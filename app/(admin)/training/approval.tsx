import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, CheckCircle, XCircle, Clock, PlayCircle, FileText, Eye
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const PENDING_MODULES = [
    {
        id: 1,
        title: 'Advanced WhatsApp Marketing',
        phase: 'Phase 2',
        type: 'video',
        submittedBy: 'Rahul Yadav',
        submittedDate: '2024-01-20',
        duration: '18 min'
    },
    {
        id: 2,
        title: 'Voter Data Analysis',
        phase: 'Phase 3',
        type: 'doc',
        submittedBy: 'Priya Singh',
        submittedDate: '2024-01-19',
        duration: '12 min'
    },
    {
        id: 3,
        title: 'Team Leadership Skills',
        phase: 'Phase 1',
        type: 'video',
        submittedBy: 'Amit Kumar',
        submittedDate: '2024-01-18',
        duration: '22 min'
    },
];

const ApprovalCard = ({ module }: any) => (
    <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-4">
        <LinearGradient
            colors={['#F59E0B', '#EF4444']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-5 relative"
        >
            <AnimatedBubble size={80} top={-20} left={200} />
            <AnimatedBubble size={60} top={40} left={-10} />

            <View className="flex-row items-center justify-between">
                <View className="flex-1">
                    <Text className="text-white font-bold text-xl mb-1">{module.title}</Text>
                    <Text className="text-white/80 text-sm">Submitted by {module.submittedBy}</Text>
                </View>
                <View className="bg-white/20 p-3 rounded-2xl">
                    {module.type === 'video' ? (
                        <PlayCircle size={24} color="white" />
                    ) : (
                        <FileText size={24} color="white" />
                    )}
                </View>
            </View>
        </LinearGradient>

        <View className="p-5">
            <View className="flex-row items-center mb-4">
                <View className="bg-amber-50 p-2 rounded-lg mr-3">
                    <Clock size={16} color="#F59E0B" />
                </View>
                <View>
                    <Text className="text-gray-400 text-xs">Submitted</Text>
                    <Text className="text-gray-800 font-semibold">{new Date(module.submittedDate).toLocaleDateString()}</Text>
                </View>
            </View>

            <View className="mb-4">
                <View className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-2">
                    <Text className="text-blue-700 font-semibold">{module.phase}</Text>
                </View>
                <Text className="text-gray-500 text-sm">Duration: {module.duration}</Text>
            </View>

            <View className="flex-row space-x-2">
                <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center">
                    <Eye size={16} color="#6B7280" />
                    <Text className="text-gray-700 font-bold ml-2">Preview</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-emerald-600 py-3 rounded-xl flex-row items-center justify-center">
                    <CheckCircle size={16} color="white" />
                    <Text className="text-white font-bold ml-2">Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-50 border border-red-200 px-4 py-3 rounded-xl items-center">
                    <XCircle size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

export default function ModuleApprovalPage() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#F59E0B', '#EF4444']} className="pt-12 pb-12 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={60} left={20} />

                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold">Module Approvals</Text>
                            <Text className="text-amber-100 text-sm mt-1">Review submitted content</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-4">
                <View className="flex-row mb-6 space-x-3">
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <View className="bg-amber-50 p-2 rounded-lg mb-2 self-start">
                            <Clock size={20} color="#F59E0B" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900">{PENDING_MODULES.length}</Text>
                        <Text className="text-gray-500 text-sm">Pending Review</Text>
                    </View>

                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <View className="bg-emerald-50 p-2 rounded-lg mb-2 self-start">
                            <CheckCircle size={20} color="#10B981" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900">12</Text>
                        <Text className="text-gray-500 text-sm">Approved Today</Text>
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Pending Submissions</Text>
                    {PENDING_MODULES.map(module => (
                        <ApprovalCard key={module.id} module={module} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
