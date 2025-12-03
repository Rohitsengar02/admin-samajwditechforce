import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Moon, Sun, Monitor, CheckCircle } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const ThemeOption = ({ icon: Icon, title, value, selected, onSelect }: any) => (
    <TouchableOpacity
        onPress={() => onSelect(value)}
        className={`flex-row items-center justify-between p-5 rounded-2xl mb-3 border ${selected ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-gray-100'}`}
    >
        <View className="flex-row items-center">
            <View className={`p-3 rounded-xl mr-4 ${selected ? 'bg-indigo-500' : 'bg-gray-100'}`}>
                <Icon size={24} color={selected ? 'white' : '#64748B'} />
            </View>
            <Text className={`font-bold text-lg ${selected ? 'text-indigo-900' : 'text-gray-700'}`}>{title}</Text>
        </View>
        {selected && <CheckCircle size={24} color="#4F46E5" />}
    </TouchableOpacity>
);

export default function ThemePage() {
    const router = useRouter();
    const [theme, setTheme] = useState('system');

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#6366f1', '#4f46e5']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">Theme</Text>
                        <Text className="text-indigo-200 text-sm mt-1">Appearance settings</Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="px-4">
                <ThemeOption
                    icon={Sun}
                    title="Light Mode"
                    value="light"
                    selected={theme === 'light'}
                    onSelect={setTheme}
                />
                <ThemeOption
                    icon={Moon}
                    title="Dark Mode"
                    value="dark"
                    selected={theme === 'dark'}
                    onSelect={setTheme}
                />
                <ThemeOption
                    icon={Monitor}
                    title="System Default"
                    value="system"
                    selected={theme === 'system'}
                    onSelect={setTheme}
                />
            </View>
        </ScrollView>
    );
}
