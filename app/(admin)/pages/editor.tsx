import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Platform, ActivityIndicator, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Save, Eye } from 'lucide-react-native';
import { getApiUrl } from '../../../utils/api';

const API_URL = `${getApiUrl()}/pages`;

export default function PageEditor() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        type: 'static',
        content: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        status: 'draft',
        showInMenu: false,
    });

    useEffect(() => {
        if (id) {
            fetchPage();
        }
    }, [id]);

    const fetchPage = async () => {
        try {
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
                    status: data.data.status || 'draft',
                    showInMenu: data.data.showInMenu || false,
                });
            }
        } catch (error) {
            console.error('Error fetching page:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                Alert.alert('Success', 'Page updated successfully!', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            } else {
                Alert.alert('Error', 'Failed to save page');
            }
        } catch (error) {
            Alert.alert('Error', 'Network error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={{ marginTop: 16, color: '#6b7280', fontWeight: '500' }}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            {/* Header */}
            <LinearGradient
                colors={['#6366f1', '#4f46e5']}
                style={{
                    paddingTop: 48,
                    paddingBottom: 20,
                    paddingHorizontal: 20,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 14 }}
                    >
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>

                    <View style={{ flex: 1, marginHorizontal: 16 }}>
                        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Edit Page</Text>
                        <Text style={{ color: '#c7d2fe', fontSize: 13, marginTop: 4 }}>Update page details</Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity
                            onPress={() => router.push(`/(admin)/pages/view?id=${id}` as any)}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                paddingHorizontal: 14,
                                paddingVertical: 10,
                                borderRadius: 12,
                            }}
                        >
                            <Eye size={20} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={saving}
                            style={{
                                backgroundColor: 'white',
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 12,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                                opacity: saving ? 0.6 : 1,
                            }}
                        >
                            {saving ? (
                                <ActivityIndicator size="small" color="#4f46e5" />
                            ) : (
                                <Save size={18} color="#4f46e5" />
                            )}
                            <Text style={{ color: '#4f46e5', fontWeight: 'bold', fontSize: 14 }}>
                                {saving ? 'Saving...' : 'Save'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

            {/* Content */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                {/* Basic Info */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 20,
                    marginBottom: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>
                        Basic Information
                    </Text>

                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                            Title
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: '#f9fafb',
                                borderWidth: 1,
                                borderColor: '#e5e7eb',
                                borderRadius: 12,
                                padding: 14,
                                fontSize: 16,
                            }}
                            value={formData.title}
                            onChangeText={(text) => setFormData({ ...formData, title: text })}
                            placeholder="Page title"
                        />
                    </View>

                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                            Slug (URL)
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: '#f9fafb',
                                borderWidth: 1,
                                borderColor: '#e5e7eb',
                                borderRadius: 12,
                                padding: 14,
                                fontSize: 16,
                            }}
                            value={formData.slug}
                            onChangeText={(text) => setFormData({ ...formData, slug: text })}
                            placeholder="page-url"
                        />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 12,
                    }}>
                        <View>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>
                                Show in Menu
                            </Text>
                            <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                                Display in navigation
                            </Text>
                        </View>
                        <Switch
                            value={formData.showInMenu}
                            onValueChange={(value) => setFormData({ ...formData, showInMenu: value })}
                            trackColor={{ false: '#d1d5db', true: '#818cf8' }}
                            thumbColor={formData.showInMenu ? '#6366f1' : '#f3f4f6'}
                        />
                    </View>
                </View>

                {/* SEO */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 20,
                    marginBottom: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>
                        SEO Settings
                    </Text>

                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                            Meta Title
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: '#f9fafb',
                                borderWidth: 1,
                                borderColor: '#e5e7eb',
                                borderRadius: 12,
                                padding: 14,
                                fontSize: 16,
                            }}
                            value={formData.metaTitle}
                            onChangeText={(text) => setFormData({ ...formData, metaTitle: text })}
                            placeholder="SEO title"
                        />
                    </View>

                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                            Meta Description
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: '#f9fafb',
                                borderWidth: 1,
                                borderColor: '#e5e7eb',
                                borderRadius: 12,
                                padding: 14,
                                fontSize: 16,
                                minHeight: 80,
                                textAlignVertical: 'top',
                            }}
                            value={formData.metaDescription}
                            onChangeText={(text) => setFormData({ ...formData, metaDescription: text })}
                            placeholder="Description for search engines"
                            multiline
                        />
                    </View>
                </View>

                {/* Status */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>
                        Publishing
                    </Text>

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
                                    paddingVertical: 12,
                                    borderRadius: 10,
                                    backgroundColor: formData.status === status ? '#6366f1' : '#f3f4f6',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{
                                    fontWeight: '600',
                                    fontSize: 14,
                                    color: formData.status === status ? 'white' : '#6b7280',
                                    textTransform: 'capitalize',
                                }}>
                                    {status}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Builder Button */}
                {(formData.type === 'static' || formData.type === 'custom-page') && (
                    <TouchableOpacity
                        onPress={() => router.push(`/(admin)/pages/builder?id=${id}` as any)}
                        style={{
                            backgroundColor: '#4f46e5',
                            paddingVertical: 16,
                            borderRadius: 12,
                            alignItems: 'center',
                            marginTop: 20,
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                            Open Page Builder
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
}
