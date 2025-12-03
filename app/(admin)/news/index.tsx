import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Plus, Search, Edit, Trash2, Calendar, Eye } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

import { Platform } from 'react-native';

const getApiUrl = () => {
    if (Platform.OS === 'android') {
        return 'http://192.168.1.39:5000/api';
    }
    if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
    return 'http://localhost:5000/api';
};

const API_URL = `${getApiUrl()}/news`;

const NewsCard = ({ news, router, onDelete }: any) => (
    <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden h-full">
        <View className="relative">
            <Image
                source={{ uri: news.coverImage || 'https://via.placeholder.com/400x200' }}
                style={{ width: '100%', height: 160 }}
                resizeMode="cover"
            />
            <View className={`absolute top-3 right-3 px-3 py-1.5 rounded-full ${news.status === 'Published' ? 'bg-green-500' : 'bg-amber-500'}`}>
                <Text className="text-white text-xs font-bold">
                    {news.status}
                </Text>
            </View>
        </View>

        <View className="p-4 flex-1">
            <Text className="text-gray-900 font-bold text-lg mb-2" numberOfLines={2}>{news.title}</Text>
            <Text className="text-gray-500 text-sm mb-4" numberOfLines={3}>{news.excerpt}</Text>

            <View className="flex-row items-center mb-4">
                <Calendar size={14} color="#9CA3AF" />
                <Text className="text-gray-400 text-xs ml-1.5">{new Date(news.createdAt).toLocaleDateString()}</Text>
                <View className="w-1 h-1 bg-gray-300 rounded-full mx-2" />
                <Eye size={14} color="#9CA3AF" />
                <Text className="text-gray-400 text-xs ml-1.5">{news.views} views</Text>
            </View>

            <View className="flex-row border-t border-gray-100 pt-3 mt-auto">
                <TouchableOpacity
                    onPress={() => router.push({ pathname: '/(admin)/news/editor', params: { id: news._id } })}
                    className="flex-1 bg-indigo-50 mr-2 py-2.5 rounded-xl flex-row items-center justify-center"
                >
                    <Edit size={16} color="#4F46E5" />
                    <Text className="text-indigo-600 font-bold text-xs ml-2">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onDelete(news._id)}
                    className="flex-1 bg-red-50 py-2.5 rounded-xl flex-row items-center justify-center"
                >
                    <Trash2 size={16} color="#EF4444" />
                    <Text className="text-red-600 font-bold text-xs ml-2">Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

export default function NewsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNews = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (data.success) {
                setNewsList(data.data);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            Alert.alert('Error', 'Failed to fetch news');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchNews();
        }, [])
    );

    const handleDelete = (id: string) => {
        Alert.alert('Delete News', 'Are you sure you want to delete this article?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                        const data = await response.json();
                        if (data.success) {
                            setNewsList(newsList.filter((item: any) => item._id !== id));
                        } else {
                            Alert.alert('Error', 'Failed to delete news');
                        }
                    } catch (error) {
                        console.error('Error deleting news:', error);
                        Alert.alert('Error', 'Failed to delete news');
                    }
                }
            }
        ]);
    };

    const filteredNews = newsList.filter((news: any) =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const publishedCount = newsList.filter((n: any) => n.status === 'Published').length;
    const draftCount = newsList.filter((n: any) => n.status === 'Draft').length;

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#0ea5e9', '#0284c7']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">News & Updates</Text>
                        <Text className="text-sky-100 text-sm mt-1">Manage party announcements</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/(admin)/news/editor' as any)}
                        className="bg-white px-4 py-3 rounded-2xl flex-row items-center shadow-lg"
                    >
                        <Plus size={20} color="#0284c7" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center bg-white/20 backdrop-blur-md px-4 rounded-2xl border border-white/30">
                    <Search size={20} color="white" />
                    <TextInput
                        className="flex-1 py-3 px-3 text-white"
                        placeholder="Search news..."
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </LinearGradient>

            <View className="px-4 pb-8">
                <View className="w-full max-w-7xl mx-auto">
                    <View className="flex-row mb-6 space-x-3">
                        <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border-l-4 border-green-500">
                            <Text className="text-2xl font-bold text-gray-900">{publishedCount}</Text>
                            <Text className="text-gray-500 text-sm">Published</Text>
                        </View>
                        <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border-l-4 border-amber-500">
                            <Text className="text-2xl font-bold text-gray-900">{draftCount}</Text>
                            <Text className="text-gray-500 text-sm">Drafts</Text>
                        </View>
                    </View>

                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Recent Articles</Text>

                    {loading ? (
                        <ActivityIndicator size="large" color="#0284c7" />
                    ) : filteredNews.length > 0 ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                marginHorizontal: -8,
                            }}
                        >
                            {filteredNews.map((news: any) => (
                                <View
                                    key={news._id}
                                    style={{
                                        width: screenWidth > 1024 ? '33.333%' : screenWidth > 768 ? '50%' : '100%',
                                        paddingHorizontal: 8,
                                        marginBottom: 16,
                                    }}
                                >
                                    <NewsCard news={news} router={router} onDelete={handleDelete} />
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View className="items-center py-10">
                            <Text className="text-gray-400">No news articles found</Text>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
