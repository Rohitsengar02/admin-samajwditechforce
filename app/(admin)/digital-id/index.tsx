import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    CheckCircle, XCircle, RefreshCw, Printer, Clock, Users,
    FileCheck, CreditCard, Shield, TrendingUp
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

const MOCK_REQUESTS = [
    { id: 1, name: 'Rahul Yadav', district: 'Lucknow', status: 'Pending', type: 'New Issue', photo: 'https://avatar.iran.liara.run/public/1' },
    { id: 2, name: 'Priya Singh', district: 'Varanasi', status: 'Approved', type: 'Re-issue', photo: 'https://avatar.iran.liara.run/public/2' },
    { id: 3, name: 'Amit Kumar', district: 'Agra', status: 'Pending', type: 'New Issue', photo: 'https://avatar.iran.liara.run/public/3' },
    { id: 4, name: 'Sneha Gupta', district: 'Kanpur', status: 'Pending', type: 'New Issue', photo: 'https://avatar.iran.liara.run/public/4' },
];

const StatCard = ({ icon: Icon, label, value, color, bgColor }: any) => (
    <View className="flex-1 m-2">
        <LinearGradient colors={color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-5 rounded-3xl shadow-lg relative overflow-hidden">
            <AnimatedBubble size={60} top={-20} left={-10} />
            <AnimatedBubble size={40} top={50} left={70} />

            <View className={`p-2.5 rounded-xl mb-2 self-start ${bgColor}`}>
                <Icon size={20} color="white" />
            </View>
            <Text className="text-white/90 text-xs font-medium mb-1">{label}</Text>
            <Text className="text-white text-3xl font-bold">{value}</Text>
        </LinearGradient>
    </View>
);

const QuickActionCard = ({ icon: Icon, title, description, color, onPress }: any) => (
    <TouchableOpacity onPress={onPress} className="flex-1 m-2">
        <View className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <View className={`p-4 rounded-2xl self-start mb-4 ${color}`}>
                <Icon size={32} color="white" />
            </View>
            <Text className="text-gray-900 font-bold text-lg mb-2">{title}</Text>
            <Text className="text-gray-500 text-sm mb-4">{description}</Text>
            <View className="flex-row items-center">
                <Text className="text-indigo-600 font-semibold text-sm">Open</Text>
                <View className="ml-2 w-6 h-6 bg-indigo-100 rounded-full items-center justify-center">
                    <Text className="text-indigo-600 font-bold">→</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
);

const PendingRequestCard = ({ request }: any) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
            case 'Pending': return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
            case 'Rejected': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
            default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
        }
    };

    const statusColor = getStatusColor(request.status);

    return (
        <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    <Image source={{ uri: request.photo }} className="w-12 h-12 rounded-xl mr-3" />
                    <View className="flex-1">
                        <Text className="text-gray-900 font-bold text-base">{request.name}</Text>
                        <Text className="text-gray-500 text-sm">{request.district} • {request.type}</Text>
                    </View>
                </View>
                <View className={`px-3 py-1.5 rounded-lg ${statusColor.bg} border ${statusColor.border}`}>
                    <Text className={`text-xs font-bold ${statusColor.text}`}>{request.status}</Text>
                </View>
            </View>
            {request.status === 'Pending' && (
                <View className="flex-row mt-4 space-x-2">
                    <TouchableOpacity className="flex-1 bg-emerald-600 py-2.5 rounded-xl flex-row items-center justify-center">
                        <CheckCircle size={16} color="white" />
                        <Text className="text-white font-semibold text-sm ml-1">Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-red-50 border border-red-200 py-2.5 rounded-xl flex-row items-center justify-center">
                        <XCircle size={16} color="#EF4444" />
                        <Text className="text-red-600 font-semibold text-sm ml-1">Reject</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default function DigitalIDPage() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#4F46E5', '#7C3AED']} className="pt-8 pb-12 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={80} left={20} />

                    <View className="mb-6">
                        <Text className="text-white text-3xl font-bold mb-2">Digital ID Cards</Text>
                        <Text className="text-indigo-200 text-sm">Manage, approve, and generate member ID cards</Text>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-4">
                {/* Stats Overview */}
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <StatCard icon={Clock} label="Pending" value="24" color={['#f59e0b', '#ef4444']} bgColor="bg-white/20" />
                    <StatCard icon={CheckCircle} label="Approved" value="156" color={['#10b981', '#059669']} bgColor="bg-white/20" />
                    <StatCard icon={XCircle} label="Rejected" value="5" color={['#ef4444', '#dc2626']} bgColor="bg-white/20" />
                </View>

                {/* Quick Actions */}
                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Quick Actions</Text>
                    <View className="flex-row flex-wrap -mx-2">
                        <QuickActionCard
                            icon={FileCheck}
                            title="ID Approval"
                            description="Review and approve pending ID card requests"
                            color="bg-indigo-600"
                            onPress={() => router.push('/(admin)/digital-id/approval' as any)}
                        />
                        <QuickActionCard
                            icon={CreditCard}
                            title="ID Generator"
                            description="Generate new digital ID cards for members"
                            color="bg-emerald-600"
                            onPress={() => router.push('/(admin)/digital-id/generator' as any)}
                        />
                    </View>
                    <View className="flex-row flex-wrap -mx-2">
                        <QuickActionCard
                            icon={RefreshCw}
                            title="ID Reissue"
                            description="Reissue lost or damaged ID cards"
                            color="bg-amber-600"
                            onPress={() => router.push('/(admin)/digital-id/reissue' as any)}
                        />
                        <QuickActionCard
                            icon={Printer}
                            title="Print Queue"
                            description="Manage and print approved ID cards"
                            color="bg-purple-600"
                            onPress={() => router.push('/(admin)/digital-id/print' as any)}
                        />
                    </View>
                </View>

                {/* ID Card Preview */}
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Sample ID Card</Text>
                    <View className="items-center">
                        <LinearGradient
                            colors={['#6366f1', '#8b5cf6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="w-full max-w-sm rounded-2xl p-6 shadow-xl relative overflow-hidden"
                            style={{ aspectRatio: 1.586 }}
                        >
                            <AnimatedBubble size={100} top={-30} left={-20} />
                            <AnimatedBubble size={80} top={120} left={200} />

                            <View className="flex-row items-center mb-6">
                                <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3">
                                    <Shield size={20} color="#6366f1" />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-lg">Samajwadi Tech Force</Text>
                                    <Text className="text-white/80 text-xs">Official Member ID</Text>
                                </View>
                            </View>

                            <View className="flex-row">
                                <View className="w-24 h-24 bg-white/20 rounded-2xl mr-4 items-center justify-center">
                                    <Image
                                        source={{ uri: 'https://avatar.iran.liara.run/public/1' }}
                                        className="w-20 h-20 rounded-xl"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-xl mb-1">Rahul Yadav</Text>
                                    <Text className="text-white/90 text-sm mb-2">District Head</Text>
                                    <Text className="text-white/80 text-sm">Lucknow, UP</Text>
                                    <View className="mt-3 bg-white/20 px-3 py-1 rounded-lg self-start">
                                        <Text className="text-white text-xs font-bold">ID: STF-2024-001</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </View>

                {/* Pending Requests */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-4 px-2">
                        <Text className="text-lg font-bold text-gray-800">Pending Approvals</Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(admin)/digital-id/approval' as any)}
                            className="flex-row items-center"
                        >
                            <Text className="text-indigo-600 text-sm font-medium mr-1">View All</Text>
                            <Text className="text-indigo-600">→</Text>
                        </TouchableOpacity>
                    </View>
                    {MOCK_REQUESTS.filter(r => r.status === 'Pending').map(request => (
                        <PendingRequestCard key={request.id} request={request} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
