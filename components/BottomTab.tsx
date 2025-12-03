import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal, ScrollView, Dimensions, Animated, Easing } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
    LayoutDashboard,
    Users,
    Map,
    CheckSquare,
    Plus,
    X,
    CreditCard,
    BookOpen,
    FileText,
    MessageSquare,
    ImageIcon,
    Vote,
    Settings,
    Newspaper,
    LucideIcon
} from 'lucide-react-native';

const screenHeight = Dimensions.get('window').height;

interface BottomTabProps {
    onMenuPress?: () => void;
}

interface MenuItem {
    name: string;
    icon: LucideIcon;
    path: string;
    gradient: [string, string];
}

const ALL_MENU_ITEMS: MenuItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/(admin)/dashboard', gradient: ['#4F46E5', '#4338ca'] },
    { name: 'Members', icon: Users, path: '/(admin)/members', gradient: ['#EC4899', '#DB2777'] },
    { name: 'Digital IDs', icon: CreditCard, path: '/(admin)/digital-id', gradient: ['#8B5CF6', '#7C3AED'] },
    { name: 'Districts', icon: Map, path: '/(admin)/districts', gradient: ['#F59E0B', '#D97706'] },
    { name: 'Training', icon: BookOpen, path: '/(admin)/training', gradient: ['#10B981', '#059669'] },
    { name: 'Posters', icon: ImageIcon, path: '/posters', gradient: ['#F97316', '#EA580C'] },
    { name: 'News', icon: Newspaper, path: '/(admin)/news', gradient: ['#0ea5e9', '#0284c7'] },
    { name: 'Tasks', icon: CheckSquare, path: '/(admin)/tasks', gradient: ['#6366f1', '#8b5cf6'] },
    { name: 'Resources', icon: FileText, path: '/(admin)/resources', gradient: ['#EC4899', '#DB2777'] },
    { name: 'Communication', icon: MessageSquare, path: '/(admin)/communication', gradient: ['#10b981', '#059669'] },
    { name: 'Election', icon: Vote, path: '/(admin)/election', gradient: ['#EF4444', '#DC2626'] },
    { name: 'Settings', icon: Settings, path: '/(admin)/settings', gradient: ['#64748B', '#475569'] },
];

const TabItem = ({ item, isActive, onPress }: { item: any, isActive: boolean, onPress: () => void }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const translateYAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isActive) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1.1,
                    useNativeDriver: true,
                    friction: 5,
                }),
                Animated.spring(translateYAnim, {
                    toValue: -5,
                    useNativeDriver: true,
                    friction: 5,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    friction: 5,
                }),
                Animated.spring(translateYAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    friction: 5,
                })
            ]).start();
        }
    }, [isActive]);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="items-center justify-center w-16"
        >
            <Animated.View style={{ transform: [{ scale: scaleAnim }, { translateY: translateYAnim }] }}>
                {isActive ? (
                    <LinearGradient
                        colors={['#4F46E5', '#4338ca']}
                        className="p-2.5 rounded-2xl shadow-lg shadow-indigo-500/40"
                    >
                        <item.icon size={22} color="white" />
                    </LinearGradient>
                ) : (
                    <View className="p-2.5">
                        <item.icon size={24} color="#9CA3AF" />
                    </View>
                )}
            </Animated.View>
            {isActive && (
                <Animated.Text
                    style={{ opacity: scaleAnim }}
                    className="text-[10px] mt-1 font-bold text-indigo-600"
                >
                    {item.name}
                </Animated.Text>
            )}
        </TouchableOpacity>
    );
};

