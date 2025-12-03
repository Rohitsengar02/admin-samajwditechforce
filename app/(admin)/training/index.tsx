import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import {
    BookOpen, Users, Trophy, CheckCircle, Plus, TrendingUp,
    PlayCircle, FileText, Edit, Clock
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

const PhaseCard = ({ phase, onPress }: any) => (
    <TouchableOpacity onPress={() => onPress(phase)} className="w-full md:w-1/2 lg:w-1/4 p-2">
        <LinearGradient colors={phase.gradient} className="rounded-3xl shadow-lg overflow-hidden">
            <AnimatedBubble size={100} top={-30} left={120} />
            <AnimatedBubble size={70} top={80} left={-20} />

            <View className="p-6 relative">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="bg-white/20 p-3 rounded-2xl">
                        <phase.icon size={24} color="white" />
                    </View>
                    <View className="bg-white/20 px-3 py-1 rounded-lg">
                        <Text className="text-white text-xs font-bold">{phase.modules} Modules</Text>
                    </View>
                </View>

                <Text className="text-white/80 text-sm mb-1">{phase.number}</Text>
                <Text className="text-white font-bold text-2xl mb-2">{phase.title}</Text>
                <Text className="text-white/70 text-sm mb-4">{phase.description}</Text>

                <View className="mb-2">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-white/80 text-xs">Completion</Text>
                        <Text className="text-white font-bold text-xs">{phase.completion}%</Text>
                    </View>
                    <View className="bg-white/20 rounded-full h-2">
                        <View
                            className="bg-white rounded-full h-2"
                            style={{ width: `${phase.completion}%` }}
                        />
                    </View>
                </View>
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

export default function TrainingPage() {
    const router = useRouter();
    const [modules, setModules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Auto-detect platform and use correct API URL
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
                setModules(data);
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

    const getPhaseCount = (phaseName: string) => {
        return modules.filter(m => m.phase === phaseName).length;
    };

    const PHASES = [
        {
            id: 1,
            title: 'Connect',
            number: 'Phase 1',
            description: 'Building the network',
            gradient: ['#3B82F6', '#2563EB'],
            modules: getPhaseCount('Phase 1'),
            completion: 0, // Placeholder
            icon: Users
        },
        {
            id: 2,
            title: 'Create',
            number: 'Phase 2',
            description: 'Content creation mastery',
            gradient: ['#8B5CF6', '#7C3AED'],
            modules: getPhaseCount('Phase 2'),
            completion: 0,
            icon: PlayCircle
        },
        {
            id: 3,
            title: 'Conquer',
            number: 'Phase 3',
            description: 'Election dominance',
            gradient: ['#EC4899', '#DB2777'],
            modules: getPhaseCount('Phase 3'),
            completion: 0,
            icon: Trophy
        },
        {
            id: 4,
            title: 'Conclusion',
            number: 'Phase 4',
            description: 'Final victory push',
            gradient: ['#10B981', '#059669'],
            modules: getPhaseCount('Phase 4'),
            completion: 0,
            icon: CheckCircle
        },
    ];

    const recentModules = [...modules].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

    return (
        <ScrollView
            className="flex-1 bg-gray-50"
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
            }
        >
            {/* Header */}
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#4F46E5', '#7C3AED']} className="pt-8 pb-12 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={80} left={20} />

                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold mb-2">Training Dashboard</Text>
                            <Text className="text-indigo-200 text-sm">4-Phase Training System</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/(admin)/training/create' as any)}
                            className="bg-white px-4 py-3 rounded-2xl flex-row items-center shadow-lg"
                        >
                            <Plus size={20} color="#4F46E5" />
                            <Text className="text-indigo-600 font-bold ml-2">Add</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-4">
                {/* Stats Overview */}
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <StatCard icon={BookOpen} label="Total Modules" value={modules.length} color={['#6366f1', '#8b5cf6']} bgColor="bg-white/20" />
                    <StatCard icon={CheckCircle} label="Published" value={modules.length} color={['#10b981', '#059669']} bgColor="bg-white/20" />
                    <StatCard icon={Users} label="Enrolled" value="0" color={['#f59e0b', '#ef4444']} bgColor="bg-white/20" />
                </View>

                {/* Phases */}
                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Training Phases</Text>
                    <View className="flex-row flex-wrap -mx-2">
                        {PHASES.map(phase => (
                            <PhaseCard
                                key={phase.id}
                                phase={phase}
                                onPress={(p: any) => router.push(`/(admin)/training/phase${p.id}` as any)}
                            />
                        ))}
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <TouchableOpacity
                        onPress={() => router.push('/(admin)/training/create' as any)}
                        className="flex-1 m-2"
                    >
                        <View className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                            <View className="bg-indigo-100 p-4 rounded-2xl self-start mb-4">
                                <Plus size={28} color="#6366f1" />
                            </View>
                            <Text className="text-gray-900 font-bold text-base mb-2">Create Module</Text>
                            <Text className="text-gray-500 text-sm">Add new training content</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/(admin)/training/approval' as any)}
                        className="flex-1 m-2"
                    >
                        <View className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                            <View className="bg-amber-100 p-4 rounded-2xl self-start mb-4">
                                <CheckCircle size={28} color="#F59E0B" />
                            </View>
                            <Text className="text-gray-900 font-bold text-base mb-2">Approvals</Text>
                            <Text className="text-gray-500 text-sm">Review submissions</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Recent Modules */}
                <View className="bg-white rounded-3xl shadow-lg p-6 mb-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-bold text-gray-800">Recent Modules</Text>
                        <TouchableOpacity>
                            <Text className="text-indigo-600 text-sm font-medium">View All</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="small" color="#4F46E5" />
                    ) : recentModules.length === 0 ? (
                        <Text className="text-gray-400 text-center py-4">No modules created yet</Text>
                    ) : (
                        recentModules.map(module => (
                            <View key={module._id} className="flex-row items-center justify-between border-b border-gray-100 py-4">
                                <View className="flex-row items-center flex-1">
                                    <View className="bg-indigo-50 p-3 rounded-xl mr-3">
                                        {module.type === 'video' ? (
                                            <PlayCircle size={20} color="#6366f1" />
                                        ) : (
                                            <FileText size={20} color="#6366f1" />
                                        )}
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-900 font-semibold">{module.title}</Text>
                                        <View className="flex-row items-center mt-1">
                                            <Text className="text-gray-500 text-sm">{module.phase}</Text>
                                            <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                                            <Clock size={12} color="#9CA3AF" />
                                            <Text className="text-gray-500 text-sm ml-1">{module.duration || 'N/A'}</Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => router.push('/(admin)/training/editor' as any)}
                                    className="bg-gray-100 px-4 py-2 rounded-xl"
                                >
                                    <Edit size={16} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
