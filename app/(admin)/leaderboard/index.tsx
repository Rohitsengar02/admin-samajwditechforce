import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Image, Alert, Modal, TextInput, ScrollView, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { getApiUrl } from '../../../utils/api';

const SP_RED = '#E30512';
const GOLD = '#FFD700';
const SILVER = '#C0C0C0';
const BRONZE = '#CD7F32';

export default function LeaderboardScreen() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [editPoints, setEditPoints] = useState('');

    const fetchUsers = async () => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            if (!token) return;
            const url = getApiUrl();
            const response = await fetch(`${url}/auth/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const sorted = data.sort((a: any, b: any) => (b.points || 0) - (a.points || 0));
                setUsers(sorted);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(useCallback(() => { fetchUsers(); }, []));

    const onRefresh = () => { setRefreshing(true); fetchUsers(); };

    const stats = useMemo(() => {
        const totalPoints = users.reduce((sum, u) => sum + (u.points || 0), 0);
        const topUser = users[0];
        return { total: users.length, totalPoints, topUserName: topUser?.name || 'N/A', topUserPoints: topUser?.points || 0 };
    }, [users]);

    const openEditModal = (item: any) => {
        setSelectedUser(item);
        setEditPoints(item.points ? String(item.points) : '0');
        setModalVisible(true);
    };

    const handleSavePoints = async () => {
        if (!selectedUser) return;
        try {
            const token = await AsyncStorage.getItem('adminToken');
            const url = getApiUrl();
            const response = await fetch(`${url}/auth/update/${selectedUser._id}?type=${selectedUser.isVolunteer ? 'volunteer' : 'user'}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ points: Number(editPoints) || 0 })
            });
            if (response.ok) {
                Alert.alert('Success', 'Points updated');
                setModalVisible(false);
                fetchUsers();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update');
        }
    };

    const getRankStyle = (index: number) => {
        if (index === 0) return { bg: GOLD, color: '#000' };
        if (index === 1) return { bg: SILVER, color: '#000' };
        if (index === 2) return { bg: BRONZE, color: '#fff' };
        return { bg: '#f1f5f9', color: '#64748b' };
    };

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        const rank = getRankStyle(index);
        return (
            <View style={styles.card}>
                <View style={[styles.rank, { backgroundColor: rank.bg }]}>
                    <Text style={[styles.rankText, { color: rank.color }]}>
                        {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                    </Text>
                </View>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name?.charAt(0) || 'U'}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{item.name || 'Unknown'}</Text>
                    <Text style={styles.phone}>{item.phone || item.email}</Text>
                    <View style={styles.pointsRow}>
                        <MaterialCommunityIcons name="star" size={14} color="#f59e0b" />
                        <Text style={styles.points}>{item.points || 0} Points</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editBtn}>
                    <MaterialCommunityIcons name="pencil" size={18} color="#0284c7" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={[SP_RED, '#b91c1c']} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>🏆 Leaderboard</Text>
            </LinearGradient>

            {loading ? (
                <ActivityIndicator size="large" color={SP_RED} style={{ flex: 1 }} />
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    ListHeaderComponent={
                        <View style={styles.statsRow}>
                            <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.stat}>
                                <Text style={styles.statNum}>{stats.total}</Text>
                                <Text style={styles.statLabel}>Users</Text>
                            </LinearGradient>
                            <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.stat}>
                                <Text style={styles.statNum}>{stats.totalPoints}</Text>
                                <Text style={styles.statLabel}>Total Pts</Text>
                            </LinearGradient>
                        </View>
                    }
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[SP_RED]} />}
                    ListEmptyComponent={<Text style={styles.empty}>No users found</Text>}
                />
            )}

            <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalBg}>
                    <View style={styles.modal}>
                        <View style={styles.modalHead}>
                            <Text style={styles.modalTitle}>Edit Points</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>
                        {selectedUser && <Text style={styles.modalUser}>{selectedUser.name}</Text>}
                        <TextInput style={styles.input} value={editPoints} onChangeText={setEditPoints} keyboardType="numeric" />
                        <View style={styles.quickRow}>
                            {[10, 50, 100, 500].map(v => (
                                <TouchableOpacity key={v} style={styles.quickBtn} onPress={() => setEditPoints(String((Number(editPoints) || 0) + v))}>
                                    <Text style={styles.quickText}>+{v}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSavePoints}>
                            <Text style={styles.saveTxt}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    list: { padding: 16 },
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    stat: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center' },
    statNum: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
    statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
    card: { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
    rank: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    rankText: { fontWeight: 'bold', fontSize: 12 },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 16, fontWeight: 'bold', color: SP_RED },
    info: { flex: 1 },
    name: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
    phone: { fontSize: 12, color: '#64748b' },
    pointsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    points: { fontSize: 13, fontWeight: '600', color: '#f59e0b' },
    editBtn: { padding: 8, borderRadius: 8, backgroundColor: '#e0f2fe' },
    empty: { textAlign: 'center', color: '#64748b', marginTop: 40 },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modal: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
    modalHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    modalTitle: { fontSize: 18, fontWeight: 'bold' },
    modalUser: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
    input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12, fontSize: 18, textAlign: 'center', fontWeight: 'bold' },
    quickRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
    quickBtn: { flex: 1, backgroundColor: '#e0f2fe', padding: 10, borderRadius: 8, alignItems: 'center' },
    quickText: { color: '#0284c7', fontWeight: 'bold' },
    saveBtn: { backgroundColor: SP_RED, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
    saveTxt: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
