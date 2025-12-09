import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Platform, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import {
    ArrowLeft, CheckCircle, XCircle, Eye, Clock, Award
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const SubmissionCard = ({ submission }: any) => (
    <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-4">
        <LinearGradient colors={['#f59e0b', '#ef4444']} className="p-5 relative">
            <AnimatedBubble size={80} top={-20} left={200} />

            <View className="flex-row items-center">
                <Image
                    source={{ uri: submission.user?.photo || 'https://via.placeholder.com/150' }}
                    className="w-14 h-14 rounded-xl mr-3"
                />
                <View className="flex-1">
                    <Text className="text-white font-bold text-xl mb-1">{submission.user?.name || 'Unknown User'}</Text>
                    <Text className="text-white/80 text-sm" numberOfLines={1}>{submission.task?.title || 'Unknown Task'}</Text>
                </View>
                <View className="bg-white/20 px-3 py-2 rounded-xl">
                    <View className="flex-row items-center">
                        <Award size={16} color="white" />
                        <Text className="text-white font-bold ml-1">{submission.pointsEarned}</Text>
                    </View>
                </View>
            </View>
        </LinearGradient>

        <View className="p-5">
            <View className="mb-4">
                <View className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-2">
                    <Text className="text-gray-400 text-xs mb-1">Platform</Text>
                    <Text className="text-gray-800 font-semibold capitalize">{submission.task?.platform || 'N/A'}</Text>
                </View>
                {submission.proofImage ? (
                    <View className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-2">
                        <Text className="text-gray-400 text-xs mb-1">Proof Image</Text>
                        <Image source={{ uri: submission.proofImage }} style={{ width: '100%', height: 150, borderRadius: 8 }} resizeMode="cover" />
                    </View>
                ) : (
                    <View className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-2">
                        <Text className="text-gray-400 text-xs mb-1">Comment</Text>
                        <Text className="text-gray-800 font-semibold text-sm">{submission.comment || 'No comment'}</Text>
                    </View>
                )}
                <View className="flex-row items-center mt-2">
                    <Clock size={14} color="#9CA3AF" />
                    <Text className="text-gray-500 text-sm ml-2">{new Date(submission.createdAt).toLocaleString()}</Text>
                </View>
            </View>


        </View>
    </View>
);

export default function SubmissionsPage() {
    const router = useRouter();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const getApiUrl = () => {
        if (Platform.OS === 'android') {
            return 'http://192.168.1.46:5001/api';
        }
        if (Platform.OS === 'ios') {
            return 'http://localhost:5001/api';
        }
        const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';
        return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
    };

    const API_URL = `${getApiUrl()}/tasks/submissions`;

    const fetchSubmissions = async () => {
        try {
            console.log('Fetching submissions from:', API_URL);
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data.success) {
                setSubmissions(data.data);
            } else {
                console.error('Failed to fetch submissions:', data.message);
                Alert.alert('Error', 'Failed to load submissions');
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
            Alert.alert('Error', 'Network error while fetching submissions');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchSubmissions();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchSubmissions();
    };

    return (
        <ScrollView
            className="flex-1 bg-gray-50"
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#f59e0b']} />
            }
        >
            <LinearGradient colors={['#f59e0b', '#ef4444']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">Submissions</Text>
                        <Text className="text-amber-100 text-sm mt-1">Review task submissions</Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="px-4">
                <View className="flex-row mb-6 space-x-3">
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <View className="bg-amber-50 p-2 rounded-lg mb-2 self-start">
                            <Clock size={20} color="#F59E0B" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900">{submissions.length}</Text>
                        <Text className="text-gray-500 text-sm">Total Submissions</Text>
                    </View>

                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <View className="bg-emerald-50 p-2 rounded-lg mb-2 self-start">
                            <CheckCircle size={20} color="#10B981" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900">
                            {submissions.filter((s: any) => s.status === 'Completed').length}
                        </Text>
                        <Text className="text-gray-500 text-sm">Verified</Text>
                    </View>
                </View>

                <View className="pb-8">
                    {loading && !refreshing ? (
                        <ActivityIndicator size="large" color="#f59e0b" />
                    ) : submissions.length === 0 ? (
                        <View className="items-center py-10">
                            <Text className="text-gray-400">No submissions found</Text>
                        </View>
                    ) : (
                        <View className="flex-row flex-wrap -mx-2">
                            {submissions.map((submission: any) => (
                                <View key={submission._id} className="w-full md:w-1/2 lg:w-1/3 p-2">
                                    <SubmissionCard submission={submission} />
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
