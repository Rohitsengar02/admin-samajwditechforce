import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Image, Alert } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Map,
    BookOpen,
    CheckSquare,
    FileText,
    MessageSquare,
    Settings,
    Shield,
    LogOut,
    Vote,
    Newspaper,
    Image as ImageIcon,
    LucideIcon,
    Smartphone,
    UserCheck,
    Film,
    Home,
    BellRing,
    Inbox,
    Calendar,
    TrendingUp
} from 'lucide-react-native';

interface MenuItem {
    name: string;
    icon: LucideIcon;
    path: string;
    gradient: [string, string];
    iconColor: string;
}

const MENU_ITEMS: MenuItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/(admin)/dashboard', gradient: ['#4F46E5', '#4338ca'], iconColor: '#4F46E5' },
    { name: 'All Users', icon: Users, path: '/(admin)/users', gradient: ['#4F46E5', '#4338ca'], iconColor: '#4F46E5' },
    { name: 'Leaderboard', icon: TrendingUp, path: '/(admin)/leaderboard', gradient: ['#f59e0b', '#d97706'], iconColor: '#f59e0b' },
    { name: 'Home Builder', icon: Home, path: '/(admin)/home-setup', gradient: ['#E11D48', '#BE123C'], iconColor: '#E11D48' },
    { name: 'Members', icon: Users, path: '/(admin)/members', gradient: ['#EC4899', '#DB2777'], iconColor: '#EC4899' },
    { name: 'Digital IDs', icon: CreditCard, path: '/(admin)/digital-id', gradient: ['#8B5CF6', '#7C3AED'], iconColor: '#8B5CF6' },
    { name: 'Districts', icon: Map, path: '/(admin)/districts', gradient: ['#F59E0B', '#D97706'], iconColor: '#F59E0B' },
    { name: 'Training', icon: BookOpen, path: '/(admin)/training', gradient: ['#10B981', '#059669'], iconColor: '#10B981' },
    { name: 'Member Approvals', icon: Shield, path: '/(admin)/verifications', gradient: ['#059669', '#047857'], iconColor: '#059669' },
    { name: 'News', icon: Newspaper, path: '/(admin)/news', gradient: ['#0ea5e9', '#0284c7'], iconColor: '#0ea5e9' },
    { name: 'Events', icon: Calendar, path: '/(admin)/events', gradient: ['#14b8a6', '#0d9488'], iconColor: '#14b8a6' },
    { name: 'Notifications', icon: BellRing, path: '/(admin)/notifications', gradient: ['#8b5cf6', '#7c3aed'], iconColor: '#8b5cf6' },
    { name: 'Onboarding', icon: Smartphone, path: '/(admin)/onboarding', gradient: ['#8b5cf6', '#7c3aed'], iconColor: '#8b5cf6' },
    { name: 'Posters', icon: ImageIcon, path: '/posters', gradient: ['#F97316', '#EA580C'], iconColor: '#F97316' },
    { name: 'Reels', icon: Film, path: '/(admin)/reels', gradient: ['#E11D48', '#BE123C'], iconColor: '#E11D48' },
    { name: 'Daily Tasks', icon: CheckSquare, path: '/(admin)/tasks', gradient: ['#6366f1', '#8b5cf6'], iconColor: '#6366f1' },
    { name: 'Resources', icon: FileText, path: '/(admin)/resources', gradient: ['#EC4899', '#DB2777'], iconColor: '#EC4899' },
    { name: 'Communication', icon: MessageSquare, path: '/(admin)/communication', gradient: ['#10b981', '#059669'], iconColor: '#10b981' },
    { name: 'Election Mode', icon: Vote, path: '/(admin)/election', gradient: ['#EF4444', '#DC2626'], iconColor: '#EF4444' },
    { name: 'Feedback', icon: Inbox, path: '/(admin)/feedback', gradient: ['#8B5CF6', '#7C3AED'], iconColor: '#8B5CF6' },
    { name: 'Settings', icon: Settings, path: '/(admin)/settings', gradient: ['#64748B', '#475569'], iconColor: '#64748B' },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);

    useEffect(() => {
        const fetchRole = async () => {
            const storedRole = await AsyncStorage.getItem('adminRole');
            setRole(storedRole);

            if (storedRole === 'master-admin') {
                setMenuItems([
                    { name: 'Master', icon: Shield, path: '/(admin)/master-dashboard', gradient: ['#000000', '#434343'], iconColor: '#000000' },
                    { name: 'Approvals', icon: UserCheck, path: '/(admin)/approvals', gradient: ['#E30512', '#FF4D4D'], iconColor: '#E30512' },
                    ...MENU_ITEMS
                ]);
            }
        };
        fetchRole();
    }, []);

    const handleLogout = async () => {
        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to logout?')) {
                await AsyncStorage.clear();
                router.replace('/login');
            }
        } else {
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
        }
    };

    return (
        <View className={`bg-white h-full border-r border-gray-100 flex-col shadow-xl ${Platform.OS === 'web' ? 'w-72' : (isOpen ? 'absolute z-50 w-72' : 'hidden')}`}>
            {/* Header */}
            <View className="p-8 pb-6 items-center border-b border-gray-50">
                <View className="w-16 h-16 bg-red-50 rounded-2xl items-center justify-center mb-3 shadow-sm">
                    <Text className="text-3xl">🚩</Text>
                </View>
                <Text className="text-xl font-bold text-gray-900">Samajwadi</Text>
                <Text className="text-sm font-medium text-red-500 tracking-widest uppercase">Tech Force</Text>
            </View>

            <ScrollView className="flex-1 py-6 px-4" showsVerticalScrollIndicator={false}>
                <Text className="text-xs font-bold text-gray-400 mb-4 px-2 uppercase tracking-wider">Main Menu</Text>
                {menuItems.map((item) => {
                    const isActive = pathname.includes(item.path);

                    if (isActive) {
                        return (
                            <TouchableOpacity
                                key={item.name}
                                onPress={() => {
                                    router.push(item.path as any);
                                    if (Platform.OS !== 'web' && onClose) onClose();
                                }}
                                className="mb-2 shadow-md shadow-gray-200"
                            >
                                <LinearGradient
                                    colors={item.gradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="flex-row items-center px-4 py-3.5 rounded-xl"
                                >
                                    <item.icon size={22} color="white" />
                                    <Text className="ml-3 font-bold text-white text-[15px]">
                                        {item.name}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        );
                    }

                    return (
                        <TouchableOpacity
                            key={item.name}
                            onPress={() => {
                                router.push(item.path as any);
                                if (Platform.OS !== 'web' && onClose) onClose();
                            }}
                            className="flex-row items-center px-4 py-3.5 mb-2 rounded-xl hover:bg-gray-50 active:bg-gray-100"
                        >
                            <item.icon size={22} color={item.iconColor} style={{ opacity: 0.7 }} />
                            <Text className="ml-3 font-medium text-gray-600 text-[15px]">
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Footer */}
            <View className="p-4 border-t border-gray-100 bg-gray-50/50">
                <TouchableOpacity
                    className="flex-row items-center px-4 py-3.5 rounded-xl bg-red-50 border border-red-100"
                    onPress={handleLogout}
                >
                    <LogOut size={20} color="#EF4444" />
                    <Text className="ml-3 font-bold text-red-600">Logout</Text>
                </TouchableOpacity>
                <Text className="text-center text-gray-400 text-[10px] mt-4 font-medium">
                    v1.0.0 • Samajwadi Tech Force
                </Text>
            </View>
        </View>
    );
}
