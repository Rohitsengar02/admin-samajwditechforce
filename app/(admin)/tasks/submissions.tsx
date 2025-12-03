import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, CheckCircle, XCircle, Eye, Clock, Award
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const SUBMISSIONS = [
    {
        id: 1,
        userName: 'Rahul Yadav',
        userPhoto: 'https://avatar.iran.liara.run/public/1',
        task: 'Share Campaign Video',
        platform: 'Facebook',
        points: 50,
        submittedAt: '2024-01-20 10:30',
        proofUrl: 'https://facebook.com/...'
    },
    {
        id: 2,
        userName: 'Priya Singh',
        userPhoto: 'https://avatar.iran.liara.run/public/2',
        task: 'Comment on Posts',
        platform: 'Twitter',
        points: 30,
        submittedAt: '2024-01-20 11:15',
        proofUrl: 'https://twitter.com/...'
    },
    {
        id: 3,
        userName: 'Amit Kumar',
        userPhoto: 'https://avatar.iran.liara.run/public/3',
        task: 'Upload Booth Photos',
        platform: 'App',
        points: 100,
        submittedAt: '2024-01-20 09:45',
        proofUrl: 'Photo uploaded'
    },
];

const SubmissionCard = ({ submission }: any) => (
    <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-4">
        <LinearGradient colors={['#f59e0b', '#ef4444']} className="p-5 relative">
            <AnimatedBubble size={80} top={-20} left={200} />

            <View className="flex-row items-center">
                <Image source={{ uri: submission.userPhoto }} className="w-14 h-14 rounded-xl mr-3" />
                <View className="flex-1">
                    <Text className="text-white font-bold text-xl mb-1">{submission.userName}</Text>
                    <Text className="text-white/80 text-sm">{submission.task}</Text>
                </View>
                <View className="bg-white/20 px-3 py-2 rounded-xl">
                    <View className="flex-row items-center">
                        <Award size={16} color="white" />
                        <Text className="text-white font-bold ml-1">{submission.points}</Text>
                    </View>
                </View>
            </View>
        </LinearGradient>

        <View className="p-5">
            <View className="mb-4">
                <View className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-2">
                    <Text className="text-gray-400 text-xs mb-1">Platform</Text>
                    <Text className="text-gray-800 font-semibold">{submission.platform}</Text>
                </View>
                <View className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-2">
                    <Text className="text-gray-400 text-xs mb-1">Proof</Text>
                    <Text className="text-gray-800 font-semibold text-sm">{submission.proofUrl}</Text>
                </View>
                <View className="flex-row items-center">
                    <Clock size={14} color="#9CA3AF" />
                    <Text className="text-gray-500 text-sm ml-2">{submission.submittedAt}</Text>
                </View>
            </View>

            <View className="flex-row space-x-2">
                <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center">
                    <Eye size={16} color="#6B7280" />
                    <Text className="text-gray-700 font-bold ml-2">View Proof</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-emerald-600 py-3 rounded-xl flex-row items-center justify-center">
                    <CheckCircle size={16} color="white" />
                    <Text className="text-white font-bold ml-2">Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                    <XCircle size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

export default function SubmissionsPage() {
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
                        <Text className="text-white text-3xl font-bold">Submissions</Text>
                        <Text className="text-amber-100 text-sm mt-1">Review task submissions</Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="px-4">
                <View className="flex-row mb-6 space-x-3">
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <View className="bg-amber-50 p-2 rounded-lg mb-2 self-start">
                            <Clock size={20} color="#F59E0B" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900">{SUBMISSIONS.length}</Text>
                        <Text className="text-gray-500 text-sm">Pending Review</Text>
                    </View>

                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <View className="bg-emerald-50 p-2 rounded-lg mb-2 self-start">
                            <CheckCircle size={20} color="#10B981" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900">156</Text>
                        <Text className="text-gray-500 text-sm">Approved Today</Text>
                    </View>
                </View>

                <View className="pb-8">
                    <View className="flex-row flex-wrap -mx-2">
                        {SUBMISSIONS.map(submission => (
                            <View key={submission.id} className="w-full md:w-1/2 lg:w-1/3 p-2">
                                <SubmissionCard submission={submission} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
