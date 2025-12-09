import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Edit2 } from 'lucide-react-native';
import { getApiUrl } from '../../../utils/api';

const API_URL = `${getApiUrl()}/pages`;

export default function PageView() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [page, setPage] = useState<any>(null);
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
                setPage(data.data);
                try {
                    const parsedSections = JSON.parse(data.data.content || '[]');
                    setSections(Array.isArray(parsedSections) ? parsedSections : []);
                } catch {
                    setSections([]);
                }
            }
        } catch (error) {
            console.error('Error fetching page:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={{ marginTop: 16, color: '#6b7280', fontWeight: '500' }}>Loading page...</Text>
            </View>
        );
    }

    if (!page) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#6b7280' }}>Page not found</Text>
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
                        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>{page.title}</Text>
                        <Text style={{ color: '#c7d2fe', fontSize: 13, marginTop: 4 }}>Page Preview</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push(`/(admin)/pages/editor?id=${id}` as any)}
                        style={{
                            backgroundColor: 'white',
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                        }}
                    >
                        <Edit2 size={18} color="#4f46e5" />
                        <Text style={{ color: '#4f46e5', fontWeight: 'bold', fontSize: 14 }}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Content */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
                {sections.length === 0 ? (
                    <View style={{
                        backgroundColor: 'white',
                        margin: 20,
                        borderRadius: 20,
                        padding: 40,
                        alignItems: 'center',
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#6b7280' }}>
                            No content yet
                        </Text>
                        <Text style={{ fontSize: 14, color: '#9ca3af', marginTop: 8, textAlign: 'center' }}>
                            Click Edit to start building this page
                        </Text>
                    </View>
                ) : (
                    <View style={{ backgroundColor: 'white', margin: 20, borderRadius: 20, overflow: 'hidden' }}>
                        {sections.map((section, index) => (
                            <View key={index} style={{ padding: 20, borderBottomWidth: index < sections.length - 1 ? 1 : 0, borderBottomColor: '#f3f4f6' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#6366f1', textTransform: 'uppercase' }}>
                                        {section.type}
                                    </Text>
                                </View>

                                {/* Render section content based on type */}
                                {section.type === 'heading' && (
                                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827' }}>
                                        {section.content.text}
                                    </Text>
                                )}

                                {section.type === 'paragraph' && (
                                    <Text style={{ fontSize: 16, color: '#374151', lineHeight: 24 }}>
                                        {section.content.text}
                                    </Text>
                                )}

                                {section.type === 'hero' && (
                                    <View>
                                        <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#111827', marginBottom: 12 }}>
                                            {section.content.title}
                                        </Text>
                                        <Text style={{ fontSize: 18, color: '#6b7280', marginBottom: 16 }}>
                                            {section.content.subtitle}
                                        </Text>
                                        <View style={{
                                            backgroundColor: '#6366f1',
                                            paddingHorizontal: 24,
                                            paddingVertical: 12,
                                            borderRadius: 8,
                                            alignSelf: 'flex-start',
                                        }}>
                                            <Text style={{ color: 'white', fontWeight: '600' }}>
                                                {section.content.buttonText}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Page Info */}
                <View style={{
                    backgroundColor: 'white',
                    marginHorizontal: 20,
                    marginTop: 8,
                    borderRadius: 16,
                    padding: 16,
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ fontSize: 13, color: '#6b7280' }}>Status:</Text>
                        <Text style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: page.status === 'published' ? '#16a34a' : page.status === 'draft' ? '#d97706' : '#6b7280',
                            textTransform: 'uppercase',
                        }}>
                            {page.status}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ fontSize: 13, color: '#6b7280' }}>Type:</Text>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#111827', textTransform: 'uppercase' }}>
                            {page.type}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 13, color: '#6b7280' }}>Slug:</Text>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#111827' }}>/{page.slug}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
