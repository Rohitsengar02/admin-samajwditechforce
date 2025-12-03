import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText, CheckCircle, Clock, AlertTriangle, Download } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const REPORTS = [
    {
        id: 1,
        booth: '101',
        location: 'Primary School, Lucknow',
        status: 'Submitted',
        time: '10:30 AM',
        issues: 0,
        voterTurnout: '45%'
    },
    {
        id: 2,
        booth: '102',
        location: 'Community Center, Gomti Nagar',
        status: 'Flagged',
        time: '11:15 AM',
        issues: 2,
        voterTurnout: '38%'
    },
    {
        id: 3,
        booth: '103',
        location: 'Inter College, Alambagh',
        status: 'Submitted',
        time: '09:45 AM',
        issues: 0,
        voterTurnout: '52%'
    },
];

const ReportCard = ({ report }: any) => (
    <View className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 mb-4">
        <View className="flex-row justify-between items-start mb-3">
            <View>
                <Text className="text-gray-900 font-bold text-lg">Booth #{report.booth}</Text>
                <Text className="text-gray-500 text-xs">{report.location}</Text>
            </View>
            <View className={`px-3 py-1 rounded-full ${report.status === 'Flagged' ? 'bg-red-100' : 'bg-green-100'}`}>
                <Text className={`text-xs font-bold ${report.status === 'Flagged' ? 'text-red-700' : 'text-green-700'}`}>
                    {report.status}
                </Text>
            </View>
        </View>

        <View className="flex-row space-x-4 mb-4">
            <View className="flex-1 bg-gray-50 p-3 rounded-xl">
                <Text className="text-gray-500 text-xs mb-1">Turnout</Text>
                <Text className="text-gray-900 font-bold text-lg">{report.voterTurnout}</Text>
            </View>
            <View className="flex-1 bg-gray-50 p-3 rounded-xl">
                <Text className="text-gray-500 text-xs mb-1">Issues</Text>
                <Text className={`font-bold text-lg ${report.issues > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {report.issues} Reported
                </Text>
            </View>
        </View>

        <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
            <View className="flex-row items-center">
                <Clock size={14} color="#9CA3AF" />
                <Text className="text-gray-500 text-xs ml-1">Submitted at {report.time}</Text>
            </View>
            <TouchableOpacity className="flex-row items-center bg-indigo-50 px-3 py-2 rounded-lg">
                <FileText size={14} color="#4F46E5" />
                <Text className="text-indigo-600 font-bold text-xs ml-2">View Report</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default function ReportsPage() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#10B981', '#059669']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">Daily Reports</Text>
                        <Text className="text-emerald-100 text-sm mt-1">Booth performance tracking</Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="px-4">
                <View className="flex-row mb-6 space-x-3">
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-2xl font-bold text-gray-900">85%</Text>
                        <Text className="text-gray-500 text-sm">Submitted</Text>
                    </View>
                    <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-2xl font-bold text-red-600">12</Text>
                        <Text className="text-gray-500 text-sm">Pending</Text>
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Today's Reports</Text>
                    {REPORTS.map(report => (
                        <ReportCard key={report.id} report={report} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