export default function BottomTab({ onMenuPress }: BottomTabProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuAnim = useRef(new Animated.Value(0)).current;

    const TABS = [
        { name: 'Home', icon: LayoutDashboard, path: '/(admin)/dashboard' },
        { name: 'Members', icon: Users, path: '/(admin)/members' },
        { name: 'Posters', icon: ImageIcon, path: '/posters' },
        { name: 'Tasks', icon: CheckSquare, path: '/(admin)/tasks' },
        { name: 'Districts', icon: Map, path: '/(admin)/districts' },
    ];

    useEffect(() => {
        if (isMenuOpen) {
            Animated.spring(menuAnim, {
                toValue: 1,
                useNativeDriver: true,
                damping: 20,
                stiffness: 90
            }).start();
        } else {
            Animated.timing(menuAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start();
        }
    }, [isMenuOpen]);

    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth >= 768) {
        return null;
    }

    const handleNavigation = (path: string) => {
        setIsMenuOpen(false);
        router.push(path as any);
    };

    const menuTranslateY = menuAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [screenHeight, 0]
    });

    return (
        <>
            <View className="absolute bottom-0 w-full z-40">
                {/* Glassmorphism Background */}
                <View className="absolute bottom-0 w-full h-24 bg-white/90 shadow-2xl border-t border-gray-100 rounded-t-[30px]" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 10 }} />

                {/* Floating Action Button Container */}
                <View className="absolute -top-8 left-1/2 -ml-9 z-50">
                    <TouchableOpacity
                        onPress={() => setIsMenuOpen(true)}
                        activeOpacity={0.9}
                    >
                        <View className="p-1.5 bg-gray-50 rounded-full shadow-sm">
                            <LinearGradient
                                colors={['#EF4444', '#DC2626']}
                                className="w-16 h-16 rounded-full items-center justify-center shadow-lg shadow-red-500/50"
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Plus size={32} color="white" />
                            </LinearGradient>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Tab Items */}
                <View className="flex-row justify-between items-end px-4 pb-4 h-24">
                    {/* Left Tabs */}
                    <View className="flex-row flex-1 justify-around pb-2">
                        {TABS.slice(0, 2).map((tab) => (
                            <TabItem
                                key={tab.name}
                                item={tab}
                                isActive={pathname.includes(tab.path)}
                                onPress={() => router.push(tab.path as any)}
                            />
                        ))}
                    </View>

                    {/* Spacer for FAB */}
                    <View className="w-20" />

                    {/* Right Tabs */}
                    <View className="flex-row flex-1 justify-around pb-2">
                        {TABS.slice(2).map((tab) => (
                            <TabItem
                                key={tab.name}
                                item={tab}
                                isActive={pathname.includes(tab.path)}
                                onPress={() => router.push(tab.path as any)}
                            />
                        ))}
                    </View>
                </View>
            </View>

            {/* Full Screen Menu Modal */}
            <Modal
                visible={isMenuOpen}
                transparent={true}
                animationType="none"
                onRequestClose={() => setIsMenuOpen(false)}
            >
                <View className="flex-1 bg-black/60 justify-end">
                    <TouchableOpacity
                        className="flex-1"
                        onPress={() => setIsMenuOpen(false)}
                    />
                    <Animated.View
                        style={{ transform: [{ translateY: menuTranslateY }] }}
                        className="bg-gray-50 rounded-t-[40px] overflow-hidden max-h-[85%]"
                    >
                        <View className="items-center pt-4 pb-2">
                            <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
                        </View>

                        <View className="px-6 pb-6 flex-row justify-between items-center">
                            <View>
                                <Text className="text-2xl font-bold text-gray-900">Menu</Text>
                                <Text className="text-gray-500 text-sm">Quick access to all modules</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setIsMenuOpen(false)}
                                className="bg-gray-200 p-2.5 rounded-full"
                            >
                                <X size={20} color="#4B5563" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="px-4 pb-8" showsVerticalScrollIndicator={false}>
                            <View className="flex-row flex-wrap justify-between">
                                {ALL_MENU_ITEMS.map((item, index) => (
                                    <TouchableOpacity
                                        key={item.name}
                                        onPress={() => handleNavigation(item.path)}
                                        className="w-[48%] mb-4"
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={item.gradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            className="p-5 rounded-3xl h-36 justify-between shadow-lg"
                                            style={{ shadowColor: item.gradient[0], shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                        >
                                            <View className="bg-white/25 w-12 h-12 rounded-2xl items-center justify-center backdrop-blur-sm">
                                                <item.icon size={24} color="white" />
                                            </View>
                                            <View>
                                                <Text className="text-white font-bold text-lg">{item.name}</Text>
                                                <Text className="text-white/70 text-xs font-medium mt-1">Tap to open</Text>
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View className="h-8" />
                        </ScrollView>
                    </Animated.View>
                </View>
            </Modal>
        </>
    );
}
