import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Search, Filter, Plus, Phone, MapPin, Mail, Calendar,
    Award, MessageCircle, MoreVertical, Users, TrendingUp, Star
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

const StatCard = ({ icon: Icon, label, value, color, bgColor }: any) => (
    <View className="flex-1 min-w-[100px] m-2">
        <LinearGradient colors={color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-4 rounded-2xl shadow-lg relative overflow-hidden">
            <AnimatedBubble size={60} top={-20} left={-10} />
            <AnimatedBubble size={40} top={40} left={60} />

            <View className={`p-2.5 rounded-xl mb-2 self-start ${bgColor}`}>
                <Icon size={20} color="white" />
            </View>
            <Text className="text-white/90 text-xs font-medium mb-1">{label}</Text>
            <Text className="text-white text-2xl font-bold">{value}</Text>
        </LinearGradient>
    </View>
);

const MemberCard = ({ member }: { member: any }) => {
    const router = useRouter();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Verified': return { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: '#10B981' };
            case 'Pending': return { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: '#F59E0B' };
            case 'Rejected': return { bg: 'bg-red-50', text: 'text-red-700', dot: '#EF4444' };
            default: return { bg: 'bg-gray-50', text: 'text-gray-700', dot: '#6B7280' };
        }
    };

    const statusColor = getStatusColor(member.verificationStatus);

    return (
        <TouchableOpacity onPress={() => router.push(`/(admin)/members/${member._id}` as any)}>
            <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <LinearGradient colors={['#6366f1', '#8b5cf6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-5 relative">
                    <AnimatedBubble size={100} top={-30} left={200} />
                    <AnimatedBubble size={70} top={30} left={-20} />

                    <View className="flex-row items-start justify-between">
                        <View className="flex-row items-center flex-1">
                            <View className="bg-white/20 p-1 rounded-2xl mr-3 backdrop-blur-md relative">
                                <Image
                                    source={{ uri: member.profileImage || 'https://avatar.iran.liara.run/public' }}
                                    className="w-16 h-16 rounded-xl"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-xl font-bold mb-1" numberOfLines={1}>{member.name}</Text>
                                <Text className="text-white/80 text-sm">{member.partyRole || 'Member'}</Text>
                                <View className="flex-row items-center mt-2">
                                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: statusColor.dot, marginRight: 6 }} />
                                    <Text className="text-white/90 text-xs font-medium">{member.verificationStatus}</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                            <MoreVertical size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                <View className="flex-row border-b border-gray-100 py-3 px-5">
                    <View className="flex-1 items-center border-r border-gray-100">
                        <Text className="text-gray-400 text-xs font-medium mb-1">Vidhan Sabha</Text>
                        <Text className="text-gray-900 text-sm font-bold">{member.vidhanSabha || 'N/A'}</Text>
                    </View>
                    <View className="flex-1 items-center">
                        <Text className="text-gray-400 text-xs font-medium mb-1">Joined</Text>
                        <Text className="text-gray-900 text-sm font-bold">{new Date(member.createdAt).toLocaleDateString()}</Text>
                    </View>
                </View>

                <View className="p-5 space-y-3">
                    <View className="flex-row items-center">
                        <View className="bg-green-50 p-2 rounded-lg mr-3">
                            <Phone size={16} color="#10B981" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-400 text-xs font-medium">Phone</Text>
                            <Text className="text-gray-800 text-sm font-semibold">{member.phone}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <View className="bg-blue-50 p-2 rounded-lg mr-3">
                            <Mail size={16} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-400 text-xs font-medium">Email</Text>
                            <Text className="text-gray-800 text-sm font-semibold" numberOfLines={1}>{member.email}</Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row p-4 border-t border-gray-100 space-x-2">
                    <TouchableOpacity
                        onPress={() => router.push(`/(admin)/members/${member._id}` as any)}
                        className="flex-1 bg-indigo-600 py-3 rounded-xl items-center"
                    >
                        <Text className="text-white font-bold text-sm">View Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function MembersPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMembers();
    }, []);

    const getApiUrl = () => {
        let url = process.env.EXPO_PUBLIC_API_URL;
        if (!url) {
            if (Platform.OS === 'android') {
                url = 'http://10.0.2.2:5000/api';
            } else {
                url = 'http://localhost:5000/api';
            }
        } else if (!url.endsWith('/api')) {
            url = `${url}/api`;
        }

        if (Platform.OS === 'android') {
            if (url.includes('localhost')) url = url.replace('localhost', '192.168.1.39');
            if (url.includes('127.0.0.1')) url = url.replace('127.0.0.1', '192.168.1.39');
            if (url.includes('10.0.2.2')) url = url.replace('10.0.2.2', '192.168.1.39');
        }
        return url;
    };

    const fetchMembers = async () => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            const url = getApiUrl();
            const response = await fetch(`${url}/admin/verified-users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setMembers(data);
            } else {
                console.error('Failed to fetch members:', data);
            }
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMembers = members.filter(m =>
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone?.includes(searchQuery) ||
        m.vidhanSabha?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            <Text className="text-white text-3xl font-bold mb-2">Verified Members</Text>
                            <Text className="text-indigo-200 text-sm">Manage all verified party members</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/(admin)/members/add' as any)}
                            className="bg-white px-4 py-3 rounded-2xl flex-row items-center shadow-lg"
                        >
                            <Plus size={20} color="#4F46E5" />
                            <Text className="text-indigo-600 font-bold ml-2">Add</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center bg-white/20 backdrop-blur-md px-4 rounded-2xl border border-white/30">
                        <Search size={20} color="white" />
                        <TextInput
                            className="flex-1 py-3 px-3 text-white"
                            placeholder="Search members..."
                            placeholderTextColor="rgba(255,255,255,0.6)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <TouchableOpacity className="bg-white/20 p-2 rounded-xl">
                            <Filter size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-4">
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <StatCard icon={Users} label="Total Verified" value={members.length.toString()} color={['#6366f1', '#8b5cf6']} bgColor="bg-white/20" />
                    <StatCard icon={TrendingUp} label="Active Today" value="0" color={['#10b981', '#059669']} bgColor="bg-white/20" />
                    <StatCard icon={Award} label="Avg Score" value="-" color={['#f59e0b', '#ef4444']} bgColor="bg-white/20" />
                </View>

                <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-4 px-2">
                        <Text className="text-lg font-bold text-gray-800">All Members ({filteredMembers.length})</Text>
                        <TouchableOpacity className="flex-row items-center">
                            <Text className="text-indigo-600 text-sm font-medium mr-1">Sort by</Text>
                            <Filter size={14} color="#6366f1" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row flex-wrap -mx-2">
                        {filteredMembers.map((member) => (
                            <View key={member._id} className="w-full md:w-1/2 lg:w-1/3 p-2">
                                <MemberCard member={member} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
