import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    MapPin, Plus, Users, Building2, Link, TrendingUp,
    Search, Filter, ChevronRight, Map, MessageCircle
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

const MOCK_DISTRICTS = [
    { id: 1, name: 'Lucknow', assemblies: 9, members: 1200, head: 'Rahul Yadav', groups: 12 },
    { id: 2, name: 'Varanasi', assemblies: 8, members: 850, head: 'Suresh Tripathi', groups: 10 },
    { id: 3, name: 'Kanpur', assemblies: 10, members: 1500, head: 'Anjali Verma', groups: 15 },
    { id: 4, name: 'Agra', assemblies: 9, members: 900, head: 'Mohit Singh', groups: 11 },
    { id: 5, name: 'Ghaziabad', assemblies: 5, members: 600, head: 'Vikram Singh', groups: 8 },
    { id: 6, name: 'Prayagraj', assemblies: 12, members: 1100, head: 'Amitabh', groups: 14 },
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
        <View className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 min-w-[150px]">
            <View className={`p-4 rounded-2xl self-start mb-4 ${color}`}>
                <Icon size={28} color="white" />
            </View>
            <Text className="text-gray-900 font-bold text-base mb-2">{title}</Text>
            <Text className="text-gray-500 text-sm mb-4">{description}</Text>
            <View className="flex-row items-center">
                <Text className="text-indigo-600 font-semibold text-sm">Open</Text>
                <ChevronRight size={16} color="#6366f1" />
            </View>
        </View>
    </TouchableOpacity>
);

const DistrictCard = ({ district, onPress }: any) => (
    <TouchableOpacity onPress={() => onPress(district)} className="w-full md:w-1/2 lg:w-1/3 p-2">
        <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <LinearGradient colors={['#6366f1', '#8b5cf6']} className="p-5 relative">
                <AnimatedBubble size={80} top={-20} left={120} />
                <AnimatedBubble size={60} top={40} left={-10} />

                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <Text className="text-white font-bold text-2xl mb-1">{district.name}</Text>
                        <Text className="text-white/80 text-sm">Head: {district.head}</Text>
                    </View>
                    <View className="bg-white/20 p-3 rounded-2xl">
                        <MapPin size={24} color="white" />
                    </View>
                </View>
            </LinearGradient>

            <View className="p-5">
                <View className="flex-row justify-between mb-4">
                    <View className="items-center">
                        <View className="bg-indigo-50 p-2 rounded-xl mb-2">
                            <Building2 size={20} color="#6366f1" />
                        </View>
                        <Text className="text-gray-400 text-xs font-medium">Assemblies</Text>
                        <Text className="text-gray-900 text-xl font-bold">{district.assemblies}</Text>
                    </View>

                    <View className="items-center">
                        <View className="bg-emerald-50 p-2 rounded-xl mb-2">
                            <Users size={20} color="#10B981" />
                        </View>
                        <Text className="text-gray-400 text-xs font-medium">Members</Text>
                        <Text className="text-gray-900 text-xl font-bold">{district.members}</Text>
                    </View>

                    <View className="items-center">
                        <View className="bg-blue-50 p-2 rounded-xl mb-2">
                            <MessageCircle size={20} color="#3B82F6" />
                        </View>
                        <Text className="text-gray-400 text-xs font-medium">Groups</Text>
                        <Text className="text-gray-900 text-xl font-bold">{district.groups}</Text>
                    </View>
                </View>

                <TouchableOpacity className="bg-indigo-600 py-3 rounded-xl flex-row items-center justify-center">
                    <Text className="text-white font-bold">View Details</Text>
                    <ChevronRight size={16} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    </TouchableOpacity>
);

export default function DistrictsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const totalAssemblies = MOCK_DISTRICTS.reduce((sum, d) => sum + d.assemblies, 0);
    const totalMembers = MOCK_DISTRICTS.reduce((sum, d) => sum + d.members, 0);

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#4F46E5', '#7C3AED']} className="pt-8 pb-12 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={80} left={20} />

                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold mb-2">Districts & Assembly</Text>
                            <Text className="text-indigo-200 text-sm">Manage districts, assemblies, and members</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/(admin)/districts/add' as any)}
                            className="bg-white px-4 py-3 rounded-2xl flex-row items-center shadow-lg"
                        >
                            <Plus size={20} color="#4F46E5" />
                            <Text className="text-indigo-600 font-bold ml-2">Add</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View className="flex-row items-center bg-white/20 backdrop-blur-md px-4 rounded-2xl border border-white/30">
                        <Search size={20} color="white" />
                        <TextInput
                            className="flex-1 py-3 px-3 text-white"
                            placeholder="Search districts..."
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
                {/* Stats Overview */}
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <StatCard icon={MapPin} label="Total Districts" value={MOCK_DISTRICTS.length} color={['#6366f1', '#8b5cf6']} bgColor="bg-white/20" />
                    <StatCard icon={Building2} label="Assemblies" value={totalAssemblies} color={['#10b981', '#059669']} bgColor="bg-white/20" />
                    <StatCard icon={Users} label="Members" value={totalMembers.toLocaleString()} color={['#f59e0b', '#ef4444']} bgColor="bg-white/20" />
                </View>

                {/* Quick Actions */}
                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Quick Actions</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-2 -mx-2">
                        <QuickActionCard
                            icon={MapPin}
                            title="District List"
                            description="View all districts"
                            color="bg-indigo-600"
                            onPress={() => router.push('/(admin)/districts/list' as any)}
                        />
                        <QuickActionCard
                            icon={Building2}
                            title="Assembly List"
                            description="Manage assemblies"
                            color="bg-emerald-600"
                            onPress={() => router.push('/(admin)/districts/assemblies' as any)}
                        />
                        <QuickActionCard
                            icon={Users}
                            title="District Members"
                            description="View by district"
                            color="bg-amber-600"
                            onPress={() => router.push('/(admin)/districts/members' as any)}
                        />
                        <QuickActionCard
                            icon={Link}
                            title="Group Links"
                            description="Manage WhatsApp groups"
                            color="bg-blue-600"
                            onPress={() => router.push('/(admin)/districts/groups' as any)}
                        />
                    </ScrollView>
                </View>

                {/* District Cards Grid */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-4 px-2">
                        <Text className="text-lg font-bold text-gray-800">All Districts ({MOCK_DISTRICTS.length})</Text>
                        <TouchableOpacity className="flex-row items-center">
                            <Text className="text-indigo-600 text-sm font-medium mr-1">View Map</Text>
                            <Map size={16} color="#6366f1" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row flex-wrap -mx-2">
                        {MOCK_DISTRICTS.map(district => (
                            <DistrictCard
                                key={district.id}
                                district={district}
                                onPress={(d: any) => router.push(`/(admin)/districts/${d.id}` as any)}
                            />
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
