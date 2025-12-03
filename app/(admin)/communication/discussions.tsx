import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, MessageSquare, MoreVertical, ThumbsUp, MessageCircle, Trash2, ShieldAlert } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const DISCUSSIONS = [
    {
        id: 1,
        user: 'Amit Kumar',
        avatar: 'https://avatar.iran.liara.run/public/1',
        topic: 'Campaign Strategy for Rural Areas',
        content: 'We need to focus more on door-to-door campaigns in the upcoming weeks. The digital reach is good but personal connection matters.',
        likes: 45,
        comments: 12,
        time: '2 hrs ago',
        flagged: false
    },
    {
        id: 2,
        user: 'Priya Singh',
        avatar: 'https://avatar.iran.liara.run/public/2',
        topic: 'Youth Wing Coordination',
        content: 'Can we organize a meetup for all district youth leaders next Sunday?',
        likes: 32,
        comments: 8,
        time: '4 hrs ago',
        flagged: true
    },
    {
        id: 3,
        user: 'Rahul Yadav',
        avatar: 'https://avatar.iran.liara.run/public/3',
        topic: 'Social Media Guidelines',
        content: 'Please clarify the new hashtags to be used for the upcoming rally.',
        likes: 28,
        comments: 5,
        time: '5 hrs ago',
        flagged: false
    },
];

const DiscussionCard = ({ discussion }: any) => (
    <View className={`bg-white rounded-3xl p-5 shadow-lg border mb-4 ${discussion.flagged ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
        <View className="flex-row justify-between items-start mb-3">
            <View className="flex-row items-center">
                <Image source={{ uri: discussion.avatar }} className="w-10 h-10 rounded-full mr-3" />
                <View>
                    <Text className="text-gray-900 font-bold">{discussion.user}</Text>
                    <Text className="text-gray-500 text-xs">{discussion.time}</Text>
                </View>
            </View>
            <TouchableOpacity>
                <MoreVertical size={20} color="#9CA3AF" />
            </TouchableOpacity>
        </View>

        <Text className="text-gray-800 font-bold text-lg mb-1">{discussion.topic}</Text>
        <Text className="text-gray-600 text-sm mb-4 leading-relaxed">{discussion.content}</Text>

        <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
            <View className="flex-row space-x-4">
                <View className="flex-row items-center">
                    <ThumbsUp size={16} color="#6B7280" />
                    <Text className="text-gray-500 text-xs ml-1 font-medium">{discussion.likes}</Text>
                </View>
                <View className="flex-row items-center">
                    <MessageCircle size={16} color="#6B7280" />
                    <Text className="text-gray-500 text-xs ml-1 font-medium">{discussion.comments}</Text>
                </View>
            </View>

            <View className="flex-row space-x-2">
                {discussion.flagged && (
                    <View className="bg-red-100 px-3 py-1 rounded-full flex-row items-center">
                        <ShieldAlert size={12} color="#EF4444" />
                        <Text className="text-red-600 text-xs font-bold ml-1">Flagged</Text>
                    </View>
                )}
                <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
                    <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

export default function DiscussionsPage() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#f59e0b', '#ef4444']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">Discussions</Text>
                        <Text className="text-amber-100 text-sm mt-1">Moderate community conversations</Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="px-4">
                <View className="flex-row mb-6 space-x-3">
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-2xl font-bold text-gray-900">45</Text>
                        <Text className="text-gray-500 text-sm">Active Topics</Text>
                    </View>
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-2xl font-bold text-red-500">3</Text>
                        <Text className="text-gray-500 text-sm">Flagged Posts</Text>
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Recent Discussions</Text>
                    {DISCUSSIONS.map(discussion => (
                        <DiscussionCard key={discussion.id} discussion={discussion} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
