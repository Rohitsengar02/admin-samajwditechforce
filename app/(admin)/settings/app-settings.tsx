import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Smartphone, Wifi, Database } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const ToggleItem = ({ icon: Icon, title, subtitle, value, onValueChange, color }: any) => (
    <View className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100">
        <View className="flex-row items-center flex-1 mr-4">
            <View className={`p-3 rounded-xl mr-4 ${color}`}>
                <Icon size={24} color="white" />
            </View>
            <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">{title}</Text>
                <Text className="text-gray-500 text-xs">{subtitle}</Text>
            </View>
        </View>
        <Switch value={value} onValueChange={onValueChange} trackColor={{ false: '#E2E8F0', true: '#475569' }} thumbColor={value ? '#ffffff' : '#f4f3f4'} />
    </View>
);

export default function AppSettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        notifications: true,
        offlineMode: false,
        autoSync: true,
        dataSaver: false,
    });

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#64748B', '#475569']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">App Settings</Text>
                        <Text className="text-slate-200 text-sm mt-1">General configuration</Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="px-4">
                <ToggleItem
                    icon={Bell}
                    title="Push Notifications"
                    subtitle="Receive alerts and updates"
                    value={settings.notifications}
                    onValueChange={(v: boolean) => setSettings({ ...settings, notifications: v })}
                    color="bg-indigo-500"
                />
                <ToggleItem
                    icon={Wifi}
                    title="Offline Mode"
                    subtitle="Enable offline data access"
                    value={settings.offlineMode}
                    onValueChange={(v: boolean) => setSettings({ ...settings, offlineMode: v })}
                    color="bg-emerald-500"
                />
                <ToggleItem
                    icon={Database}
                    title="Auto Sync"
                    subtitle="Sync data automatically"
                    value={settings.autoSync}
                    onValueChange={(v: boolean) => setSettings({ ...settings, autoSync: v })}
                    color="bg-blue-500"
                />
                <ToggleItem
                    icon={Smartphone}
                    title="Data Saver"
                    subtitle="Reduce data usage"
                    value={settings.dataSaver}
                    onValueChange={(v: boolean) => setSettings({ ...settings, dataSaver: v })}
                    color="bg-amber-500"
                />
            </View>
        </ScrollView>
    );
}
