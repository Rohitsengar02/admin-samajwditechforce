import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, Alert, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft, Upload, FileText, PlayCircle, CheckCircle, Link as LinkIcon, Save, Youtube, Smartphone, Video as VideoIcon, Trash2
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { getApiUrl } from '../../../utils/api';
import { uploadBase64ToAPI, uploadVideoToAPI } from '../../../utils/upload';


const screenWidth = Dimensions.get('window').width;

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

export default function ModuleEditorPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [videoSourceType, setVideoSourceType] = useState<'link' | 'upload'>('link');
    const [selectedVideoFile, setSelectedVideoFile] = useState<any>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        phase: '',
        type: 'video',
        duration: '',
        description: '',
        contentUrl: '',
    });

    const API_URL = `${getApiUrl()}/training`;

    useEffect(() => {
        if (id) {
            fetchModule();
        }
    }, [id]);

    const fetchModule = async () => {
        try {
            setFetching(true);
            const response = await fetch(`${API_URL}/${id}`);
            const data = await response.json();

            if (response.ok && data) {
                const url = data.contentUrl || '';
                setFormData({
                    title: data.title || '',
                    phase: data.phase || '',
                    type: data.type || 'video',
                    duration: data.duration || '',
                    description: data.description || '',
                    contentUrl: url,
                });

                // Determine source type from URL
                if (url.includes('.mp4') || url.includes('/video/')) {
                    setVideoSourceType('upload');
                } else {
                    setVideoSourceType('link');
                }
            } else {
                Alert.alert('Error', 'Module not found');
                router.back();
            }
        } catch (error) {
            console.error('Error fetching module:', error);
            Alert.alert('Error', 'Failed to load module');
        } finally {
            setFetching(false);
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
                if (video.size && video.size > 100 * 1024 * 1024) {
                    Alert.alert('Error', 'Video size should be less than 100MB');
                    return;
                }
                setSelectedVideoFile(video);
            }
        } catch (error) {
            console.error('Error picking video:', error);
            Alert.alert('Error', 'Failed to pick video');
        }
    };

    const pickFile = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled && result.assets[0].base64) {
                setUploading(true);
                try {
                    const url = await uploadBase64ToAPI(result.assets[0].base64, 'training');
                    if (url) {
                        setFormData(prev => ({ ...prev, contentUrl: url }));
                    }
                } finally {
                    setUploading(false);
                }
            }
        } catch (error) {
            console.error('Error picking file:', error);
            Alert.alert('Error', 'Failed to pick file');
        }
    };

    const handleDelete = async () => {
        const confirmDelete = () => {
            return new Promise<boolean>((resolve) => {
                if (Platform.OS === 'web') {
                    resolve(window.confirm(`Delete "${formData.title}"?\n\nThis action cannot be undone.`));
                } else {
                    Alert.alert(
                        '⚠️ Delete Module',
                        `Are you sure you want to delete "${formData.title}"?`,
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

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                if (Platform.OS === 'web') {
                    alert('✅ Module deleted successfully');
                } else {
                    Alert.alert('Success', 'Module deleted successfully');
                }
                router.back();
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
            if (Platform.OS === 'web') {
                alert('❌ Failed to delete module');
            } else {
                Alert.alert('Error', 'Failed to delete module');
            }
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            Alert.alert('Validation Error', 'Please enter module title');
            return false;
        }
        if (!formData.phase) {
            Alert.alert('Validation Error', 'Please select a phase');
            return false;
        }
        if (formData.type === 'video') {
            if (videoSourceType === 'link' && !formData.contentUrl.trim()) {
                Alert.alert('Validation Error', 'Please enter YouTube URL');
                return false;
            }
            if (videoSourceType === 'upload' && !selectedVideoFile && !formData.contentUrl.startsWith('http')) {
                Alert.alert('Validation Error', 'Please upload a video file');
                return false;
            }
        }
        if (formData.type === 'document' && !formData.contentUrl.trim()) {
            Alert.alert('Validation Error', 'Please upload a document or provide a URL');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            let finalContentUrl = formData.contentUrl.trim();

            if (formData.type === 'video' && videoSourceType === 'upload' && selectedVideoFile) {
                setUploading(true);
                try {
                    const result = await uploadVideoToAPI(selectedVideoFile.uri, 'training');
                    if (!result.url) {
                        setLoading(false);
                        return;
                    }
                    finalContentUrl = result.url;
                } catch (uploadError) {
                    Alert.alert('Error', 'Failed to upload video');
                    setLoading(false);
                    return;
                } finally {
                    setUploading(false);
                }
            }

            const payload = {
                title: formData.title.trim(),
                phase: formData.phase,
                type: formData.type,
                duration: formData.duration.trim(),
                description: formData.description.trim(),
                contentUrl: finalContentUrl,
            };

            console.log('Updating module with payload:', payload);

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setShowSuccess(true);
                // Auto close after 2 seconds and navigate back
                setTimeout(() => {
                    setShowSuccess(false);
                    router.back();
                }, 2000);
            } else {
                Alert.alert('Error', data.message || 'Failed to update module');
            }
        } catch (error) {
            console.error('Error updating module:', error);
            Alert.alert('Error', 'Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };



    if (fetching) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                <ActivityIndicator size="large" color="#8B5CF6" />
                <Text style={{ marginTop: 16, color: '#6b7280', fontWeight: '500' }}>Loading module...</Text>
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
                            backgroundColor: '#f3e8ff',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 20,
                        }}>
                            <Save size={48} color="#8B5CF6" />
                        </View>
                        <Text style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#111827',
                            marginBottom: 8,
                        }}>Updated!</Text>
                        <Text style={{
                            fontSize: 16,
                            color: '#6b7280',
                            textAlign: 'center',
                        }}>Training module updated successfully</Text>
                    </View>
                </View>
            )}

            <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }} showsVerticalScrollIndicator={false}>
                <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={{
                        paddingTop: 48,
                        paddingBottom: 64,
                        paddingHorizontal: 24,
                        borderBottomLeftRadius: 40,
                        borderBottomRightRadius: 40,
                        marginBottom: 24,
                    }}
                >
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 14, marginRight: 16 }}
                        >
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>Edit Module</Text>
                            <Text style={{ color: '#c4b5fd', fontSize: 14, marginTop: 4 }}>Update training content</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={{ paddingHorizontal: 24, paddingBottom: 100 }}>
                    {/* Module Information */}
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 24,
                        padding: 24,
                        marginBottom: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.08,
                        shadowRadius: 12,
                        elevation: 4,
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 20 }}>Module Information</Text>

                        {/* Title */}
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Module Title *</Text>
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
                                placeholder="Enter module title"
                                value={formData.title}
                                onChangeText={(text) => setFormData({ ...formData, title: text })}
                            />
                        </View>

                        {/* Phase Selection */}
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Select Phase *</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                {['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'].map((phase) => (
                                    <TouchableOpacity
                                        key={phase}
                                        onPress={() => setFormData({ ...formData, phase })}
                                        style={{
                                            paddingHorizontal: 18,
                                            paddingVertical: 10,
                                            borderRadius: 12,
                                            backgroundColor: formData.phase === phase ? '#8B5CF6' : '#f3f4f6',
                                        }}
                                    >
                                        <Text style={{
                                            fontWeight: '600',
                                            color: formData.phase === phase ? 'white' : '#374151',
                                        }}>
                                            {phase}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Content Type */}
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Content Type *</Text>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <TouchableOpacity
                                    onPress={() => setFormData({ ...formData, type: 'video' })}
                                    style={{
                                        flex: 1,
                                        padding: 18,
                                        borderRadius: 16,
                                        borderWidth: 2,
                                        backgroundColor: formData.type === 'video' ? '#f5f3ff' : '#f9fafb',
                                        borderColor: formData.type === 'video' ? '#8B5CF6' : '#e5e7eb',
                                        alignItems: 'center',
                                    }}
                                >
                                    <PlayCircle size={32} color={formData.type === 'video' ? '#8B5CF6' : '#9CA3AF'} />
                                    <Text style={{
                                        fontWeight: '600',
                                        marginTop: 8,
                                        color: formData.type === 'video' ? '#7c3aed' : '#6b7280',
                                    }}>
                                        Video
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setFormData({ ...formData, type: 'document' })}
                                    style={{
                                        flex: 1,
                                        padding: 18,
                                        borderRadius: 16,
                                        borderWidth: 2,
                                        backgroundColor: formData.type === 'document' ? '#f5f3ff' : '#f9fafb',
                                        borderColor: formData.type === 'document' ? '#8B5CF6' : '#e5e7eb',
                                        alignItems: 'center',
                                    }}
                                >
                                    <FileText size={32} color={formData.type === 'document' ? '#8B5CF6' : '#9CA3AF'} />
                                    <Text style={{
                                        fontWeight: '600',
                                        marginTop: 8,
                                        color: formData.type === 'document' ? '#7c3aed' : '#6b7280',
                                    }}>
                                        Document
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Duration */}
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Duration</Text>
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
                                placeholder="e.g. 15 min"
                                value={formData.duration}
                                onChangeText={(text) => setFormData({ ...formData, duration: text })}
                            />
                        </View>

                        {/* Description */}
                        <View>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Description</Text>
                            <TextInput
                                style={{
                                    backgroundColor: '#f9fafb',
                                    borderWidth: 1,
                                    borderColor: '#e5e7eb',
                                    borderRadius: 14,
                                    padding: 16,
                                    fontSize: 16,
                                    color: '#111827',
                                    minHeight: 100,
                                    textAlignVertical: 'top',
                                }}
                                placeholder="Enter module description"
                                multiline
                                numberOfLines={4}
                                value={formData.description}
                                onChangeText={(text) => setFormData({ ...formData, description: text })}
                            />
                        </View>
                    </View>

                    {/* Content URL Section */}
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 24,
                        padding: 24,
                        marginBottom: 24,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.08,
                        shadowRadius: 12,
                        elevation: 4,
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 20 }}>
                            {formData.type === 'video' ? '🎬 Video Source' : '📄 Document Source'}
                        </Text>

                        {formData.type === 'video' ? (
                            <View>
                                {/* Source Selector Switch */}
                                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                                    <TouchableOpacity
                                        onPress={() => setVideoSourceType('link')}
                                        style={{
                                            flex: 1,
                                            paddingVertical: 12,
                                            borderRadius: 14,
                                            borderWidth: 2,
                                            backgroundColor: videoSourceType === 'link' ? '#f5f3ff' : '#ffffff',
                                            borderColor: videoSourceType === 'link' ? '#8B5CF6' : '#f3f4f6',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Youtube size={18} color={videoSourceType === 'link' ? '#8B5CF6' : '#9CA3AF'} />
                                        <Text style={{
                                            fontWeight: 'bold',
                                            marginLeft: 8,
                                            color: videoSourceType === 'link' ? '#7c3aed' : '#6b7280',
                                        }}>YouTube Link</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setVideoSourceType('upload')}
                                        style={{
                                            flex: 1,
                                            paddingVertical: 12,
                                            borderRadius: 14,
                                            borderWidth: 2,
                                            backgroundColor: videoSourceType === 'upload' ? '#f5f3ff' : '#ffffff',
                                            borderColor: videoSourceType === 'upload' ? '#8B5CF6' : '#f3f4f6',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Upload size={18} color={videoSourceType === 'upload' ? '#8B5CF6' : '#9CA3AF'} />
                                        <Text style={{
                                            fontWeight: 'bold',
                                            marginLeft: 8,
                                            color: videoSourceType === 'upload' ? '#7c3aed' : '#6b7280',
                                        }}>Upload File</Text>
                                    </TouchableOpacity>
                                </View>

                                {videoSourceType === 'link' ? (
                                    <View>
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>YouTube Video URL *</Text>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            backgroundColor: '#f9fafb',
                                            borderWidth: 1,
                                            borderColor: '#e5e7eb',
                                            borderRadius: 14,
                                            paddingHorizontal: 16,
                                        }}>
                                            <LinkIcon size={20} color="#9CA3AF" />
                                            <TextInput
                                                style={{ flex: 1, padding: 16, fontSize: 16, color: '#111827' }}
                                                placeholder="https://youtube.com/..."
                                                value={formData.contentUrl}
                                                onChangeText={(text) => setFormData({ ...formData, contentUrl: text })}
                                                autoCapitalize="none"
                                            />
                                        </View>
                                        <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>
                                            Paste the full YouTube video link here.
                                        </Text>
                                    </View>
                                ) : (
                                    <View>
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Upload Video File *</Text>
                                        <TouchableOpacity
                                            onPress={pickVideo}
                                            style={{
                                                backgroundColor: '#f5f3ff',
                                                borderWidth: 2,
                                                borderStyle: 'dashed',
                                                borderColor: '#c4b5fd',
                                                borderRadius: 16,
                                                padding: 32,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <View style={{ width: 64, height: 64, backgroundColor: 'white', borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
                                                <VideoIcon size={32} color="#8B5CF6" />
                                            </View>
                                            <Text style={{ color: '#111827', fontWeight: 'bold', marginBottom: 4, textAlign: 'center' }}>
                                                {selectedVideoFile ? selectedVideoFile.name : (formData.contentUrl.startsWith('http') ? 'Video already uploaded' : 'Tap to select video')}
                                            </Text>
                                            <Text style={{ color: '#8B5CF6', fontSize: 12, textAlign: 'center' }}>
                                                {selectedVideoFile
                                                    ? `(${(selectedVideoFile.size / 1024 / 1024).toFixed(2)} MB)`
                                                    : 'Supported formats: MP4, MOV, AVI (Max: 100MB)'}
                                            </Text>
                                        </TouchableOpacity>
                                        {uploading && (
                                            <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator size="small" color="#8B5CF6" />
                                                <Text style={{ color: '#7c3aed', marginLeft: 8, fontWeight: '600' }}>Uploading video content...</Text>
                                            </View>
                                        )}
                                        {formData.contentUrl && formData.contentUrl.startsWith('http') && !selectedVideoFile && (
                                            <View style={{ marginTop: 12, backgroundColor: '#f0fdf4', padding: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                <CheckCircle size={14} color="#16a34a" />
                                                <Text style={{ color: '#16a34a', fontSize: 12, marginLeft: 6, fontWeight: '600' }}>Current content is an uploaded video</Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Document URL or Upload</Text>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#f9fafb',
                                    borderWidth: 1,
                                    borderColor: '#e5e7eb',
                                    borderRadius: 14,
                                    paddingHorizontal: 16,
                                    marginBottom: 16,
                                }}>
                                    <LinkIcon size={20} color="#9CA3AF" />
                                    <TextInput
                                        style={{ flex: 1, padding: 16, fontSize: 16, color: '#111827' }}
                                        placeholder="https://example.com/document.pdf"
                                        value={formData.contentUrl}
                                        onChangeText={(text) => setFormData({ ...formData, contentUrl: text })}
                                        autoCapitalize="none"
                                    />
                                </View>

                                <TouchableOpacity
                                    onPress={pickFile}
                                    style={{
                                        backgroundColor: '#f5f3ff',
                                        borderWidth: 2,
                                        borderStyle: 'dashed',
                                        borderColor: '#c4b5fd',
                                        borderRadius: 16,
                                        padding: 24,
                                        alignItems: 'center',
                                    }}
                                >
                                    {uploading ? (
                                        <ActivityIndicator size="small" color="#8B5CF6" />
                                    ) : (
                                        <>
                                            <Upload size={28} color="#8B5CF6" />
                                            <Text style={{ color: '#7c3aed', fontWeight: '600', marginTop: 8 }}>Upload Document (Image/PDF)</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                                {formData.contentUrl && formData.contentUrl.startsWith('http') && (
                                    <Text style={{ color: '#059669', fontSize: 12, marginTop: 8, textAlign: 'center' }}>
                                        ✅ File uploaded successfully!
                                    </Text>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Action Buttons */}
                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
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
                                colors={loading ? ['#9CA3AF', '#6B7280'] : ['#8B5CF6', '#7C3AED']}
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
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Delete Section */}
                    <View style={{ borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 20 }}>
                        <TouchableOpacity
                            onPress={handleDelete}
                            style={{
                                backgroundColor: '#fef2f2',
                                paddingVertical: 16,
                                borderRadius: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: '#fee2e2',
                            }}
                            disabled={loading}
                        >
                            <Trash2 size={20} color="#DC2626" />
                            <Text style={{ color: '#DC2626', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>Delete Module</Text>
                        </TouchableOpacity>
                        <Text style={{ color: '#9ca3af', fontSize: 12, textAlign: 'center', marginTop: 10 }}>
                            Warning: This action is permanent and cannot be undone.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}
