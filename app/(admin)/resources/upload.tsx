import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, Alert, ActivityIndicator, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Upload, Image as ImageIcon, Video, FileText, CheckCircle, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { getApiUrl } from '../../../utils/api';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const API_URL = `${getApiUrl()}/resources`;
import { uploadBase64ToAPI } from '../../../utils/upload';

export default function UploadPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id } = params;
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        fileUrl: '',
        thumbnailUrl: '',
        fileType: '',
        fileSize: 0,
        youtubeLink: '',
        tags: [] as string[]
    });

    React.useEffect(() => {
        if (isEditing) {
            fetchResourceData();
        }
    }, [id]);

    const fetchResourceData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/${id}`);
            const data = await response.json();
            if (data.success) {
                const resource = data.data;
                setFormData({
                    title: resource.title || '',
                    category: resource.category || '',
                    description: resource.description || '',
                    fileUrl: resource.fileUrl || '',
                    thumbnailUrl: resource.thumbnailUrl || '',
                    fileType: resource.fileType || '',
                    fileSize: resource.fileSize || 0,
                    youtubeLink: resource.youtubeLink || '',
                    tags: resource.tags || []
                });
            }
        } catch (error) {
            console.error('Error fetching resource:', error);
            Alert.alert('Error', 'Failed to fetch resource details');
        } finally {
            setLoading(false);
        }
    };

    const pickFile = async () => {
        try {
            setUploading(true);
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled && result.assets[0].base64) {
                const url = await uploadBase64ToAPI(result.assets[0].base64, 'resources');
                if (url) {
                    setFormData(prev => ({
                        ...prev,
                        fileUrl: url,
                        thumbnailUrl: url,
                        fileType: result.assets[0].type === 'video' ? 'video' : 'image',
                        fileSize: result.assets[0].fileSize || 0
                    }));
                }
            }
        } catch (error) {
            console.error('Error picking file:', error);
            Alert.alert('Error', 'Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const handleUpload = async () => {
        if (!formData.title || !formData.category) {
            Alert.alert('Validation Error', 'Title and Category are required');
            return;
        }

        if (!formData.fileUrl && !formData.youtubeLink) {
            Alert.alert('Validation Error', 'Please upload a file OR provide a YouTube link');
            return;
        }

        try {
            setLoading(true);
            const url = isEditing ? `${API_URL}/${id}` : API_URL;
            const method = isEditing ? 'PUT' : 'POST';

            // Clean up data before sending
            const payload: any = { ...formData };
            if (!payload.fileUrl) delete payload.fileUrl;
            if (!payload.thumbnailUrl) delete payload.thumbnailUrl;
            if (!payload.youtubeLink) delete payload.youtubeLink;

            // Auto-set fileType for YouTube links
            if (payload.youtubeLink && !payload.fileUrl) {
                payload.fileType = 'video';
            }

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.success) {
                Alert.alert('Success! 🎉', `Resource ${isEditing ? 'updated' : 'uploaded'} successfully!`, [
                    { text: 'OK', onPress: () => router.push('/(admin)/resources') }
                ]);
            } else {
                throw new Error(data.error || 'Failed to save resource');
            }
        } catch (error) {
            console.error('Error saving resource:', error);
            Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'upload'} resource: ` + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#EC4899', '#DB2777']} className="pt-12 pb-16 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">{isEditing ? 'Edit Resource' : 'Upload Resource'}</Text>
                        <Text className="text-pink-200 text-sm mt-1">{isEditing ? 'Update resource details' : 'Add new digital asset'}</Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="px-6 pb-8">
                <View className="w-full max-w-5xl mx-auto">
                    <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                        <Text className="text-gray-800 font-bold text-lg mb-4">Resource Details</Text>

                        <View className="mb-4">
                            <Text className="text-gray-600 font-medium mb-2">Title *</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                                placeholder="Enter resource title"
                                value={formData.title}
                                onChangeText={(text) => setFormData({ ...formData, title: text })}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-600 font-medium mb-2">Category *</Text>
                            <View className="flex-row flex-wrap -mx-1">
                                {[
                                    { label: 'Poster', value: 'poster' },
                                    { label: 'Reel', value: 'reel' },
                                    { label: 'Document', value: 'document' },
                                    { label: 'Tutorial', value: 'tutorial' },
                                    { label: 'Log', value: 'log' }
                                ].map(({ label, value }) => (
                                    <TouchableOpacity
                                        key={value}
                                        onPress={() => setFormData({ ...formData, category: value })}
                                        className={`m-1 px-4 py-3 rounded-xl ${formData.category === value ? 'bg-pink-600' : 'bg-gray-100'}`}
                                    >
                                        <Text className={`font-semibold ${formData.category === value ? 'text-white' : 'text-gray-700'}`}>
                                            {label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-gray-600 font-medium mb-2">YouTube Link (Optional)</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                                placeholder="https://youtube.com/..."
                                value={formData.youtubeLink}
                                onChangeText={(text) => setFormData({ ...formData, youtubeLink: text })}
                            />
                        </View>

                        <View>
                            <Text className="text-gray-600 font-medium mb-2">Description</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                                placeholder="Enter description"
                                multiline
                                numberOfLines={3}
                                value={formData.description}
                                onChangeText={(text) => setFormData({ ...formData, description: text })}
                            />
                        </View>
                    </View>

                    <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                        <Text className="text-gray-800 font-bold text-lg mb-4">Upload File (Optional if Link provided)</Text>

                        {formData.fileUrl ? (
                            <View className="relative">
                                <Image
                                    source={{ uri: formData.fileUrl }}
                                    style={{ width: '100%', height: 200, borderRadius: 16 }}
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    onPress={() => setFormData(prev => ({ ...prev, fileUrl: '', thumbnailUrl: '' }))}
                                    className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                                >
                                    <X size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={pickFile}
                                className="bg-pink-50 border-2 border-dashed border-pink-300 rounded-2xl p-12 items-center"
                            >
                                {uploading ? (
                                    <ActivityIndicator size="large" color="#EC4899" />
                                ) : (
                                    <>
                                        <View className="bg-pink-100 p-4 rounded-full mb-3">
                                            <Upload size={32} color="#EC4899" />
                                        </View>
                                        <Text className="text-pink-600 font-semibold text-lg">Click to Upload</Text>
                                        <Text className="text-gray-400 text-sm mt-1">Images or Videos</Text>
                                    </>
                                )}
                            </TouchableOpacity>
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
                            onPress={handleUpload}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={['#EC4899', '#DB2777']}
                                className="py-4 rounded-2xl items-center flex-row justify-center"
                                style={{ opacity: loading ? 0.5 : 1 }}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <>
                                        <CheckCircle size={20} color="white" />
                                        <Text className="text-white font-bold ml-2">Upload</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
