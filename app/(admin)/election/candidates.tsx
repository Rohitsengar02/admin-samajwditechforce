import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, UserCheck, MapPin, Phone, Mail, Award } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const CANDIDATES = [
    {
        id: 1,
        name: 'Akhilesh Yadav',
        photo: 'https://avatar.iran.liara.run/public/15',
        constituency: 'Karhal',
        party: 'Samajwadi Party',
        status: 'Confirmed',
        age: 50,
        education: 'Masters in Environmental Engineering'
    },
    {
        id: 2,
        name: 'Dimple Yadav',
        photo: 'https://avatar.iran.liara.run/public/45',
        constituency: 'Mainpuri',
        party: 'Samajwadi Party',
        status: 'Confirmed',
        age: 46,
        education: 'B.Com'
    },
];

const CandidateCard = ({ candidate }: any) => (
    <View className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 mb-4">
        <View className="flex-row items-start mb-4">
            <Image source={{ uri: candidate.photo }} className="w-20 h-20 rounded-2xl mr-4" />
            <View className="flex-1">
                <Text className="text-gray-900 font-bold text-xl mb-1">{candidate.name}</Text>
                <Text className="text-red-600 font-semibold mb-2">{candidate.party}</Text>
                <View className="flex-row items-center bg-gray-50 self-start px-3 py-1 rounded-lg">
                    <MapPin size={14} color="#6B7280" />
                    <Text className="text-gray-600 text-xs ml-1 font-medium">{candidate.constituency}</Text>
                </View>
            </View>
        </View>

        <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <View className="flex-row justify-between mb-2">
                <Text className="text-gray-500 text-sm">Age</Text>
                <Text className="text-gray-900 font-semibold">{candidate.age} Years</Text>
            </View>
            <View className="flex-row justify-between">
                <Text className="text-gray-500 text-sm">Education</Text>
                <Text className="text-gray-900 font-semibold text-right flex-1 ml-4">{candidate.education}</Text>
            </View>
        </View>

        <View className="flex-row space-x-3">
            <TouchableOpacity className="flex-1 bg-red-600 py-3 rounded-xl flex-row items-center justify-center">
                <UserCheck size={16} color="white" />
                <Text className="text-white font-bold ml-2">View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-red-50 px-4 py-3 rounded-xl">
                <Phone size={18} color="#DC2626" />
            </TouchableOpacity>
        </View>
    </View>
);

export default function CandidatesPage() {
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
                        <Text className="text-white text-3xl font-bold">Candidates</Text>
                        <Text className="text-purple-100 text-sm mt-1">Election representatives</Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="px-4">
                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Candidate List</Text>
                    {CANDIDATES.map(candidate => (
                        <CandidateCard key={candidate.id} candidate={candidate} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
