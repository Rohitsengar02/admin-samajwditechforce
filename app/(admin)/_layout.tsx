import { Tabs, Slot } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sidebar from '../../components/Sidebar';

export default function AdminLayout() {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        AsyncStorage.getItem('adminRole').then(setRole);
    }, []);

    const isMaster = role === 'master-admin';

    if (Platform.OS === 'web') {
        return (
            <View style={{ flexDirection: 'row', height: '100%' }}>
                <Sidebar />
                <View style={{ flex: 1 }}>
                    <Slot />
                </View>
            </View>
        );
    }

    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#E30512' }}>
            {/* Master Admin Tabs */}
            <Tabs.Screen
                name="master-dashboard"
                options={{
                    title: 'Master',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="shield-crown" size={24} color={color} />,
                    href: isMaster ? '/(admin)/master-dashboard' : null,
                }}
            />
            <Tabs.Screen
                name="approvals"
                options={{
                    title: 'Approvals',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-check" size={24} color={color} />,
                    href: isMaster ? '/(admin)/approvals' : null,
                }}
            />

            {/* Common Admin Tabs */}
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="view-dashboard" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="members"
                options={{
                    title: 'Members',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-group" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="tasks"
                options={{
                    title: 'Tasks',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="clipboard-check" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="news"
                options={{
                    title: 'News',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="newspaper" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cog" size={24} color={color} />,
                }}
            />

            {/* Hidden Routes */}
            <Tabs.Screen name="communication" options={{ href: null }} />
            <Tabs.Screen name="digital-id" options={{ href: null }} />
            <Tabs.Screen name="districts" options={{ href: null }} />
            <Tabs.Screen name="election" options={{ href: null }} />
            <Tabs.Screen name="onboarding" options={{ href: null }} />
            <Tabs.Screen name="resources" options={{ href: null }} />
            <Tabs.Screen name="training" options={{ href: null }} />
            <Tabs.Screen name="verifications" options={{ href: null }} />
            <Tabs.Screen name="posters" options={{ href: null }} />
        </Tabs>
    );
}
