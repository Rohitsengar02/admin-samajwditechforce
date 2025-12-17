import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal, ScrollView, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    UserCheck,
    BellRing,
    Inbox,
    Calendar,
    LucideIcon
} from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface BottomTabProps {
    onMenuPress?: () => void;
}

interface MenuItem {
    name: string;
    icon: LucideIcon;
    path: string;
    gradient: [string, string];
}

// Fixed bottom tabs (2 left + FAB + 2 right = 5 total)
const BOTTOM_TABS: MenuItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/(admin)/dashboard', gradient: ['#4F46E5', '#4338ca'] },
    { name: 'Members', icon: Users, path: '/(admin)/members', gradient: ['#EC4899', '#DB2777'] },
    // FAB in middle
    { name: 'Districts', icon: Map, path: '/(admin)/districts', gradient: ['#F59E0B', '#D97706'] },
    { name: 'Tasks', icon: CheckSquare, path: '/(admin)/tasks', gradient: ['#6366f1', '#8b5cf6'] },
];

// Carousel items (remaining menu items)
const CAROUSEL_ITEMS: MenuItem[] = [
    { name: 'All Users', icon: Users, path: '/(admin)/users', gradient: ['#4F46E5', '#4338ca'] },
    { name: 'Notifications', icon: BellRing, path: '/(admin)/notifications', gradient: ['#8b5cf6', '#7c3aed'] },
    { name: 'Approvals', icon: UserCheck, path: '/(admin)/approvals', gradient: ['#10B981', '#059669'] },
    { name: 'Verifications', icon: CheckSquare, path: '/(admin)/verifications', gradient: ['#0EA5E9', '#0284C7'] },
    { name: 'Digital IDs', icon: CreditCard, path: '/(admin)/digital-id', gradient: ['#8B5CF6', '#7C3AED'] },
    { name: 'Training', icon: BookOpen, path: '/(admin)/training', gradient: ['#10B981', '#059669'] },
    { name: 'Posters', icon: ImageIcon, path: '/(admin)/posters', gradient: ['#F97316', '#EA580C'] },
    { name: 'News', icon: Newspaper, path: '/(admin)/news', gradient: ['#0ea5e9', '#0284c7'] },
    { name: 'Events', icon: Calendar, path: '/(admin)/events', gradient: ['#14b8a6', '#0d9488'] },
    { name: 'Resources', icon: FileText, path: '/(admin)/resources', gradient: ['#EC4899', '#DB2777'] },
    { name: 'Communication', icon: MessageSquare, path: '/(admin)/communication', gradient: ['#10b981', '#059669'] },
    { name: 'Election', icon: Vote, path: '/(admin)/election', gradient: ['#EF4444', '#DC2626'] },
    { name: 'Feedback', icon: Inbox, path: '/(admin)/feedback', gradient: ['#8B5CF6', '#7C3AED'] },
    { name: 'Settings', icon: Settings, path: '/(admin)/settings', gradient: ['#64748B', '#475569'] },
];

const TabItem = ({ item, isActive, onPress }: { item: MenuItem, isActive: boolean, onPress: () => void }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: isActive ? 1.1 : 1,
            useNativeDriver: true,
            friction: 5,
        }).start();
    }, [isActive]);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={{ alignItems: 'center', justifyContent: 'center', width: 64 }}
        >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                {isActive ? (
                    <LinearGradient
                        colors={item.gradient}
                        style={{ padding: 10, borderRadius: 16, shadowColor: item.gradient[0], shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }}
                    >
                        <item.icon size={22} color="white" />
                    </LinearGradient>
                ) : (
                    <View style={{ padding: 10 }}>
                        <item.icon size={24} color="#9CA3AF" />
                    </View>
                )}
            </Animated.View>
            {isActive && (
                <Text style={{ fontSize: 10, marginTop: 4, fontWeight: 'bold', color: item.gradient[0] }}>
                    {item.name}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const CarouselItem = ({ item, onPress }: { item: MenuItem, onPress: () => void }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={{ alignItems: 'center', marginHorizontal: 12 }}
        >
            <LinearGradient
                colors={item.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: item.gradient[0],
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 10,
                    elevation: 8
                }}
            >
                <item.icon size={32} color="white" />
            </LinearGradient>
            <Text style={{ fontSize: 12, marginTop: 8, fontWeight: '600', color: '#374151', textAlign: 'center', maxWidth: 80 }}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );
};

