import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('adminToken');
            const role = await AsyncStorage.getItem('adminRole');

            if (token) {
                if (role === 'master-admin') {
                    router.replace('/(admin)/master-dashboard');
                } else if (role === 'admin') {
                    router.replace('/(admin)/dashboard');
                } else {
                    router.replace('/login');
                }
            } else {
                router.replace('/login');
            }
        };

        checkAuth();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#E30512" />
        </View>
    );
}
