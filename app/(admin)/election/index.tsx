import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    MapPin, Users, AlertTriangle, FileText, UserCheck,
    TrendingUp, Plus, Shield
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
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

export default function ElectionModePage() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#EF4444', '#DC2626']} className="pt-8 pb-12 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={80} left={20} />
                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold mb-2">Election Mode</Text>
                            <Text className="text-red-100 text-sm">Booth management & reporting</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/(admin)/election/booths' as any)}
                            className="bg-white px-4 py-3 rounded-2xl flex-row items-center shadow-lg"
                        >
                            <Plus size={20} color="#EF4444" />
                            <Text className="text-red-600 font-bold ml-2">Add Booth</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-4">
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <StatCard icon={AlertTriangle} label="Critical Booths" value="12" color={['#EF4444', '#B91C1C']} bgColor="bg-white/20" />
                    <StatCard icon={Users} label="Volunteers" value="1.2K" color={['#3B82F6', '#2563EB']} bgColor="bg-white/20" />
                    <StatCard icon={FileText} label="Reports" value="85%" color={['#10B981', '#059669']} bgColor="bg-white/20" />
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Election Tools</Text>
                    <View className="flex-row flex-wrap -mx-2">
                        <QuickActionCard
                            icon={MapPin}
                            title="Booth Management"
                            description="Manage booth status"
                            color="bg-red-600"
                            onPress={() => router.push('/(admin)/election/booths' as any)}
                        />
                        <QuickActionCard
                            icon={Users}
                            title="Volunteers"
                            description="Assign booth agents"
                            color="bg-blue-600"
                            onPress={() => router.push('/(admin)/election/volunteers' as any)}
                        />
                    </View>
                    <View className="flex-row flex-wrap -mx-2">
                        <QuickActionCard
                            icon={UserCheck}
                            title="Candidates"
                            description="View candidate profiles"
                            color="bg-purple-600"
                            onPress={() => router.push('/(admin)/election/candidates' as any)}
                        />
                        <QuickActionCard
                            icon={FileText}
                            title="Daily Reports"
                            description="Review booth reports"
                            color="bg-emerald-600"
                            onPress={() => router.push('/(admin)/election/reports' as any)}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
