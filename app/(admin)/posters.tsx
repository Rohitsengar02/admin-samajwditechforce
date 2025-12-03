import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
    ActivityIndicator,
    Modal,
    Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SP_RED = '#E30512';

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

const API_URL = getApiUrl();

interface Poster {
    _id: string;
    title: string;
    imageUrl: string;
    downloadCount: number;
    cloudinaryPublicId: string;
    createdAt: string;
}

interface Stats {
    totalPosters: number;
    totalDownloads: number;
}

export default function PostersPage() {
    const [posters, setPosters] = useState<Poster[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [title, setTitle] = useState('');
    const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [stats, setStats] = useState<Stats>({ totalPosters: 0, totalDownloads: 0 });

    useEffect(() => {
        fetchPosters();
        fetchStats();
    }, []);

    const fetchPosters = async () => {
        try {
            const response = await fetch(`${API_URL}/posters`);
            const data = await response.json();
            setPosters(data.posters || []);
        } catch (error) {
            console.error('Error fetching posters:', error);
            Alert.alert('Error', 'Failed to load posters');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_URL}/posters/stats`);
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission Required', 'Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0]);
        }
    };

    const uploadPoster = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title');
            return;
        }

        if (!selectedImage) {
            Alert.alert('Error', 'Please select an image');
            return;
        }

        try {
            setUploading(true);

            const token = await AsyncStorage.getItem('adminToken');

            // Debug logging
            console.log('Token retrieved:', token ? 'Token exists' : 'No token found');

            if (!token) {
                Alert.alert('Authentication Error', 'Please log in to upload posters. No auth token found.');
                setUploading(false);
                return;
            }

            // Convert image to base64
            const response = await fetch(selectedImage.uri);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64data = reader.result as string;

                console.log('Uploading to:', `${API_URL}/posters/upload`);
                console.log('Title:', title);
                console.log('Image size:', base64data.length, 'characters');

                const uploadResponse = await fetch(`${API_URL}/posters/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title,
                        imageBase64: base64data
                    })
                });

                const data = await uploadResponse.json();

                console.log('Upload response status:', uploadResponse.status);
                console.log('Upload response data:', data);

                if (uploadResponse.ok) {
                    Alert.alert('Success', 'Poster uploaded successfully!');
                    setShowUploadModal(false);
                    setTitle('');
                    setSelectedImage(null);
                    fetchPosters();
                    fetchStats();
                } else {
                    Alert.alert('Error', data.message || `Upload failed: ${uploadResponse.status}`);
                }
                setUploading(false);
            };

            reader.readAsDataURL(blob);
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Error', `Failed to upload poster: ${error}`);
            setUploading(false);
        }
    };

    const deletePoster = async (posterId: string) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this poster?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('adminToken');
                            const response = await fetch(`${API_URL}/posters/${posterId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                }
                            });

                            if (response.ok) {
                                Alert.alert('Success', 'Poster deleted successfully');
                                fetchPosters();
                                fetchStats();
                            } else {
                                Alert.alert('Error', 'Failed to delete poster');
                            }
                        } catch (error) {
                            console.error('Delete error:', error);
                            Alert.alert('Error', 'Failed to delete poster');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={SP_RED} />
                <Text style={styles.loadingText}>Loading posters...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#ffffff', '#f8f9fa']} style={styles.background} />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Poster Management</Text>
                        <Text style={styles.subtitle}>Upload and manage party posters</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={() => setShowUploadModal(true)}
                    >
                        <LinearGradient colors={[SP_RED, '#b91c1c']} style={styles.uploadButtonGradient}>
                            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
                            <Text style={styles.uploadButtonText}>Upload Poster</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <MaterialCommunityIcons name="image-multiple" size={32} color={SP_RED} />
                        <Text style={styles.statNumber}>{stats.totalPosters}</Text>
                        <Text style={styles.statLabel}>Total Posters</Text>
                    </View>
                    <View style={styles.statCard}>
                        <MaterialCommunityIcons name="download" size={32} color="#10b981" />
                        <Text style={styles.statNumber}>{stats.totalDownloads}</Text>
                        <Text style={styles.statLabel}>Total Downloads</Text>
                    </View>
                </View>

                {/* Posters Grid */}
                <View style={styles.postersGrid}>
                    {posters.map((poster) => (
                        <View key={poster._id} style={styles.posterCard}>
                            <Image source={{ uri: poster.imageUrl }} style={styles.posterImage} />
                            <View style={styles.posterInfo}>
                                <Text style={styles.posterTitle} numberOfLines={2}>{poster.title}</Text>
                                <View style={styles.posterMeta}>
                                    <View style={styles.downloadInfo}>
                                        <MaterialCommunityIcons name="download" size={16} color="#64748b" />
                                        <Text style={styles.downloadCount}>{poster.downloadCount}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => deletePoster(poster._id)}
                                    >
                                        <MaterialCommunityIcons name="delete" size={20} color={SP_RED} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {posters.length === 0 && (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="image-off" size={64} color="#cbd5e1" />
                        <Text style={styles.emptyText}>No posters uploaded yet</Text>
                        <Text style={styles.emptySubtext}>Click the upload button to add your first poster</Text>
                    </View>
                )}
            </ScrollView>

            {/* Upload Modal */}
            <Modal
                visible={showUploadModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowUploadModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Upload New Poster</Text>
                            <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Poster Title"
                            value={title}
                            onChangeText={setTitle}
                            placeholderTextColor="#94a3b8"
                        />

                        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                            {selectedImage ? (
                                <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
                            ) : (
                                <View style={styles.imagePickerPlaceholder}>
                                    <MaterialCommunityIcons name="image-plus" size={48} color="#cbd5e1" />
                                    <Text style={styles.imagePickerText}>Select Image</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.submitButton, uploading && styles.submitButtonDisabled]}
                            onPress={uploadPoster}
                            disabled={uploading}
                        >
                            <LinearGradient colors={[SP_RED, '#b91c1c']} style={styles.submitButtonGradient}>
                                {uploading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <MaterialCommunityIcons name="upload" size={20} color="#fff" />
                                        <Text style={styles.submitButtonText}>Upload Poster</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748b',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0f172a',
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
    uploadButton: {
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: SP_RED,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    uploadButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 16,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    statNumber: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0f172a',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
    },
    postersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 12,
        gap: 16,
    },
    posterCard: {
        width: '47%',
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    posterImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#f1f5f9',
    },
    posterInfo: {
        padding: 12,
    },
    posterTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 8,
    },
    posterMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    downloadInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    downloadCount: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
    },
    deleteButton: {
        padding: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#64748b',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 500,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0f172a',
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#0f172a',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    imagePicker: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
    },
    selectedImage: {
        width: '100%',
        height: '100%',
    },
    imagePickerPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    imagePickerText: {
        marginTop: 8,
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '600',
    },
    submitButton: {
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 4,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
