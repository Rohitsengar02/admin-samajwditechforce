import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Modal, Platform, Image } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { Video, ResizeMode } from 'expo-av';

import { uploadVideoToAPI } from '../../../utils/upload';
import { getApiUrl as getApiUrlUtil } from '../../../utils/api';

const getApiUrl = () => {
    return getApiUrlUtil();
};

export default function ReelsManager() {
    const [reels, setReels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [playingReel, setPlayingReel] = useState<any>(null);
    const [showVideoModal, setShowVideoModal] = useState(false);

    const [newReel, setNewReel] = useState({
        title: '',
        videoUrl: '',
    });

    const [selectedVideo, setSelectedVideo] = useState<any>(null);

    useEffect(() => {
        fetchReels();
    }, []);

    // Generate thumbnail placeholder
    const getVideoThumbnail = (videoUrl: string) => {
        // R2 doesn't auto-generate thumbnails like Cloudinary
        // Return null to show placeholder icon
        return null;
    };

    const handlePlayReel = (reel: any) => {
        setPlayingReel(reel);
        setShowVideoModal(true);
    };

    const closeVideoModal = () => {
        setShowVideoModal(false);
        setPlayingReel(null);
    };

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

    const pickVideo = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'video/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const video = result.assets[0];

                // Check file size (limit to 100MB)
                if (video.size && video.size > 100 * 1024 * 1024) {
                    Alert.alert('Error', 'Video size should be less than 100MB');
                    return;
                }

                setSelectedVideo(video);
                Alert.alert('Success', `Video selected: ${video.name}`);
            }
        } catch (error) {
            console.error('Error picking video:', error);
            Alert.alert('Error', 'Failed to pick video');
        }
    };

    const handleAddReel = async () => {
        console.log('🔵 Upload button clicked!');
        console.log('Title:', newReel.title);
        console.log('Selected Video:', selectedVideo);

        if (!newReel.title) {
            console.log('❌ No title');
            Alert.alert('Error', 'Please enter a title');
            return;
        }

        if (!selectedVideo) {
            console.log('❌ No video selected');
            Alert.alert('Error', 'Please select a video');
            return;
        }

        console.log('✅ Validation passed, starting upload...');

        try {
            setSubmitting(true);
            setUploading(true);
            setUploadProgress(0);

            // Simulate progress updates
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 500);

            console.log('📤 Starting R2 upload via backend...');

            // Upload video through backend API to R2
            const result = await uploadVideoToAPI(selectedVideo.uri, 'reels');

            clearInterval(progressInterval);
            setUploadProgress(100);

            console.log('Uploaded URL:', result.url);

            if (!result.url) {
                console.log('❌ Upload failed');
                Alert.alert('Error', 'Failed to upload video. Please try again.');
                setSubmitting(false);
                return;
            }

            console.log('✅ Video uploaded successfully!');
            console.log('💾 Saving to database...');

            // Save to database
            const url = getApiUrl();
            const token = await AsyncStorage.getItem('adminToken');

            console.log('API URL:', url);
            console.log('Token:', token ? 'Present' : 'Missing');

            const response = await fetch(`${url}/reels`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: newReel.title,
                    videoUrl: result.url,
                    platform: 'r2'
                })
            });

            const data = await response.json();
            console.log('API Response:', data);

            if (data.success) {
                Alert.alert('Success', 'Reel uploaded successfully!');
                setNewReel({ title: '', videoUrl: '' });
                setSelectedVideo(null);
                fetchReels();
            } else {
                Alert.alert('Error', data.message || 'Failed to add reel');
            }
        } catch (error: any) {
            console.error('❌ Error in handleAddReel:', error);
            Alert.alert('Error', `Failed to add reel: ${error?.message || error}`);
        } finally {
            setSubmitting(false);
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDeleteReel = async (id: string) => {
        if (Platform.OS === 'web') {
            if (!window.confirm('Are you sure you want to delete this reel?')) {
                return;
            }
        } else {
            await new Promise((resolve) => {
                Alert.alert(
                    'Confirm Delete',
                    'Are you sure you want to delete this reel?',
                    [
                        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                        {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => resolve(true)
                        }
                    ]
                );
            });
        }

        try {
            const url = getApiUrl();
            const token = await AsyncStorage.getItem('adminToken');
            const response = await fetch(`${url}/reels/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                Alert.alert('Success', 'Reel deleted successfully');
                fetchReels();
            } else {
                Alert.alert('Error', 'Failed to delete reel');
            }
        } catch (error) {
            console.error('Error deleting reel:', error);
            Alert.alert('Error', 'Failed to delete reel');
        }
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
                    <Text style={styles.sectionTitle}>Upload New Reel</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Title *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter reel title..."
                            value={newReel.title}
                            onChangeText={t => setNewReel({ ...newReel, title: t })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Select Video *</Text>
                        <TouchableOpacity
                            style={styles.videoPicker}
                            onPress={pickVideo}
                        >
                            <MaterialCommunityIcons
                                name={selectedVideo ? "check-circle" : "video-plus"}
                                size={32}
                                color={selectedVideo ? "#10b981" : "#E30512"}
                            />
                            <Text style={styles.videoPickerText}>
                                {selectedVideo ? selectedVideo.name : 'Tap to select video'}
                            </Text>
                            {selectedVideo && (
                                <Text style={styles.videoSize}>
                                    {(selectedVideo.size / 1024 / 1024).toFixed(2)} MB
                                </Text>
                            )}
                        </TouchableOpacity>
                        <Text style={styles.helperText}>
                            Supported formats: MP4, MOV, AVI (Max: 100MB)
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitBtn, (submitting || uploading) && styles.disabledBtn]}
                        onPress={handleAddReel}
                        disabled={submitting || uploading}
                        activeOpacity={0.8}
                    >
                        {(submitting || uploading) ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <MaterialCommunityIcons name="cloud-upload" size={20} color="#fff" />
                                <Text style={styles.submitBtnText}>Upload Reel</Text>
                            </>
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
                                    {/* Video Thumbnail with Play Button */}
                                    <TouchableOpacity
                                        style={styles.thumbnailContainer}
                                        onPress={() => handlePlayReel(reel)}
                                        activeOpacity={0.9}
                                    >
                                        {getVideoThumbnail(reel.videoUrl) ? (
                                            <>
                                                <Image
                                                    source={{ uri: getVideoThumbnail(reel.videoUrl)! }}
                                                    style={styles.thumbnail}
                                                    resizeMode="cover"
                                                />
                                                <View style={styles.playOverlay}>
                                                    <View style={styles.playButton}>
                                                        <MaterialCommunityIcons name="play" size={32} color="#fff" />
                                                    </View>
                                                </View>
                                            </>
                                        ) : (
                                            <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
                                                <MaterialCommunityIcons name="video" size={40} color="#94a3b8" />
                                            </View>
                                        )}
                                    </TouchableOpacity>

                                    <View style={styles.reelInfo}>
                                        <Text style={styles.reelItemTitle}>{reel.title}</Text>
                                        <Text style={styles.reelItemUrl} numberOfLines={1}>{reel.videoUrl}</Text>
                                        <View style={styles.reelMeta}>
                                            <Text style={styles.reelDate}>
                                                {new Date(reel.createdAt).toLocaleDateString()}
                                            </Text>
                                            {reel.platform && (
                                                <View style={styles.platformBadge}>
                                                    <Text style={styles.platformText}>{reel.platform}</Text>
                                                </View>
                                            )}
                                        </View>
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
                                <View style={styles.emptyState}>
                                    <MaterialCommunityIcons name="video-off" size={64} color="#cbd5e1" />
                                    <Text style={styles.emptyText}>No reels uploaded yet</Text>
                                    <Text style={styles.emptySubtext}>Upload your first reel to get started</Text>
                                </View>
                            )}
                        </ScrollView>
                    )}
                </View>
            </View>

            {/* Upload Progress Modal */}
            <Modal
                visible={uploading}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <MaterialCommunityIcons name="cloud-upload" size={48} color="#E30512" />
                        <Text style={styles.modalTitle}>Uploading Video</Text>
                        <Text style={styles.modalSubtitle}>Please wait...</Text>

                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{uploadProgress}%</Text>

                        <ActivityIndicator size="large" color="#E30512" style={{ marginTop: 16 }} />
                    </View>
                </View>
            </Modal>

            {/* Video Player Modal */}
            <Modal
                visible={showVideoModal}
                transparent={true}
                animationType="fade"
                onRequestClose={closeVideoModal}
            >
                <View style={styles.videoModalOverlay}>
                    <TouchableOpacity
                        style={styles.videoModalClose}
                        onPress={closeVideoModal}
                        activeOpacity={0.8}
                    >
                        <MaterialCommunityIcons name="close-circle" size={40} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.videoPlayerContainer}>
                        {playingReel && (
                            <>
                                <Text style={styles.videoTitle}>{playingReel.title}</Text>
                                <Video
                                    source={{ uri: playingReel.videoUrl }}
                                    style={styles.videoPlayer}
                                    useNativeControls
                                    resizeMode={ResizeMode.CONTAIN}
                                    isLooping
                                    shouldPlay
                                />
                            </>
                        )}
                    </View>
                </View>
            </Modal>
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
    videoPicker: {
        borderWidth: 2,
        borderColor: '#cbd5e1',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        gap: 8,
        // @ts-ignore - web only
        cursor: 'pointer',
    },
    videoPickerText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#475569',
        textAlign: 'center',
    },
    videoSize: {
        fontSize: 13,
        color: '#94a3b8',
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
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        // @ts-ignore - web only
        cursor: 'pointer',
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
        padding: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        borderRadius: 12,
        marginBottom: 12,
        gap: 12,
        backgroundColor: '#fff',
    },
    thumbnailContainer: {
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
        // @ts-ignore - web only
        cursor: 'pointer',
    },
    thumbnail: {
        width: 120,
        height: 80,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
    },
    placeholderThumbnail: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    playButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(227, 5, 18, 0.9)',
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
    reelMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
    },
    reelDate: {
        fontSize: 12,
        color: '#94a3b8',
    },
    platformBadge: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    platformText: {
        fontSize: 11,
        color: '#0369a1',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    deleteBtn: {
        padding: 8,
        backgroundColor: '#fef2f2',
        borderRadius: 8,
        // @ts-ignore - web only
        cursor: 'pointer',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        textAlign: 'center',
        color: '#64748b',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    emptySubtext: {
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: 14,
        marginTop: 4,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        marginTop: 16,
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 8,
    },
    progressBarContainer: {
        width: '100%',
        height: 8,
        backgroundColor: '#e2e8f0',
        borderRadius: 4,
        marginTop: 24,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#E30512',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#E30512',
        marginTop: 12,
    },
    // Video Player Modal Styles
    videoModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    videoModalClose: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
        // @ts-ignore - web only
        cursor: 'pointer',
    },
    videoPlayerContainer: {
        width: '100%',
        maxWidth: 800,
        backgroundColor: '#000',
        borderRadius: 12,
        overflow: 'hidden',
    },
    videoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    videoPlayer: {
        width: '100%',
        height: 450,
        backgroundColor: '#000',
    },
});
