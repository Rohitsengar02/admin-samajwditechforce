import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import {
    ArrowLeft, Plus, Edit2, Trash2, Eye, FileText, Layout,
    Image as ImageIcon, Code, Newspaper, Grid, FormInput
} from 'lucide-react-native';
import { getApiUrl } from '../../../utils/api';

const screenWidth = Dimensions.get('window').width;

const API_URL = `${getApiUrl()}/pages`;

const PAGE_TYPE_ICONS: any = {
    static: FileText,
    dynamic: Layout,
    custom: Code,
    blog: Newspaper,
    gallery: ImageIcon,
    form: FormInput
};

const PAGE_TYPE_COLORS: any = {
    static: '#3b82f6',
    dynamic: '#10b981',
    custom: '#8b5cf6',
    blog: '#f59e0b',
    gallery: '#ec4899',
    form: '#6366f1'
};

interface Page {
    _id: string;
    title: string;
    slug: string;
    type: string;
    status: string;
    showInMenu: boolean;
    order: number;
    createdAt: string;
}

interface PageCardProps {
    page: Page;
    onEdit: () => void;
    onDelete: () => void;
    onView: () => void;
}

const PageCard = ({ page, onEdit, onDelete, onView }: PageCardProps) => {
    const IconComponent = PAGE_TYPE_ICONS[page.type] || FileText;
    const typeColor = PAGE_TYPE_COLORS[page.type] || '#6b7280';

    return (
        <View style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 18,
            marginBottom: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
            elevation: 4,
            borderWidth: 1,
            borderColor: '#f3f4f6',
        }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: `${typeColor}15`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                }}>
                    <IconComponent size={24} color={typeColor} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#111827', marginBottom: 4 }}>
                        {page.title}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#9ca3af' }}>/{page.slug}</Text>
                </View>
            </View>

            {/* Type & Status Badges */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
                <View style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 8,
                    backgroundColor: `${typeColor}15`,
                }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: typeColor, textTransform: 'uppercase' }}>
                        {page.type}
                    </Text>
                </View>

                <View style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 8,
                    backgroundColor: page.status === 'published' ? '#dcfce7' : page.status === 'draft' ? '#fef3c7' : '#f3f4f6',
                }}>
                    <Text style={{
                        fontSize: 11,
                        fontWeight: '700',
                        color: page.status === 'published' ? '#16a34a' : page.status === 'draft' ? '#d97706' : '#6b7280',
                        textTransform: 'uppercase'
                    }}>
                        {page.status}
                    </Text>
                </View>

                {page.showInMenu && (
                    <View style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 8,
                        backgroundColor: '#dbeafe',
                    }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase' }}>
                            IN MENU
                        </Text>
                    </View>
                )}
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                    onPress={onView}
                    style={{
                        flex: 1,
                        backgroundColor: '#f3f4f6',
                        paddingVertical: 12,
                        borderRadius: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                    }}
                >
                    <Eye size={16} color="#6b7280" />
                    <Text style={{ color: '#6b7280', fontWeight: '600', fontSize: 13 }}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onEdit}
                    style={{
                        flex: 1,
                        backgroundColor: '#eef2ff',
                        paddingVertical: 12,
                        borderRadius: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                    }}
                >
                    <Edit2 size={16} color="#4f46e5" />
                    <Text style={{ color: '#4f46e5', fontWeight: '600', fontSize: 13 }}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onDelete}
                    style={{
                        flex: 1,
                        backgroundColor: '#fef2f2',
                        paddingVertical: 12,
                        borderRadius: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                    }}
                >
                    <Trash2 size={16} color="#dc2626" />
                    <Text style={{ color: '#dc2626', fontWeight: '600', fontSize: 13 }}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function PageManagement() {
    const router = useRouter();
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchPages();
        }, [])
    );

    const fetchPages = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            const data = await response.json();
            if (data.success) {
                setPages(data.data);
            }
        } catch (error) {
            console.error('Error fetching pages:', error);
            Alert.alert('Error', 'Failed to fetch pages');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        const confirmDelete = () => {
            return new Promise<boolean>((resolve) => {
                if (Platform.OS === 'web') {
                    resolve(window.confirm(`Delete "${title}"?\n\nThis action cannot be undone.`));
                } else {
                    Alert.alert(
                        '⚠️ Delete Page',
                        `Are you sure you want to delete "${title}"?`,
                        [
                            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                            { text: 'Delete', style: 'destructive', onPress: () => resolve(true) }
                        ]
                    );
                }
            });
        };

        const confirmed = await confirmDelete();
        if (!confirmed) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                if (Platform.OS === 'web') {
                    alert('✅ Page deleted successfully');
                } else {
                    Alert.alert('Success', 'Page deleted successfully');
                }
                fetchPages();
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
            if (Platform.OS === 'web') {
                alert('❌ Failed to delete page');
            } else {
                Alert.alert('Error', 'Failed to delete page');
            }
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            {/* Header */}
            <LinearGradient
                colors={['#6366f1', '#4f46e5']}
                style={{
                    paddingTop: 48,
                    paddingBottom: 24,
                    paddingHorizontal: 20,
                    borderBottomLeftRadius: 32,
                    borderBottomRightRadius: 32,
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
                        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Page Management</Text>
                        <Text style={{ color: '#c7d2fe', fontSize: 14, marginTop: 4 }}>
                            {pages.length} {pages.length === 1 ? 'page' : 'pages'}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push('/(admin)/pages/create' as any)}
                        style={{
                            backgroundColor: 'white',
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            borderRadius: 14,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                        }}
                    >
                        <Plus size={20} color="#4f46e5" />
                        <Text style={{ color: '#4f46e5', fontWeight: 'bold', fontSize: 14 }}>New</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Content */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#6366f1" />
                    <Text style={{ marginTop: 16, color: '#6b7280', fontWeight: '500' }}>Loading pages...</Text>
                </View>
            ) : pages.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Grid size={64} color="#d1d5db" />
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#6b7280', marginTop: 16 }}>No pages yet</Text>
                    <Text style={{ fontSize: 14, color: '#9ca3af', marginTop: 8, textAlign: 'center' }}>
                        Create your first page to get started
                    </Text>
                </View>
            ) : (
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    {pages.map((page) => (
                        <PageCard
                            key={page._id}
                            page={page}
                            onEdit={() => router.push(`/(admin)/pages/editor?id=${page._id}` as any)}
                            onDelete={() => handleDelete(page._id, page.title)}
                            onView={() => router.push(`/(admin)/pages/view?id=${page._id}` as any)}
                        />
                    ))}
                </ScrollView>
            )}
        </View>
    );
}