export default function BottomTab({ onMenuPress }: BottomTabProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const slideAnim = useRef(new Animated.Value(300)).current;

    useEffect(() => {
        if (isMenuOpen) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                damping: 20,
                stiffness: 90
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 300,
                duration: 250,
                useNativeDriver: true
            }).start();
        }
    }, [isMenuOpen]);

    // Hide on desktop
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth >= 768) {
        return null;
    }

    // Hide on builder page (mobile only)
    if (pathname.includes('/pages/builder')) {
        return null;
    }

    const handleNavigation = (path: string) => {
        setIsMenuOpen(false);
        router.push(path as any);
    };

    return (
        <>
            <SafeAreaView
                edges={['bottom']}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    zIndex: 40,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                }}
            >
                {/* Glassmorphism Background */}
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height: Platform.OS === 'web' ? 100 : 90,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 15,
                    elevation: 10,
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(229, 231, 235, 0.5)'
                }} />

                {/* Floating Action Button */}
                <View style={{ position: 'absolute', top: -28, left: '50%', marginLeft: -28, zIndex: 50 }}>
                    <TouchableOpacity
                        onPress={() => setIsMenuOpen(true)}
                        activeOpacity={0.9}
                    >
                        <View style={{ padding: 4, backgroundColor: '#F9FAFB', borderRadius: 100, shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }}>
                            <LinearGradient
                                colors={['#EF4444', '#DC2626']}
                                style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Plus size={28} color="white" strokeWidth={3} />
                            </LinearGradient>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Tab Items */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    paddingHorizontal: 16,
                    paddingTop: 8,
                    paddingBottom: Platform.OS === 'web' ? 20 : 16,
                    height: Platform.OS === 'web' ? 100 : 50
                }}>
                    {/* Left 2 Tabs */}
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around', paddingBottom: 8 }}>
                        {BOTTOM_TABS.slice(0, 2).map((tab) => (
                            <TabItem
                                key={tab.name}
                                item={tab}
                                isActive={pathname.includes(tab.path)}
                                onPress={() => router.push(tab.path as any)}
                            />
                        ))}
                    </View>

                    {/* Spacer for FAB */}
                    <View style={{ width: 80 }} />

                    {/* Right 2 Tabs */}
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around', paddingBottom: 8 }}>
                        {BOTTOM_TABS.slice(2).map((tab) => (
                            <TabItem
                                key={tab.name}
                                item={tab}
                                isActive={pathname.includes(tab.path)}
                                onPress={() => router.push(tab.path as any)}
                            />
                        ))}
                    </View>
                </View>
            </SafeAreaView>

            {/* Bottom Sheet Modal with Horizontal Carousel */}
            <Modal
                visible={isMenuOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsMenuOpen(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setIsMenuOpen(false)}
                    />
                    <Animated.View
                        style={{
                            transform: [{ translateY: slideAnim }],
                            backgroundColor: '#F9FAFB',
                            borderTopLeftRadius: 32,
                            borderTopRightRadius: 32,
                            paddingBottom: 32,
                            maxHeight: 280
                        }}
                    >
                        {/* Handle Bar */}
                        <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
                            <View style={{ width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2 }} />
                        </View>

                        {/* Header */}
                        <View style={{ paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>Quick Access</Text>
                                <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>Tap to navigate</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setIsMenuOpen(false)}
                                style={{ backgroundColor: '#E5E7EB', padding: 8, borderRadius: 20 }}
                            >
                                <X size={20} color="#4B5563" />
                            </TouchableOpacity>
                        </View>

                        {/* Horizontal Carousel */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 8 }}
                            style={{ flexGrow: 0 }}
                        >
                            {CAROUSEL_ITEMS.map((item) => (
                                <CarouselItem
                                    key={item.name}
                                    item={item}
                                    onPress={() => handleNavigation(item.path)}
                                />
                            ))}
                        </ScrollView>
                    </Animated.View>
                </View>
            </Modal>
        </>
    );
}
