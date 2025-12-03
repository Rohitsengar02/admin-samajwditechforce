import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const LanguageOption = ({ title, subtitle, value, selected, onSelect }: any) => (
    <TouchableOpacity
        onPress={() => onSelect(value)}
        className={`flex-row items-center justify-between p-5 rounded-2xl mb-3 border ${selected ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-100'}`}
    >
        <View>
            <Text className={`font-bold text-lg ${selected ? 'text-blue-900' : 'text-gray-700'}`}>{title}</Text>
            <Text className="text-gray-500 text-sm">{subtitle}</Text>
        </View>
        {selected && <CheckCircle size={24} color="#3B82F6" />}
    </TouchableOpacity>
);

export default function LanguagePage() {
    const router = useRouter();
    const [language, setLanguage] = useState('en');

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#3B82F6', '#2563EB']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">Language</Text>
                        <Text className="text-blue-100 text-sm mt-1">Select app language</Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="px-4">
                <LanguageOption
                    title="English"
                    subtitle="Default"
                    value="en"
                    selected={language === 'en'}
                    onSelect={setLanguage}
                />
                <LanguageOption
                    title="Hindi"
                    subtitle="हिंदी"
                    value="hi"
                    selected={language === 'hi'}
                    onSelect={setLanguage}
                />
            </View>
        </ScrollView>
    );
}
