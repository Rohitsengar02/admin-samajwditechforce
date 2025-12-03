import React from 'react';
import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import {
    Users, CheckSquare, Map, AlertTriangle, CheckCircle, WifiOff,
    TrendingUp, Award, Calendar, Bell, ChevronRight, Activity, Shield,
    UserPlus, FileText, Clock, Star, Settings
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForBackgroundLines: {
        strokeDasharray: "",
        stroke: "#E5E7EB"
    }
};

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View
        style={{
            position: 'absolute',
            width: size,
            height: size,
            top: top,
            left: left,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: size / 2,
            opacity: 0.6,
        }}
    />
);

interface StatsCardProps {
    title: string;
    value: string;
    change: string;
    icon: any;
    gradient: [string, string];
}

const StatsCard = ({ title, value, change, icon: Icon, gradient }: StatsCardProps) => (
    <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-5 rounded-3xl h-40 justify-between shadow-lg relative overflow-hidden mx-2"
    >
        <AnimatedBubble size={80} top={-30} left={-20} />
        <AnimatedBubble size={60} top={60} left={120} />

        <View className="flex-row justify-between items-start">
            <View className="bg-white/20 p-3 rounded-2xl">
                <Icon size={24} color="white" />
            </View>
            <View className="bg-white/20 px-3 py-1 rounded-full">
                <Text className="text-white font-bold text-xs">{change}</Text>
            </View>
        </View>

        <View>
            <Text className="text-white/90 font-medium text-sm mb-1">{title}</Text>
            <Text className="text-white font-bold text-3xl">{value}</Text>
        </View>
    </LinearGradient>
);

const QuickActionButton = ({ icon: Icon, label, color }: { icon: any; label: string; color: string }) => (
    <TouchableOpacity className="items-center p-3">
        <View className={`w-16 h-16 rounded-2xl items-center justify-center mb-2 ${color}`}>
            <Icon size={28} color="#4F46E5" />
        </View>
        <Text className="text-gray-700 font-medium text-xs text-center">{label}</Text>
    </TouchableOpacity>
);

const MetricCard = ({ label, value, icon: Icon, bgColor, iconColor }: any) => (
    <View className="flex-1 min-w-[120px] m-1">
        <View className={`${bgColor} p-4 rounded-2xl border border-gray-100`}>
            <View className="flex-row items-center justify-between mb-2">
                <Icon size={20} color={iconColor} />
                <Text className="text-xs text-gray-500 font-medium">{label}</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">{value}</Text>
        </View>
    </View>
);

const ActivityItem = ({ title, time, icon: Icon, color, bg }: any) => (
    <View className="flex-row items-center p-3 mb-2 bg-white rounded-xl">
        <View className={`p-2.5 rounded-full mr-3 ${bg}`}>
            <Icon size={16} color={color} />
        </View>
        <View className="flex-1">
            <Text className="text-gray-800 font-semibold text-sm">{title}</Text>
            <Text className="text-gray-400 text-xs">{time}</Text>
        </View>
    </View>
);

const TeamMemberCard = ({ name, role, avatar, stats }: any) => (
    <View className="bg-white p-4 rounded-2xl border border-gray-100 mr-4 w-48">
        <View className="flex-row items-center mb-3">
            <Image source={{ uri: avatar }} className="w-12 h-12 rounded-full mr-3" />
            <View className="flex-1">
                <Text className="font-bold text-gray-900 text-sm">{name}</Text>
                <Text className="text-gray-500 text-xs">{role}</Text>
            </View>
        </View>
        <View className="flex-row justify-between">
            <View>
                <Text className="text-xs text-gray-400">Tasks</Text>
                <Text className="text-sm font-bold text-gray-900">{stats.tasks}</Text>
            </View>
            <View>
                <Text className="text-xs text-gray-400">Score</Text>
                <Text className="text-sm font-bold text-indigo-600">{stats.score}</Text>
            </View>
        </View>
    </View>
);

