import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lightbulb, ThumbsUp, Star, Archive } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const SUGGESTIONS = [
    {
        id: 1,
        user: 'Deepak Verma',
        avatar: 'https://avatar.iran.liara.run/public/7',
        title: 'Mobile App for Voter Registration',
        description: 'We should develop a simple mobile app for booth agents to quickly register new voters offline.',
        votes: 156,
        category: 'Technology',
        date: '2024-01-20'
    },
    {
        id: 2,
        user: 'Meera Reddy',
        avatar: 'https://avatar.iran.liara.run/public/8',
        title: 'Weekly Youth Sports Events',
        description: 'Organizing cricket matches in every district to engage the youth demographic.',
        votes: 89,
        category: 'Events',
        date: '2024-01-19'
    },
    {
        id: 3,
        user: 'Rajesh Koothrappali',
        avatar: 'https://avatar.iran.liara.run/public/9',
        title: 'Digital Literacy Workshops',
        description: 'Conduct workshops for senior members to help them use social media effectively.',
        votes: 124,
        category: 'Education',
        date: '2024-01-18'
    },
];

const SuggestionCard = ({ suggestion }: any) => (
    <View className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 mb-4">
        <View className="flex-row justify-between items-start mb-3">
            <View className="flex-row items-center">
                <Image source={{ uri: suggestion.avatar }} className="w-10 h-10 rounded-full mr-3" />
                <View>
                    <Text className="text-gray-900 font-bold">{suggestion.user}</Text>
                    <Text className="text-gray-500 text-xs">{new Date(suggestion.date).toLocaleDateString()}</Text>
                </View>
            </View>
            <View className="bg-blue-50 px-3 py-1 rounded-full">
                <Text className="text-blue-700 text-xs font-bold">{suggestion.category}</Text>
            </View>
        </View>

        <Text className="text-gray-800 font-bold text-lg mb-2">{suggestion.title}</Text>
        <Text className="text-gray-600 text-sm mb-4 leading-relaxed">{suggestion.description}</Text>

        <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
            <View className="flex-row items-center bg-amber-50 px-3 py-1.5 rounded-lg">
                <ThumbsUp size={16} color="#F59E0B" />
                <Text className="text-amber-700 font-bold text-sm ml-2">{suggestion.votes} Votes</Text>
            </View>

            <View className="flex-row space-x-2">
                <TouchableOpacity className="bg-indigo-600 px-4 py-2 rounded-xl flex-row items-center">
                    <Star size={16} color="white" />
                    <Text className="text-white font-bold ml-2 text-xs">Shortlist</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-gray-100 p-2 rounded-xl">
                    <Archive size={18} color="#6B7280" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

export default function SuggestionsPage() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#3B82F6', '#2563EB']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">Suggestion Box</Text>
                        <Text className="text-blue-100 text-sm mt-1">Review community ideas</Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="px-4">
                <View className="flex-row mb-6 space-x-3">
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-2xl font-bold text-gray-900">28</Text>
                        <Text className="text-gray-500 text-sm">New Ideas</Text>
                    </View>
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-2xl font-bold text-indigo-600">5</Text>
                        <Text className="text-gray-500 text-sm">Shortlisted</Text>
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Top Suggestions</Text>
                    {SUGGESTIONS.map(suggestion => (
                        <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
