import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Platform, RefreshControl, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import {
    ArrowLeft, Target, PlayCircle, FileText, Clock, CheckCircle,
    Pencil, Trash2
} from 'lucide-react-native';
import { getApiUrl } from '../../../utils/api';

const screenWidth = Dimensions.get('window').width;

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const API_URL = `${getApiUrl()}/training`;

interface ModuleCardProps {
    module: any;
    onEdit: () => void;
    onDelete: () => void;
}

const ModuleCard = ({ module, onEdit, onDelete }: ModuleCardProps) => (
    <View style={{
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <LinearGradient
                colors={module.type === 'video' ? ['#10B981', '#059669'] : ['#F59E0B', '#D97706']}
                style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                }}
            >
                {module.type === 'video' ? (
                    <PlayCircle size={28} color="white" />
                ) : (
                    <FileText size={28} color="white" />
                )}
            </LinearGradient>
            <View style={{ flex: 1 }}>
                <View style={{
                    backgroundColor: module.type === 'video' ? '#dcfce7' : '#fef3c7',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                    alignSelf: 'flex-start',
                    marginBottom: 6,
                }}>
                    <Text style={{
                        fontSize: 11,
                        fontWeight: '700',
                        color: module.type === 'video' ? '#059669' : '#d97706',
                        textTransform: 'uppercase',
                    }}>
                        {module.type}
                    </Text>
                </View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }} numberOfLines={2}>
                    {module.title}
                </Text>
            </View>
        </View>

        {module.description && (
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 16, lineHeight: 20 }} numberOfLines={2}>
                {module.description}
            </Text>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            {module.duration && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                    <Clock size={16} color="#9CA3AF" />
                    <Text style={{ fontSize: 13, color: '#6b7280', marginLeft: 6, fontWeight: '500' }}>{module.duration}</Text>
                </View>
            )}
            <View style={{
                backgroundColor: '#fef3c7',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
            }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#d97706' }}>{module.phase}</Text>
            </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
                onPress={onEdit}
                style={{
                    flex: 1,
                    backgroundColor: '#ecfdf5',
                    paddingVertical: 14,
                    borderRadius: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Pencil size={18} color="#059669" />
                <Text style={{ color: '#059669', fontWeight: '700', fontSize: 14, marginLeft: 8 }}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onDelete}
                style={{
                    flex: 1,
                    backgroundColor: '#fef2f2',
                    paddingVertical: 14,
                    borderRadius: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Trash2 size={18} color="#DC2626" />
                <Text style={{ color: '#DC2626', fontWeight: '700', fontSize: 14, marginLeft: 8 }}>Delete</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default function Phase2Page() {
    const router = useRouter();
    const [modules, setModules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchModules = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (Array.isArray(data)) {
                const phase2Modules = data.filter((m: any) => m.phase === 'Phase 2');
                setModules(phase2Modules);
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchModules();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchModules();
    };

    const handleEdit = (moduleId: string) => {
        router.push(`/(admin)/training/editor?id=${moduleId}` as any);
    };

    const handleDelete = async (moduleId: string, title: string) => {
        const confirmDelete = () => {
            return new Promise<boolean>((resolve) => {
                if (Platform.OS === 'web') {
                    resolve(window.confirm(`Delete "${title}"?\n\nThis action cannot be undone.`));
                } else {
                    Alert.alert(
                        '⚠️ Delete Module',
                        `Are you sure you want to delete "${title}"?`,
                        [
                            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                            { text: 'Delete', style: 'destructive', onPress: () => resolve(true) }
                        ]
                    );
                }
            });
        };

        const confirmed = await confirmDelete();
        if (!confirmed) return;

        try {
            const response = await fetch(`${API_URL}/${moduleId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                if (Platform.OS === 'web') {
                    alert('✅ Module deleted successfully');
                } else {
                    Alert.alert('Success', 'Module deleted successfully');
                }
                fetchModules();
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
            if (Platform.OS === 'web') {
                alert('❌ Failed to delete module');
            } else {
                Alert.alert('Error', 'Failed to delete module');
            }
        }
    };

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#f9fafb' }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10B981']} />
            }
        >
            <View style={{ position: 'relative', overflow: 'hidden', marginBottom: 24 }}>
                <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={{
                        paddingTop: 48,
                        paddingBottom: 64,
                        paddingHorizontal: 24,
                        borderBottomLeftRadius: 40,
                        borderBottomRightRadius: 40,
                    }}
                >
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={80} left={20} />

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 14, marginRight: 16 }}
                        >
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#a7f3d0', fontSize: 14, marginBottom: 4 }}>Phase 2</Text>
                            <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>Engage</Text>
                            <Text style={{ color: '#a7f3d0', fontSize: 14, marginTop: 4 }}>Community interaction</Text>
                        </View>
                        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 14, borderRadius: 18 }}>
                            <Target size={28} color="white" />
                        </View>
                    </View>

                    <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 18, padding: 18 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Total Modules</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{modules.length}</Text>
                        </View>
                        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, height: 10 }}>
                            <View style={{ backgroundColor: 'white', borderRadius: 10, height: 10, width: '0%' }} />
                        </View>
                    </View>
                </LinearGradient>
            </View>

            <View style={{ paddingHorizontal: 16, paddingBottom: 100 }}>
                <View style={{ flexDirection: 'row', marginBottom: 24, gap: 12 }}>
                    <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 20, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                        <View style={{ backgroundColor: '#dcfce7', padding: 10, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 10 }}>
                            <FileText size={22} color="#10B981" />
                        </View>
                        <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#111827' }}>{modules.length}</Text>
                        <Text style={{ fontSize: 13, color: '#6b7280', fontWeight: '500' }}>Total Modules</Text>
                    </View>

                    <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 20, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                        <View style={{ backgroundColor: '#d1fae5', padding: 10, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 10 }}>
                            <CheckCircle size={22} color="#059669" />
                        </View>
                        <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#111827' }}>0</Text>
                        <Text style={{ fontSize: 13, color: '#6b7280', fontWeight: '500' }}>Completed</Text>
                    </View>
                </View>

                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>
                        📚 Training Modules
                    </Text>
                    {loading && !refreshing ? (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#10B981" />
                        </View>
                    ) : modules.length === 0 ? (
                        <View style={{ backgroundColor: 'white', padding: 40, borderRadius: 20, alignItems: 'center' }}>
                            <FileText size={48} color="#d1d5db" />
                            <Text style={{ color: '#6b7280', fontSize: 16, marginTop: 16, fontWeight: '500' }}>No modules found for Phase 2</Text>
                        </View>
                    ) : (
                        modules.map(module => (
                            <ModuleCard
                                key={module._id}
                                module={module}
                                onEdit={() => handleEdit(module._id)}
                                onDelete={() => handleDelete(module._id, module.title)}
                            />
                        ))
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
