import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Map, TrendingUp, ChevronRight, Activity, CheckCircle,
    Settings, Image as ImageIcon, Newspaper, MapPin, FileText
} from 'lucide-react-native';
import { getApiUrl } from '../../../utils/api';

const screenWidth = Dimensions.get('window').width;

const API_URL = getApiUrl();

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: string;
    icon: any;
    gradient: [string, string];
    onPress?: () => void;
}

const StatsCard = ({ title, value, change, icon: Icon, gradient, onPress }: StatsCardProps) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ flex: 1, minWidth: 150 }}>
        <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                padding: 16,
                borderRadius: 20,
                height: 120,
                justifyContent: 'space-between',
                margin: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
                overflow: 'hidden',
            }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12 }}>
                    <Icon size={20} color="white" />
                </View>
                {change && (
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 10 }}>{change}</Text>
                    </View>
                )}
            </View>
            <View>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '500', fontSize: 12 }}>{title}</Text>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 22 }}>{value}</Text>
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

const QuickActionButton = ({ icon: Icon, label, color, onPress }: any) => (
    <TouchableOpacity style={{ alignItems: 'center', padding: 10, flex: 1 }} onPress={onPress}>
        <View style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: color,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 6,
        }}>
            <Icon size={24} color="#4F46E5" />
        </View>
        <Text style={{ color: '#374151', fontWeight: '500', fontSize: 11, textAlign: 'center' }}>{label}</Text>
    </TouchableOpacity>
);

