import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { getApiUrl } from '../../utils/api';

const API_URL = getApiUrl();

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

    const deleteAdmin = async (adminId: string, adminName: string) => {
        console.log('Delete admin clicked:', adminId, adminName);

        // Use native confirm on web, Alert on mobile
        if (Platform.OS === 'web') {
            const confirmed = window.confirm(
                `Are you sure you want to delete "${adminName}"?\n\nThis action cannot be undone.`
            );

            if (!confirmed) {
                console.log('Delete cancelled');
                return;
            }
        } else {
            // Mobile - use Alert
            Alert.alert(
                '⚠️ Delete Admin',
                `Are you sure you want to delete "${adminName}"?\n\nThis action cannot be undone.`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => console.log('Delete cancelled'),
                    },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => performDelete(adminId, adminName),
                    },
                ]
            );
            return; // Alert is async, so we return here
        }

        // For web, execute immediately after confirm
        await performDelete(adminId, adminName);
    };

    const performDelete = async (adminId: string, adminName: string) => {
        try {
            console.log('Starting delete for:', adminId);
            const token = await AsyncStorage.getItem('adminToken');

            if (!token) {
                const errorMsg = 'Not authenticated';
                console.error(errorMsg);
                if (Platform.OS === 'web') {
                    alert('❌ Error: ' + errorMsg);
                } else {
                    Alert.alert('❌ Error', errorMsg);
                }
                return;
            }

            console.log('Making DELETE request to:', `${API_URL}/admin/delete/${adminId}`);

            const response = await fetch(`${API_URL}/admin/delete/${adminId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            // Check if response is ok before parsing
            if (response.ok) {
                const data = await response.json();
                console.log('Delete successful:', data);
                const successMsg = data.message || 'Admin deleted successfully';

                if (Platform.OS === 'web') {
                    alert('✅ Success: ' + successMsg);
                } else {
                    Alert.alert('✅ Success', successMsg);
                }

                fetchAdmins(); // Refresh the list
            } else {
                // Try to parse error message
                try {
                    const errorData = await response.json();
                    console.error('Delete failed:', errorData);
                    const errorMsg = errorData.message || 'Failed to delete admin';

                    if (Platform.OS === 'web') {
                        alert('❌ Error: ' + errorMsg);
                    } else {
                        Alert.alert('❌ Error', errorMsg);
                    }
                } catch (parseError) {
                    // If JSON parsing fails, show status
                    console.error('Parse error:', parseError);
                    const errorMsg = `Failed to delete admin (Status: ${response.status})`;

                    if (Platform.OS === 'web') {
                        alert('❌ Error: ' + errorMsg);
                    } else {
                        Alert.alert('❌ Error', errorMsg);
                    }
                }
            }
        } catch (error) {
            console.error('Error deleting admin:', error);
            const errorMsg = 'Network error. Please check your connection.';

            if (Platform.OS === 'web') {
                alert('❌ Error: ' + errorMsg);
            } else {
                Alert.alert('❌ Error', errorMsg);
            }
        }
    };

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

                {/* Delete Button */}
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteAdmin(item._id, item.name)}
                >
                    <MaterialCommunityIcons name="delete-outline" size={20} color="#fff" />
                    <Text style={styles.deleteButtonText}>Delete Admin</Text>
                </TouchableOpacity>
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
                    <Text style={styles.statValue}>{loading ? '...' : admins.length}</Text>
                    <Text style={styles.statLabel}>Active Admins</Text>
                </View>
                {/* Add more stats if needed */}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Approved Admins</Text>
                {loading && !refreshing && admins.length === 0 ? (
                    <View style={{ paddingTop: 40, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#E30512" />
                        <Text style={{ marginTop: 12, color: '#64748b' }}>Loading admins...</Text>
                    </View>
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
        paddingBottom: 100,
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
    deleteButton: {
        backgroundColor: '#dc2626',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 10,
        marginTop: 12,
        gap: 8,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
