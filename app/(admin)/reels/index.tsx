import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const getApiUrl = () => {
    if (Platform.OS === 'android') return 'http://192.168.1.38:5001/api';
    if (Platform.OS === 'ios') return 'http://localhost:5001/api';
    const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

export default function ReelsManager() {
    const [reels, setReels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [newReel, setNewReel] = useState({
        title: '',
        videoUrl: '',
        platform: 'drive'
    });

    useEffect(() => {
        fetchReels();
    }, []);

    const fetchReels = async () => {
        try {
            const url = getApiUrl();
            const response = await fetch(`${url}/reels`);
            const data = await response.json();
            if (data.success) {
                setReels(data.data);
            }
        } catch (error) {
            console.error('Error fetching reels:', error);
            Alert.alert('Error', 'Failed to fetch reels');
        } finally {
            setLoading(false);
        }
    };

    const handleAddReel = async () => {
        if (!newReel.title || !newReel.videoUrl) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {
            setSubmitting(true);
            const url = getApiUrl();
            const token = await AsyncStorage.getItem('adminToken');

            const response = await fetch(`${url}/reels`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newReel)
            });

            const data = await response.json();
            if (data.success) {
                Alert.alert('Success', 'Reel added successfully');
                setNewReel({ title: '', videoUrl: '', platform: 'drive' });
                fetchReels();
            } else {
                Alert.alert('Error', data.message || 'Failed to add reel');
            }
        } catch (error) {
            console.error('Error adding reel:', error);
            Alert.alert('Error', 'Failed to add reel');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReel = async (id: string) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this reel?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const url = getApiUrl();
                            const token = await AsyncStorage.getItem('adminToken');
                            await fetch(`${url}/reels/${id}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            fetchReels();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete reel');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Reels Manager' }} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Manage Reels</Text>
                <Text style={styles.headerSubtitle}>Upload and manage video content</Text>
            </View>

            <View style={styles.content}>
                {/* Left Side: Add Form */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Add New Reel</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter reel title..."
                            value={newReel.title}
                            onChangeText={t => setNewReel({ ...newReel, title: t })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Video URL (Drive / YouTube)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="https://drive.google.com/..."
                            value={newReel.videoUrl}
                            onChangeText={t => setNewReel({ ...newReel, videoUrl: t })}
                        />
                        <Text style={styles.helperText}>
                            Paste the public share link of your video from Google Drive or YouTube.
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitBtn, submitting && styles.disabledBtn]}
                        onPress={handleAddReel}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitBtnText}>Add Reel</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Right Side: List */}
                <View style={styles.listSection}>
                    <Text style={styles.sectionTitle}>All Reels ({reels.length})</Text>
                    {loading ? (
                        <ActivityIndicator size="large" color="#E30512" />
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {reels.map((reel) => (
                                <View key={reel._id} style={styles.reelItem}>
                                    <View style={styles.reelIcon}>
                                        <MaterialCommunityIcons name="play-circle" size={32} color="#E30512" />
                                    </View>
                                    <View style={styles.reelInfo}>
                                        <Text style={styles.reelItemTitle}>{reel.title}</Text>
                                        <Text style={styles.reelItemUrl} numberOfLines={1}>{reel.videoUrl}</Text>
                                        <Text style={styles.reelDate}>
                                            {new Date(reel.createdAt).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.deleteBtn}
                                        onPress={() => handleDeleteReel(reel._id)}
                                    >
                                        <MaterialCommunityIcons name="delete" size={20} color="#dc2626" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            {reels.length === 0 && (
                                <Text style={styles.emptyText}>No reels found</Text>
                            )}
                        </ScrollView>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles: any = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 24,
    },
    header: {
        marginBottom: 32,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1e293b',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 4,
    },
    content: {
        flexDirection: 'row',
        gap: 32,
        flex: 1,
    },
    formSection: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        // @ts-ignore
        height: 'fit-content',
    },
    listSection: {
        flex: 1.5,
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        backgroundColor: '#f8fafc',
    },
    helperText: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 6,
    },
    submitBtn: {
        backgroundColor: '#E30512',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    disabledBtn: {
        opacity: 0.7,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    reelItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        borderRadius: 12,
        marginBottom: 12,
        gap: 16,
    },
    reelIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fef2f2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reelInfo: {
        flex: 1,
    },
    reelItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    reelItemUrl: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
    },
    reelDate: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 4,
    },
    deleteBtn: {
        padding: 8,
        backgroundColor: '#fef2f2',
        borderRadius: 8,
    },
    emptyText: {
        textAlign: 'center',
        color: '#94a3b8',
        marginTop: 40,
    },
});
