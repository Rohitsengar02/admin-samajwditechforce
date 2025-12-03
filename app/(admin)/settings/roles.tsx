import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield, Edit, Trash2, Plus } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const ROLES = [
    {
        id: 1,
        name: 'Super Admin',
        description: 'Full access to all features',
        users: 2,
        color: 'bg-purple-100 text-purple-700'
    },
    {
        id: 2,
        name: 'District Head',
        description: 'Manage district level data',
        users: 75,
        color: 'bg-blue-100 text-blue-700'
    },
    {
        id: 3,
        name: 'Content Moderator',
        description: 'Manage posts and discussions',
        users: 12,
        color: 'bg-green-100 text-green-700'
    },
];

const RoleCard = ({ role }: any) => (
    <View className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 mb-4">
        <View className="flex-row justify-between items-start mb-2">
            <View>
                <Text className="text-gray-900 font-bold text-lg">{role.name}</Text>
                <Text className="text-gray-500 text-sm">{role.description}</Text>
            </View>
            <View className={`px-3 py-1 rounded-full ${role.color.split(' ')[0]}`}>
                <Text className={`text-xs font-bold ${role.color.split(' ')[1]}`}>
                    {role.users} Users
                </Text>
            </View>
        </View>

        <View className="flex-row justify-end space-x-3 mt-4 border-t border-gray-50 pt-3">
            <TouchableOpacity className="bg-gray-100 p-2 rounded-xl">
                <Edit size={18} color="#4B5563" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-red-50 p-2 rounded-xl">
                <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
        </View>
    </View>
);

export default function RolesPage() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#8B5CF6', '#7C3AED']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">Roles & Permissions</Text>
                        <Text className="text-purple-100 text-sm mt-1">Access control management</Text>
                    </View>
                    <TouchableOpacity className="bg-white px-4 py-3 rounded-2xl">
                        <Plus size={20} color="#8B5CF6" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <View className="px-4">
                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Defined Roles</Text>
                    {ROLES.map(role => (
                        <RoleCard key={role.id} role={role} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
