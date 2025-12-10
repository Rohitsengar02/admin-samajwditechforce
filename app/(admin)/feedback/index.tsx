import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Trash2, Star, User, Phone, MapPin, Calendar, MessageSquare } from 'lucide-react-native';

const getApiUrl = () => {
    let url = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api';
    if (!url.endsWith('/api')) url += '/api';
    return url;
};

const API_URL = getApiUrl();

export default function FeedbackList() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFeedbacks = async () => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/feedback`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setFeedbacks(data.data);
            } else {
                Alert.alert('Error', data.error || 'Failed to fetch feedbacks');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Network error');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleDelete = async (id: string) => {
        if (Platform.OS === 'web') {
            if (!confirm('Are you sure you want to delete this feedback?')) return;
        } else {
            // Mobile alert logic could go here, but focusing on web for admin typically
        }

        try {
            const token = await AsyncStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/feedback/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setFeedbacks(feedbacks.filter((item: any) => item._id !== id));
            } else {
                Alert.alert('Error', data.error || 'Failed to delete');
            }
        } catch (error) {
            Alert.alert('Error', 'Network error');
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View className="bg-white p-6 rounded-xl shadow-sm mb-4 border border-gray-100">
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-indigo-50 rounded-full items-center justify-center mr-3">
                        <User size={20} color="#4F46E5" />
                    </View>
                    <View>
                        <Text className="text-lg font-bold text-gray-900">{item.name || 'Anonymous'}</Text>
                        <Text className="text-sm text-gray-500">{item.leaderName ? `Leader: ${item.leaderName}` : 'No Leader Info'}</Text>
                    </View>
                </View>
                <View className="items-end">
                    <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star size={14} color="#F59E0B" fill="#F59E0B" />
                        <Text className="ml-1 font-bold text-yellow-700">{item.rating || 0}/5</Text>
                    </View>
                    <Text className="text-xs text-gray-400 mt-1">
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>
            </View>

            <View className="flex-row flex-wrap gap-4 mb-4">
                {item.mobile && (
                    <View className="flex-row items-center">
                        <Phone size={14} color="#6B7280" />
                        <Text className="ml-1.5 text-sm text-gray-600">{item.mobile}</Text>
                    </View>
                )}
                {item.mohalla && (
                    <View className="flex-row items-center">
                        <MapPin size={14} color="#6B7280" />
                        <Text className="ml-1.5 text-sm text-gray-600">{item.mohalla}</Text>
                    </View>
                )}
                {item.assembly && (
                    <View className="flex-row items-center">
                        <MapPin size={14} color="#6B7280" />
                        <Text className="ml-1.5 text-sm text-gray-600">{item.assembly}</Text>
                    </View>
                )}
            </View>

            <View className="bg-gray-50 p-4 rounded-lg mb-4">
                <View className="flex-row items-start">
                    <MessageSquare size={16} color="#4B5563" className="mt-1" />
                    <Text className="ml-2 text-gray-700 flex-1 leading-5">
                        {item.feedback || item.message || 'No written feedback provided.'}
                    </Text>
                </View>
            </View>

            {/* Detailed stats if available */}
            <View className="flex-row flex-wrap gap-2 mb-4">
                {item.meetingFrequency && <Badge label={`Meeting: ${item.meetingFrequency}`} />}
                {item.workPerformance && <Badge label={`Work: ${item.workPerformance}`} />}
                {item.behaviour && <Badge label={`Behavior: ${item.behaviour}`} />}
                {item.supportLevel && <Badge label={`Support: ${item.supportLevel}`} color={item.supportLevel.includes('निश्चित') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} />}
            </View>

            <View className="flex-row justify-end pt-3 border-t border-gray-100">
                <TouchableOpacity
                    onPress={() => handleDelete(item._id)}
                    className="flex-row items-center px-4 py-2 bg-red-50 rounded-lg hover:bg-red-100"
                >
                    <Trash2 size={16} color="#EF4444" />
                    <Text className="ml-2 text-sm font-medium text-red-600">Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const Badge = ({ label, color = 'bg-blue-50 text-blue-700' }: { label: string, color?: string }) => (
        <View className={`px-2.5 py-1 rounded-md ${color.split(' ')[0]}`}>
            <Text className={`text-xs font-medium ${color.split(' ')[1]}`}>{label}</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <Stack.Screen options={{
                headerShown: true,
                title: 'Feedback Management',
                headerStyle: { backgroundColor: '#fff' },
                headerShadowVisible: false,
            }} />

            <View className="p-6">
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-2xl font-bold text-gray-900">User Feedback</Text>
                        <Text className="text-gray-500">View and manage feedback from users</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            setLoading(true);
                            fetchFeedbacks();
                        }}
                        className="p-2 bg-white border border-gray-200 rounded-lg"
                    >
                        <MaterialCommunityIcons name="refresh" size={24} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View className="flex-1 justify-center items-center py-20">
                        <ActivityIndicator size="large" color="#E30512" />
                    </View>
                ) : (
                    <FlatList
                        data={feedbacks}
                        renderItem={renderItem}
                        keyExtractor={(item: any) => item._id}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View className="py-20 items-center justify-center">
                                <Text className="text-gray-400 text-lg">No feedback found</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
}