export default function Dashboard() {
    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            <View className="relative overflow-hidden">
                <LinearGradient colors={['#4F46E5', '#7C3AED']} className="pt-12 pb-20 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={150} top={10} left={screenWidth - 100} />
                    <AnimatedBubble size={100} top={120} left={20} />
                    <AnimatedBubble size={80} top={60} left={screenWidth / 2} />

                    <View className="flex-row justify-between items-center z-10 mb-6">
                        <View>
                            <Text className="text-indigo-200 text-lg font-medium">Welcome back,</Text>
                            <Text className="text-white text-3xl font-bold">Admin Dashboard</Text>
                        </View>
                        <TouchableOpacity className="bg-white/20 p-1.5 rounded-full border-2 border-white/30">
                            <Image source={{ uri: 'https://avatar.iran.liara.run/public/boy' }} className="w-12 h-12 rounded-full" />
                        </TouchableOpacity>
                    </View>

                    <View className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                        <Text className="text-white font-semibold mb-1">Today's Progress</Text>
                        <View className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <View className="h-full bg-white rounded-full" style={{ width: '68%' }} />
                        </View>
                        <Text className="text-white/80 text-xs mt-2">68% of daily goals completed</Text>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-2 py-2 pb-24">
                {/* STATS CARDS - Carousel on Mobile, Grid on Desktop */}
                {screenWidth < 768 ? (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mb-6 -mx-2"
                        pagingEnabled
                        snapToInterval={screenWidth - 40}
                        decelerationRate="fast"
                    >
                        <View style={{ width: screenWidth - 40 }}>
                            <StatsCard title="Revenue" value="₹2.4M" change="+18%" icon={TrendingUp} gradient={['#10b981', '#059669']} />
                        </View>
                        <View style={{ width: screenWidth - 40 }}>
                            <StatsCard title="Districts" value="75" change="+2" icon={Map} gradient={['#f59e0b', '#ef4444']} />
                        </View>
                        <View style={{ width: screenWidth - 40 }}>
                            <StatsCard title="Total Members" value="12,450" change="+12%" icon={Users} gradient={['#6366f1', '#8b5cf6']} />
                        </View>
                        <View style={{ width: screenWidth - 40 }}>
                            <StatsCard title="Active Tasks" value="45" change="+5%" icon={CheckSquare} gradient={['#0ea5e9', '#3b82f6']} />
                        </View>


                    </ScrollView>
                ) : (
                    <View className="flex-row flex-wrap -mx-2 mb-6">
                        <View className="w-1/4 p-2">
                            <StatsCard title="Total Members" value="12,450" change="+12%" icon={Users} gradient={['#6366f1', '#8b5cf6']} />
                        </View>
                        <View className="w-1/4 p-2">
                            <StatsCard title="Active Tasks" value="45" change="+5%" icon={CheckSquare} gradient={['#0ea5e9', '#3b82f6']} />
                        </View>
                        <View className="w-1/4 p-2">
                            <StatsCard title="Districts" value="75" change="+2" icon={Map} gradient={['#f59e0b', '#ef4444']} />
                        </View>
                        <View className="w-1/4 p-2">
                            <StatsCard title="Revenue" value="₹2.4M" change="+18%" icon={TrendingUp} gradient={['#10b981', '#059669']} />
                        </View>
                    </View>
                )}

                <View className="bg-white p-5 rounded-3xl shadow-sm mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
                    <View className="flex-row flex-wrap justify-around">
                        <QuickActionButton icon={UserPlus} label="Add Member" color="bg-indigo-50" />
                        <QuickActionButton icon={FileText} label="New Task" color="bg-blue-50" />
                        <QuickActionButton icon={Award} label="Rewards" color="bg-amber-50" />
                        <QuickActionButton icon={Settings} label="Settings" color="bg-gray-50" />
                    </View>
                </View>

                <View className="mb-6">
                    <View className="bg-white p-5 rounded-3xl shadow-sm">
                        <View className="flex-row justify-between items-center mb-4">
                            <View>
                                <Text className="text-lg font-bold text-gray-800">Member Growth</Text>
                                <Text className="text-gray-400 text-xs">Last 7 months</Text>
                            </View>
                            <View className="bg-green-50 px-3 py-1 rounded-lg">
                                <Text className="text-green-600 text-xs font-bold">+12.5%</Text>
                            </View>
                        </View>

                        <LineChart
                            data={{
                                labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                                datasets: [{
                                    data: [980, 1100, 1134, 1262, 1421, 1550, 1600],
                                    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
                                    strokeWidth: 4
                                }]
                            }}
                            width={screenWidth - 60}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                            style={{ borderRadius: 16 }}
                            withVerticalLines={false}
                        />
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-3 px-2">Performance Metrics</Text>
                    <View className="flex-row flex-wrap -mx-1">
                        <MetricCard label="Engagement" value="94%" icon={Activity} bgColor="bg-blue-50" iconColor="#3B82F6" />
                        <MetricCard label="Response" value="2.4h" icon={Clock} bgColor="bg-purple-50" iconColor="#A855F7" />
                        <MetricCard label="Rating" value="4.8" icon={Star} bgColor="bg-yellow-50" iconColor="#F59E0B" />

                    </View>
                </View>

                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <View className="w-full lg:w-1/2 p-2">
                        <View className="bg-white p-5 rounded-3xl shadow-sm">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-lg font-bold text-gray-800">Recent Activity</Text>
                                <TouchableOpacity><Text className="text-indigo-600 text-sm font-medium">View All</Text></TouchableOpacity>
                            </View>
                            <ActivityItem title="New member joined" time="2 min ago" icon={UserPlus} color="#10B981" bg="bg-emerald-50" />
                            <ActivityItem title="Task completed" time="15 min ago" icon={CheckCircle} color="#3B82F6" bg="bg-blue-50" />
                            <ActivityItem title="District updated" time="1 hour ago" icon={Map} color="#F59E0B" bg="bg-amber-50" />
                            <ActivityItem title="Report generated" time="2 hours ago" icon={FileText} color="#8B5CF6" bg="bg-purple-50" />
                        </View>
                    </View>

                    <View className="w-full lg:w-1/2 p-2">
                        <View className="bg-white p-5 rounded-3xl shadow-sm">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-lg font-bold text-gray-800">Upcoming Events</Text>
                                <TouchableOpacity><Calendar size={20} color="#4F46E5" /></TouchableOpacity>
                            </View>

                            <View className="bg-indigo-50 p-4 rounded-2xl mb-3 flex-row border border-indigo-100">
                                <View className="bg-white p-3 rounded-xl items-center mr-3">
                                    <Text className="text-indigo-600 font-bold text-xs">NOV</Text>
                                    <Text className="text-gray-900 font-bold text-xl">25</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-900 font-bold">District Meeting</Text>
                                    <Text className="text-indigo-600 text-xs mt-1">10:00 AM • Lucknow HQ</Text>
                                </View>
                            </View>

                            <View className="bg-pink-50 p-4 rounded-2xl flex-row border border-pink-100">
                                <View className="bg-white p-3 rounded-xl items-center mr-3">
                                    <Text className="text-pink-600 font-bold text-xs">DEC</Text>
                                    <Text className="text-gray-900 font-bold text-xl">02</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-900 font-bold">Training Workshop</Text>
                                    <Text className="text-pink-600 text-xs mt-1">2:00 PM • Online</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-3 px-2">
                        <Text className="text-lg font-bold text-gray-800">Team Overview</Text>
                        <TouchableOpacity className="flex-row items-center">
                            <Text className="text-indigo-600 text-sm font-medium mr-1">See All</Text>
                            <ChevronRight size={16} color="#4F46E5" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-2">
                        <TeamMemberCard name="Rahul Yadav" role="District Head" avatar="https://avatar.iran.liara.run/public/1" stats={{ tasks: 24, score: 95 }} />
                        <TeamMemberCard name="Priya Singh" role="Coordinator" avatar="https://avatar.iran.liara.run/public/2" stats={{ tasks: 18, score: 88 }} />
                        <TeamMemberCard name="Amit Kumar" role="Volunteer" avatar="https://avatar.iran.liara.run/public/3" stats={{ tasks: 32, score: 92 }} />
                    </ScrollView>
                </View>

                <View className="relative overflow-hidden mb-6">
                    <LinearGradient colors={['#F97316', '#EF4444']} className="p-5 rounded-3xl">
                        <AnimatedBubble size={120} top={-20} left={screenWidth - 150} />
                        <AnimatedBubble size={80} top={80} left={20} />

                        <View className="flex-row items-center justify-between">
                            <View className="flex-1 mr-4">
                                <View className="bg-yellow-500/30 self-start px-3 py-1 rounded-full mb-3">
                                    <Text className="text-yellow-100 text-xs font-bold uppercase">Important</Text>
                                </View>
                                <Text className="text-white text-xl font-bold mb-2">Election Mode Active</Text>
                                <Text className="text-white/90 text-sm mb-4">Monitor real-time booth activities.</Text>
                                <TouchableOpacity className="bg-white px-5 py-2.5 rounded-xl self-start">
                                    <Text className="text-orange-600 font-bold text-sm">View Dashboard</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="bg-white/20 p-4 rounded-full">
                                <Shield size={40} color="white" />
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                <View className="mb-6">
                    <View className="bg-white p-5 rounded-3xl shadow-sm">
                        <Text className="text-lg font-bold text-gray-800 mb-4">System Health</Text>

                        <View className="flex-row items-center justify-between mb-3 p-3 bg-green-50 rounded-xl">
                            <View className="flex-row items-center">
                                <CheckCircle size={20} color="#10B981" />
                                <Text className="ml-2 text-gray-700 font-medium">Server Status</Text>
                            </View>
                            <Text className="text-green-600 font-bold">Online</Text>
                        </View>

                        <View className="flex-row items-center justify-between mb-3 p-3 bg-blue-50 rounded-xl">
                            <View className="flex-row items-center">
                                <Activity size={20} color="#3B82F6" />
                                <Text className="ml-2 text-gray-700 font-medium">CPU Usage</Text>
                            </View>
                            <Text className="text-blue-600 font-bold">24%</Text>
                        </View>

                        <View className="flex-row items-center justify-between p-3 bg-yellow-50 rounded-xl">
                            <View className="flex-row items-center">
                                <AlertTriangle size={20} color="#F59E0B" />
                                <Text className="ml-2 text-gray-700 font-medium">Alerts</Text>
                            </View>
                            <Text className="text-yellow-600 font-bold">3</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
