import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, Alert, ActivityIndicator, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Upload, FileText, PlayCircle, CheckCircle, Link as LinkIcon, X
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const screenWidth = Dimensions.get('window').width;

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dssmutzly/image/upload';
const UPLOAD_PRESET = 'multimallpro';

export default function CreateModulePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        phase: '',
        type: 'video', // Default to video
        duration: '',
        description: '',
        contentUrl: '',
    });

    // Auto-detect platform and use correct API URL
    const getApiUrl = () => {
        const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
        if (Platform.OS === 'android') {
            return baseUrl.replace('localhost', '10.0.2.2');
        }
        return baseUrl;
    };

    const API_URL = `${getApiUrl()}/api/training`;

    const uploadToCloudinary = async (base64: string) => {
        try {
            setUploading(true);
            const data = new FormData();
            data.append('file', `data:image/jpeg;base64,${base64}`);
            data.append('upload_preset', UPLOAD_PRESET);

            const response = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: data,
            });

            const result = await response.json();
            if (result.secure_url) {
                return result.secure_url;
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            Alert.alert('Error', 'Failed to upload file');
            return null;
        } finally {
            setUploading(false);
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
                const url = await uploadToCloudinary(result.assets[0].base64);
                if (url) {
                    setFormData(prev => ({ ...prev, contentUrl: url }));
                }
            }
        } catch (error) {
            console.error('Error picking file:', error);
            Alert.alert('Error', 'Failed to pick file');
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
        if (formData.type === 'video' && !formData.contentUrl.trim()) {
            Alert.alert('Validation Error', 'Please enter YouTube URL');
            return false;
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
            const payload = {
                title: formData.title.trim(),
                phase: formData.phase,
                type: formData.type,
                duration: formData.duration.trim(),
                description: formData.description.trim(),
                contentUrl: formData.contentUrl.trim(),
            };

            console.log('Creating module with payload:', payload);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                Alert.alert(
                    'Success!',
                    'Training module created successfully',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.back(),
                        },
                    ]
                );
            } else {
                Alert.alert('Error', data.message || 'Failed to create module');
            }
        } catch (error) {
            console.error('Error creating module:', error);
            Alert.alert('Error', 'Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            <LinearGradient colors={['#4F46E5', '#7C3AED']} className="pt-12 pb-16 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">Create Module</Text>
                        <Text className="text-indigo-200 text-sm mt-1">Add new training content</Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="px-6 pb-8">
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-4">Module Information</Text>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Module Title *</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                            placeholder="Enter module title"
                            value={formData.title}
                            onChangeText={(text) => setFormData({ ...formData, title: text })}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Select Phase *</Text>
                        <View className="flex-row flex-wrap -mx-1">
                            {['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'].map((phase) => (
                                <TouchableOpacity
                                    key={phase}
                                    onPress={() => setFormData({ ...formData, phase })}
                                    className={`m-1 px-4 py-2 rounded-xl ${formData.phase === phase ? 'bg-indigo-600' : 'bg-gray-100'}`}
                                >
                                    <Text className={`font-semibold ${formData.phase === phase ? 'text-white' : 'text-gray-700'}`}>
                                        {phase}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Content Type *</Text>
                        <View className="flex-row space-x-3">
                            <TouchableOpacity
                                onPress={() => setFormData({ ...formData, type: 'video' })}
                                className={`flex-1 p-4 rounded-2xl border-2 ${formData.type === 'video' ? 'bg-indigo-50 border-indigo-500' : 'bg-gray-50 border-gray-200'}`}
                            >
                                <PlayCircle size={28} color={formData.type === 'video' ? '#6366f1' : '#9CA3AF'} />
                                <Text className={`font-semibold mt-2 ${formData.type === 'video' ? 'text-indigo-900' : 'text-gray-700'}`}>
                                    Video
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setFormData({ ...formData, type: 'document' })}
                                className={`flex-1 p-4 rounded-2xl border-2 ${formData.type === 'document' ? 'bg-indigo-50 border-indigo-500' : 'bg-gray-50 border-gray-200'}`}
                            >
                                <FileText size={28} color={formData.type === 'document' ? '#6366f1' : '#9CA3AF'} />
                                <Text className={`font-semibold mt-2 ${formData.type === 'document' ? 'text-indigo-900' : 'text-gray-700'}`}>
                                    Document
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Duration</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                            placeholder="e.g. 15 min"
                            value={formData.duration}
                            onChangeText={(text) => setFormData({ ...formData, duration: text })}
                        />
                    </View>

                    <View>
                        <Text className="text-gray-600 font-medium mb-2">Description</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                            placeholder="Enter module description"
                            multiline
                            numberOfLines={4}
                            value={formData.description}
                            onChangeText={(text) => setFormData({ ...formData, description: text })}
                        />
                    </View>
                </View>

                {/* Content URL Section */}
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-4">
                        {formData.type === 'video' ? 'Video Source' : 'Document Source'}
                    </Text>

                    {formData.type === 'video' ? (
                        <View>
                            <Text className="text-gray-600 font-medium mb-2">YouTube Video URL *</Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
                                <LinkIcon size={20} color="#9CA3AF" />
                                <TextInput
                                    className="flex-1 p-4 text-gray-800"
                                    placeholder="https://youtube.com/..."
                                    value={formData.contentUrl}
                                    onChangeText={(text) => setFormData({ ...formData, contentUrl: text })}
                                    autoCapitalize="none"
                                />
                            </View>
                            <Text className="text-gray-400 text-xs mt-2">Paste the full YouTube video link here.</Text>
                        </View>
                    ) : (
                        <View>
                            <Text className="text-gray-600 font-medium mb-2">Document URL or Upload</Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 mb-4">
                                <LinkIcon size={20} color="#9CA3AF" />
                                <TextInput
                                    className="flex-1 p-4 text-gray-800"
                                    placeholder="https://example.com/document.pdf"
                                    value={formData.contentUrl}
                                    onChangeText={(text) => setFormData({ ...formData, contentUrl: text })}
                                    autoCapitalize="none"
                                />
                            </View>

                            <TouchableOpacity
                                onPress={pickFile}
                                className="bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-2xl p-6 items-center"
                            >
                                {uploading ? (
                                    <ActivityIndicator size="small" color="#6366f1" />
                                ) : (
                                    <>
                                        <Upload size={24} color="#6366f1" />
                                        <Text className="text-indigo-600 font-semibold mt-2">Upload Document (Image/PDF)</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                            {formData.contentUrl && formData.contentUrl.includes('cloudinary') && (
                                <Text className="text-green-600 text-xs mt-2 text-center">File uploaded successfully!</Text>
                            )}
                        </View>
                    )}
                </View>

                <View className="flex-row space-x-3">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 bg-gray-100 py-4 rounded-2xl items-center"
                        disabled={loading}
                    >
                        <Text className="text-gray-700 font-bold">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1"
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={loading ? ['#9CA3AF', '#6B7280'] : ['#6366f1', '#8b5cf6']}
                            className="py-4 rounded-2xl items-center flex-row justify-center"
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <CheckCircle size={20} color="white" />
                            )}
                            <Text className="text-white font-bold ml-2">
                                {loading ? 'Creating...' : 'Create Module'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
