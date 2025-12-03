import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, HelpCircle, CheckCircle, XCircle, MessageSquare } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const QUESTIONS = [
    {
        id: 1,
        user: 'Vikram Singh',
        avatar: 'https://avatar.iran.liara.run/public/4',
        question: 'What is the official stance on the new agricultural policy?',
        status: 'Pending',
        date: '2024-01-20'
    },
    {
        id: 2,
        user: 'Anjali Gupta',
        avatar: 'https://avatar.iran.liara.run/public/5',
        question: 'How can we request more campaign materials for our district?',
        status: 'Answered',
        date: '2024-01-19'
    },
    {
        id: 3,
        user: 'Suresh Kumar',
        avatar: 'https://avatar.iran.liara.run/public/6',
        question: 'Is there a training session for new booth agents?',
        status: 'Pending',
        date: '2024-01-18'
    },
];

const QuestionCard = ({ question }: any) => (
    <View className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 mb-4">
        <View className="flex-row justify-between items-start mb-3">
            <View className="flex-row items-center">
                <Image source={{ uri: question.avatar }} className="w-10 h-10 rounded-full mr-3" />
                <View>
                    <Text className="text-gray-900 font-bold">{question.user}</Text>
                    <Text className="text-gray-500 text-xs">{new Date(question.date).toLocaleDateString()}</Text>
                </View>
            </View>
            <View className={`px-3 py-1 rounded-full ${question.status === 'Pending' ? 'bg-amber-100' : 'bg-green-100'}`}>
                <Text className={`text-xs font-bold ${question.status === 'Pending' ? 'text-amber-700' : 'text-green-700'}`}>
                    {question.status}
                </Text>
            </View>
        </View>

        <Text className="text-gray-800 font-medium text-base mb-4 leading-relaxed">{question.question}</Text>

        {question.status === 'Pending' ? (
            <View>
                <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3 text-sm"
                    placeholder="Type your answer here..."
                    multiline
                />
                <View className="flex-row space-x-2">
                    <TouchableOpacity className="flex-1 bg-purple-600 py-3 rounded-xl flex-row items-center justify-center">
                        <CheckCircle size={16} color="white" />
                        <Text className="text-white font-bold ml-2">Submit Answer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-gray-100 px-4 py-3 rounded-xl">
                        <XCircle size={18} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            </View>
        ) : (
            <View className="bg-green-50 p-3 rounded-xl border border-green-100">
                <View className="flex-row items-center mb-1">
                    <CheckCircle size={14} color="#059669" />
                    <Text className="text-green-700 font-bold text-xs ml-1">Answered</Text>
                </View>
                <Text className="text-green-800 text-sm">Contact the district office for material requests.</Text>
            </View>
        )}
    </View>
);

export default function QuestionsPage() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#8B5CF6', '#7C3AED']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">Ask Leader</Text>
                        <Text className="text-purple-100 text-sm mt-1">Answer member questions</Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="px-4">
                <View className="flex-row mb-6 space-x-3">
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-2xl font-bold text-gray-900">12</Text>
                        <Text className="text-gray-500 text-sm">Pending</Text>
                    </View>
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-2xl font-bold text-green-600">145</Text>
                        <Text className="text-gray-500 text-sm">Answered</Text>
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Recent Questions</Text>
                    {QUESTIONS.map(question => (
                        <QuestionCard key={question.id} question={question} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
