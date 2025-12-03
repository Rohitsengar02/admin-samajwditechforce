import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Plus, CheckCircle, Clock, Gift, TrendingUp, ListTodo,
    FileCheck, Award, Users
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

const QuickActionCard = ({ icon: Icon, title, description, color, onPress }: any) => (
    <TouchableOpacity onPress={onPress} className="flex-1 m-2">
        <View className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <View className={`p-4 rounded-2xl self-start mb-4 ${color}`}>
                <Icon size={28} color="white" />
            </View>
            <Text className="text-gray-900 font-bold text-base mb-2">{title}</Text>
            <Text className="text-gray-500 text-sm mb-4">{description}</Text>
            <View className="flex-row items-center">
                <Text className="text-indigo-600 font-semibold text-sm">Open</Text>
                <Text className="text-indigo-600 ml-2">→</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const RECENT_TASKS = [
    { id: 1, title: 'Share Campaign Video', platform: 'Facebook', points: 50, submissions: 145, status: 'Active' },
    { id: 2, title: 'Comment on Posts', platform: 'Twitter', points: 30, submissions: 89, status: 'Active' },
    { id: 3, title: 'Upload Booth Photos', platform: 'App', points: 100, submissions: 234, status: 'Completed' },
];

export default function TasksPage() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#6366f1', '#8b5cf6']} className="pt-8 pb-12 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={80} left={20} />

                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold mb-2">Daily Digital Work</Text>
                            <Text className="text-indigo-200 text-sm">Manage tasks and rewards</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/(admin)/tasks/builder' as any)}
                            className="bg-white px-4 py-3 rounded-2xl flex-row items-center shadow-lg"
                        >
                            <Plus size={20} color="#6366f1" />
                            <Text className="text-indigo-600 font-bold ml-2">New</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-4">
                {/* Stats Overview */}
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <StatCard icon={ListTodo} label="Active Tasks" value="12" color={['#6366f1', '#8b5cf6']} bgColor="bg-white/20" />
                    <StatCard icon={CheckCircle} label="Completed" value="468" color={['#10b981', '#059669']} bgColor="bg-white/20" />
                    <StatCard icon={Clock} label="Pending" value="234" color={['#f59e0b', '#ef4444']} bgColor="bg-white/20" />
                </View>

                {/* Quick Actions */}
                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Quick Actions</Text>
                    <View className="flex-row flex-wrap -mx-2">
                        <QuickActionCard
                            icon={Plus}
                            title="Task Builder"
                            description="Create new daily tasks"
                            color="bg-indigo-600"
                            onPress={() => router.push('/(admin)/tasks/builder' as any)}
                        />
                        <QuickActionCard
                            icon={ListTodo}
                            title="Tasks List"
                            description="View all tasks"
                            color="bg-emerald-600"
                            onPress={() => router.push('/(admin)/tasks/list' as any)}
                        />
                    </View>
                    <View className="flex-row flex-wrap -mx-2">
                        <QuickActionCard
                            icon={FileCheck}
                            title="Submissions"
                            description="Review submissions"
                            color="bg-amber-600"
                            onPress={() => router.push('/(admin)/tasks/submissions' as any)}
                        />
                        <QuickActionCard
                            icon={Gift}
                            title="Rewards"
                            description="Assign rewards"
                            color="bg-purple-600"
                            onPress={() => router.push('/(admin)/tasks/rewards' as any)}
                        />
                    </View>
                </View>

                {/* Recent Tasks */}
                <View className="bg-white rounded-3xl shadow-lg p-6 mb-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-bold text-gray-800">Recent Tasks</Text>
                        <TouchableOpacity onPress={() => router.push('/(admin)/tasks/list' as any)}>
                            <Text className="text-indigo-600 text-sm font-medium">View All</Text>
                        </TouchableOpacity>
                    </View>

                    {RECENT_TASKS.map(task => (
                        <View key={task.id} className="flex-row items-center justify-between border-b border-gray-100 py-4">
                            <View className="flex-row items-center flex-1">
                                <View className="bg-indigo-50 p-3 rounded-xl mr-3">
                                    <ListTodo size={20} color="#6366f1" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-900 font-semibold">{task.title}</Text>
                                    <View className="flex-row items-center mt-1">
                                        <Text className="text-gray-500 text-sm">{task.platform}</Text>
                                        <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                                        <Award size={12} color="#F59E0B" />
                                        <Text className="text-amber-600 text-sm ml-1 font-semibold">{task.points} pts</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="items-end">
                                <View className={`px-3 py-1 rounded-lg ${task.status === 'Active' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                                    <Text className={`text-xs font-bold ${task.status === 'Active' ? 'text-emerald-700' : 'text-gray-700'}`}>
                                        {task.status}
                                    </Text>
                                </View>
                                <View className="flex-row items-center mt-1">
                                    <Users size={12} color="#9CA3AF" />
                                    <Text className="text-gray-500 text-xs ml-1">{task.submissions}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
