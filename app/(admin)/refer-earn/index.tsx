import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { getApiUrl } from '../../../utils/api';

const SP_RED = '#E30512';
const { width } = Dimensions.get('window');
const isDesktop = width >= 768;

export default function ReferEarnScreen() {
    const router = useRouter();
    const [referrers, setReferrers] = useState<any[]>([]);
    const [referredUsers, setReferredUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'referrers' | 'referred'>('referrers');

    const fetchStats = async () => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            if (!token) return;
            const url = getApiUrl();
            const response = await fetch(`${url}/auth/referral-stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setReferrers(data.referrers);
                    setReferredUsers(data.referredUsers);
                    setStats(data.stats);
                }
            }
        } catch (error) {
            console.error('Error fetching referral stats:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(useCallback(() => { fetchStats(); }, []));
    const onRefresh = () => { setRefreshing(true); fetchStats(); };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const renderReferrerItem = ({ item, index }: { item: any, index: number }) => (
        <View style={styles.card}>
            <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name?.charAt(0) || 'U'}</Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.subtitle}>{item.email}</Text>
                <View style={styles.codeBadge}>
                    <Text style={styles.codeText}>Code: {item.referralCode}</Text>
                </View>
            </View>
            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{item.totalReferrals}</Text>
                    <Text style={styles.statLabel}>Refers</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: '#16a34a' }]}>{item.pointsEarned}</Text>
                    <Text style={styles.statLabel}>Pts</Text>
                </View>
            </View>
        </View>
    );

    const renderReferredItem = ({ item, index }: { item: any, index: number }) => (
        <View style={styles.card}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name?.charAt(0) || 'U'}</Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.subtitle}>{item.email}</Text>
                <Text style={styles.date}>Joined: {formatDate(item.joinedAt)}</Text>
            </View>
            <View style={styles.referredByContainer}>
                <Text style={styles.referredByLabel}>Referred By</Text>
                <View style={styles.referrerBadge}>
                    <MaterialCommunityIcons name="account-arrow-left" size={16} color={SP_RED} />
                    <Text style={styles.referrerCode}>{item.referredBy}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={[SP_RED, '#b91c1c']} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>🔗 Refer & Earn Stats</Text>
            </LinearGradient>

            {loading ? (
                <ActivityIndicator size="large" color={SP_RED} style={{ flex: 1 }} />
            ) : (
                <View style={{ flex: 1 }}>
                    {/* Summary Stats */}
                    <View style={styles.summaryRow}>
                        <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.summaryCard}>
                            <MaterialCommunityIcons name="account-group" size={24} color="#fff" />
                            <View>
                                <Text style={styles.summaryValue}>{stats.totalReferrers || 0}</Text>
                                <Text style={styles.summaryLabel}>Total Referrers</Text>
                            </View>
                        </LinearGradient>
                        <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.summaryCard}>
                            <MaterialCommunityIcons name="account-plus" size={24} color="#fff" />
                            <View>
                                <Text style={styles.summaryValue}>{stats.totalReferred || 0}</Text>
                                <Text style={styles.summaryLabel}>Referred Users</Text>
                            </View>
                        </LinearGradient>
                        <LinearGradient colors={['#10b981', '#059669']} style={styles.summaryCard}>
                            <MaterialCommunityIcons name="star" size={24} color="#fff" />
                            <View>
                                <Text style={styles.summaryValue}>{stats.totalPointsAwarded || 0}</Text>
                                <Text style={styles.summaryLabel}>Points Awarded</Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {isDesktop ? (
                        /* Desktop Split View */
                        <View style={styles.splitView}>
                            <View style={styles.column}>
                                <View style={styles.columnHeader}>
                                    <Text style={styles.columnTitle}>Top Referrers</Text>
                                    <View style={styles.badge}><Text style={styles.badgeText}>{referrers.length}</Text></View>
                                </View>
                                <FlatList
                                    data={referrers}
                                    renderItem={renderReferrerItem}
                                    keyExtractor={item => item._id}
                                    contentContainerStyle={styles.listcontent}
                                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                                    ListEmptyComponent={<Text style={styles.emptyText}>No referrers found</Text>}
                                />
                            </View>
                            <View style={[styles.column, { borderLeftWidth: 1, borderLeftColor: '#e2e8f0' }]}>
                                <View style={styles.columnHeader}>
                                    <Text style={styles.columnTitle}>Referred Users</Text>
                                    <View style={styles.badge}><Text style={styles.badgeText}>{referredUsers.length}</Text></View>
                                </View>
                                <FlatList
                                    data={referredUsers}
                                    renderItem={renderReferredItem}
                                    keyExtractor={item => item._id}
                                    contentContainerStyle={styles.listcontent}
                                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                                    ListEmptyComponent={<Text style={styles.emptyText}>No referred users found</Text>}
                                />
                            </View>
                        </View>
                    ) : (
                        /* Mobile Tab View */
                        <View style={{ flex: 1 }}>
                            <View style={styles.tabs}>
                                <TouchableOpacity
                                    style={[styles.tab, activeTab === 'referrers' && styles.activeTab]}
                                    onPress={() => setActiveTab('referrers')}
                                >
                                    <Text style={[styles.tabText, activeTab === 'referrers' && styles.activeTabText]}>Top Referrers</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.tab, activeTab === 'referred' && styles.activeTab]}
                                    onPress={() => setActiveTab('referred')}
                                >
                                    <Text style={[styles.tabText, activeTab === 'referred' && styles.activeTabText]}>Referred Users</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={activeTab === 'referrers' ? referrers : referredUsers}
                                renderItem={activeTab === 'referrers' ? renderReferrerItem : renderReferredItem}
                                keyExtractor={item => item._id}
                                contentContainerStyle={styles.listcontent}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                                ListEmptyComponent={<Text style={styles.emptyText}>No data found</Text>}
                            />
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { paddingTop: Platform.OS === 'web' ? 20 : 60, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    summaryRow: { flexDirection: 'row', padding: 16, gap: 12, flexWrap: 'wrap' },
    summaryCard: { flex: 1, minWidth: 100, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
    summaryValue: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    summaryLabel: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
    splitView: { flex: 1, flexDirection: 'row' },
    column: { flex: 1, backgroundColor: '#f1f5f9' },
    columnHeader: { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    columnTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
    badge: { backgroundColor: '#e2e8f0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
    badgeText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
    listcontent: { padding: 16, paddingBottom: 40 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    rankBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
    rankText: { fontSize: 10, fontWeight: 'bold', color: '#64748b' },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 16, fontWeight: 'bold', color: SP_RED },
    info: { flex: 1 },
    name: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
    subtitle: { fontSize: 12, color: '#64748b' },
    codeBadge: { backgroundColor: '#eff6ff', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
    codeText: { fontSize: 11, color: '#2563eb', fontWeight: '500' },
    statsContainer: { alignItems: 'flex-end', gap: 4 },
    statBox: { alignItems: 'center', minWidth: 40 },
    statValue: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
    statLabel: { fontSize: 10, color: '#64748b' },
    date: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
    referredByContainer: { alignItems: 'flex-end' },
    referredByLabel: { fontSize: 10, color: '#64748b', marginBottom: 2 },
    referrerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    referrerCode: { fontSize: 12, fontWeight: '600', color: SP_RED },
    emptyText: { textAlign: 'center', color: '#94a3b8', marginTop: 40 },
    tabs: { flexDirection: 'row', backgroundColor: '#fff', padding: 4, margin: 16, borderRadius: 12 },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
    activeTab: { backgroundColor: SP_RED },
    tabText: { fontWeight: '600', color: '#64748b', fontSize: 14 },
    activeTabText: { color: '#fff' }
});
