import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Gift, Award, Trophy, Star, Search
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const TOP_PERFORMERS = [
    { id: 1, name: 'Rahul Yadav', photo: 'https://avatar.iran.liara.run/public/1', points: 2850, tasks: 57, rank: 1 },
    { id: 2, name: 'Priya Singh', photo: 'https://avatar.iran.liara.run/public/2', points: 2640, tasks: 53, rank: 2 },
    { id: 3, name: 'Amit Kumar', photo: 'https://avatar.iran.liara.run/public/3', points: 2420, tasks: 48, rank: 3 },
    { id: 4, name: 'Sneha Gupta', photo: 'https://avatar.iran.liara.run/public/4', points: 2180, tasks: 44, rank: 4 },
];

const REWARDS = [
    { id: 1, name: 'Bronze Badge', points: 1000, icon: Award, color: '#CD7F32' },
    { id: 2, name: 'Silver Badge', points: 2000, icon: Award, color: '#C0C0C0' },
    { id: 3, name: 'Gold Badge', points: 3000, icon: Trophy, color: '#FFD700' },
    { id: 4, name: 'Platinum Badge', points: 5000, icon: Star, color: '#E5E4E2' },
];

const PerformerCard = ({ performer }: any) => {
    const getRankColor = (rank: number): [string, string] => {
        switch (rank) {
            case 1: return ['#FFD700', '#FFA500'];
            case 2: return ['#C0C0C0', '#A8A8A8'];
            case 3: return ['#CD7F32', '#B87333'];
            default: return ['#8B5CF6', '#7C3AED'];
        }
    };

    return (
        <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-4">
            <LinearGradient colors={getRankColor(performer.rank)} className="p-5 relative">
                <AnimatedBubble size={80} top={-20} left={180} />

                <View className="flex-row items-center">
                    <View className="relative">
                        <Image source={{ uri: performer.photo }} className="w-16 h-16 rounded-2xl" />
                        <View className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 items-center justify-center border-2 border-white">
                            <Text className="text-gray-900 font-bold text-sm">#{performer.rank}</Text>
                        </View>
                    </View>
                    <View className="flex-1 ml-3">
                        <Text className="text-white font-bold text-xl mb-1">{performer.name}</Text>
                        <View className="flex-row items-center">
                            <Award size={14} color="white" />
                            <Text className="text-white/90 text-sm ml-1">{performer.points} points</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <View className="p-5">
                <View className="flex-row justify-between mb-4">
                    <View className="flex-1 items-center">
                        <Text className="text-gray-400 text-xs mb-1">Tasks Completed</Text>
                        <Text className="text-gray-900 text-2xl font-bold">{performer.tasks}</Text>
                    </View>
                    <View className="flex-1 items-center">
                        <Text className="text-gray-400 text-xs mb-1">Total Points</Text>
                        <Text className="text-amber-600 text-2xl font-bold">{performer.points}</Text>
                    </View>
                </View>

                <TouchableOpacity className="bg-purple-600 py-3 rounded-xl flex-row items-center justify-center">
                    <Gift size={16} color="white" />
                    <Text className="text-white font-bold ml-2">Assign Reward</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const RewardCard = ({ reward }: any) => (
    <TouchableOpacity className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 m-2">
        <View style={{ backgroundColor: `${reward.color}20` }} className="p-4 rounded-2xl self-start mb-4">
            <reward.icon size={32} color={reward.color} />
        </View>
        <Text className="text-gray-900 font-bold text-lg mb-2">{reward.name}</Text>
        <View className="flex-row items-center">
            <Award size={14} color="#F59E0B" />
            <Text className="text-amber-600 font-semibold ml-1">{reward.points} pts</Text>
        </View>
    </TouchableOpacity>
);

export default function RewardsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#8B5CF6', '#7C3AED']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">Rewards</Text>
                        <Text className="text-purple-100 text-sm mt-1">Assign rewards to members</Text>
                    </View>
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
                </View>
            </LinearGradient>

            <View className="px-4">
                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Available Rewards</Text>
                    <View className="flex-row flex-wrap -mx-2">
                        {REWARDS.map(reward => (
                            <View key={reward.id} className="w-1/2">
                                <RewardCard reward={reward} />
                            </View>
                        ))}
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Top Performers</Text>
                    <View className="flex-row flex-wrap -mx-2">
                        {TOP_PERFORMERS.map(performer => (
                            <View key={performer.id} className="w-full md:w-1/2 p-2">
                                <PerformerCard performer={performer} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
