import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, MessageCircle, Users, MapPin, Plus, Copy,
    ExternalLink, Edit, Trash2, Link as LinkIcon
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

const MOCK_GROUPS = [
    {
        id: 1,
        name: 'Lucknow District - Main',
        district: 'Lucknow',
        members: 256,
        link: 'https://chat.whatsapp.com/xyz123',
        type: 'District',
        admin: 'Rahul Yadav'
    },
    {
        id: 2,
        name: 'Lucknow - Coordinators',
        district: 'Lucknow',
        members: 45,
        link: 'https://chat.whatsapp.com/abc456',
        type: 'Coordinators',
        admin: 'Priya Singh'
    },
    {
        id: 3,
        name: 'Varanasi District - Main',
        district: 'Varanasi',
        members: 189,
        link: 'https://chat.whatsapp.com/def789',
        type: 'District',
        admin: 'Suresh Tripathi'
    },
    {
        id: 4,
        name: 'Kanpur District - Main',
        district: 'Kanpur',
        members: 312,
        link: 'https://chat.whatsapp.com/ghi012',
        type: 'District',
        admin: 'Anjali Verma'
    },
];

const GroupCard = ({ group }: any) => {
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'District': return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
            case 'Coordinators': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
            default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
        }
    };

    const typeColor = getTypeColor(group.type);

    const handleOpenLink = () => {
        Linking.openURL(group.link);
    };

    const handleCopyLink = () => {
        // Copy to clipboard logic
        console.log('Copy:', group.link);
    };

    return (
        <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-4">
            <LinearGradient colors={['#3B82F6', '#2563EB']} className="p-5 relative">
                <AnimatedBubble size={80} top={-20} left={200} />
                <AnimatedBubble size={60} top={40} left={-10} />

                <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                        <Text className="text-white font-bold text-xl mb-2">{group.name}</Text>
                        <View className="flex-row items-center">
                            <MapPin size={14} color="white" />
                            <Text className="text-white/80 text-sm ml-1">{group.district}</Text>
                        </View>
                    </View>
                    <View className="bg-white/20 p-3 rounded-2xl">
                        <MessageCircle size={24} color="white" />
                    </View>
                </View>

                <View className="flex-row items-center mt-3">
                    <View className={`px-3 py-1.5 rounded-lg ${typeColor.bg} border ${typeColor.border}`}>
                        <Text className={`text-xs font-bold ${typeColor.text}`}>{group.type}</Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="p-5">
                <View className="flex-row justify-between mb-4">
                    <View className="flex-1">
                        <View className="flex-row items-center mb-2">
                            <Users size={16} color="#6B7280" />
                            <Text className="text-gray-600 text-sm ml-2">{group.members} Members</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Users size={16} color="#6B7280" />
                            <Text className="text-gray-600 text-sm ml-2">Admin: {group.admin}</Text>
                        </View>
                    </View>
                </View>

                <View className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4">
                    <Text className="text-gray-400 text-xs mb-1">WhatsApp Link</Text>
                    <Text className="text-gray-800 text-sm" numberOfLines={1}>{group.link}</Text>
                </View>

                <View className="flex-row space-x-2">
                    <TouchableOpacity
                        onPress={handleOpenLink}
                        className="flex-1 bg-blue-600 py-3 rounded-xl flex-row items-center justify-center"
                    >
                        <ExternalLink size={16} color="white" />
                        <Text className="text-white font-bold ml-2">Open Link</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleCopyLink}
                        className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-xl items-center"
                    >
                        <Copy size={18} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl items-center">
                        <Edit size={18} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const AddGroupModal = () => (
    <View className="bg-white rounded-3xl p-6 shadow-2xl mb-6">
        <Text className="text-gray-900 font-bold text-2xl mb-6">Add New Group</Text>

        <View className="mb-4">
            <Text className="text-gray-600 font-medium mb-2">Group Name *</Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                <MessageCircle size={20} color="#9CA3AF" />
                <TextInput
                    className="flex-1 py-3 px-3 text-gray-800"
                    placeholder="Enter group name"
                />
            </View>
        </View>

        <View className="mb-4">
            <Text className="text-gray-600 font-medium mb-2">District *</Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                <MapPin size={20} color="#9CA3AF" />
                <TextInput
                    className="flex-1 py-3 px-3 text-gray-800"
                    placeholder="Select district"
                />
            </View>
        </View>

        <View className="mb-4">
            <Text className="text-gray-600 font-medium mb-2">WhatsApp Link *</Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                <LinkIcon size={20} color="#9CA3AF" />
                <TextInput
                    className="flex-1 py-3 px-3 text-gray-800"
                    placeholder="https://chat.whatsapp.com/..."
                />
            </View>
        </View>

        <View className="flex-row space-x-3">
            <TouchableOpacity className="flex-1 bg-gray-100 py-4 rounded-2xl items-center">
                <Text className="text-gray-700 font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-blue-600 py-4 rounded-2xl items-center">
                <Text className="text-white font-bold">Add Group</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default function DistrictGroupsPage() {
    const router = useRouter();
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState('all');

    const districts = Array.from(new Set(MOCK_GROUPS.map(g => g.district)));

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#3B82F6', '#2563EB']} className="pt-12 pb-12 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={60} left={20} />

                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold">Group Links</Text>
                            <Text className="text-blue-100 text-sm mt-1">Manage WhatsApp group links</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setShowAddModal(!showAddModal)}
                            className="bg-white px-4 py-3 rounded-2xl flex-row items-center"
                        >
                            <Plus size={20} color="#3B82F6" />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-4">
                {/* Add Group Modal */}
                {showAddModal && <AddGroupModal />}

                {/* District Filter */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-4 px-4">
                    <TouchableOpacity
                        onPress={() => setSelectedDistrict('all')}
                        className={`px-6 py-3 rounded-2xl mr-3 ${selectedDistrict === 'all' ? 'bg-blue-600' : 'bg-white border border-gray-200'}`}
                    >
                        <Text className={`font-semibold ${selectedDistrict === 'all' ? 'text-white' : 'text-gray-700'}`}>
                            All ({MOCK_GROUPS.length})
                        </Text>
                    </TouchableOpacity>
                    {districts.map(district => (
                        <TouchableOpacity
                            key={district}
                            onPress={() => setSelectedDistrict(district)}
                            className={`px-6 py-3 rounded-2xl mr-3 ${selectedDistrict === district ? 'bg-blue-600' : 'bg-white border border-gray-200'}`}
                        >
                            <Text className={`font-semibold ${selectedDistrict === district ? 'text-white' : 'text-gray-700'}`}>
                                {district} ({MOCK_GROUPS.filter(g => g.district === district).length})
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Group Cards */}
                <View className="pb-8">
                    {MOCK_GROUPS
                        .filter(g => selectedDistrict === 'all' || g.district === selectedDistrict)
                        .map(group => (
                            <GroupCard key={group.id} group={group} />
                        ))}
                </View>
            </View>
        </ScrollView>
    );
}
