import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react-native';

const getApiUrl = () => {
    if (Platform.OS === 'android') {
        return 'http://192.168.1.39:5000/api';
    }
    let url = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
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

    const handleDelete = async (id: string) => {
        Alert.alert(
            'Delete Slide',
            'Are you sure you want to delete this slide?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${API_URL}/${id}`, {
                                method: 'DELETE',
                            });
                            const data = await response.json();
                            if (data.success) {
                                fetchSlides();
                            } else {
                                Alert.alert('Error', 'Failed to delete slide');
                            }
                        } catch (error) {
                            console.error('Error deleting slide:', error);
                            Alert.alert('Error', 'Failed to delete slide');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: Slide }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.orderText}>Order: {item.order}</Text>
                    <View style={styles.actions}>
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/(admin)/onboarding/editor', params: { id: item._id } })}
                            style={styles.actionButton}
                        >
                            <Edit2 size={20} color="#2563eb" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleDelete(item._id)}
                            style={styles.actionButton}
                        >
                            <Trash2 size={20} color="#dc2626" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#f8fafc', '#e2e8f0']} style={StyleSheet.absoluteFill} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Onboarding Screens</Text>
                <TouchableOpacity
                    onPress={() => router.push('/(admin)/onboarding/editor')}
                    style={styles.addButton}
                >
                    <Plus size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    Note: The "Volunteers Carousel" slide is fixed at position 2 (Order 1) and cannot be changed.
                </Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#E30512" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={slides}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No custom slides found. Add one to get started.</Text>
                    }
                />
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
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        flexDirection: 'row',
        height: 120,
    },
    cardImage: {
        width: 120,
        height: '100%',
        backgroundColor: '#f1f5f9',
    },
    cardContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    cardDescription: {
        fontSize: 12,
        color: '#64748b',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderText: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        padding: 4,
    },
    emptyText: {
        textAlign: 'center',
        color: '#94a3b8',
        marginTop: 40,
    },
    infoBox: {
        backgroundColor: '#eff6ff',
        padding: 12,
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    infoText: {
        color: '#1e40af',
        fontSize: 12,
    }
});
