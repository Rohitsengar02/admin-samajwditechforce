import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getApiUrl } from '../../utils/api'; // Ensure this matches path

export default function AdminApprovalsScreen() {
    const [pendingAdmins, setPendingAdmins] = useState<any[]>([]);
    const [pendingMembers, setPendingMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('adminToken');
            const url = getApiUrl();
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch Pending Admins
            const adminRes = await fetch(`${url}/admin/pending-admins`, { headers });
            const adminData = await adminRes.json();
            if (adminRes.ok) setPendingAdmins(adminData);

            // Fetch Pending Members
            const memberRes = await fetch(`${url}/admin/verifications`, { headers });
            const memberData = await memberRes.json();
            if (memberRes.ok) setPendingMembers(memberData);

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    // --- Admin Action Handlers ---
    const handleApproveAdmin = async (id: string, name: string) => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            const url = getApiUrl();
            const response = await fetch(`${url}/admin/approve-admin/${id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                Alert.alert('Success', `${name} approved as Admin`);
                fetchData();
            } else {
                Alert.alert('Error', 'Failed to approve');
            }
        } catch (e) { Alert.alert('Error', 'Network error'); }
    };

    const handleRejectAdmin = async (id: string, name: string) => {
        Alert.alert('Reject Admin', `Reject ${name}?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Reject', style: 'destructive',
                onPress: async () => {
                    const token = await AsyncStorage.getItem('adminToken');
                    const url = getApiUrl();
                    await fetch(`${url}/admin/reject-admin/${id}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    fetchData();
                }
            }
        ]);
    };

    // --- Member Action Handlers ---
    const handleVerifyMember = async (id: string, name: string) => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            const url = getApiUrl();
            const response = await fetch(`${url}/admin/verify/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ mindset: 'A', whatsappGroupAdded: 'Yes' })
            });

            if (response.ok) {
                Alert.alert('Success', `Member ${name} verified!`);
                fetchData();
            } else {
                Alert.alert('Error', 'Failed to verify member');
            }
        } catch (e) { Alert.alert('Error', 'Network error'); }
    };

    const handleRejectMember = async (id: string, name: string) => {
        Alert.alert('Reject Member', `Reject ${name}?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Reject', style: 'destructive',
                onPress: async () => {
                    const token = await AsyncStorage.getItem('adminToken');
                    const url = getApiUrl();
                    await fetch(`${url}/admin/reject/${id}`, {
                        method: 'PUT',
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    fetchData();
                }
            }
        ]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderAdminItem = (item: any) => (
        <View key={item._id} style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name} (Admin Request)</Text>
                <Text style={styles.details}>{item.email}</Text>
                <Text style={styles.details}>{item.phone}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={[styles.btn, styles.btnReject]} onPress={() => handleRejectAdmin(item._id, item.name)}>
                    <MaterialCommunityIcons name="close" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnApprove]} onPress={() => handleApproveAdmin(item._id, item.name)}>
                    <MaterialCommunityIcons name="check" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderMemberItem = (item: any) => (
        <View key={item._id} style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name} (Member)</Text>
                <Text style={styles.details}>Dist: {item.district} | VS: {item.vidhanSabha}</Text>
                <Text style={styles.details}>Phone: {item.phone}</Text>
                <Text style={styles.details}>Role: {item.partyRole || 'N/A'}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={[styles.btn, styles.btnReject]} onPress={() => handleRejectMember(item._id, item.name)}>
                    <MaterialCommunityIcons name="close" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnApprove]} onPress={() => handleVerifyMember(item._id, item.name)}>
                    <MaterialCommunityIcons name="check" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Approvals Management</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#E30512" style={{ marginTop: 50 }} />
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {/* Admin Requests Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <MaterialCommunityIcons name="account-tie" size={24} color="#E30512" />
                            <Text style={styles.sectionTitle}>Admin Requests ({pendingAdmins.length})</Text>
                        </View>
                        {pendingAdmins.length === 0 ? (
                            <Text style={styles.emptyText}>No pending admin requests</Text>
                        ) : (
                            pendingAdmins.map(renderAdminItem)
                        )}
                    </View>

                    {/* Member Requests Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <MaterialCommunityIcons name="account-group" size={24} color="#009933" />
                            <Text style={styles.sectionTitle}>Member Verifications ({pendingMembers.length})</Text>
                        </View>
                        {pendingMembers.length === 0 ? (
                            <Text style={styles.emptyText}>No pending member verifications</Text>
                        ) : (
                            pendingMembers.map(renderMemberItem)
                        )}
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 20 },
    scrollContent: { paddingBottom: 40 },
    section: { marginBottom: 30 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#334155' },
    card: {
        backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
    },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
    details: { fontSize: 13, color: '#64748b', marginBottom: 2 },
    actions: { flexDirection: 'row', gap: 10 },
    btn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    btnApprove: { backgroundColor: '#10B981' },
    btnReject: { backgroundColor: '#EF4444' },
    emptyText: { fontStyle: 'italic', color: '#94a3b8', marginLeft: 10 },
});
