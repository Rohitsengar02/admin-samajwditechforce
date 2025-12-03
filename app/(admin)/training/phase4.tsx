import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import {
    ArrowLeft, Users, PlayCircle, FileText, Clock, CheckCircle,
    Plus, TrendingUp, Award
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

const ModuleCard = ({ module }: any) => (
    <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-4">
        <View className="p-5">
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                    <View className={`p-3 rounded-xl mr-3 ${module.type === 'video' ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                        {module.type === 'video' ? (
                            <PlayCircle size={24} color="#3B82F6" />
                        ) : (
                            <FileText size={24} color="#10B981" />
                        )}
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-900 font-bold text-lg">{module.title}</Text>
                        <View className="flex-row items-center mt-1">
                            <Clock size={14} color="#9CA3AF" />
                            <Text className="text-gray-500 text-sm ml-1">{module.duration || 'N/A'}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <TouchableOpacity className="bg-emerald-600 py-3 rounded-xl items-center">
                <Text className="text-white font-bold">Start Learning</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default function Phase4Page() {
    const router = useRouter();
    const [modules, setModules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const getApiUrl = () => {
        const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
        if (Platform.OS === 'android') {
            return baseUrl.replace('localhost', '10.0.2.2');
        }
        return baseUrl;
    };

    const API_URL = `${getApiUrl()}/api/training`;

    const fetchModules = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (Array.isArray(data)) {
                const phaseModules = data.filter((m: any) => m.phase === 'Phase 4');
                setModules(phaseModules);
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchModules();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchModules();
    };

    return (
        <ScrollView
            className="flex-1 bg-gray-50"
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10B981']} />
            }
        >
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#10B981', '#059669']} className="pt-12 pb-16 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={80} left={20} />

                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-emerald-100 text-sm mb-1">Phase 4</Text>
                            <Text className="text-white text-3xl font-bold">Conclusion</Text>
                            <Text className="text-emerald-100 text-sm mt-1">Final victory push</Text>
                        </View>
                        <View className="bg-white/20 p-3 rounded-2xl">
                            <CheckCircle size={28} color="white" />
                        </View>
                    </View>

                    <View className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-white/80 text-sm">Overall Progress</Text>
                            <Text className="text-white font-bold">0%</Text>
                        </View>
                        <View className="bg-white/20 rounded-full h-3">
                            <View className="bg-white rounded-full h-3" style={{ width: '0%' }} />
                        </View>
                        <View className="flex-row items-center mt-2">
                            <Text className="text-white/80 text-xs">0 of {modules.length} modules completed</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-4">
                <View className="flex-row mb-6 space-x-3">
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <View className="bg-emerald-50 p-2 rounded-lg mb-2 self-start">
                            <FileText size={20} color="#10B981" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900">{modules.length}</Text>
                        <Text className="text-gray-500 text-sm">Total Modules</Text>
                    </View>

                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <View className="bg-emerald-50 p-2 rounded-lg mb-2 self-start">
                            <CheckCircle size={20} color="#10B981" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900">0</Text>
                        <Text className="text-gray-500 text-sm">Completed</Text>
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Training Modules</Text>
                    {loading && !refreshing ? (
                        <ActivityIndicator size="large" color="#10B981" />
                    ) : modules.length === 0 ? (
                        <Text className="text-gray-400 text-center py-4">No modules found for Phase 4</Text>
                    ) : (
                        modules.map(module => (
                            <ModuleCard key={module._id} module={module} />
                        ))
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
