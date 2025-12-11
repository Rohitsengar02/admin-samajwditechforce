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
    Platform,
    useWindowDimensions,
    FlatList
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '../../utils/api';

const SP_RED = '#E30512';

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
    const [showEditModal, setShowEditModal] = useState(false);
    const [title, setTitle] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editingPoster, setEditingPoster] = useState<Poster | null>(null);
    const [editImage, setEditImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [updating, setUpdating] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [stats, setStats] = useState<Stats>({ totalPosters: 0, totalDownloads: 0 });

    const { width } = useWindowDimensions();
    const isDesktop = Platform.OS === 'web' && width >= 1024;
    const isTablet = Platform.OS === 'web' && width >= 768 && width < 1024;

    const getNumColumns = () => {
        if (isDesktop) return 4;
        if (isTablet) return 3;
        return 2;
    };

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

    const pickEditImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            if (Platform.OS === 'web') {
                alert('Permission to access camera roll is required!');
            } else {
                Alert.alert('Permission Required', 'Permission to access camera roll is required!');
            }
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setEditImage(result.assets[0]);
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

            if (!token) {
                Alert.alert('Authentication Error', 'Please log in to upload posters.');
                setUploading(false);
                return;
            }

            const response = await fetch(selectedImage.uri);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64data = reader.result as string;

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

                if (uploadResponse.ok) {
                    Alert.alert('Success', 'Poster uploaded successfully!');
                    setShowUploadModal(false);
                    setTitle('');
                    setSelectedImage(null);
                    fetchPosters();
                    fetchStats();
                } else {
                    Alert.alert('Error', data.message || `Upload failed`);
                }
                setUploading(false);
            };

            reader.readAsDataURL(blob);
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Error', `Failed to upload poster`);
            setUploading(false);
        }
    };

    const deletePoster = async (posterId: string, posterTitle: string) => {
        const confirmDelete = () => {
            return new Promise<boolean>((resolve) => {
                if (Platform.OS === 'web') {
                    resolve(window.confirm(`Are you sure you want to delete "${posterTitle}"?\n\nThis action cannot be undone.`));
                } else {
                    Alert.alert(
                        '⚠️ Delete Poster',
                        `Are you sure you want to delete "${posterTitle}"?\n\nThis action cannot be undone.`,
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
            const token = await AsyncStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/posters/${posterId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                if (Platform.OS === 'web') {
                    alert('✅ Poster deleted successfully');
                } else {
                    Alert.alert('✅ Success', 'Poster deleted successfully');
                }
                fetchPosters();
                fetchStats();
            } else {
                if (Platform.OS === 'web') {
                    alert('❌ Failed to delete poster');
                } else {
                    Alert.alert('Error', 'Failed to delete poster');
                }
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const editPoster = (poster: Poster) => {
        setEditingPoster(poster);
        setEditTitle(poster.title);
        setEditImage(null);
        setShowEditModal(true);
    };

    const updatePoster = async () => {
        if (!editTitle.trim()) {
            if (Platform.OS === 'web') {
                alert('⚠️ Please enter a title');
            } else {
                Alert.alert('Error', 'Please enter a title');
            }
            return;
        }

        if (!editingPoster) return;

        try {
            setUpdating(true);
            const token = await AsyncStorage.getItem('adminToken');

            const updateData: { title: string; imageBase64?: string } = { title: editTitle };

            // If new image selected, convert to base64
            if (editImage) {
                const response = await fetch(editImage.uri);
                const blob = await response.blob();
                const base64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(blob);
                });
                updateData.imageBase64 = base64;
            }

            const apiResponse = await fetch(`${API_URL}/posters/${editingPoster._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            const data = await apiResponse.json();

            if (apiResponse.ok) {
                if (Platform.OS === 'web') {
                    alert('✅ Poster updated successfully!');
                } else {
                    Alert.alert('✅ Success', 'Poster updated successfully!');
                }
                setShowEditModal(false);
                setEditingPoster(null);
                setEditTitle('');
                setEditImage(null);
                fetchPosters();
            } else {
                if (Platform.OS === 'web') {
                    alert(`❌ ${data.message || 'Failed to update poster'}`);
                } else {
                    Alert.alert('Error', data.message || 'Failed to update poster');
                }
            }
        } catch (error) {
            console.error('Update error:', error);
            if (Platform.OS === 'web') {
                alert('❌ Failed to update poster');
            } else {
                Alert.alert('Error', 'Failed to update poster');
            }
        } finally {
            setUpdating(false);
        }
    };

    const renderPosterCard = ({ item }: { item: Poster }) => (
        <View key={item._id} style={[
            styles.posterCard,
            { width: isDesktop ? '23%' : isTablet ? '31%' : '47%' }
        ]}>
            <Image source={{ uri: item.imageUrl }} style={styles.posterImage} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.posterOverlay}
            >
                <Text style={styles.posterTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.posterActions}>
                    <View style={styles.downloadInfo}>
                        <MaterialCommunityIcons name="download" size={16} color="#fff" />
                        <Text style={styles.downloadCount}>{item.downloadCount}</Text>
                    </View>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => editPoster(item)}
                        >
                            <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => deletePoster(item._id, item.title)}
                        >
                            <MaterialCommunityIcons name="delete-outline" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );



    return (
        <View style={styles.container}>
            <LinearGradient colors={['#FEF2F2', '#FFFFFF']} style={styles.background} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 40 : 120 }}
            >
                {/* Header */}
                <View style={[styles.header, isDesktop && styles.headerDesktop]}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>🎨 Poster Management</Text>
                        <Text style={styles.subtitle}>Create, upload and manage campaign posters</Text>
                    </View>
                    <TouchableOpacity style={styles.uploadButton} onPress={() => setShowUploadModal(true)}>
                        <LinearGradient
                            colors={[SP_RED, '#B91C1C']}
                            style={styles.uploadButtonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" />
                            <Text style={styles.uploadButtonText}>
                                {isDesktop || isTablet ? 'Upload New' : 'Upload'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Stats Cards */}
                <View style={[styles.statsContainer, isDesktop && styles.statsContainerDesktop]}>
                    <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.statCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <View style={styles.statIconContainer}>
                            <MaterialCommunityIcons name="image-multiple" size={28} color="#fff" />
                        </View>
                        <Text style={styles.statNumber}>{stats.totalPosters}</Text>
                        <Text style={styles.statLabel}>Total Posters</Text>
                    </LinearGradient>

                    <LinearGradient colors={['#10B981', '#059669']} style={styles.statCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <View style={styles.statIconContainer}>
                            <MaterialCommunityIcons name="download" size={28} color="#fff" />
                        </View>
                        <Text style={styles.statNumber}>{stats.totalDownloads}</Text>
                        <Text style={styles.statLabel}>Total Downloads</Text>
                    </LinearGradient>
                </View>

                {/* Posters Grid */}
                {loading ? (
                    <View style={{ paddingTop: 60, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={SP_RED} />
                        <Text style={{ marginTop: 12, color: '#64748B' }}>Loading posters...</Text>
                    </View>
                ) : posters.length > 0 ? (
                    <View style={[styles.postersGrid, isDesktop && styles.postersGridDesktop]}>
                        {posters.map((poster) => renderPosterCard({ item: poster }))}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <LinearGradient colors={['#F3F4F6', '#E5E7EB']} style={styles.emptyIconContainer}>
                            <MaterialCommunityIcons name="image-off-outline" size={64} color="#9CA3AF" />
                        </LinearGradient>
                        <Text style={styles.emptyText}>No posters uploaded yet</Text>
                        <Text style={styles.emptySubtext}>Click the upload button to add your first poster</Text>
                    </View>
                )}
            </ScrollView>

            {/* Upload Modal */}
            <Modal visible={showUploadModal} transparent animationType="fade" onRequestClose={() => setShowUploadModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, isDesktop && styles.modalContentDesktop]}>
                        <LinearGradient colors={['#FEF2F2', '#FFFFFF']} style={styles.modalGradient}>
                            <View style={styles.modalHeader}>
                                <View>
                                    <Text style={styles.modalTitle}>📤 Upload New Poster</Text>
                                    <Text style={styles.modalSubtitle}>Add a new poster to your collection</Text>
                                </View>
                                <TouchableOpacity onPress={() => setShowUploadModal(false)} style={styles.closeButton}>
                                    <MaterialCommunityIcons name="close-circle" size={28} color="#64748B" />
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="Enter poster title..."
                                value={title}
                                onChangeText={setTitle}
                                placeholderTextColor="#94A3B8"
                            />

                            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                                {selectedImage ? (
                                    <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
                                ) : (
                                    <View style={styles.imagePickerPlaceholder}>
                                        <MaterialCommunityIcons name="image-plus" size={56} color="#CBD5E1" />
                                        <Text style={styles.imagePickerText}>Tap to select image</Text>
                                        <Text style={styles.imagePickerSubtext}>JPG, PNG up to 5MB</Text>
                                    </View>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.submitButton, uploading && styles.submitButtonDisabled]}
                                onPress={uploadPoster}
                                disabled={uploading}
                            >
                                <LinearGradient colors={[SP_RED, '#B91C1C']} style={styles.submitButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                                    {uploading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <MaterialCommunityIcons name="cloud-upload" size={22} color="#fff" />
                                            <Text style={styles.submitButtonText}>Upload Poster</Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </Modal>

            {/* Edit Modal */}
            <Modal visible={showEditModal} transparent animationType="fade" onRequestClose={() => setShowEditModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, isDesktop && styles.modalContentDesktop]}>
                        <LinearGradient colors={['#EEF2FF', '#FFFFFF']} style={styles.modalGradient}>
                            <View style={styles.modalHeader}>
                                <View>
                                    <Text style={styles.modalTitle}>✏️ Edit Poster</Text>
                                    <Text style={styles.modalSubtitle}>Update poster details</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowEditModal(false);
                                        setEditingPoster(null);
                                        setEditTitle('');
                                        setEditImage(null);
                                    }}
                                    style={styles.closeButton}
                                >
                                    <MaterialCommunityIcons name="close-circle" size={28} color="#64748B" />
                                </TouchableOpacity>
                            </View>

                            {/* Poster Image Preview / Change */}
                            <Text style={styles.inputLabel}>Poster Image</Text>
                            <TouchableOpacity style={styles.editImagePicker} onPress={pickEditImage}>
                                {editImage ? (
                                    <Image source={{ uri: editImage.uri }} style={styles.editPreviewImage} resizeMode="cover" />
                                ) : editingPoster ? (
                                    <Image source={{ uri: editingPoster.imageUrl }} style={styles.editPreviewImage} resizeMode="cover" />
                                ) : null}
                                <View style={styles.changeImageOverlay}>
                                    <MaterialCommunityIcons name="camera" size={24} color="#fff" />
                                    <Text style={styles.changeImageText}>Tap to change image</Text>
                                </View>
                            </TouchableOpacity>

                            <Text style={styles.inputLabel}>Poster Title</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter poster title..."
                                value={editTitle}
                                onChangeText={setEditTitle}
                                placeholderTextColor="#94A3B8"
                            />

                            <TouchableOpacity
                                style={[styles.submitButton, updating && styles.submitButtonDisabled]}
                                onPress={updatePoster}
                                disabled={updating}
                            >
                                <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.submitButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                                    {updating ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <MaterialCommunityIcons name="content-save" size={22} color="#fff" />
                                            <Text style={styles.submitButtonText}>Save Changes</Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 16, fontSize: 16, color: '#64748B', fontWeight: '600' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, paddingTop: 24 },
    headerDesktop: { paddingHorizontal: 40, paddingTop: 32 },
    title: { fontSize: 28, fontWeight: '900', color: '#0F172A', marginBottom: 4 },
    subtitle: { fontSize: 14, color: '#64748B', fontWeight: '500' },
    uploadButton: { borderRadius: 12, overflow: 'hidden', shadowColor: SP_RED, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
    uploadButtonGradient: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 20 },
    uploadButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    statsContainer: { flexDirection: 'row', gap: 16, paddingHorizontal: 20, marginBottom: 24 },
    statsContainerDesktop: { paddingHorizontal: 40 },
    statCard: { flex: 1, padding: 20, borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
    statIconContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    statNumber: { fontSize: 32, fontWeight: '900', color: '#fff', marginTop: 8 },
    statLabel: { fontSize: 13, color: 'rgba(255, 255, 255, 0.9)', marginTop: 4, fontWeight: '600' },
    postersGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 16 },
    postersGridDesktop: { paddingHorizontal: 32 },
    posterCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4, marginBottom: 8 },
    posterImage: { width: '100%', height: 240, backgroundColor: '#F1F5F9' },
    posterOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
    posterTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 8 },
    posterActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    downloadInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255, 255, 255, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    downloadCount: { fontSize: 13, color: '#fff', fontWeight: '700' },
    actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    editButton: { backgroundColor: 'rgba(59, 130, 246, 0.9)', padding: 8, borderRadius: 10 },
    deleteButton: { backgroundColor: 'rgba(239, 68, 68, 0.9)', padding: 8, borderRadius: 10 },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, paddingHorizontal: 20 },
    emptyIconContainer: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    emptyText: { fontSize: 20, fontWeight: '700', color: '#64748B', marginTop: 16 },
    emptySubtext: { fontSize: 14, color: '#94A3B8', marginTop: 8, textAlign: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { width: '100%', maxWidth: 500, borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
    modalContentDesktop: { maxWidth: 600 },
    modalGradient: { padding: 28 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
    modalTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
    modalSubtitle: { fontSize: 13, color: '#64748B', marginTop: 4 },
    closeButton: { padding: 4 },
    input: { backgroundColor: '#fff', borderRadius: 14, padding: 16, fontSize: 16, color: '#0F172A', marginBottom: 20, borderWidth: 2, borderColor: '#E2E8F0', fontWeight: '500' },
    inputLabel: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 8 },
    imagePicker: { height: 220, borderRadius: 16, overflow: 'hidden', marginBottom: 24, borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed' },
    selectedImage: { width: '100%', height: '100%' },
    imagePickerPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
    imagePickerText: { marginTop: 12, fontSize: 15, color: '#64748B', fontWeight: '700' },
    imagePickerSubtext: { marginTop: 4, fontSize: 12, color: '#94A3B8', fontWeight: '500' },
    editImagePicker: { height: 200, borderRadius: 16, overflow: 'hidden', marginBottom: 20, borderWidth: 2, borderColor: '#E2E8F0', position: 'relative' },
    editPreviewImage: { width: '100%', height: '100%', backgroundColor: '#F1F5F9' },
    changeImageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    changeImageText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    submitButton: { borderRadius: 14, overflow: 'hidden', shadowColor: SP_RED, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
    submitButtonDisabled: { opacity: 0.6 },
    submitButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