// Poster Card Component - LARGER SIZE
const PosterCard = ({ poster, size = 'normal' }: { poster: any; size?: 'normal' | 'small' }) => (
    <View style={{
        width: size === 'small' ? 220 : (screenWidth - 60),
        marginRight: 16,
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 14,
    }}>
        <Image source={{ uri: poster.imageUrl }} style={{ width: '100%', height: size === 'small' ? 160 : 200 }} resizeMode="cover" />
        <View style={{ padding: 16 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#111827' }} numberOfLines={2}>{poster.title}</Text>
            <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>⬇️ {poster.downloadCount} downloads</Text>
        </View>
    </View>
);

// News Card Component - LARGER SIZE
const NewsCard = ({ news, size = 'normal' }: { news: any; size?: 'normal' | 'small' }) => (
    <View style={{
        width: size === 'small' ? 300 : 'auto',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 20,
        marginRight: size === 'small' ? 16 : 0,
        marginBottom: size === 'normal' ? 14 : 0,
        flexDirection: size === 'normal' ? 'row' : 'column',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    }}>
        {news.coverImage && (
            <Image
                source={{ uri: news.coverImage }}
                style={{
                    width: size === 'small' ? '100%' : 90,
                    height: size === 'small' ? 160 : 90,
                    borderRadius: 14,
                    marginRight: size === 'normal' ? 16 : 0,
                    marginBottom: size === 'small' ? 14 : 0,
                }}
                resizeMode="cover"
            />
        )}
        <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', color: '#111827', fontSize: 16 }} numberOfLines={2}>{news.title}</Text>
            <Text style={{ color: '#6b7280', fontSize: 14, marginTop: 6 }} numberOfLines={2}>{news.excerpt}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                <View style={{
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    borderRadius: 10,
                    backgroundColor: news.status === 'Published' ? '#dcfce7' : '#fef3c7',
                }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: news.status === 'Published' ? '#16a34a' : '#d97706' }}>
                        {news.status}
                    </Text>
                </View>
            </View>
        </View>
    </View>
);

// District Card Component - LARGER SIZE
const DistrictCard = ({ district }: { district: any }) => (
    <View style={{
        width: 160,
        backgroundColor: 'white',
        borderRadius: 18,
        padding: 16,
        marginRight: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    }}>
        <View style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: '#eef2ff',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
        }}>
            <MapPin size={24} color="#4F46E5" />
        </View>
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#111827' }} numberOfLines={1}>{district.name}</Text>
        <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>{district.code || 'UP'}</Text>
    </View>
);

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        districts: 0,
        posters: 0,
        posterDownloads: 0,
        news: 0,
        publishedNews: 0,
        draftNews: 0,
    });
    const [allNews, setAllNews] = useState<any[]>([]);
    const [allPosters, setAllPosters] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch districts
            const districtsRes = await fetch(`${API_URL}/districts`);
            const districtsData = await districtsRes.json();
            // Handle both array format and { data: [] } format
            const districtsList = Array.isArray(districtsData) ? districtsData : (districtsData.data || []);
            setDistricts(districtsList);

            // Fetch poster stats
            const posterStatsRes = await fetch(`${API_URL}/posters/stats`);
            const posterStats = await posterStatsRes.json();

            // Fetch all posters
            const postersRes = await fetch(`${API_URL}/posters`);
            const postersData = await postersRes.json();
            setAllPosters(postersData.posters || []);

            // Fetch news
            const newsRes = await fetch(`${API_URL}/news`);
            const newsData = await newsRes.json();
            const newsList = newsData.data || [];
            setAllNews(newsList);

            const publishedNews = newsList.filter((n: any) => n.status === 'Published').length;
            const draftNews = newsList.filter((n: any) => n.status === 'Draft').length;

            setStats({
                districts: districtsList.length,
                posters: posterStats.totalPosters || 0,
                posterDownloads: posterStats.totalDownloads || 0,
                news: newsList.length,
                publishedNews,
                draftNews,
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Split posters: show all in carousel
    const carouselPosters = allPosters;

    // Split news: first 5 in list, rest in carousel
    const listNews = allNews.slice(0, 5);
    const carouselNews = allNews.slice(5);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={{ marginTop: 16, color: '#6b7280', fontWeight: '500' }}>Loading dashboard...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={{ position: 'relative', overflow: 'hidden' }}>
                <LinearGradient
                    colors={['#4F46E5', '#7C3AED']}
                    style={{
                        paddingTop: 48,
                        paddingBottom: 24,
                        paddingHorizontal: 20,
                        borderBottomLeftRadius: 32,
                        borderBottomRightRadius: 32,
                    }}
                >
                    <AnimatedBubble size={120} top={10} left={screenWidth - 80} />
                    <AnimatedBubble size={80} top={80} left={20} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <View>
                            <Text style={{ color: '#c7d2fe', fontSize: 16, fontWeight: '500' }}>Welcome back,</Text>
                            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Admin Dashboard</Text>
                        </View>
                        <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 4, borderRadius: 50, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' }}>
                            <Image source={{ uri: 'https://avatar.iran.liara.run/public/boy' }} style={{ width: 44, height: 44, borderRadius: 22 }} />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>

            <View style={{ padding: 16, paddingBottom: 100 }}>
                {/* Stats Cards Row */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20, marginTop: -20 }}>
                    <StatsCard title="Districts" value={stats.districts} icon={Map} gradient={['#f59e0b', '#ef4444']} onPress={() => router.push('/(admin)/districts' as any)} />
                    <StatsCard title="Posters" value={stats.posters} change={`⬇️${stats.posterDownloads}`} icon={ImageIcon} gradient={['#6366f1', '#8b5cf6']} onPress={() => router.push('/(admin)/posters' as any)} />
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
                    <StatsCard title="News" value={stats.news} change={`${stats.publishedNews} Live`} icon={Newspaper} gradient={['#10b981', '#059669']} onPress={() => router.push('/(admin)/news' as any)} />
                    <StatsCard title="Downloads" value={stats.posterDownloads} icon={TrendingUp} gradient={['#0ea5e9', '#3b82f6']} />
                </View>

                {/* Quick Actions */}
                <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 12 }}>Quick Actions</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <QuickActionButton icon={Map} label="Districts" color="#eef2ff" onPress={() => router.push('/(admin)/districts' as any)} />
                        <QuickActionButton icon={ImageIcon} label="Posters" color="#f5f3ff" onPress={() => router.push('/(admin)/posters' as any)} />
                        <QuickActionButton icon={Newspaper} label="News" color="#ecfdf5" onPress={() => router.push('/(admin)/news' as any)} />
                        <QuickActionButton icon={Settings} label="Settings" color="#f3f4f6" />
                    </View>
                </View>

                {/* Districts Section */}
                {districts.length > 0 && (
                    <View style={{ marginBottom: 24 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>📍 Districts</Text>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => router.push('/(admin)/districts' as any)}>
                                <Text style={{ color: '#4F46E5', fontSize: 14, fontWeight: '600', marginRight: 4 }}>View All ({stats.districts})</Text>
                                <ChevronRight size={18} color="#4F46E5" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {districts.slice(0, 10).map((district: any) => (
                                <DistrictCard key={district._id} district={district} />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Posters Section - Carousel */}
                {allPosters.length > 0 && (
                    <View style={{ marginBottom: 24 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>🖼️ Posters</Text>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => router.push('/(admin)/posters' as any)}>
                                <Text style={{ color: '#4F46E5', fontSize: 14, fontWeight: '600', marginRight: 4 }}>View All ({stats.posters})</Text>
                                <ChevronRight size={18} color="#4F46E5" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {carouselPosters.map((poster: any) => (
                                <PosterCard key={poster._id} poster={poster} size="small" />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* News Section */}
                {allNews.length > 0 && (
                    <View style={{ marginBottom: 24 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>📰 Latest News</Text>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => router.push('/(admin)/news' as any)}>
                                <Text style={{ color: '#4F46E5', fontSize: 14, fontWeight: '600', marginRight: 4 }}>View All ({stats.news})</Text>
                                <ChevronRight size={18} color="#4F46E5" />
                            </TouchableOpacity>
                        </View>

                        {/* First 5 News in List */}
                        {listNews.map((news: any) => (
                            <NewsCard key={news._id} news={news} />
                        ))}

                        {/* Remaining News in Carousel */}
                        {carouselNews.length > 0 && (
                            <View style={{ marginTop: 16 }}>
                                <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 10 }}>More news →</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {carouselNews.map((news: any) => (
                                        <NewsCard key={news._id} news={news} size="small" />
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>
                )}

                {/* Stats Summary */}
                <View style={{ backgroundColor: 'white', padding: 18, borderRadius: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 14 }}>📈 Summary</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#eef2ff', borderRadius: 12, marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Map size={20} color="#4F46E5" />
                            <Text style={{ marginLeft: 10, color: '#374151', fontWeight: '600', fontSize: 14 }}>Districts</Text>
                        </View>
                        <Text style={{ color: '#4F46E5', fontWeight: 'bold', fontSize: 18 }}>{stats.districts}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#f5f3ff', borderRadius: 12, marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ImageIcon size={20} color="#8B5CF6" />
                            <Text style={{ marginLeft: 10, color: '#374151', fontWeight: '600', fontSize: 14 }}>Posters</Text>
                        </View>
                        <Text style={{ color: '#8B5CF6', fontWeight: 'bold', fontSize: 18 }}>{stats.posters}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#ecfdf5', borderRadius: 12, marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Newspaper size={20} color="#10B981" />
                            <Text style={{ marginLeft: 10, color: '#374151', fontWeight: '600', fontSize: 14 }}>Published</Text>
                        </View>
                        <Text style={{ color: '#10B981', fontWeight: 'bold', fontSize: 18 }}>{stats.publishedNews}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#fef3c7', borderRadius: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FileText size={20} color="#F59E0B" />
                            <Text style={{ marginLeft: 10, color: '#374151', fontWeight: '600', fontSize: 14 }}>Drafts</Text>
                        </View>
                        <Text style={{ color: '#F59E0B', fontWeight: 'bold', fontSize: 18 }}>{stats.draftNews}</Text>
                    </View>
                </View>

                {/* System Status */}
                <View style={{ backgroundColor: 'white', padding: 18, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 14 }}>🔧 System</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#dcfce7', borderRadius: 12, marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CheckCircle size={20} color="#16a34a" />
                            <Text style={{ marginLeft: 10, color: '#374151', fontWeight: '600', fontSize: 14 }}>API Status</Text>
                        </View>
                        <Text style={{ color: '#16a34a', fontWeight: 'bold' }}>Online</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#dbeafe', borderRadius: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Activity size={20} color="#3B82F6" />
                            <Text style={{ marginLeft: 10, color: '#374151', fontWeight: '600', fontSize: 14 }}>Last Refresh</Text>
                        </View>
                        <Text style={{ color: '#3B82F6', fontWeight: 'bold' }}>Just now</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
