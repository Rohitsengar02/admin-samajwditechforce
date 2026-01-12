import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Image, Alert, Modal, TextInput, ScrollView, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { getApiUrl } from '../../../utils/api';

const SP_RED = '#E30512';
const SP_GREEN = '#009933';

export default function UsersScreen() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Edit Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [editRole, setEditRole] = useState('');
    const [editPoints, setEditPoints] = useState('');

    const fetchUsers = async () => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            if (!token) return;

            const url = getApiUrl();
            const response = await fetch(`${url}/auth/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                Alert.alert('Error', `Failed to fetch users. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            Alert.alert('Error', 'Network request failed');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUsers();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchUsers();
    };

    const stats = useMemo(() => {
        return {
            total: users.length,
            verified: users.filter(u => u.verificationStatus === 'Verified').length,
            pending: users.filter(u => u.verificationStatus === 'Pending').length,
            appUsers: users.filter(u => !u.isVolunteer).length,
            volunteers: users.filter(u => u.isVolunteer).length
        };
    }, [users]);

    const handleDelete = (item: any) => {
        const type = item.isVolunteer ? 'volunteer' : 'user';

        if (Platform.OS === 'web') {
            if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                performDelete(item._id, type);
            }
        } else {
            Alert.alert(
                'Delete User',
                `Are you sure you want to delete ${item.name}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => performDelete(item._id, type) }
                ]
            );
        }
    };

    const performDelete = async (id: string, type: string) => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            const url = getApiUrl();

            const response = await fetch(`${url}/auth/delete/${id}?type=${type}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                Alert.alert('Success', 'User deleted successfully');
                fetchUsers(); // Refresh list
            } else {
                Alert.alert('Error', 'Failed to delete user');
            }
        } catch (error) {
            console.error('Delete error:', error);
            Alert.alert('Error', 'Network error during delete');
        }
    };

    const openEditModal = (item: any) => {
        setSelectedUser(item);
        setEditName(item.name || '');
        setEditPhone(item.phone || '');
        setEditStatus(item.verificationStatus || 'Pending');
        setEditRole(item.role || 'Member');
        setEditPoints(item.points ? String(item.points) : '0');
        setModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedUser) return;
        const type = selectedUser.isVolunteer ? 'volunteer' : 'user';

        try {
            const token = await AsyncStorage.getItem('adminToken');
            const url = getApiUrl();

            const body = {
                name: editName,
                phone: editPhone,
                verificationStatus: editStatus,
                role: editRole,
                points: Number(editPoints) || 0
            };


            const response = await fetch(`${url}/auth/update/${selectedUser._id}?type=${type}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                Alert.alert('Success', 'User updated successfully');
                setModalVisible(false);
                fetchUsers(); // Refresh list
            } else {
                Alert.alert('Error', 'Failed to update user');
            }
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert('Error', 'Network error during update');
        }
    };

    const renderHeader = () => (
        <View style={styles.statsContainer}>
            <View style={styles.statsGrid}>
                {/* Total Users */}
                <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.statCard}>
                    <View style={styles.statIconContainer}>
                        <MaterialCommunityIcons name="account-group" size={20} color="white" />
                    </View>
                    <Text style={styles.statNumber}>{stats.total}</Text>
                    <Text style={styles.statLabel}>Total Users</Text>
                </LinearGradient>

                {/* Verified Users */}
                <LinearGradient colors={['#10b981', '#059669']} style={styles.statCard}>
                    <View style={styles.statIconContainer}>
                        <MaterialCommunityIcons name="check-decagram" size={20} color="white" />
                    </View>
                    <Text style={styles.statNumber}>{stats.verified}</Text>
                    <Text style={styles.statLabel}>Verified</Text>
                </LinearGradient>

                {/* Pending Verification */}
                <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.statCard}>
                    <View style={styles.statIconContainer}>
                        <MaterialCommunityIcons name="clock-outline" size={20} color="white" />
                    </View>
                    <Text style={styles.statNumber}>{stats.pending}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </LinearGradient>

                {/* App Users */}
                <LinearGradient colors={['#8b5cf6', '#7c3aed']} style={styles.statCard}>
                    <View style={styles.statIconContainer}>
                        <MaterialCommunityIcons name="cellphone" size={20} color="white" />
                    </View>
                    <Text style={styles.statNumber}>{stats.appUsers}</Text>
                    <Text style={styles.statLabel}>App Users</Text>
                </LinearGradient>
            </View>
        </View>
    );

    const renderUserItem = ({ item }: { item: any }) => (
        <View style={styles.userCard}>
            <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                    {item.profileImage ? (
                        <Image source={{ uri: item.profileImage }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, { backgroundColor: '#f1f5f9' }]}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: SP_RED }}>
                                {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                            </Text>
                        </View>
                    )}
                    {item.verificationStatus === 'Verified' && (
                        <View style={styles.verifiedBadge}>
                            <MaterialCommunityIcons name="check" size={10} color="#fff" />
                        </View>
                    )}
                </View>

                <View style={styles.userDetails}>
                    <Text style={styles.userName}>{item.name || 'Unknown User'}</Text>
                    <Text style={styles.userContact}>{item.phone || item.email}</Text>

                    <View style={styles.badgesRow}>
                        <View style={[styles.badge, { backgroundColor: item.role === 'admin' ? '#fee2e2' : '#e0f2fe' }]}>
                            <Text style={[styles.badgeText, { color: item.role === 'admin' ? '#ef4444' : '#0284c7' }]}>
                                {item.role === 'admin' ? 'Admin' : (item.role === 'volunteer' ? 'Volunteer' : (item.role || 'Member'))}
                            </Text>
                        </View>

                        <View style={[styles.badge, {
                            backgroundColor: item.verificationStatus === 'Verified' ? '#dcfce7' :
                                (item.verificationStatus === 'Pending' ? '#fef9c3' : '#f1f5f9')
                        }]}>
                            <Text style={[styles.badgeText, {
                                color: item.verificationStatus === 'Verified' ? '#16a34a' :
                                    (item.verificationStatus === 'Pending' ? '#ca8a04' : '#64748b')
                            }]}>
                                {item.verificationStatus === 'Verified' ? 'Verified' :
                                    (item.verificationStatus === 'Pending' ? 'Pending' : 'Unverified')}
                            </Text>
                        </View>

                        <View style={[styles.badge, { backgroundColor: '#f3e8ff' }]}>
                            <Text style={[styles.badgeText, { color: '#7e22ce' }]}>
                                {item.isVolunteer ? 'Database' : 'App User'}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.dateText}>
                        Joined: {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>

                {/* CRUD Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => openEditModal(item)} style={[styles.actionButton, styles.editButton]}>
                        <MaterialCommunityIcons name="pencil" size={20} color="#0284c7" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item)} style={[styles.actionButton, styles.deleteButton]}>
                        <MaterialCommunityIcons name="trash-can-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={[SP_RED, '#b91c1c']} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Users</Text>
            </LinearGradient>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={SP_RED} />
                </View>
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderUserItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={renderHeader}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[SP_RED]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No users found</Text>
                        </View>
                    }
                />
            )}

            {/* Edit Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit User</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.form}>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editName}
                                    onChangeText={setEditName}
                                    placeholder="Enter full name"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Phone</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editPhone}
                                    onChangeText={setEditPhone}
                                    keyboardType="phone-pad"
                                    placeholder="Enter phone number"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Points</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editPoints}
                                    onChangeText={setEditPoints}
                                    keyboardType="numeric"
                                    placeholder="0"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Status (Verified/Pending)</Text>
                                <View style={styles.row}>
                                    <TouchableOpacity
                                        style={[styles.chip, editStatus === 'Verified' && styles.chipActive]}
                                        onPress={() => setEditStatus('Verified')}
                                    >
                                        <Text style={[styles.chipText, editStatus === 'Verified' && styles.chipTextActive]}>Verified</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.chip, editStatus === 'Pending' && styles.chipActive]}
                                        onPress={() => setEditStatus('Pending')}
                                    >
                                        <Text style={[styles.chipText, editStatus === 'Pending' && styles.chipTextActive]}>Pending</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    // Stats Styles
    statsContainer: {
        marginBottom: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statCard: {
        width: '48%', // Allow wrap into 2 columns
        padding: 16,
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        minHeight: 110,
        justifyContent: 'space-between'
    },
    statIconContainer: {
        width: 32,
        height: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    statLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
    },

    // User Card Styles (Same as before)
    userCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: SP_GREEN,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 2,
    },
    userContact: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 8,
    },
    badgesRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 6,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 11,
        color: '#94a3b8'
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
    },
    editButton: {
        backgroundColor: '#e0f2fe',
    },
    deleteButton: {
        backgroundColor: '#fee2e2',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#64748b',
        fontSize: 16
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    form: {
        gap: 16,
    },
    formGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#1e293b',
        backgroundColor: '#f8fafc',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    chipActive: {
        backgroundColor: '#eff6ff',
        borderColor: '#3b82f6',
    },
    chipText: {
        color: '#64748b',
        fontWeight: '600',
        fontSize: 14,
    },
    chipTextActive: {
        color: '#3b82f6',
    },
    saveButton: {
        backgroundColor: SP_RED,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
