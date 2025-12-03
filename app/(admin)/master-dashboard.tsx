import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api';

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
}

export default function MasterAdminDashboard() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAdmins = async () => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/admin/approved-admins`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setAdmins(data);
            }
        } catch (error) {
            console.error('Error fetching admins:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchAdmins();
    }, []);

    const renderItem = ({ item }: { item: AdminUser }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.role}>{item.role}</Text>
                </View>
                <MaterialCommunityIcons name="check-decagram" size={24} color="#10B981" />
            </View>
            <View style={styles.cardFooter}>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="email-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{item.email}</Text>
                </View>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="phone-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{item.phone}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Master Admin Dashboard</Text>
                <Text style={styles.subtitle}>Overview & Management</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{admins.length}</Text>
                    <Text style={styles.statLabel}>Active Admins</Text>
                </View>
                {/* Add more stats if needed */}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Approved Admins</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#E30512" />
                ) : (
                    <FlatList
                        data={admins}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E30512" />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <MaterialCommunityIcons name="account-off-outline" size={48} color="#ccc" />
                                <Text style={styles.emptyText}>No approved admins found.</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 15,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#E30512',
    },
    statLabel: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 4,
        fontWeight: '600',
    },
    section: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 15,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fee2e2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E30512',
    },
    cardContent: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    role: {
        fontSize: 12,
        color: '#64748b',
        textTransform: 'capitalize',
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 12,
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#64748b',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        marginTop: 10,
        color: '#94a3b8',
        fontSize: 16,
    },
});
