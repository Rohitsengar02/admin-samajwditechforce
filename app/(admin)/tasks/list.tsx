import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import {
    ArrowLeft, Search, Filter, Edit, Trash2, Award, Users,
    Calendar, CheckCircle, XCircle, AlertCircle
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const TaskCard = ({ task }: any) => (
    <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-4">
        <LinearGradient
            colors={task.status === 'Active' ? ['#10b981', '#059669'] : ['#9CA3AF', '#6B7280']}
            className="p-5 relative"
        >
            <AnimatedBubble size={80} top={-20} left={200} />

            <View className="flex-row items-center justify-between">
                <View className="flex-1">
                    <Text className="text-white font-bold text-xl mb-1">{task.title}</Text>
                    <Text className="text-white/80 text-sm capitalize">{task.platform}</Text>
                </View>
                <View className="bg-white/20 px-4 py-2 rounded-xl">
                    <View className="flex-row items-center">
                        <Award size={16} color="white" />
                        <Text className="text-white font-bold ml-1">{task.points}</Text>
                    </View>
                </View>
            </View>
        </LinearGradient>

        <View className="p-5">
            <View className="flex-row justify-between mb-4">
                <View className="flex-1 items-center">
                    <View className="bg-indigo-50 p-2 rounded-lg mb-2">
                        <Users size={20} color="#6366f1" />
                    </View>
                    <Text className="text-gray-400 text-xs">Target</Text>
                    <Text className="text-gray-900 text-sm font-bold text-center">{task.targetAudience || 'All'}</Text>
                </View>

                <View className="flex-1 items-center">
                    <View className="bg-amber-50 p-2 rounded-lg mb-2">
                        <Calendar size={20} color="#F59E0B" />
                    </View>
                    <Text className="text-gray-400 text-xs">Deadline</Text>
                    <Text className="text-gray-900 text-sm font-bold">
                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No Deadline'}
                    </Text>
                </View>
            </View>

            <View className="flex-row space-x-2">
                <TouchableOpacity className="flex-1 bg-indigo-600 py-3 rounded-xl flex-row items-center justify-center">
                    <Edit size={16} color="white" />
                    <Text className="text-white font-bold ml-2">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                    <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

export default function TasksListPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Auto-detect platform and use correct API URL
    // Auto-detect platform and use correct API URL
    const getApiUrl = () => {
        if (Platform.OS === 'android') {
            return 'http://192.168.1.46:5001/api';
        }
        if (Platform.OS === 'ios') {
            return 'http://localhost:5001/api';
        }
        const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';
        return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
    };

    const API_URL = `${getApiUrl()}/tasks`;

    const fetchTasks = async () => {
        try {
            setError(null);
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data.success || Array.isArray(data)) {
                // Handle both response formats (standard wrapper or direct array)
                setTasks(data.data || data);
            } else {
                setError('Failed to load tasks');
            }
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError('Network error. Please check connection.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Refresh when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchTasks();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchTasks();
    };

    const filteredTasks = tasks.filter((task: any) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'active' && task.status === 'Active') ||
            (filter === 'completed' && task.status === 'Expired'); // Mapping 'completed' to 'Expired' for now
        return matchesSearch && matchesFilter;
    });

    return (
        <ScrollView
            className="flex-1 bg-gray-50"
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10b981']} />
            }
        >
            <LinearGradient colors={['#10b981', '#059669']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">Tasks List</Text>
                        <Text className="text-emerald-100 text-sm mt-1">All daily tasks</Text>
                    </View>
                </View>

                <View className="flex-row items-center bg-white/20 backdrop-blur-md px-4 rounded-2xl border border-white/30">
                    <Search size={20} color="white" />
                    <TextInput
                        className="flex-1 py-3 px-3 text-white"
                        placeholder="Search tasks..."
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
                <View className="flex-row mb-6 bg-white rounded-2xl p-2 shadow-sm">
                    <TouchableOpacity
                        onPress={() => setFilter('all')}
                        className={`flex-1 py-2.5 rounded-xl ${filter === 'all' ? 'bg-emerald-600' : 'bg-transparent'}`}
                    >
                        <Text className={`text-center font-semibold ${filter === 'all' ? 'text-white' : 'text-gray-600'}`}>
                            All ({tasks.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setFilter('active')}
                        className={`flex-1 py-2.5 rounded-xl ${filter === 'active' ? 'bg-emerald-600' : 'bg-transparent'}`}
                    >
                        <Text className={`text-center font-semibold ${filter === 'active' ? 'text-white' : 'text-gray-600'}`}>
                            Active
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setFilter('completed')}
                        className={`flex-1 py-2.5 rounded-xl ${filter === 'completed' ? 'bg-emerald-600' : 'bg-transparent'}`}
                    >
                        <Text className={`text-center font-semibold ${filter === 'completed' ? 'text-white' : 'text-gray-600'}`}>
                            Expired
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="pb-8">
                    {loading && !refreshing ? (
                        <View className="items-center py-10">
                            <ActivityIndicator size="large" color="#10b981" />
                            <Text className="text-gray-400 mt-4">Loading tasks...</Text>
                        </View>
                    ) : error ? (
                        <View className="items-center py-10">
                            <AlertCircle size={40} color="#EF4444" />
                            <Text className="text-red-500 mt-4 font-medium">{error}</Text>
                            <TouchableOpacity onPress={fetchTasks} className="mt-4 bg-indigo-100 px-4 py-2 rounded-lg">
                                <Text className="text-indigo-600 font-bold">Try Again</Text>
                            </TouchableOpacity>
                        </View>
                    ) : filteredTasks.length === 0 ? (
                        <View className="items-center py-10">
                            <Text className="text-gray-400 font-medium text-lg">No tasks found</Text>
                            <Text className="text-gray-300 text-sm mt-1">Try adjusting your search or filters</Text>
                        </View>
                    ) : (
                        <View className="flex-row flex-wrap -mx-2">
                            {filteredTasks.map((task: any) => (
                                <View key={task._id} className="w-full md:w-1/2 lg:w-1/3 p-2">
                                    <TaskCard task={task} />
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
