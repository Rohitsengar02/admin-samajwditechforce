import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, View, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sidebar from '../../components/Sidebar';
import BottomTab from '../../components/BottomTab';

export default function AdminLayout() {
    const [role, setRole] = useState<string | null>(null);
    const { width } = useWindowDimensions();

    useEffect(() => {
        AsyncStorage.getItem('adminRole').then(setRole);
    }, []);

    const isMaster = role === 'master-admin';
    const isDesktop = Platform.OS === 'web' && width >= 768;

    // Desktop: Show Sidebar
    if (isDesktop) {
        return (
            <View style={{ flexDirection: 'row', height: '100%' }}>
                <Sidebar />
                <View style={{ flex: 1 }}>
                    <Slot />
                </View>
            </View>
        );
    }

    // Mobile: Show content with BottomTab
    return (
        <View style={{ flex: 1 }}>
            <Slot />
            <BottomTab />
        </View>
    );
}
