import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Phone, MapPin, UserPlus, CheckCircle } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const VOLUNTEERS = [
    {
        id: 1,
        name: 'Rahul Yadav',
        photo: 'https://avatar.iran.liara.run/public/1',
        role: 'Booth Agent',
        assignedBooth: '101',
        status: 'Active',
        phone: '+91 98765 43210'
    },
    {
        id: 2,
        name: 'Priya Singh',
        photo: 'https://avatar.iran.liara.run/public/2',
        role: 'Supervisor',
        assignedBooth: '101, 102',
        status: 'Active',
        phone: '+91 98765 43211'
    },
    {
        id: 3,
        name: 'Amit Kumar',
        photo: 'https://avatar.iran.liara.run/public/3',
        role: 'Volunteer',
        assignedBooth: 'Unassigned',
        status: 'Pending',
        phone: '+91 98765 43212'
    },
];

const VolunteerCard = ({ volunteer }: any) => (
    <View className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 mb-4">
        <View className="flex-row items-center mb-4">
            <Image source={{ uri: volunteer.photo }} className="w-14 h-14 rounded-2xl mr-4" />
            <View className="flex-1">
                <Text className="text-gray-900 font-bold text-lg">{volunteer.name}</Text>
                <Text className="text-gray-500 text-sm">{volunteer.role}</Text>
            </View>
            <View className={`px-3 py-1 rounded-full ${volunteer.status === 'Active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Text className={`text-xs font-bold ${volunteer.status === 'Active' ? 'text-green-700' : 'text-gray-600'}`}>
                    {volunteer.status}
                </Text>
            </View>
        </View>

        <View className="flex-row items-center mb-4 bg-gray-50 p-3 rounded-xl">
            <MapPin size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-2 font-medium">
                Booth: <Text className="text-gray-900 font-bold">{volunteer.assignedBooth}</Text>
            </Text>
        </View>

        <View className="flex-row space-x-3">
            <TouchableOpacity className="flex-1 bg-blue-600 py-3 rounded-xl flex-row items-center justify-center">
                <Phone size={16} color="white" />
                <Text className="text-white font-bold ml-2">Call</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center">
                <UserPlus size={16} color="#4B5563" />
                <Text className="text-gray-700 font-bold ml-2">Reassign</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default function VolunteersPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#3B82F6', '#2563EB']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">Volunteers</Text>
                        <Text className="text-blue-100 text-sm mt-1">Manage booth agents</Text>
                    </View>
                </View>

                <View className="flex-row items-center bg-white/20 backdrop-blur-md px-4 rounded-2xl border border-white/30">
                    <Search size={20} color="white" />
                    <TextInput
                        className="flex-1 py-3 px-3 text-white"
                        placeholder="Search volunteers..."
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </LinearGradient>

            <View className="px-4">
                <View className="flex-row mb-6 space-x-3">
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-2xl font-bold text-gray-900">1,250</Text>
                        <Text className="text-gray-500 text-sm">Total Staff</Text>
                    </View>
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-2xl font-bold text-green-600">98%</Text>
                        <Text className="text-gray-500 text-sm">Attendance</Text>
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Staff List</Text>
                    {VOLUNTEERS.map(volunteer => (
                        <VolunteerCard key={volunteer.id} volunteer={volunteer} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
