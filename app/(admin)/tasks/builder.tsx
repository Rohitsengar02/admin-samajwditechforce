import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, Alert, ActivityIndicator, Platform, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
    ArrowLeft, Upload, Calendar, Award, Users, CheckCircle,
    Facebook, Twitter, Instagram, Share2
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const PLATFORMS = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
    { id: 'app', name: 'App Only', icon: Share2, color: '#6366f1' },
];

export default function TaskBuilderPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [mediaUri, setMediaUri] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [taskId, setTaskId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        platform: '',
        points: '10',
        deadline: '',
        target: 'All',
        linkToShare: '',
    });

    // Pre-fill form if in edit mode
    useEffect(() => {
        if (params.editMode === 'true' && params.taskId) {
            setIsEditMode(true);
            setTaskId(params.taskId as string);
            setFormData({
                title: (params.title as string) || '',
                description: (params.description as string) || '',
                platform: (params.platform as string) || '',
                points: (params.points as string) || '10',
                deadline: (params.deadline as string) || '',
                target: (params.target as string) || 'All',
                linkToShare: (params.linkToShare as string) || '',
            });
        }
    }, [params]);

    // Auto-detect platform and use correct API URL
    const getApiUrl = () => {
        const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

        // For Android emulator, localhost doesn't work - need to use 10.0.2.2
        if (Platform.OS === 'android') {
            return baseUrl.replace('localhost', '10.0.2.2');
        }

        return baseUrl;
    };

    const apiUrl = getApiUrl();
    const API_URL = apiUrl.endsWith('/api') ? `${apiUrl}/tasks` : `${apiUrl}/api/tasks`;

    const pickMedia = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images', 'videos'],
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setMediaUri(result.assets[0].uri);
                Alert.alert('Success', 'Media selected! (Upload functionality to be implemented)');
            }
        } catch (error) {
            console.error('Error picking media:', error);
            Alert.alert('Error', 'Failed to pick media');
        }
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            Alert.alert('Validation Error', 'Please enter a task title');
            return false;
        }

        if (!formData.platform) {
            Alert.alert('Validation Error', 'Please select a platform');
            return false;
        }

        if (formData.points && isNaN(parseInt(formData.points))) {
            Alert.alert('Validation Error', 'Points must be a number');
            return false;
        }

        if (formData.deadline) {
            const deadlineDate = new Date(formData.deadline);
            if (isNaN(deadlineDate.getTime())) {
                Alert.alert('Validation Error', 'Please enter a valid deadline (YYYY-MM-DD)');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                platform: formData.platform,
                points: parseInt(formData.points) || 10,
                deadline: formData.deadline || null,
                targetAudience: formData.target || 'All',
                linkToShare: formData.linkToShare.trim() || '',
                type: 'Social Media',
            };

            console.log(isEditMode ? 'Updating task' : 'Creating task', 'with payload:', payload);

            const url = isEditMode ? `${API_URL}/${taskId}` : API_URL;
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setShowSuccessModal(true);
            } else {
                Alert.alert('Error', data.message || 'Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            Alert.alert('Error', 'Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#6366f1', '#8b5cf6']} className="pt-12 pb-16 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">
                            {isEditMode ? 'Edit Task' : 'Task Builder'}
                        </Text>
                        <Text className="text-indigo-200 text-sm mt-1">
                            {isEditMode ? 'Update task details' : 'Create new daily task'}
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="px-6 pb-8">
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-4">Task Details</Text>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Task Title *</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                            placeholder="e.g. Share campaign video on Facebook"
                            value={formData.title}
                            onChangeText={(text) => setFormData({ ...formData, title: text })}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Description</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                            placeholder="What members need to do..."
                            multiline
                            numberOfLines={3}
                            value={formData.description}
                            onChangeText={(text) => setFormData({ ...formData, description: text })}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Select Platform *</Text>
                        <View className="flex-row flex-wrap -mx-1">
                            {PLATFORMS.map((platform) => (
                                <TouchableOpacity
                                    key={platform.id}
                                    onPress={() => setFormData({ ...formData, platform: platform.id })}
                                    className={`m-1 px-4 py-3 rounded-2xl border-2 flex-row items-center ${formData.platform === platform.id ? 'bg-indigo-50 border-indigo-500' : 'bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    <platform.icon size={18} color={formData.platform === platform.id ? platform.color : '#9CA3AF'} />
                                    <Text className={`font-semibold ml-2 ${formData.platform === platform.id ? 'text-indigo-900' : 'text-gray-700'}`}>
                                        {platform.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Link to Share (Optional)</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                            placeholder="https://example.com/post"
                            value={formData.linkToShare}
                            onChangeText={(text) => setFormData({ ...formData, linkToShare: text })}
                        />
                    </View>

                    <View className="flex-row space-x-3 mb-4">
                        <View className="flex-1">
                            <Text className="text-gray-600 font-medium mb-2">Points Reward</Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
                                <Award size={20} color="#F59E0B" />
                                <TextInput
                                    className="flex-1 py-3 px-3 text-gray-800"
                                    placeholder="10"
                                    keyboardType="numeric"
                                    value={formData.points}
                                    onChangeText={(text) => setFormData({ ...formData, points: text })}
                                />
                            </View>
                        </View>

                        <View className="flex-1">
                            <Text className="text-gray-600 font-medium mb-2">Target Users</Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
                                <Users size={20} color="#6366f1" />
                                <TextInput
                                    className="flex-1 py-3 px-3 text-gray-800"
                                    placeholder="All"
                                    value={formData.target}
                                    onChangeText={(text) => setFormData({ ...formData, target: text })}
                                />
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-600 font-medium mb-2">Deadline</Text>
                        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
                            <Calendar size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                placeholder="YYYY-MM-DD"
                                value={formData.deadline}
                                onChangeText={(text) => setFormData({ ...formData, deadline: text })}
                            />
                        </View>
                    </View>
                </View>

                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-4">Attach Media (Optional)</Text>
                    <TouchableOpacity
                        onPress={pickMedia}
                        className="bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-2xl p-8 items-center"
                    >
                        <View className="bg-indigo-100 p-4 rounded-full mb-3">
                            <Upload size={32} color="#6366f1" />
                        </View>
                        <Text className="text-indigo-600 font-semibold">Upload Reference Media</Text>
                        <Text className="text-gray-400 text-xs mt-1">Image or Video to share</Text>
                        {mediaUri && (
                            <Text className="text-green-600 text-xs mt-2">✓ Media selected</Text>
                        )}
                    </TouchableOpacity>
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
                                <>
                                    <ActivityIndicator size="small" color="white" />
                                    <Text className="text-white font-bold ml-2">
                                        {isEditMode ? 'Updating...' : 'Creating...'}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} color="white" />
                                    <Text className="text-white font-bold ml-2">
                                        {isEditMode ? 'Update Task' : 'Create Task'}
                                    </Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Success Modal */}
            <Modal
                visible={showSuccessModal}
                transparent
                animationType="fade"
                onRequestClose={() => {
                    setShowSuccessModal(false);
                    router.back();
                }}
            >
                <View className="flex-1 justify-center items-center bg-black/50 px-6">
                    <View className="bg-white rounded-3xl p-8 items-center shadow-2xl w-full max-w-sm">
                        <View className="bg-green-100 p-4 rounded-full mb-4">
                            <CheckCircle size={48} color="#22c55e" />
                        </View>

                        <Text className="text-2xl font-bold text-gray-900 mb-2">
                            {isEditMode ? 'Task Updated! ✨' : 'Task Created! 🎉'}
                        </Text>

                        <Text className="text-gray-600 text-center mb-6">
                            Your task has been successfully {isEditMode ? 'updated' : 'created'} and all members will be notified instantly.
                        </Text>

                        <View className="bg-indigo-50 p-4 rounded-2xl mb-6 w-full">
                            <View className="flex-row items-center mb-2">
                                <View className="bg-indigo-500 p-1 rounded-full mr-2">
                                    <CheckCircle size={16} color="white" />
                                </View>
                                <Text className="text-indigo-900 font-semibold">Task saved to database</Text>
                            </View>
                            <View className="flex-row items-center">
                                <View className="bg-indigo-500 p-1 rounded-full mr-2">
                                    <CheckCircle size={16} color="white" />
                                </View>
                                <Text className="text-indigo-900 font-semibold">Notifications sent to members</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                setShowSuccessModal(false);
                                router.back();
                            }}
                            className="w-full"
                        >
                            <LinearGradient
                                colors={['#22c55e', '#16a34a']}
                                className="py-4 rounded-2xl items-center"
                            >
                                <Text className="text-white font-bold text-lg">Done</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
