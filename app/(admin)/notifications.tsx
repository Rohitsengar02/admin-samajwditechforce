import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Platform,
    RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getApiUrl, getSocketUrl } from '../../utils/api';

const SP_RED = '#E30512';
const SP_GREEN = '#009933';

export default function AdminNotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchNotifications();
        const cleanup = setupSocketIO();

        return () => {
            cleanup?.();
        };
    }, []);

    const setupSocketIO = () => {
        try {
            // Import and setup Socket.IO client directly
            const io = require('socket.io-client');

            const SOCKET_URL = getSocketUrl();

            console.log('Connecting to Socket.IO at:', SOCKET_URL);
            const socket = io(SOCKET_URL);

            socket.on('connect', () => {
                console.log('✅ Admin socket connected');
            });

            socket.on('admin-notification', (notification: any) => {
                console.log('📧 Admin notification received:', notification);
                setNotifications((prev) => [
                    {
                        id: notification.id,
                        title: notification.title,
                        message: notification.message,
                        type: notification.type,
                        time: 'Just now',
                        read: false,
                        userName: notification.userName,
                        taskId: notification.taskId,
                    },
                    ...prev,
                ]);
            });

            socket.on('disconnect', () => {
                console.log('❌ Admin socket disconnected');
            });

            // Cleanup on unmount
            return () => {
                socket.disconnect();
            };
        } catch (error) {
            console.error('Error setting up Socket.IO:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const apiUrl = getApiUrl();

            console.log('Fetching notifications from:', `${apiUrl}/notifications`);
            const response = await fetch(`${apiUrl}/notifications`);
            const data = await response.json();

            if (data.success) {
                const formattedNotifications = data.data
                    .filter((notif: any) =>
                        notif.type === 'task' &&
                        notif.relatedItem?.model === 'UserTask' // Only show task submissions, not task creations
                    )
                    .map((notif: any) => ({
                        id: notif._id,
                        title: notif.title,
                        message: notif.message,
                        type: notif.type,
                        time: getTimeAgo(notif.createdAt),
                        read: false,
                    }));
                setNotifications(formattedNotifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getTimeAgo = (date: string) => {
        const now = new Date();
        const past = new Date(date);
        const diff = now.getTime() - past.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return 'Just now';
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const getIconName = (type: string) => {
        return 'checkbox-marked-circle-outline' as any;
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Task Submissions</Text>
                        <Text style={styles.headerSubtitle}>
                            {notifications.filter((n) => !n.read).length} new submissions
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.headerButton}>
                        <MaterialCommunityIcons name="bell-ring" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[SP_RED]} />
                }
            >
                <View style={styles.notificationsList}>
                    {notifications.length > 0 ? (
                        notifications.map((notification, idx) => (
                            <TouchableOpacity
                                key={notification.id || idx}
                                style={styles.notificationCard}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.notificationIcon, { backgroundColor: '#dcfce7' }]}>
                                    <MaterialCommunityIcons
                                        name={getIconName(notification.type)}
                                        size={24}
                                        color={SP_GREEN}
                                    />
                                </View>

                                <View style={styles.notificationText}>
                                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                                    <Text style={styles.notificationMessage} numberOfLines={2}>
                                        {notification.message}
                                    </Text>
                                    <View style={styles.notificationFooter}>
                                        <MaterialCommunityIcons name="clock-outline" size={14} color="#94a3b8" />
                                        <Text style={styles.notificationTime}>{notification.time}</Text>
                                        {!notification.read && <View style={styles.unreadDot} />}
                                    </View>
                                </View>

                                <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="bell-off" size={64} color="#cbd5e1" />
                            <Text style={styles.emptyStateText}>No submissions yet</Text>
                            <Text style={styles.emptyStateSubtext}>
                                Task submissions will appear here
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    notificationsList: {
        gap: 12,
    },
    notificationCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    notificationIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationText: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 20,
        marginBottom: 8,
    },
    notificationFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    notificationTime: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
    },
    unreadDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: SP_RED,
        marginLeft: 8,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#64748b',
        marginTop: 16,
        marginBottom: 4,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#94a3b8',
    },
});
