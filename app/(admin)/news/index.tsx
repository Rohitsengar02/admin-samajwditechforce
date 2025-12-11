import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Plus, Search, Edit, Trash2, Calendar, Eye } from 'lucide-react-native';
import { getApiUrl } from '../../../utils/api';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const API_URL = `${getApiUrl()}/news`;

const NewsCard = ({ news, router, onDelete }: any) => (
    <View style={{
        backgroundColor: 'white',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        overflow: 'hidden',
        marginBottom: 16,
    }}>
        <View style={{ position: 'relative' }}>
            <Image
                source={{ uri: news.coverImage || 'https://via.placeholder.com/400x200' }}
                style={{ width: '100%', height: 140 }}
                resizeMode="cover"
            />
            <View style={{
                position: 'absolute',
                top: 12,
                right: 12,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: news.status === 'Published' ? '#22c55e' : '#f59e0b',
            }}>
                <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>
                    {news.status}
                </Text>
            </View>
        </View>

        <View style={{ padding: 14 }}>
            <Text style={{ color: '#111827', fontWeight: 'bold', fontSize: 16, marginBottom: 6 }} numberOfLines={2}>
                {news.title}
            </Text>
            <Text style={{ color: '#6b7280', fontSize: 13, marginBottom: 12 }} numberOfLines={2}>
                {news.excerpt}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Calendar size={12} color="#9CA3AF" />
                <Text style={{ color: '#9ca3af', fontSize: 11, marginLeft: 4 }}>
                    {new Date(news.createdAt).toLocaleDateString()}
                </Text>
                <View style={{ width: 3, height: 3, backgroundColor: '#d1d5db', borderRadius: 2, marginHorizontal: 6 }} />
                <Eye size={12} color="#9CA3AF" />
                <Text style={{ color: '#9ca3af', fontSize: 11, marginLeft: 4 }}>
                    {news.views} views
                </Text>
            </View>

            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 10 }}>
                <TouchableOpacity
                    onPress={() => router.push({ pathname: '/(admin)/news/editor', params: { id: news._id } })}
                    style={{
                        flex: 1,
                        backgroundColor: '#eef2ff',
                        marginRight: 6,
                        paddingVertical: 10,
                        borderRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Edit size={14} color="#4F46E5" />
                    <Text style={{ color: '#4F46E5', fontWeight: 'bold', fontSize: 12, marginLeft: 6 }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onDelete(news._id, news.title)}
                    style={{
                        flex: 1,
                        backgroundColor: '#fef2f2',
                        paddingVertical: 10,
                        borderRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Trash2 size={14} color="#EF4444" />
                    <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 12, marginLeft: 6 }}>Delete</Text>
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
            showAlert('Error', 'Failed to fetch news');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (title: string, message: string) => {
        if (Platform.OS === 'web') {
            alert(`${title}: ${message}`);
        } else {
            Alert.alert(title, message);
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

    const handleDelete = async (id: string, title: string) => {
        const confirmDelete = () => {
            return new Promise<boolean>((resolve) => {
                if (Platform.OS === 'web') {
                    resolve(window.confirm(`Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`));
                } else {
                    Alert.alert(
                        '⚠️ Delete News',
                        `Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`,
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
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            const data = await response.json();

            if (data.success) {
                setNewsList(newsList.filter((item: any) => item._id !== id));
                if (Platform.OS === 'web') {
                    alert('✅ News deleted successfully');
                } else {
                    Alert.alert('✅ Success', 'News deleted successfully');
                }
            } else {
                showAlert('Error', 'Failed to delete news');
            }
        } catch (error) {
            console.error('Error deleting news:', error);
            showAlert('Error', 'Failed to delete news');
        }
    };

    const filteredNews = newsList.filter((news: any) =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const publishedCount = newsList.filter((n: any) => n.status === 'Published').length;
    const draftCount = newsList.filter((n: any) => n.status === 'Draft').length;

    // Calculate card width based on screen size
    const getCardWidth = () => {
        if (screenWidth > 1200) return '25%';      // 4 cards per row
        if (screenWidth > 900) return '33.333%';   // 3 cards per row
        if (screenWidth > 600) return '50%';       // 2 cards per row
        return '100%';                              // 1 card per row (mobile)
    };

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#f9fafb' }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        >
            <LinearGradient
                colors={['#0ea5e9', '#0284c7']}
                style={{
                    paddingTop: 48,
                    paddingBottom: 48,
                    paddingHorizontal: 24,
                    borderBottomLeftRadius: 40,
                    borderBottomRightRadius: 40,
                    marginBottom: 24
                }}
            >
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12, marginRight: 16 }}
                    >
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>News & Updates</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 }}>Manage party announcements</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/(admin)/news/editor' as any)}
                        style={{
                            backgroundColor: 'white',
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            borderRadius: 16,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <Plus size={20} color="#0284c7" />
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    paddingHorizontal: 16,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.3)'
                }}>
                    <Search size={20} color="white" />
                    <TextInput
                        style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 12, color: 'white', fontSize: 16 }}
                        placeholder="Search news..."
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </LinearGradient>

            <View style={{ paddingHorizontal: 16 }}>
                {/* Stats */}
                <View style={{ flexDirection: 'row', marginBottom: 24 }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 16,
                        marginRight: 8,
                        borderLeftWidth: 4,
                        borderLeftColor: '#22c55e',
                        elevation: 2,
                    }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>{loading ? '...' : publishedCount}</Text>
                        <Text style={{ color: '#6b7280', fontSize: 14 }}>Published</Text>
                    </View>
                    <View style={{
                        flex: 1,
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 16,
                        marginLeft: 8,
                        borderLeftWidth: 4,
                        borderLeftColor: '#f59e0b',
                        elevation: 2,
                    }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>{loading ? '...' : draftCount}</Text>
                        <Text style={{ color: '#6b7280', fontSize: 14 }}>Drafts</Text>
                    </View>
                </View>

                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 16, paddingHorizontal: 8 }}>
                    Recent Articles ({filteredNews.length})
                </Text>

                {loading ? (
                    <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#0284c7" />
                        <Text style={{ color: '#9ca3af', marginTop: 16 }}>Loading news...</Text>
                    </View>
                ) : filteredNews.length > 0 ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 }}>
                        {filteredNews.map((news: any) => (
                            <View
                                key={news._id}
                                style={{
                                    width: getCardWidth(),
                                    paddingHorizontal: 8,
                                }}
                            >
                                <NewsCard
                                    news={news}
                                    router={router}
                                    onDelete={handleDelete}
                                />
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                        <Text style={{ color: '#9ca3af', fontSize: 16 }}>No news articles found</Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(admin)/news/editor' as any)}
                            style={{
                                marginTop: 16,
                                backgroundColor: '#0284c7',
                                paddingHorizontal: 24,
                                paddingVertical: 12,
                                borderRadius: 12
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Create First Article</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
