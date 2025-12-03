import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, MapPin, Users, Search, Filter, Star, Phone, Mail
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

const MOCK_MEMBERS_BY_DISTRICT = [
    {
        district: 'Lucknow',
        members: [
            { id: 1, name: 'Rahul Yadav', role: 'District Head', phone: '9876543210', email: 'rahul@example.com', score: 95, photo: 'https://avatar.iran.liara.run/public/1' },
            { id: 2, name: 'Priya Singh', role: 'Coordinator', phone: '9876543211', email: 'priya@example.com', score: 88, photo: 'https://avatar.iran.liara.run/public/2' },
        ]
    },
    {
        district: 'Varanasi',
        members: [
            { id: 3, name: 'Suresh Tripathi', role: 'District Head', phone: '9876543212', email: 'suresh@example.com', score: 92, photo: 'https://avatar.iran.liara.run/public/3' },
            { id: 4, name: 'Anjali Verma', role: 'Volunteer', phone: '9876543213', email: 'anjali@example.com', score: 85, photo: 'https://avatar.iran.liara.run/public/4' },
        ]
    },
];

const MemberCard = ({ member }: any) => (
    <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3">
        <View className="flex-row items-center">
            <Image source={{ uri: member.photo }} className="w-14 h-14 rounded-xl mr-3" />
            <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">{member.name}</Text>
                <Text className="text-gray-500 text-sm">{member.role}</Text>
                <View className="flex-row items-center mt-1">
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text className="text-amber-600 text-sm font-semibold ml-1">{member.score}</Text>
                </View>
            </View>
            <View className="items-end">
                <TouchableOpacity className="bg-indigo-50 p-2 rounded-lg mb-2">
                    <Phone size={16} color="#6366f1" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-blue-50 p-2 rounded-lg">
                    <Mail size={16} color="#3B82F6" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

const DistrictSection = ({ district, members }: any) => (
    <View className="mb-6">
        <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <LinearGradient colors={['#f59e0b', '#ef4444']} className="p-5 relative">
                <AnimatedBubble size={80} top={-20} left={180} />
                <AnimatedBubble size={60} top={40} left={-10} />

                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <Text className="text-white font-bold text-2xl mb-1">{district}</Text>
                        <Text className="text-white/80 text-sm">{members.length} Members</Text>
                    </View>
                    <View className="bg-white/20 p-3 rounded-2xl">
                        <MapPin size={24} color="white" />
                    </View>
                </View>
            </LinearGradient>

            <View className="p-4">
                {members.map((member: any) => (
                    <MemberCard key={member.id} member={member} />
                ))}
            </View>
        </View>
    </View>
);

export default function DistrictMembersPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#f59e0b', '#ef4444']} className="pt-12 pb-12 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={60} left={20} />

                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold">District Members</Text>
                            <Text className="text-amber-100 text-sm mt-1">View members by district</Text>
                        </View>
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

            <View className="px-4 pb-8">
                {MOCK_MEMBERS_BY_DISTRICT.map(({ district, members }) => (
                    <DistrictSection key={district} district={district} members={members} />
                ))}
            </View>
        </ScrollView>
    );
}
