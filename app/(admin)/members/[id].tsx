import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft, Phone, Mail, MapPin, Calendar, Award, TrendingUp,
    MessageCircle, Edit, Trash2, Star, CheckCircle, Clock
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View
        style={{
            position: 'absolute',
            width: size,
            height: size,
            top, left,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: size / 2,
            opacity: 0.6,
        }}
    />
);

const RECENT_ACTIVITIES = [
    { id: 1, action: 'Joined Platform', time: 'Recently', icon: CheckCircle, color: '#10B981' },
];

export default function MemberDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [member, setMember] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchMember();
    }, [id]);

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

    const fetchMember = async () => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            const url = getApiUrl();
            const response = await fetch(`${url}/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setMember(data);
            } else {
                console.error('Failed to fetch member:', data);
            }
        } catch (error) {
            console.error('Error fetching member:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    if (!member) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <Text>Member not found</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            {/* Header with Profile */}
            <View className="relative overflow-hidden">
                <LinearGradient colors={['#6366f1', '#8b5cf6']} className="pt-12 pb-32 px-6">
                    <AnimatedBubble size={150} top={-30} left={screenWidth - 120} />
                    <AnimatedBubble size={100} top={100} left={20} />

                    <View className="flex-row items-center justify-between mb-8">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white/20 p-2 rounded-xl">
                            <Edit size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View className="items-center">
                        <View className="bg-white/20 p-2 rounded-3xl mb-4">
                            <Image
                                source={{ uri: member.profileImage || 'https://avatar.iran.liara.run/public' }}
                                className="w-24 h-24 rounded-2xl"
                            />
                        </View>
                        <Text className="text-white text-2xl font-bold mb-1">{member.name}</Text>
                        <Text className="text-white/80 text-sm mb-3">{member.partyRole || 'Member'}</Text>
                        <View className="bg-emerald-500/30 px-4 py-1.5 rounded-full">
                            <Text className="text-white font-semibold text-xs">{member.verificationStatus}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-6 -mt-20">
                {/* Stats Cards */}
                <View className="flex-row mb-6 space-x-3">
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-lg">
                        <View className="flex-row items-center justify-between mb-2">
                            <Award size={20} color="#6366f1" />
                            <Text className="text-gray-400 text-xs font-medium">Score</Text>
                        </View>
                        <Text className="text-2xl font-bold text-gray-900">0</Text>
                        <View className="flex-row items-center mt-1">
                            <Star size={12} color="#F59E0B" fill="#F59E0B" />
                            <Text className="text-xs text-gray-500 ml-1">Rating</Text>
                        </View>
                    </View>

                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-lg">
                        <View className="flex-row items-center justify-between mb-2">
                            <CheckCircle size={20} color="#10B981" />
                            <Text className="text-gray-400 text-xs font-medium">Tasks</Text>
                        </View>
                        <Text className="text-2xl font-bold text-gray-900">0</Text>
                        <Text className="text-xs text-emerald-600 mt-1">
                            0 completed
                        </Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="flex-row space-x-3 mb-6">
                    <TouchableOpacity
                        onPress={() => router.push(`/(admin)/members/${member._id}/chat` as any)}
                        className="flex-1"
                    >
                        <LinearGradient
                            colors={['#6366f1', '#8b5cf6']}
                            className="py-4 rounded-2xl items-center flex-row justify-center"
                        >
                            <MessageCircle size={20} color="white" />
                            <Text className="text-white font-bold ml-2">Message</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-white border-2 border-indigo-200 py-4 px-6 rounded-2xl">
                        <Phone size={20} color="#6366f1" />
                    </TouchableOpacity>
                </View>

                {/* Contact Information */}
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-4">Contact Information</Text>

                    <View className="space-y-4">
                        <View className="flex-row items-center">
                            <View className="bg-indigo-50 p-3 rounded-xl mr-4">
                                <Phone size={18} color="#6366f1" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-400 text-xs font-medium">Phone</Text>
                                <Text className="text-gray-800 font-semibold">{member.phone}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center">
                            <View className="bg-blue-50 p-3 rounded-xl mr-4">
                                <Mail size={18} color="#3B82F6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-400 text-xs font-medium">Email</Text>
                                <Text className="text-gray-800 font-semibold">{member.email}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center">
                            <View className="bg-purple-50 p-3 rounded-xl mr-4">
                                <MapPin size={18} color="#8B5CF6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-400 text-xs font-medium">Vidhan Sabha</Text>
                                <Text className="text-gray-800 font-semibold">{member.vidhanSabha || 'N/A'}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center">
                            <View className="bg-green-50 p-3 rounded-xl mr-4">
                                <Calendar size={18} color="#10B981" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-400 text-xs font-medium">Joined</Text>
                                <Text className="text-gray-800 font-semibold">
                                    {new Date(member.createdAt).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* About */}
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-3">About</Text>
                    <Text className="text-gray-600 leading-6">
                        {member.qualification ? `Qualification: ${member.qualification}\n` : ''}
                        {member.socialMedia?.length > 0 ? `Social Media: ${member.socialMedia.join(', ')}` : 'No additional info'}
                    </Text>
                </View>

                {/* Recent Activity */}
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-800 font-bold text-lg">Recent Activity</Text>
                        <TouchableOpacity>
                            <Text className="text-indigo-600 text-sm font-medium">View All</Text>
                        </TouchableOpacity>
                    </View>

                    {RECENT_ACTIVITIES.map((activity) => (
                        <View key={activity.id} className="flex-row items-center py-3 border-b border-gray-100">
                            <View className="bg-gray-50 p-2 rounded-lg mr-3">
                                <activity.icon size={16} color={activity.color} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-800 font-medium text-sm">{activity.action}</Text>
                                <Text className="text-gray-400 text-xs mt-1">{activity.time}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Danger Zone */}
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-8 border border-red-100">
                    <Text className="text-gray-800 font-bold text-lg mb-3">Danger Zone</Text>
                    <TouchableOpacity className="bg-red-50 border border-red-200 py-3 rounded-xl items-center flex-row justify-center">
                        <Trash2 size={18} color="#EF4444" />
                        <Text className="text-red-600 font-semibold ml-2">Delete Member</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
