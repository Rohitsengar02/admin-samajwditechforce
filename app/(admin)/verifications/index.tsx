import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Shield, Check, X, MapPin, User, Phone, Calendar, Facebook, Instagram, Youtube, Twitter } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '../../../utils/api';

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

export default function VerificationsPage() {
    const [verifications, setVerifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchVerifications();
    }, []);

    const fetchVerifications = async () => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            const url = getApiUrl();
            const response = await fetch(`${url}/admin/verifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                // Sort by newest first (most recent updatedAt on top)
                const sortedData = data.sort((a: any, b: any) => {
                    const dateA = new Date(a.updatedAt || a.createdAt).getTime();
                    const dateB = new Date(b.updatedAt || b.createdAt).getTime();
                    return dateB - dateA; // Descending order (newest first)
                });
                setVerifications(sortedData);
            } else {
                console.error('Failed to fetch verifications:', data);
            }
        } catch (error) {
            console.error('Error fetching verifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id: string) => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            const url = getApiUrl();
            const response = await fetch(`${url}/admin/verify/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    mindset: 'A', // Default or ask admin
                    whatsappGroupAdded: 'Yes' // Default or ask admin
                })
            });

            if (response.ok) {
                Alert.alert('Success', 'User verified successfully');
                fetchVerifications();
            } else {
                Alert.alert('Error', 'Failed to verify user');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        }
    };

    const handleReject = async (id: string) => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            const url = getApiUrl();
            const response = await fetch(`${url}/admin/reject/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                Alert.alert('Success', 'User verification rejected');
                fetchVerifications();
            } else {
                Alert.alert('Error', 'Failed to reject user');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#4F46E5', '#7C3AED']} className="pt-8 pb-12 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={60} left={20} />

                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold mb-2">Verifications</Text>
                            <Text className="text-indigo-200 text-sm">Review pending member requests</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-4 pb-10">
                {verifications.length === 0 ? (
                    <View className="items-center py-10">
                        <Shield size={48} color="#9CA3AF" />
                        <Text className="text-gray-500 mt-4 text-lg">No pending verifications</Text>
                    </View>
                ) : (
                    verifications.map((user) => (
                        <View key={user._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
                            <View className="p-4 border-b border-gray-100 bg-gray-50/50 flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mr-3">
                                        <User size={20} color="#4F46E5" />
                                    </View>
                                    <View>
                                        <Text className="font-bold text-gray-900 text-lg">{user.name}</Text>
                                        <Text className="text-gray-500 text-xs">Applied: {new Date(user.updatedAt).toLocaleDateString()}</Text>
                                    </View>
                                </View>
                                <View className="bg-yellow-100 px-3 py-1 rounded-full">
                                    <Text className="text-yellow-700 text-xs font-bold">Pending</Text>
                                </View>
                            </View>

                            <View className="p-4 space-y-3">
                                {/* Email */}
                                <View className="flex-row items-center">
                                    <User size={16} color="#6B7280" className="mr-2" />
                                    <Text className="text-gray-600 flex-1">Email: <Text className="font-semibold text-gray-900">{user.email || 'N/A'}</Text></Text>
                                </View>
                                <View className="flex-row items-center">
                                    <MapPin size={16} color="#6B7280" className="mr-2" />
                                    <Text className="text-gray-600 flex-1">Vidhan Sabha: <Text className="font-semibold text-gray-900">{user.vidhanSabha || 'N/A'}</Text></Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Phone size={16} color="#6B7280" className="mr-2" />
                                    <Text className="text-gray-600 flex-1">Phone: <Text className="font-semibold text-gray-900">{user.phone}</Text></Text>
                                </View>
                                <View className="flex-row items-center">
                                    <User size={16} color="#6B7280" className="mr-2" />
                                    <Text className="text-gray-600 flex-1">Party Member: <Text className="font-semibold text-gray-900">{user.isPartyMember} ({user.partyRole || 'No Role'})</Text></Text>
                                </View>
                                {/* Party Joining Date */}
                                <View className="flex-row items-center">
                                    <Calendar size={16} color="#6B7280" className="mr-2" />
                                    <Text className="text-gray-600 flex-1">Party Joining Date: <Text className="font-semibold text-gray-900">{user.partyJoiningDate || 'N/A'}</Text></Text>
                                </View>
                                {/* Election Preparation */}
                                <View className="flex-row items-center">
                                    <Shield size={16} color="#6B7280" className="mr-2" />
                                    <Text className="text-gray-600 flex-1">Election Preparation: <Text className="font-semibold text-gray-900">{user.electionPreparation || 'Not Specified'}</Text></Text>
                                </View>
                                {/* Qualification */}
                                <View className="flex-row items-center">
                                    <User size={16} color="#6B7280" className="mr-2" />
                                    <Text className="text-gray-600 flex-1">Qualification: <Text className="font-semibold text-gray-900">{user.qualification || 'N/A'}</Text></Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Calendar size={16} color="#6B7280" className="mr-2" />
                                    <Text className="text-gray-600 flex-1">Visit Lucknow: <Text className="font-semibold text-gray-900">{user.canVisitLucknow}</Text></Text>
                                </View>

                                {user.socialMedia && user.socialMedia.length > 0 && (
                                    <View className="mt-2">
                                        <Text className="text-gray-500 text-xs mb-2">Social Media:</Text>
                                        <View className="flex-row flex-wrap gap-2">
                                            {user.socialMedia.map((platform: string) => (
                                                <View key={platform} className="bg-gray-100 px-2 py-1 rounded-md flex-row items-center">
                                                    <Text className="text-xs text-gray-700">{platform}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </View>

                            <View className="flex-row p-4 border-t border-gray-100 gap-3">
                                <TouchableOpacity
                                    onPress={() => handleReject(user._id)}
                                    className="flex-1 bg-red-50 py-3 rounded-xl items-center flex-row justify-center border border-red-100"
                                >
                                    <X size={18} color="#EF4444" className="mr-2" />
                                    <Text className="text-red-600 font-bold">Reject</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleVerify(user._id)}
                                    className="flex-1 bg-indigo-600 py-3 rounded-xl items-center flex-row justify-center shadow-md shadow-indigo-200"
                                >
                                    <Check size={18} color="white" className="mr-2" />
                                    <Text className="text-white font-bold">Verify User</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}
