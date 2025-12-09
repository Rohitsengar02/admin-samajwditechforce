import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, ActivityIndicator, Platform, RefreshControl, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import {
    ArrowLeft, MapPin, Users, Building2, Edit, Trash2,
    Search, Filter, Plus, TrendingUp, AlertCircle
} from 'lucide-react-native';
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

const DistrictListCard = ({ district, onEdit, onDelete }: any) => (
    <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-4">
        <LinearGradient colors={['#6366f1', '#8b5cf6']} className="p-5 relative">
            <AnimatedBubble size={80} top={-20} left={200} />
            <AnimatedBubble size={60} top={40} left={-10} />

            <View className="flex-row items-center justify-between">
                <View className="flex-1">
                    <Text className="text-white font-bold text-2xl mb-1">{district.name}</Text>
                    <Text className="text-white/80 text-sm">Head: {district.headName || 'Not Assigned'}</Text>
                </View>
                <View className="bg-emerald-500/30 px-3 py-1.5 rounded-lg">
                    <Text className="text-white font-bold text-sm">Active</Text>
                </View>
            </View>
        </LinearGradient>

        <View className="p-5">
            <View className="flex-row justify-between mb-4">
                <View className="flex-1 items-center">
                    <View className="bg-indigo-50 p-3 rounded-xl mb-2">
                        <Building2 size={20} color="#6366f1" />
                    </View>
                    <Text className="text-gray-400 text-xs font-medium">Assemblies</Text>
                    <Text className="text-gray-900 text-xl font-bold">{district.assemblyCount || 0}</Text>
                </View>

                <View className="flex-1 items-center">
                    <View className="bg-emerald-50 p-3 rounded-xl mb-2">
                        <Users size={20} color="#10B981" />
                    </View>
                    <Text className="text-gray-400 text-xs font-medium">Members</Text>
                    <Text className="text-gray-900 text-xl font-bold">{district.totalMembers || 0}</Text>
                </View>

                <View className="flex-1 items-center">
                    <View className="bg-amber-50 p-3 rounded-xl mb-2">
                        <TrendingUp size={20} color="#F59E0B" />
                    </View>
                    <Text className="text-gray-400 text-xs font-medium">Phone</Text>
                    <Text className="text-emerald-600 text-sm font-bold">{district.headPhone || 'N/A'}</Text>
                </View>
            </View>

            <View className="flex-row space-x-2">
                <TouchableOpacity
                    onPress={() => onEdit(district)}
                    className="flex-1 bg-indigo-600 py-3 rounded-xl flex-row items-center justify-center"
                >
                    <Edit size={16} color="white" />
                    <Text className="text-white font-bold ml-2">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onDelete(district)}
                    className="bg-red-50 border border-red-200 px-4 py-3 rounded-xl items-center"
                >
                    <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

export default function DistrictListPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [districts, setDistricts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_URL = `${getApiUrl()}/districts`;

    const fetchDistricts = async () => {
        try {
            setError(null);
            const response = await fetch(API_URL);
            const data = await response.json();

            if (Array.isArray(data)) {
                setDistricts(data);
            } else if (data.success && Array.isArray(data.data)) {
                setDistricts(data.data);
            } else {
                setDistricts([]);
            }
        } catch (err) {
            console.error('Error fetching districts:', err);
            setError('Failed to load districts');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const deleteDistrict = async (district: any) => {
        const confirmDelete = () => {
            return new Promise<boolean>((resolve) => {
                if (Platform.OS === 'web') {
                    resolve(window.confirm(`Are you sure you want to delete "${district.name}"?\n\nThis action cannot be undone.`));
                } else {
                    Alert.alert(
                        '⚠️ Delete District',
                        `Are you sure you want to delete "${district.name}"?\n\nThis action cannot be undone.`,
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
            const response = await fetch(`${API_URL}/${district._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const successMsg = 'District deleted successfully';
                if (Platform.OS === 'web') {
                    alert('✅ ' + successMsg);
                } else {
                    Alert.alert('✅ Success', successMsg);
                }
                fetchDistricts();
            } else {
                const errorMsg = 'Failed to delete district';
                if (Platform.OS === 'web') {
                    alert('❌ ' + errorMsg);
                } else {
                    Alert.alert('❌ Error', errorMsg);
                }
            }
        } catch (error) {
            console.error('Error deleting district:', error);
            const errorMsg = 'Network error. Please try again.';
            if (Platform.OS === 'web') {
                alert('❌ ' + errorMsg);
            } else {
                Alert.alert('❌ Error', errorMsg);
            }
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDistricts();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchDistricts();
    };

    const filteredDistricts = districts.filter((district: any) =>
        district.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ScrollView
            className="flex-1 bg-gray-50"
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
            }
        >
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#4F46E5', '#7C3AED']} className="pt-12 pb-12 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={60} left={20} />

                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold">District List</Text>
                            <Text className="text-indigo-200 text-sm mt-1">Manage all districts</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/(admin)/districts/add' as any)}
                            className="bg-white px-4 py-3 rounded-2xl flex-row items-center"
                        >
                            <Plus size={20} color="#4F46E5" />
                        </TouchableOpacity>
                    </View>

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

            <View className="px-4 pb-8">
                {loading && !refreshing ? (
                    <View className="items-center py-10">
                        <ActivityIndicator size="large" color="#4F46E5" />
                        <Text className="text-gray-400 mt-4">Loading districts...</Text>
                    </View>
                ) : error ? (
                    <View className="items-center py-10">
                        <AlertCircle size={40} color="#EF4444" />
                        <Text className="text-red-500 mt-4 font-medium">{error}</Text>
                        <TouchableOpacity onPress={fetchDistricts} className="mt-4 bg-indigo-100 px-4 py-2 rounded-lg">
                            <Text className="text-indigo-600 font-bold">Try Again</Text>
                        </TouchableOpacity>
                    </View>
                ) : filteredDistricts.length === 0 ? (
                    <View className="items-center py-10">
                        <Text className="text-gray-400 font-medium text-lg">No districts found</Text>
                        <Text className="text-gray-300 text-sm mt-1">Add a new district to get started</Text>
                    </View>
                ) : (
                    <View className="flex-row flex-wrap -mx-2">
                        {filteredDistricts.map((district: any) => (
                            <View key={district._id} className="w-full md:w-1/2 lg:w-1/3 p-2">
                                <DistrictListCard
                                    district={district}
                                    onEdit={(d: any) => router.push(`/(admin)/districts/edit/${d._id}` as any)}
                                    onDelete={deleteDistrict}
                                />
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
