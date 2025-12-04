import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Upload, Image as ImageIcon, Video, FileText, Download,
    Plus, TrendingUp, Eye, BarChart3
} from 'lucide-react-native';
import { Platform } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const getApiUrl = () => {
    if (Platform.OS === 'android') {
        return 'http://192.168.1.46:5001/api/resources';
    }
    if (Platform.OS === 'ios') {
        return 'http://localhost:5001/api/resources';
    }
    if (process.env.EXPO_PUBLIC_API_URL) return `${process.env.EXPO_PUBLIC_API_URL}/api/resources`;
    return 'http://localhost:5001/api/resources';
};

const API_URL = getApiUrl();

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

export default function ResourcesPage() {
    const router = useRouter();
    const [stats, setStats] = React.useState({
        posters: 0,
        reels: 0,
        documents: 0,
        tutorials: 0,
        totalDownloads: 0
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data.success) {
                const resources = data.data;
                setStats({
                    posters: resources.filter((r: any) => r.category === 'poster').length,
                    reels: resources.filter((r: any) => r.category === 'reel').length,
                    documents: resources.filter((r: any) => r.category === 'document').length,
                    tutorials: resources.filter((r: any) => r.category === 'tutorial').length,
                    totalDownloads: resources.reduce((sum: number, r: any) => sum + r.downloads, 0)
                });
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#EC4899', '#DB2777']} className="pt-8 pb-12 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={80} left={20} />
                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold mb-2">Resource Library</Text>
                            <Text className="text-pink-200 text-sm">Digital assets & templates</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/(admin)/resources/upload' as any)}
                            className="bg-white px-4 py-3 rounded-2xl flex-row items-center shadow-lg"
                        >
                            <Plus size={20} color="#EC4899" />
                            <Text className="text-pink-600 font-bold ml-2">Upload</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-4">
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    <StatCard icon={ImageIcon} label="Posters" value={stats.posters.toString()} color={['#6366f1', '#8b5cf6']} bgColor="bg-white/20" />
                    <StatCard icon={Video} label="Reels" value={stats.reels.toString()} color={['#10b981', '#059669']} bgColor="bg-white/20" />
                    <StatCard icon={Download} label="Downloads" value={stats.totalDownloads > 1000 ? `${(stats.totalDownloads / 1000).toFixed(1)}K` : stats.totalDownloads.toString()} color={['#f59e0b', '#ef4444']} bgColor="bg-white/20" />
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Categories</Text>
                    <View className="flex-row flex-wrap -mx-2">
                        <QuickActionCard
                            icon={ImageIcon}
                            title="Posters"
                            description="Campaign posters & graphics"
                            color="bg-indigo-600"
                            onPress={() => router.push('/(admin)/resources/posters' as any)}
                        />
                        <QuickActionCard
                            icon={Video}
                            title="Reel Templates"
                            description="Video templates"
                            color="bg-emerald-600"
                            onPress={() => router.push('/(admin)/resources/reels' as any)}
                        />
                    </View>
                    <View className="flex-row flex-wrap -mx-2">
                        <QuickActionCard
                            icon={FileText}
                            title="Documents"
                            description="Speeches & templates"
                            color="bg-amber-600"
                            onPress={() => router.push('/(admin)/resources/documents' as any)}
                        />
                        <QuickActionCard
                            icon={Eye}
                            title="Tutorials"
                            description="Editing guides"
                            color="bg-purple-600"
                            onPress={() => router.push('/(admin)/resources/tutorials' as any)}
                        />
                    </View>
                    <View className="flex-row flex-wrap -mx-2">
                        <QuickActionCard
                            icon={BarChart3}
                            title="Download Logs"
                            description="Track downloads"
                            color="bg-blue-600"
                            onPress={() => router.push('/(admin)/resources/logs' as any)}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
