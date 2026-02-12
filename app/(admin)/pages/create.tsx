import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft, Save, FileText, Layout, Code, Newspaper,
    Image as ImageIcon, FormInput, Plus, Trash2, Upload
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { getApiUrl } from '../../../utils/api';

const API_URL = `${getApiUrl()}/pages`;
import { uploadBase64ToAPI } from '../../../utils/upload';

const PAGE_TYPES = [
    { value: 'static', label: 'Static Page', icon: FileText, description: 'Simple content page', color: '#3b82f6' },
    { value: 'dynamic', label: 'Dynamic Page', icon: Layout, description: 'Database-driven content', color: '#10b981' },
    { value: 'custom', label: 'Custom HTML', icon: Code, description: 'Custom HTML/CSS/JS', color: '#8b5cf6' },
    { value: 'blog', label: 'Blog Post', icon: Newspaper, description: 'Article with metadata', color: '#f59e0b' },
    { value: 'gallery', label: 'Gallery', icon: ImageIcon, description: 'Image collection', color: '#ec4899' },
    { value: 'form', label: 'Form Page', icon: FormInput, description: 'Custom form builder', color: '#6366f1' },
    { value: 'custom-page', label: 'Custom Page', icon: FileText, description: 'Custom form builder', color: '#6366f1' },
];

