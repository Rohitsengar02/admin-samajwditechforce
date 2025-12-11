import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Dimensions, Platform, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Search, Filter, Plus, Phone, MapPin, Mail, Calendar,
    Award, MessageCircle, MoreVertical, Users, TrendingUp, Star, Trash2
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '../../../utils/api';

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

const MemberCard = ({ member, onDelete }: { member: any; onDelete: (id: string, name: string) => void }) => {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);

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
            <View className="bg-white mb-24 rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
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

                        <View style={{ position: 'relative' }}>
                            <TouchableOpacity
                                className="bg-white/20 p-2 rounded-xl backdrop-blur-md"
                                onPress={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(!showMenu);
                                }}
                            >
                                <MoreVertical size={20} color="white" />
                            </TouchableOpacity>

                            {showMenu && (
                                <View style={{
                                    position: 'absolute',
                                    top: 45,
                                    right: 0,
                                    backgroundColor: 'white',
                                    borderRadius: 12,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 12,
                                    elevation: 8,
                                    minWidth: 160,
                                    zIndex: 999,
                                }}>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 14,
                                            borderRadius: 12,
                                        }}
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            setShowMenu(false);
                                            onDelete(member._id, member.name);
                                        }}
                                    >
                                        <View style={{
                                            backgroundColor: '#fee2e2',
                                            padding: 8,
                                            borderRadius: 8,
                                            marginRight: 12
                                        }}>
                                            <Trash2 size={18} color="#dc2626" />
                                        </View>
                                        <Text style={{ color: '#dc2626', fontSize: 15, fontWeight: '600' }}>
                                            Delete Member
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
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

    const deleteMember = async (memberId: string, memberName: string) => {
        const confirmDelete = () => {
            return new Promise<boolean>((resolve) => {
                if (Platform.OS === 'web') {
                    resolve(window.confirm(`Are you sure you want to delete "${memberName}"?\n\nThis action cannot be undone.`));
                } else {
                    Alert.alert(
                        '⚠️ Delete Member',
                        `Are you sure you want to delete "${memberName}"?\n\nThis action cannot be undone.`,
                        [
                            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                            { text: 'Delete', style: 'destructive', onPress: () => resolve(true) }
                        ]
                    );
                }
            });
        };

        const confirmed = await confirmDelete();
        if (!confirmed) return;

        try {
            const token = await AsyncStorage.getItem('adminToken');
            const url = getApiUrl();

            const response = await fetch(`${url}/admin/delete-member/${memberId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const successMsg = 'Member deleted successfully';
                if (Platform.OS === 'web') {
                    alert('✅ ' + successMsg);
                } else {
                    Alert.alert('✅ Success', successMsg);
                }
                fetchMembers();
            } else {
                const errorMsg = 'Failed to delete member';
                if (Platform.OS === 'web') {
                    alert('❌ ' + errorMsg);
                } else {
                    Alert.alert('❌ Error', errorMsg);
                }
            }
        } catch (error) {
            console.error('Error deleting member:', error);
            const errorMsg = 'Network error. Please try again.';
            if (Platform.OS === 'web') {
                alert('❌ ' + errorMsg);
            } else {
                Alert.alert('❌ Error', errorMsg);
            }
        }
    };

    const filteredMembers = members.filter(m =>
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone?.includes(searchQuery) ||
        m.vidhanSabha?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const onRefresh = React.useCallback(() => {
        setLoading(true);
        fetchMembers();
    }, []);

    return (
        <ScrollView
            className="flex-1 bg-gray-50"
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={['#4F46E5']} />
            }
        >
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
                    <StatCard
                        icon={Users}
                        label="Total Verified"
                        value={loading ? "..." : members.length.toString()}
                        color={['#6366f1', '#8b5cf6']}
                        bgColor="bg-white/20"
                    />
                    <StatCard icon={TrendingUp} label="Active Today" value="0" color={['#10b981', '#059669']} bgColor="bg-white/20" />
                    <StatCard icon={Award} label="Avg Score" value="-" color={['#f59e0b', '#ef4444']} bgColor="bg-white/20" />
                </View>

                <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-4 px-2">
                        <Text className="text-lg font-bold text-gray-800">All Members ({loading ? "..." : filteredMembers.length})</Text>
                        <TouchableOpacity className="flex-row items-center">
                            <Text className="text-indigo-600 text-sm font-medium mr-1">Sort by</Text>
                            <Filter size={14} color="#6366f1" />
                        </TouchableOpacity>
                    </View>

                    {loading && members.length === 0 ? (
                        <View className="items-center py-10">
                            <ActivityIndicator size="large" color="#4F46E5" />
                            <Text className="text-gray-400 mt-4">Loading members...</Text>
                        </View>
                    ) : (
                        <View className="flex-row flex-wrap -mx-2">
                            {filteredMembers.map((member) => (
                                <View key={member._id} className="w-full md:w-1/2 lg:w-1/3 p-2">
                                    <MemberCard member={member} onDelete={deleteMember} />
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
