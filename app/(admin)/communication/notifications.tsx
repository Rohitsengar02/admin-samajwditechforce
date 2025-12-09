import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, ActivityIndicator, Platform, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft, Send, Bell, Users, CheckCircle } from 'lucide-react-native';
import { getApiUrl } from '../../../utils/api';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

export default function NotificationsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false); // For sending
    const [fetching, setFetching] = useState(true); // For history
    const [refreshing, setRefreshing] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        message: '',
        target: 'all',
    });

    const API_URL = `${getApiUrl()}/notifications`;

    const fetchHistory = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (data.success) {
                setHistory(data.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setFetching(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHistory();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const handleSend = async () => {
        if (!formData.title || !formData.message) {
            Alert.alert('Error', 'Please fill in title and message');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.success) {
                Alert.alert('Success', 'Notification sent successfully');
                setFormData({ title: '', message: '', target: 'all' });
                fetchHistory();
            } else {
                Alert.alert('Error', data.error || 'Failed to send notification');
            }
        } catch (error) {
            Alert.alert('Error', 'Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            className="flex-1 bg-gray-50"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10b981']} />}
        >
            <LinearGradient colors={['#10b981', '#059669']} className="pt-12 pb-16 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">Push Notifications</Text>
                        <Text className="text-emerald-100 text-sm mt-1">Send alerts to the force</Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="px-6 pb-8">
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <View className="flex-row items-center mb-6">
                        <View className="bg-emerald-100 p-3 rounded-full mr-4">
                            <Bell size={24} color="#059669" />
                        </View>
                        <View>
                            <Text className="text-lg font-bold text-gray-800">Compose Alert</Text>
                            <Text className="text-gray-500 text-sm">Send instant updates to devices</Text>
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Notification Title *</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                            placeholder="Enter title"
                            value={formData.title}
                            onChangeText={(text) => setFormData({ ...formData, title: text })}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Message *</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 h-32"
                            placeholder="Type your message here..."
                            multiline
                            textAlignVertical="top"
                            value={formData.message}
                            onChangeText={(text) => setFormData({ ...formData, message: text })}
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="text-gray-600 font-medium mb-2">Target Audience</Text>
                        <View className="flex-row flex-wrap -mx-1">
                            {[
                                { id: 'all', label: 'All Users' },
                                { id: 'district_heads', label: 'District Heads' },
                                { id: 'active', label: 'Active Members' },
                                { id: 'youth', label: 'Youth Wing' }
                            ].map((target) => (
                                <TouchableOpacity
                                    key={target.id}
                                    onPress={() => setFormData({ ...formData, target: target.id })}
                                    className={`m-1 px-4 py-2 rounded-xl border ${formData.target === target.id
                                        ? 'bg-emerald-600 border-emerald-600'
                                        : 'bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    <Text className={`font-semibold ${formData.target === target.id ? 'text-white' : 'text-gray-600'
                                        }`}>
                                        {target.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleSend}
                        disabled={loading}
                        className="bg-emerald-600 py-4 rounded-2xl flex-row justify-center items-center shadow-lg shadow-emerald-200"
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Send size={20} color="white" />
                                <Text className="text-white font-bold ml-2 text-lg">Send Notification</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="bg-white rounded-3xl p-6 shadow-lg">
                    <Text className="text-gray-800 font-bold text-lg mb-4">Recent History</Text>
                    {fetching && !refreshing ? (
                        <ActivityIndicator color="#10B981" />
                    ) : history.length === 0 ? (
                        <Text className="text-gray-400 text-center py-4">No history found</Text>
                    ) : (
                        history.map((item) => (
                            <View key={item._id} className="flex-row items-center border-b border-gray-50 py-3 last:border-0">
                                <View className="bg-gray-100 p-2 rounded-full mr-3">
                                    <CheckCircle size={16} color="#10B981" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-semibold">{item.title}</Text>
                                    <Text className="text-gray-500 text-xs" numberOfLines={1}>{item.message}</Text>
                                    <Text className="text-gray-400 text-[10px] mt-1">
                                        {new Date(item.createdAt).toLocaleString()}
                                    </Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-gray-600 text-xs font-medium">{item.target}</Text>
                                    <Text className="text-emerald-600 text-xs font-bold">{item.sentCount} Sent</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
