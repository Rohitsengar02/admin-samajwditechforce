import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function AdminApprovalsScreen() {
    const [pendingAdmins, setPendingAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingAdmins = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/admin/pending-admins`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setPendingAdmins(data);
            } else {
                Alert.alert('Error', data.message || 'Failed to fetch pending admins');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string, name: string) => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/admin/approve-admin/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                Alert.alert('Success', `${name} has been approved as Admin.`);
                fetchPendingAdmins(); // Refresh list
            } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to approve admin');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Something went wrong');
        }
    };

    const handleReject = async (id: string, name: string) => {
        Alert.alert(
            'Confirm Reject',
            `Are you sure you want to reject ${name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reject',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('adminToken');
                            const response = await fetch(`${API_URL}/admin/reject-admin/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });

                            if (response.ok) {
                                Alert.alert('Success', `${name} has been rejected.`);
                                fetchPendingAdmins();
                            } else {
                                const data = await response.json();
                                Alert.alert('Error', data.message || 'Failed to reject admin');
                            }
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Error', 'Something went wrong');
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        fetchPendingAdmins();
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <Text style={styles.phone}>{item.phone}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleReject(item._id, item.name)}
                >
                    <MaterialCommunityIcons name="close" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleApprove(item._id, item.name)}
                >
                    <MaterialCommunityIcons name="check" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pending Admin Requests</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#E30512" />
            ) : pendingAdmins.length === 0 ? (
                <Text style={styles.emptyText}>No pending requests.</Text>
            ) : (
                <FlatList
                    data={pendingAdmins}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    phone: {
        fontSize: 14,
        color: '#666',
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    approveButton: {
        backgroundColor: '#10B981',
    },
    rejectButton: {
        backgroundColor: '#EF4444',
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
        fontSize: 16,
    },
});
