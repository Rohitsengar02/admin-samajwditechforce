import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, CheckCircle, XCircle, Search, Filter, Eye,
    MapPin, Phone, Mail, Calendar, Shield
} from 'lucide-react-native';

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

const MOCK_APPROVALS = [
    {
        id: 1,
        name: 'Rahul Yadav',
        district: 'Lucknow',
        role: 'District Head',
        phone: '9876543210',
        email: 'rahul.y@example.com',
        photo: 'https://avatar.iran.liara.run/public/1',
        requestDate: '2024-01-15',
        type: 'New Issue'
    },
    {
        id: 2,
        name: 'Priya Singh',
        district: 'Varanasi',
        role: 'Coordinator',
        phone: '9876543211',
        email: 'priya.s@example.com',
        photo: 'https://avatar.iran.liara.run/public/2',
        requestDate: '2024-01-16',
        type: 'New Issue'
    },
    {
        id: 3,
        name: 'Amit Kumar',
        district: 'Agra',
        role: 'Volunteer',
        phone: '9876543212',
        email: 'amit.k@example.com',
        photo: 'https://avatar.iran.liara.run/public/3',
        requestDate: '2024-01-17',
        type: 'Re-issue'
    },
];

const ApprovalCard = ({ request, onApprove, onReject, onView }: any) => (
    <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-4">
        <LinearGradient colors={['#6366f1', '#8b5cf6']} className="p-5 relative">
            <AnimatedBubble size={80} top={-20} left={200} />
            <AnimatedBubble size={60} top={40} left={-10} />

            <View className="flex-row items-start">
                <View className="bg-white/20 p-1 rounded-2xl mr-4">
                    <Image source={{ uri: request.photo }} className="w-16 h-16 rounded-xl" />
                </View>
                <View className="flex-1">
                    <Text className="text-white font-bold text-xl mb-1">{request.name}</Text>
                    <Text className="text-white/80 text-sm">{request.role}</Text>
                    <View className="flex-row items-center mt-2">
                        <View className="bg-white/20 px-3 py-1 rounded-lg">
                            <Text className="text-white text-xs font-semibold">{request.type}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </LinearGradient>

        <View className="p-5">
            <View className="space-y-3 mb-4">
                <View className="flex-row items-center">
                    <View className="bg-indigo-50 p-2 rounded-lg mr-3">
                        <MapPin size={16} color="#6366f1" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-400 text-xs">District</Text>
                        <Text className="text-gray-800 font-semibold">{request.district}</Text>
                    </View>
                </View>

                <View className="flex-row items-center">
                    <View className="bg-green-50 p-2 rounded-lg mr-3">
                        <Phone size={16} color="#10B981" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-400 text-xs">Phone</Text>
                        <Text className="text-gray-800 font-semibold">{request.phone}</Text>
                    </View>
                </View>

                <View className="flex-row items-center">
                    <View className="bg-blue-50 p-2 rounded-lg mr-3">
                        <Mail size={16} color="#3B82F6" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-400 text-xs">Email</Text>
                        <Text className="text-gray-800 font-semibold text-sm">{request.email}</Text>
                    </View>
                </View>

                <View className="flex-row items-center">
                    <View className="bg-purple-50 p-2 rounded-lg mr-3">
                        <Calendar size={16} color="#8B5CF6" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-400 text-xs">Request Date</Text>
                        <Text className="text-gray-800 font-semibold">{new Date(request.requestDate).toLocaleDateString()}</Text>
                    </View>
                </View>
            </View>

            <View className="flex-row space-x-3">
                <TouchableOpacity
                    onPress={() => onView(request)}
                    className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
                >
                    <Text className="text-gray-700 font-bold">View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onApprove(request)}
                    className="flex-1 bg-emerald-600 py-3 rounded-xl flex-row items-center justify-center"
                >
                    <CheckCircle size={18} color="white" />
                    <Text className="text-white font-bold ml-1">Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onReject(request)}
                    className="bg-red-50 border border-red-200 px-4 py-3 rounded-xl items-center"
                >
                    <XCircle size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

export default function IDApprovalPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');

    const handleApprove = (request: any) => {
        console.log('Approve:', request);
        // Handle approval logic
    };

    const handleReject = (request: any) => {
        console.log('Reject:', request);
        // Handle rejection logic
    };

    const handleView = (request: any) => {
        console.log('View:', request);
        // Navigate to details
    };

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#4F46E5', '#7C3AED']} className="pt-12 pb-12 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={60} left={20} />

                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold">ID Approval</Text>
                            <Text className="text-indigo-200 text-sm mt-1">Review and approve ID requests</Text>
                        </View>
                    </View>

                    {/* Search Bar */}
                    <View className="flex-row items-center bg-white/20 backdrop-blur-md px-4 rounded-2xl border border-white/30">
                        <Search size={20} color="white" />
                        <TextInput
                            className="flex-1 py-3 px-3 text-white"
                            placeholder="Search requests..."
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
                {/* Filter Tabs */}
                <View className="flex-row mb-6 bg-white rounded-2xl p-2 shadow-sm">
                    <TouchableOpacity
                        onPress={() => setFilter('all')}
                        className={`flex-1 py-2.5 rounded-xl ${filter === 'all' ? 'bg-indigo-600' : 'bg-transparent'}`}
                    >
                        <Text className={`text-center font-semibold ${filter === 'all' ? 'text-white' : 'text-gray-600'}`}>
                            All ({MOCK_APPROVALS.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setFilter('new')}
                        className={`flex-1 py-2.5 rounded-xl ${filter === 'new' ? 'bg-indigo-600' : 'bg-transparent'}`}
                    >
                        <Text className={`text-center font-semibold ${filter === 'new' ? 'text-white' : 'text-gray-600'}`}>
                            New Issue
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setFilter('reissue')}
                        className={`flex-1 py-2.5 rounded-xl ${filter === 'reissue' ? 'bg-indigo-600' : 'bg-transparent'}`}
                    >
                        <Text className={`text-center font-semibold ${filter === 'reissue' ? 'text-white' : 'text-gray-600'}`}>
                            Re-issue
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Approval Cards */}
                <View className="mb-6">
                    {MOCK_APPROVALS.map(request => (
                        <ApprovalCard
                            key={request.id}
                            request={request}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onView={handleView}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