export default function PageCreate() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        type: 'static',
        content: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        headerImage: '',
        status: 'draft',
        order: 0,
        showInMenu: false,
        icon: '',
        customFields: [] as any[],
    });

    useEffect(() => {
        if (isEditing) {
            fetchPage();
        }
    }, [id]);

    const fetchPage = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/${id}`);
            const data = await response.json();

            if (data.success) {
                setFormData({
                    title: data.data.title || '',
                    slug: data.data.slug || '',
                    type: data.data.type || 'static',
                    content: data.data.content || '',
                    metaTitle: data.data.metaTitle || '',
                    metaDescription: data.data.metaDescription || '',
                    metaKeywords: data.data.metaKeywords || '',
                    headerImage: data.data.headerImage || '',
                    status: data.data.status || 'draft',
                    order: data.data.order || 0,
                    showInMenu: data.data.showInMenu || false,
                    icon: data.data.icon || '',
                    customFields: data.data.customFields || [],
                });
            }
        } catch (error) {
            console.error('Error fetching page:', error);
            Alert.alert('Error', 'Failed to load page');
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const pickImage = async () => {
        try {
            setUploading(true);
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled && result.assets[0].base64) {
                const url = await uploadBase64ToAPI(result.assets[0].base64, 'pages');
                if (url) {
                    setFormData(prev => ({ ...prev, headerImage: url }));
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const addCustomField = () => {
        setFormData(prev => ({
            ...prev,
            customFields: [...prev.customFields, { fieldName: '', fieldType: 'text', fieldValue: '' }]
        }));
    };

    const removeCustomField = (index: number) => {
        setFormData(prev => ({
            ...prev,
            customFields: prev.customFields.filter((_, i) => i !== index)
        }));
    };

    const updateCustomField = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            customFields: prev.customFields.map((cf, i) =>
                i === index ? { ...cf, [field]: value } : cf
            )
        }));
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            Alert.alert('Validation Error', 'Please enter a page title');
            return false;
        }
        if (!formData.slug.trim()) {
            Alert.alert('Validation Error', 'Please enter a page slug');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const url = isEditing ? `${API_URL}/${id}` : API_URL;
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    // Redirect to page builder based on type
                    if (formData.type === 'static' || formData.type === 'custom-page') {
                        router.push(`/(admin)/pages/builder?id=${data.data._id}` as any);
                    } else {
                        router.back();
                    }
                }, 2000);
            } else {
                Alert.alert('Error', data.message || 'Failed to save page');
            }
        } catch (error) {
            console.error('Error saving page:', error);
            Alert.alert('Error', 'Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={{ marginTop: 16, color: '#6b7280', fontWeight: '500' }}>Loading page...</Text>
            </View>
        );
    }

    return (
        <>
            {/* Success Modal */}
            {showSuccess && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 9999,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 24,
                        padding: 32,
                        alignItems: 'center',
                        margin: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.3,
                        shadowRadius: 20,
                        elevation: 10,
                        minWidth: 280,
                    }}>
                        <View style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: isEditing ? '#f3e8ff' : '#dcfce7',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 20,
                        }}>
                            <Save size={48} color={isEditing ? '#8b5cf6' : '#16a34a'} />
                        </View>
                        <Text style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#111827',
                            marginBottom: 8,
                        }}>{isEditing ? 'Updated!' : 'Created!'}</Text>
                        <Text style={{
                            fontSize: 16,
                            color: '#6b7280',
                            textAlign: 'center',
                        }}>Page {isEditing ? 'updated' : 'created'} successfully</Text>
                    </View>
                </View>
            )}

            <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <LinearGradient
                    colors={['#6366f1', '#4f46e5']}
                    style={{
                        paddingTop: 48,
                        paddingBottom: 64,
                        paddingHorizontal: 24,
                        borderBottomLeftRadius: 40,
                        borderBottomRightRadius: 40,
                        marginBottom: 24,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 14, marginRight: 16 }}
                        >
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>
                                {isEditing ? 'Edit Page' : 'Create Page'}
                            </Text>
                            <Text style={{ color: '#c7d2fe', fontSize: 14, marginTop: 4 }}>
                                {isEditing ? 'Update page details' : 'Add new page to your site'}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={{ paddingHorizontal: 24, paddingBottom: 100 }}>
                    {/* Basic Information */}
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 24,
                        padding: 20,
                        marginBottom: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.08,
                        shadowRadius: 12,
                        elevation: 4,
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 20 }}>
                            Basic Information
                        </Text>

                        {/* Title */}
                        <View style={{ marginBottom: 18 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                                Page Title *
                            </Text>
                            <TextInput
                                style={{
                                    backgroundColor: '#f9fafb',
                                    borderWidth: 1,
                                    borderColor: '#e5e7eb',
                                    borderRadius: 14,
                                    padding: 16,
                                    fontSize: 16,
                                    color: '#111827',
                                }}
                                placeholder="Enter page title"
                                value={formData.title}
                                onChangeText={(text) => {
                                    setFormData({ ...formData, title: text });
                                    if (!isEditing || !formData.slug) {
                                        setFormData(prev => ({ ...prev, title: text, slug: generateSlug(text) }));
                                    }
                                }}
                            />
                        </View>

                        {/* Slug */}
                        <View style={{ marginBottom: 18 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                                Page Slug * (URL)
                            </Text>
                            <TextInput
                                style={{
                                    backgroundColor: '#f9fafb',
                                    borderWidth: 1,
                                    borderColor: '#e5e7eb',
                                    borderRadius: 14,
                                    padding: 16,
                                    fontSize: 16,
                                    color: '#111827',
                                }}
                                placeholder="page-url-slug"
                                value={formData.slug}
                                onChangeText={(text) => setFormData({ ...formData, slug: generateSlug(text) })}
                                autoCapitalize="none"
                            />
                            <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
                                URL: /{formData.slug || 'page-slug'}
                            </Text>
                        </View>

                        {/* Page Type */}
                        <View>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
                                Page Type *
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                {PAGE_TYPES.map((type) => {
                                    const Icon = type.icon;
                                    const isSelected = formData.type === type.value;
                                    return (
                                        <TouchableOpacity
                                            key={type.value}
                                            onPress={() => setFormData({ ...formData, type: type.value })}
                                            style={{
                                                width: '48%',
                                                backgroundColor: isSelected ? `${type.color}15` : '#f9fafb',
                                                borderWidth: 2,
                                                borderColor: isSelected ? type.color : '#e5e7eb',
                                                borderRadius: 16,
                                                padding: 16,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Icon size={28} color={isSelected ? type.color : '#9ca3af'} />
                                            <Text style={{
                                                marginTop: 8,
                                                fontSize: 14,
                                                fontWeight: '600',
                                                color: isSelected ? type.color : '#6b7280',
                                            }}>
                                                {type.label}
                                            </Text>
                                            <Text style={{
                                                marginTop: 4,
                                                fontSize: 11,
                                                color: '#9ca3af',
                                                textAlign: 'center',
                                            }}>
                                                {type.description}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </View>



                    {/* SEO Settings */}
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 24,
                        padding: 20,
                        marginBottom: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.08,
                        shadowRadius: 12,
                        elevation: 4,
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 20 }}>
                            SEO Settings
                        </Text>

                        <View style={{ marginBottom: 18 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                                Meta Title
                            </Text>
                            <TextInput
                                style={{
                                    backgroundColor: '#f9fafb',
                                    borderWidth: 1,
                                    borderColor: '#e5e7eb',
                                    borderRadius: 14,
                                    padding: 16,
                                    fontSize: 16,
                                    color: '#111827',
                                }}
                                placeholder="SEO title for search engines"
                                value={formData.metaTitle}
                                onChangeText={(text) => setFormData({ ...formData, metaTitle: text })}
                            />
                        </View>

                        <View style={{ marginBottom: 18 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                                Meta Description
                            </Text>
                            <TextInput
                                style={{
                                    backgroundColor: '#f9fafb',
                                    borderWidth: 1,
                                    borderColor: '#e5e7eb',
                                    borderRadius: 14,
                                    padding: 16,
                                    fontSize: 16,
                                    color: '#111827',
                                    minHeight: 80,
                                    textAlignVertical: 'top',
                                }}
                                placeholder="Brief description for search results"
                                multiline
                                numberOfLines={3}
                                value={formData.metaDescription}
                                onChangeText={(text) => setFormData({ ...formData, metaDescription: text })}
                            />
                        </View>

                        <View>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                                Meta Keywords
                            </Text>
                            <TextInput
                                style={{
                                    backgroundColor: '#f9fafb',
                                    borderWidth: 1,
                                    borderColor: '#e5e7eb',
                                    borderRadius: 14,
                                    padding: 16,
                                    fontSize: 16,
                                    color: '#111827',
                                }}
                                placeholder="keyword1, keyword2, keyword3"
                                value={formData.metaKeywords}
                                onChangeText={(text) => setFormData({ ...formData, metaKeywords: text })}
                            />
                        </View>
                    </View>

                    {/* Settings */}
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 24,
                        padding: 20,
                        marginBottom: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.08,
                        shadowRadius: 12,
                        elevation: 4,
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 20 }}>
                            Page Settings
                        </Text>

                        {/* Status */}
                        <View style={{ marginBottom: 18 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
                                Status
                            </Text>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                {['draft', 'published', 'archived'].map((status) => (
                                    <TouchableOpacity
                                        key={status}
                                        onPress={() => setFormData({ ...formData, status })}
                                        style={{
                                            flex: 1,
                                            paddingVertical: 14,
                                            paddingHorizontal: 12,
                                            borderRadius: 12,
                                            backgroundColor: formData.status === status ? '#6366f1' : '#f3f4f6',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{
                                            fontWeight: '600',
                                            fontSize: 13,
                                            color: formData.status === status ? 'white' : '#6b7280',
                                            textTransform: 'capitalize',
                                        }}>
                                            {status}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Show in Menu */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 18,
                            paddingVertical: 12,
                        }}>
                            <View>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>
                                    Show in Menu
                                </Text>
                                <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                                    Display this page in navigation
                                </Text>
                            </View>
                            <Switch
                                value={formData.showInMenu}
                                onValueChange={(value) => setFormData({ ...formData, showInMenu: value })}
                                trackColor={{ false: '#d1d5db', true: '#818cf8' }}
                                thumbColor={formData.showInMenu ? '#6366f1' : '#f3f4f6'}
                            />
                        </View>

                        {/* Order */}
                        <View>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                                Menu Order
                            </Text>
                            <TextInput
                                style={{
                                    backgroundColor: '#f9fafb',
                                    borderWidth: 1,
                                    borderColor: '#e5e7eb',
                                    borderRadius: 14,
                                    padding: 16,
                                    fontSize: 16,
                                    color: '#111827',
                                }}
                                placeholder="0"
                                keyboardType="numeric"
                                value={formData.order.toString()}
                                onChangeText={(text) => setFormData({ ...formData, order: parseInt(text) || 0 })}
                            />
                        </View>
                    </View>



                    {/* Action Buttons */}
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{
                                flex: 1,
                                backgroundColor: '#f3f4f6',
                                paddingVertical: 18,
                                borderRadius: 16,
                                alignItems: 'center',
                            }}
                            disabled={loading}
                        >
                            <Text style={{ color: '#374151', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={loading ? ['#9CA3AF', '#6B7280'] : ['#6366f1', '#4f46e5']}
                                style={{
                                    paddingVertical: 18,
                                    borderRadius: 16,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Save size={20} color="white" />
                                )}
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>
                                    {loading ? 'Saving...' : isEditing ? 'Update Page' : 'Create Page'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}
