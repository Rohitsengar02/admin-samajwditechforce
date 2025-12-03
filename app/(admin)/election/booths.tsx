import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, AlertTriangle, Users, Search, Filter, Edit } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const BOOTHS = [
    { id: 1, number: '101', name: 'Primary School, Lucknow', status: 'Critical', volunteers: 2, voters: 1200, location: 'Lucknow Central' },
    { id: 2, number: '102', name: 'Community Center, Gomti Nagar', status: 'Normal', volunteers: 5, voters: 850, location: 'Lucknow East' },
    { id: 3, number: '103', name: 'Inter College, Alambagh', status: 'Sensitive', volunteers: 4, voters: 1500, location: 'Lucknow West' },
    { id: 4, number: '104', name: 'Public Library, Hazratganj', status: 'Normal', volunteers: 3, voters: 900, location: 'Lucknow Central' },
];

const BoothCard = ({ booth }: any) => (
    <View className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 mb-4">
        <View className="flex-row justify-between items-start mb-3">
            <View className="flex-row items-center">
                <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-3 ${booth.status === 'Critical' ? 'bg-red-100' :
                        booth.status === 'Sensitive' ? 'bg-amber-100' : 'bg-green-100'
                    }`}>
                    <MapPin size={24} color={
                        booth.status === 'Critical' ? '#EF4444' :
                            booth.status === 'Sensitive' ? '#F59E0B' : '#10B981'
                    } />
                </View>
                <View>
                    <Text className="text-gray-900 font-bold text-lg">Booth #{booth.number}</Text>
                    <Text className="text-gray-500 text-xs">{booth.location}</Text>
                </View>
            </View>
            <View className={`px-3 py-1 rounded-full ${booth.status === 'Critical' ? 'bg-red-100' :
                    booth.status === 'Sensitive' ? 'bg-amber-100' : 'bg-green-100'
                }`}>
                <Text className={`text-xs font-bold ${booth.status === 'Critical' ? 'text-red-700' :
                        booth.status === 'Sensitive' ? 'text-amber-700' : 'text-green-700'
                    }`}>
                    {booth.status.toUpperCase()}
                </Text>
            </View>
        </View>

        <Text className="text-gray-800 font-medium mb-4">{booth.name}</Text>

        <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
            <View className="flex-row space-x-4">
                <View className="flex-row items-center">
                    <Users size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-1 font-medium">{booth.volunteers} Agents</Text>
                </View>
                <View className="flex-row items-center">
                    <Text className="text-gray-600 text-sm font-medium">{booth.voters} Voters</Text>
                </View>
            </View>

            <TouchableOpacity className="bg-gray-100 p-2 rounded-xl">
                <Edit size={18} color="#4B5563" />
            </TouchableOpacity>
        </View>
    </View>
);

export default function BoothsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#EF4444', '#DC2626']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">Booth Management</Text>
                        <Text className="text-red-100 text-sm mt-1">Monitor booth status</Text>
                    </View>
                </View>

                <View className="flex-row items-center bg-white/20 backdrop-blur-md px-4 rounded-2xl border border-white/30">
                    <Search size={20} color="white" />
                    <TextInput
                        className="flex-1 py-3 px-3 text-white"
                        placeholder="Search booths..."
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity className="bg-white/20 p-2 rounded-xl">
                        <Filter size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <View className="px-4">
                <View className="flex-row mb-6 space-x-3">
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border-l-4 border-red-500">
                        <Text className="text-2xl font-bold text-gray-900">12</Text>
                        <Text className="text-gray-500 text-sm">Critical</Text>
                    </View>
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border-l-4 border-amber-500">
                        <Text className="text-2xl font-bold text-gray-900">24</Text>
                        <Text className="text-gray-500 text-sm">Sensitive</Text>
                    </View>
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border-l-4 border-green-500">
                        <Text className="text-2xl font-bold text-gray-900">156</Text>
                        <Text className="text-gray-500 text-sm">Normal</Text>
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Booth List</Text>
                    {BOOTHS.map(booth => (
                        <BoothCard key={booth.id} booth={booth} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
