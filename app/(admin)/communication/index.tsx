import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Bell, Send, MessageSquare, HelpCircle, Lightbulb,
    Plus, TrendingUp, Users, CheckCircle
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

export default function CommunicationPage() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#10b981', '#059669']} className="pt-8 pb-12 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={80} left={20} />
                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold mb-2">Communication Hub</Text>
                            <Text className="text-emerald-200 text-sm">Connect with your force</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/(admin)/communication/announcements' as any)}
                            className="bg-white px-4 py-3 rounded-2xl flex-row items-center shadow-lg"
                        >
                            <Plus size={20} color="#10b981" />
                            <Text className="text-emerald-600 font-bold ml-2">New</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-4">
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <StatCard icon={Bell} label="Announcements" value="24" color={['#6366f1', '#8b5cf6']} bgColor="bg-white/20" />
                    <StatCard icon={HelpCircle} label="Questions" value="156" color={['#10b981', '#059669']} bgColor="bg-white/20" />
                    <StatCard icon={Lightbulb} label="Suggestions" value="89" color={['#f59e0b', '#ef4444']} bgColor="bg-white/20" />
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Communication Tools</Text>
                    <View className="flex-row flex-wrap -mx-2">
                        <QuickActionCard
                            icon={Bell}
                            title="Announcements"
                            description="Post updates & news"
                            color="bg-indigo-600"
                            onPress={() => router.push('/(admin)/communication/announcements' as any)}
                        />
                        <QuickActionCard
                            icon={Send}
                            title="Push Notifications"
                            description="Send instant alerts"
                            color="bg-emerald-600"
                            onPress={() => router.push('/(admin)/communication/notifications' as any)}
                        />
                    </View>
                    <View className="flex-row flex-wrap -mx-2">
                        <QuickActionCard
                            icon={MessageSquare}
                            title="Discussions"
                            description="Moderate conversations"
                            color="bg-amber-600"
                            onPress={() => router.push('/(admin)/communication/discussions' as any)}
                        />
                        <QuickActionCard
                            icon={HelpCircle}
                            title="Ask Leader"
                            description="Review questions"
                            color="bg-purple-600"
                            onPress={() => router.push('/(admin)/communication/questions' as any)}
                        />
                    </View>
                    <View className="flex-row flex-wrap -mx-2">
                        <QuickActionCard
                            icon={Lightbulb}
                            title="Suggestion Box"
                            description="Review ideas"
                            color="bg-blue-600"
                            onPress={() => router.push('/(admin)/communication/suggestions' as any)}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
