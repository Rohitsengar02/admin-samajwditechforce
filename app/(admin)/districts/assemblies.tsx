import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Building2, MapPin, Users, Edit, Plus,
    Search, Filter, ChevronRight
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

const MOCK_ASSEMBLIES = [
    { id: 1, name: 'Lucknow Central', district: 'Lucknow', members: 245, booths: 180 },
    { id: 2, name: 'Lucknow North', district: 'Lucknow', members: 198, booths: 150 },
    { id: 3, name: 'Lucknow East', district: 'Lucknow', members: 312, booths: 220 },
    { id: 4, name: 'Cantonment', district: 'Lucknow', members: 156, booths: 120 },
    { id: 5, name: 'Varanasi North', district: 'Varanasi', members: 287, booths: 195 },
    { id: 6, name: 'Varanasi South', district: 'Varanasi', members: 234, booths: 170 },
];

const AssemblyCard = ({ assembly }: any) => (
    <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-4">
        <LinearGradient colors={['#10b981', '#059669']} className="p-5 relative">
            <AnimatedBubble size={80} top={-20} left={180} />
            <AnimatedBubble size={60} top={40} left={-10} />

            <View className="flex-row items-center justify-between">
                <View className="flex-1">
                    <Text className="text-white font-bold text-xl mb-1">{assembly.name}</Text>
                    <View className="flex-row items-center mt-1">
                        <MapPin size={14} color="white" />
                        <Text className="text-white/80 text-sm ml-1">{assembly.district}</Text>
                    </View>
                </View>
                <View className="bg-white/20 p-3 rounded-2xl">
                    <Building2 size={24} color="white" />
                </View>
            </View>
        </LinearGradient>

        <View className="p-5">
            <View className="flex-row justify-between mb-4">
                <View className="flex-1 items-center">
                    <View className="bg-emerald-50 p-3 rounded-xl mb-2">
                        <Users size={20} color="#10B981" />
                    </View>
                    <Text className="text-gray-400 text-xs font-medium">Members</Text>
                    <Text className="text-gray-900 text-xl font-bold">{assembly.members}</Text>
                </View>

                <View className="flex-1 items-center">
                    <View className="bg-indigo-50 p-3 rounded-xl mb-2">
                        <Building2 size={20} color="#6366f1" />
                    </View>
                    <Text className="text-gray-400 text-xs font-medium">Booths</Text>
                    <Text className="text-gray-900 text-xl font-bold">{assembly.booths}</Text>
                </View>
            </View>

            <View className="flex-row space-x-2">
                <TouchableOpacity className="flex-1 bg-emerald-600 py-3 rounded-xl flex-row items-center justify-center">
                    <Text className="text-white font-bold">View Details</Text>
                    <ChevronRight size={16} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl items-center">
                    <Edit size={18} color="#10B981" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

export default function AssembliesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('all');

    const districts = Array.from(new Set(MOCK_ASSEMBLIES.map(a => a.district)));

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#10b981', '#059669']} className="pt-12 pb-12 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={60} left={20} />

                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold">Assembly List</Text>
                            <Text className="text-emerald-100 text-sm mt-1">Manage all assemblies</Text>
                        </View>
                        <TouchableOpacity className="bg-white px-4 py-3 rounded-2xl flex-row items-center">
                            <Plus size={20} color="#10B981" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center bg-white/20 backdrop-blur-md px-4 rounded-2xl border border-white/30">
                        <Search size={20} color="white" />
                        <TextInput
                            className="flex-1 py-3 px-3 text-white"
                            placeholder="Search assemblies..."
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
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-4 px-4">
                    <TouchableOpacity
                        onPress={() => setSelectedDistrict('all')}
                        className={`px-6 py-3 rounded-2xl mr-3 ${selectedDistrict === 'all' ? 'bg-emerald-600' : 'bg-white border border-gray-200'}`}
                    >
                        <Text className={`font-semibold ${selectedDistrict === 'all' ? 'text-white' : 'text-gray-700'}`}>
                            All ({MOCK_ASSEMBLIES.length})
                        </Text>
                    </TouchableOpacity>
                    {districts.map(district => (
                        <TouchableOpacity
                            key={district}
                            onPress={() => setSelectedDistrict(district)}
                            className={`px-6 py-3 rounded-2xl mr-3 ${selectedDistrict === district ? 'bg-emerald-600' : 'bg-white border border-gray-200'}`}
                        >
                            <Text className={`font-semibold ${selectedDistrict === district ? 'text-white' : 'text-gray-700'}`}>
                                {district} ({MOCK_ASSEMBLIES.filter(a => a.district === district).length})
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View className="pb-8">
                    <View className="flex-row flex-wrap -mx-2">
                        {MOCK_ASSEMBLIES
                            .filter(a => selectedDistrict === 'all' || a.district === selectedDistrict)
                            .map(assembly => (
                                <View key={assembly.id} className="w-full md:w-1/2 lg:w-1/3 p-2">
                                    <AssemblyCard assembly={assembly} />
                                </View>
                            ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
