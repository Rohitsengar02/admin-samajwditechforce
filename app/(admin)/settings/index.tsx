import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Settings, Moon, Globe, Shield, Key, Mail, Users,
    ChevronRight, LogOut, Smartphone
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const SettingItem = ({ icon: Icon, title, subtitle, color, onPress }: any) => (
    <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100"
    >
        <View className={`p-3 rounded-xl mr-4 ${color}`}>
            <Icon size={24} color="white" />
        </View>
        <View className="flex-1">
            <Text className="text-gray-900 font-bold text-base">{title}</Text>
            <Text className="text-gray-500 text-xs">{subtitle}</Text>
        </View>
        <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
);

export default function SettingsPage() {
    const router = useRouter();

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.clear();
                        router.replace('/login');
                    },
                },
            ]
        );
    };

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#64748B', '#475569']} className="pt-8 pb-12 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={80} left={20} />
                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold mb-2">Settings</Text>
                            <Text className="text-slate-200 text-sm">App configuration & preferences</Text>
                        </View>
                        <View className="bg-white/20 p-3 rounded-2xl">
                            <Settings size={24} color="white" />
                        </View>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-4 pb-8">
                <Text className="text-gray-500 font-bold text-sm mb-3 ml-2 uppercase tracking-wider">General</Text>
                <SettingItem
                    icon={Smartphone}
                    title="App Settings"
                    subtitle="General configuration"
                    color="bg-slate-600"
                    onPress={() => router.push('/(admin)/settings/app-settings' as any)}
                />
                <SettingItem
                    icon={Moon}
                    title="Theme Management"
                    subtitle="Dark mode & colors"
                    color="bg-indigo-600"
                    onPress={() => router.push('/(admin)/settings/theme' as any)}
                />
                <SettingItem
                    icon={Globe}
                    title="Language"
                    subtitle="Hindi / English"
                    color="bg-blue-600"
                    onPress={() => router.push('/(admin)/settings/language' as any)}
                />

                <Text className="text-gray-500 font-bold text-sm mb-3 ml-2 mt-4 uppercase tracking-wider">Integrations</Text>
                <SettingItem
                    icon={Mail}
                    title="SMTP Settings"
                    subtitle="Email configuration"
                    color="bg-emerald-600"
                    onPress={() => router.push('/(admin)/settings/smtp' as any)}
                />
                <SettingItem
                    icon={Key}
                    title="API Keys"
                    subtitle="Maps & Notifications"
                    color="bg-amber-600"
                    onPress={() => router.push('/(admin)/settings/api-keys' as any)}
                />

                <Text className="text-gray-500 font-bold text-sm mb-3 ml-2 mt-4 uppercase tracking-wider">Security</Text>
                <SettingItem
                    icon={Users}
                    title="Roles & Permissions"
                    subtitle="Admin access control"
                    color="bg-purple-600"
                    onPress={() => router.push('/(admin)/settings/roles' as any)}
                />

                <TouchableOpacity
                    onPress={handleLogout}
                    className="mt-6 bg-red-50 p-4 rounded-2xl flex-row items-center justify-center border border-red-100"
                >
                    <LogOut size={20} color="#EF4444" />
                    <Text className="text-red-600 font-bold ml-2">Log Out</Text>
                </TouchableOpacity>

                <Text className="text-center text-gray-400 text-xs mt-4">Version 1.0.0 (Build 2024.1)</Text>
            </View>
        </ScrollView>
    );
}
