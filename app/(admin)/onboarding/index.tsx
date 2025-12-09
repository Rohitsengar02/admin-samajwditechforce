import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, StyleSheet, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react-native';

const getApiUrl = () => {
    if (Platform.OS === 'android') {
        return 'http://192.168.1.46:5001/api';
    }
    let url = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';
    if (!url.endsWith('/api')) {
        url += '/api';
    }
    return url;
};

const API_URL = `${getApiUrl()}/onboarding`;

interface Slide {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    order: number;
}

export default function OnboardingList() {
    const router = useRouter();
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (data.success) {
                setSlides(data.slides);
            }
        } catch (error) {
            console.error('Error fetching slides:', error);
            Alert.alert('Error', 'Failed to fetch slides');
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
                        '⚠️ Delete Slide',
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
            const data = await response.json();

            if (data.success) {
                if (Platform.OS === 'web') {
                    alert('✅ Slide deleted successfully');
                } else {
                    Alert.alert('Success', 'Slide deleted successfully');
                }
                fetchSlides();
            } else {
                Alert.alert('Error', 'Failed to delete slide');
            }
        } catch (error) {
            console.error('Error deleting slide:', error);
            Alert.alert('Error', 'Failed to delete slide');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#f8fafc', '#e2e8f0']} style={StyleSheet.absoluteFill} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Onboarding Screens</Text>
                <TouchableOpacity
                    onPress={() => router.push('/(admin)/onboarding/editor' as any)}
                    style={styles.addButton}
                >
                    <Plus size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    💡 The "Volunteers Carousel" slide is fixed at position 2 (Order 1) and cannot be changed.
                </Text>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#E30512" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {slides.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No custom slides found</Text>
                            <Text style={styles.emptySubtext}>Add one to get started</Text>
                        </View>
                    ) : (
                        <View style={styles.grid}>
                            {slides.map((item) => (
                                <View key={item._id} style={styles.card}>
                                    {/* Card Image */}
                                    <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />

                                    {/* Order Badge */}
                                    <View style={styles.orderBadge}>
                                        <Text style={styles.orderBadgeText}>#{item.order}</Text>
                                    </View>

                                    {/* Card Content */}
                                    <View style={styles.cardContent}>
                                        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                                        <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>

                                        {/* Action Buttons */}
                                        <View style={styles.cardActions}>
                                            <TouchableOpacity
                                                onPress={() => router.push({ pathname: '/(admin)/onboarding/editor', params: { id: item._id } } as any)}
                                                style={[styles.actionButton, styles.editButton]}
                                            >
                                                <Edit2 size={16} color="#2563eb" />
                                                <Text style={styles.editButtonText}>Edit</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => handleDelete(item._id, item.title)}
                                                style={[styles.actionButton, styles.deleteButton]}
                                            >
                                                <Trash2 size={16} color="#dc2626" />
                                                <Text style={styles.deleteButtonText}>Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    addButton: {
        backgroundColor: '#E30512',
        padding: 8,
        borderRadius: 8,
    },
    infoBox: {
        backgroundColor: '#eff6ff',
        padding: 14,
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    infoText: {
        color: '#1e40af',
        fontSize: 13,
        fontWeight: '500',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginTop: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '48%',
        minWidth: 160,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cardImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#f1f5f9',
    },
    orderBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    orderBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardContent: {
        padding: 14,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 6,
    },
    cardDescription: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 14,
        lineHeight: 18,
    },
    cardActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        gap: 6,
    },
    editButton: {
        backgroundColor: '#eff6ff',
    },
    editButtonText: {
        color: '#2563eb',
        fontSize: 13,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: '#fef2f2',
    },
    deleteButtonText: {
        color: '#dc2626',
        fontSize: 13,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        color: '#94a3b8',
        fontWeight: '600',
        marginBottom: 6,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#cbd5e1',
    },
});
