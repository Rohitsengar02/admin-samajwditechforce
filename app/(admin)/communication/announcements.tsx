import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, ActivityIndicator, Platform, RefreshControl, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft, Bell, Plus, Edit, Trash2, Eye, Calendar, X, CheckCircle } from 'lucide-react-native';
import { getApiUrl } from '../../../utils/api';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

export default function AnnouncementsPage() {
    const router = useRouter();
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [creating, setCreating] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        priority: 'Medium'
    });

    const API_URL = `${getApiUrl()}/announcements`;

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (data.success) {
                setAnnouncements(data.data);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAnnouncements();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchAnnouncements();
    };

    const handleCreate = async () => {
        if (!formData.title || !formData.content) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setCreating(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.success) {
                setModalVisible(false);
                setFormData({ title: '', content: '', priority: 'Medium' });
                fetchAnnouncements();
                Alert.alert('Success', 'Announcement created successfully');
            } else {
                Alert.alert('Error', data.error || 'Failed to create announcement');
            }
        } catch (error) {
            Alert.alert('Error', 'Network error');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        Alert.alert(
            'Delete Announcement',
            'Are you sure you want to delete this announcement?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                            const data = await response.json();
                            if (data.success) {
                                fetchAnnouncements();
                            } else {
                                Alert.alert('Error', 'Failed to delete');
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Network error');
                        }
                    }
                }
            ]
        );
    };

    const AnnouncementCard = ({ announcement }: any) => (
        <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-4">
            <LinearGradient
                colors={announcement.priority === 'High' ? ['#EF4444', '#DC2626'] : announcement.priority === 'Medium' ? ['#F59E0B', '#D97706'] : ['#10B981', '#059669']}
                className="p-5 relative"
            >
                <AnimatedBubble size={80} top={-20} left={200} />
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <Text className="text-white font-bold text-xl mb-1">{announcement.title}</Text>
                        <Text className="text-white/80 text-sm" numberOfLines={2}>{announcement.content}</Text>
                    </View>
                    <View className="bg-white/20 px-3 py-1 rounded-lg ml-2">
                        <Text className="text-white text-xs font-bold">{announcement.priority}</Text>
                    </View>
                </View>
            </LinearGradient>
            <View className="p-5">
                <View className="flex-row items-center mb-4">
                    <View className="flex-row items-center flex-1">
                        <Calendar size={14} color="#9CA3AF" />
                        <Text className="text-gray-500 text-sm ml-1">
                            {new Date(announcement.date || announcement.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Eye size={14} color="#9CA3AF" />
                        <Text className="text-gray-500 text-sm ml-1">{announcement.views || 0} views</Text>
                    </View>
                </View>
                <View className="flex-row space-x-2">
                    <TouchableOpacity className="flex-1 bg-indigo-600 py-3 rounded-xl items-center">
                        <Text className="text-white font-bold">View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-red-50 px-4 py-3 rounded-xl"
                        onPress={() => handleDelete(announcement._id)}
                    >
                        <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView
                className="flex-1"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366f1']} />}
            >
                <LinearGradient colors={['#6366f1', '#8b5cf6']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold">Announcements</Text>
                            <Text className="text-indigo-200 text-sm mt-1">Manage updates & news</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            className="bg-white px-4 py-3 rounded-2xl flex-row items-center"
                        >
                            <Plus size={20} color="#6366f1" />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                <View className="px-4 pb-8">
                    {loading && !refreshing ? (
                        <ActivityIndicator size="large" color="#6366f1" />
                    ) : announcements.length === 0 ? (
                        <Text className="text-center text-gray-500 mt-10">No announcements found</Text>
                    ) : (
                        <View className="flex-row flex-wrap -mx-2">
                            {announcements.map(announcement => (
                                <View key={announcement._id} className="w-full md:w-1/2 p-2">
                                    <AnnouncementCard announcement={announcement} />
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-[30px] p-6 h-[80%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-bold text-gray-900">New Announcement</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-gray-100 p-2 rounded-full">
                                <X size={24} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                            <View className="mb-4">
                                <Text className="text-gray-600 font-medium mb-2">Title</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                                    placeholder="Announcement Title"
                                    value={formData.title}
                                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-600 font-medium mb-2">Priority</Text>
                                <View className="flex-row space-x-3">
                                    {['High', 'Medium', 'Low'].map((p) => (
                                        <TouchableOpacity
                                            key={p}
                                            onPress={() => setFormData({ ...formData, priority: p })}
                                            className={`flex-1 py-3 rounded-xl items-center border ${formData.priority === p
                                                ? (p === 'High' ? 'bg-red-50 border-red-500' : p === 'Medium' ? 'bg-amber-50 border-amber-500' : 'bg-emerald-50 border-emerald-500')
                                                : 'bg-gray-50 border-gray-200'
                                                }`}
                                        >
                                            <Text className={`font-bold ${formData.priority === p
                                                ? (p === 'High' ? 'text-red-600' : p === 'Medium' ? 'text-amber-600' : 'text-emerald-600')
                                                : 'text-gray-500'
                                                }`}>{p}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View className="mb-6">
                                <Text className="text-gray-600 font-medium mb-2">Content</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 h-40"
                                    placeholder="Write your announcement here..."
                                    multiline
                                    textAlignVertical="top"
                                    value={formData.content}
                                    onChangeText={(text) => setFormData({ ...formData, content: text })}
                                />
                            </View>

                            <TouchableOpacity
                                onPress={handleCreate}
                                disabled={creating}
                                className="bg-indigo-600 py-4 rounded-2xl flex-row justify-center items-center shadow-lg shadow-indigo-200 mb-8"
                            >
                                {creating ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <CheckCircle size={20} color="white" />
                                        <Text className="text-white font-bold ml-2 text-lg">Publish Announcement</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
