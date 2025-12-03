import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image, Alert, ActivityIndicator, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Platform } from 'react-native';
import { ArrowLeft, Upload, Image as ImageIcon, Download, Edit, Trash2, Eye, ExternalLink } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const getApiUrl = () => {
    if (Platform.OS === 'android') {
        return 'http://192.168.1.39:5000/api/resources';
    }
    if (process.env.EXPO_PUBLIC_API_URL) return `${process.env.EXPO_PUBLIC_API_URL}/api/resources`;
    return 'http://localhost:5000/api/resources';
};

const API_URL = getApiUrl();

const ResourceCard = ({ resource, onDelete, router }: any) => (
    <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden h-full">
        <View className="relative">
            {resource.thumbnailUrl ? (
                <Image
                    source={{ uri: resource.thumbnailUrl }}
                    style={{ width: '100%', height: 200 }}
                    resizeMode="cover"
                />
            ) : (
                <View className="bg-gradient-to-br from-indigo-100 to-purple-100 h-48 items-center justify-center">
                    <ImageIcon size={48} color="#9CA3AF" />
                </View>
            )}
            {resource.youtubeLink && (
                <View className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded-lg flex-row items-center">
                    <ExternalLink size={12} color="white" />
                    <Text className="text-white text-xs font-bold ml-1">YouTube</Text>
                </View>
            )}
        </View>
        <View className="p-5 flex-1">
            <Text className="text-gray-900 font-bold text-lg mb-2" numberOfLines={2}>{resource.title}</Text>
            <Text className="text-gray-500 text-sm mb-3" numberOfLines={2}>{resource.description}</Text>

            <View className="flex-row items-center mb-4 mt-auto">
                <Download size={14} color="#9CA3AF" />
                <Text className="text-gray-500 text-sm ml-1.5">{resource.downloads} downloads</Text>
                <View className="w-1 h-1 bg-gray-300 rounded-full mx-2" />
                <Eye size={14} color="#9CA3AF" />
                <Text className="text-gray-500 text-sm ml-1.5">{resource.views} views</Text>
            </View>

            <View className="flex-row space-x-2 pt-2 border-t border-gray-100">
                <TouchableOpacity
                    onPress={() => {
                        // Increment download count
                        fetch(`${API_URL}/${resource._id}/download`, { method: 'POST' });
                        // Open file or link
                        if (resource.youtubeLink) {
                            Linking.openURL(resource.youtubeLink).catch(err => Alert.alert('Error', 'Could not open link'));
                        } else if (resource.fileUrl) {
                            Alert.alert('Download', `Opening: ${resource.title}`);
                            // In a real app, you would use Linking.openURL(resource.fileUrl)
                        }
                    }}
                    className={`flex-1 ${resource.youtubeLink ? 'bg-red-600' : 'bg-indigo-600'} py-3 rounded-xl items-center flex-row justify-center`}
                >
                    {resource.youtubeLink ? <ExternalLink size={16} color="white" /> : <Download size={16} color="white" />}
                    <Text className="text-white font-bold ml-2">{resource.youtubeLink ? 'Open' : 'Download'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push({ pathname: '/(admin)/resources/upload', params: { id: resource._id } })}
                    className="bg-gray-100 px-4 py-3 rounded-xl justify-center"
                >
                    <Edit size={18} color="#6B7280" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onDelete(resource._id)}
                    className="bg-red-50 px-4 py-3 rounded-xl justify-center"
                >
                    <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

interface CategoryPageProps {
    category: string;
    title: string;
    subtitle: string;
    gradientColors: string[];
}

export default function CategoryPage({ category, title, subtitle, gradientColors }: CategoryPageProps) {
    const router = useRouter();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}?category=${category}`);
            const data = await response.json();

            if (data.success) {
                setResources(data.data);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
            Alert.alert('Error', 'Failed to fetch resources');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchResources();
        }, [])
    );

    const handleDelete = (id: string) => {
        Alert.alert('Delete Resource', 'Are you sure you want to delete this resource?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                        const data = await response.json();
                        if (data.success) {
                            setResources(resources.filter((item: any) => item._id !== id));
                            Alert.alert('Success', 'Resource deleted successfully');
                        } else {
                            Alert.alert('Error', 'Failed to delete resource');
                        }
                    } catch (error) {
                        console.error('Error deleting resource:', error);
                        Alert.alert('Error', 'Failed to delete resource');
                    }
                }
            }
        ]);
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={gradientColors as any} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">{title}</Text>
                        <Text className="text-white/80 text-sm mt-1">{subtitle}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/(admin)/resources/upload')}
                        className="bg-white px-4 py-3 rounded-2xl flex-row items-center"
                    >
                        <Upload size={20} color={gradientColors[0]} />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <View className="px-4 pb-8">
                <View className="w-full max-w-7xl mx-auto">
                    {loading ? (
                        <View className="items-center py-10">
                            <ActivityIndicator size="large" color={gradientColors[0]} />
                        </View>
                    ) : resources.length > 0 ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                marginHorizontal: -8,
                            }}
                        >
                            {resources.map((resource: any) => (
                                <View
                                    key={resource._id}
                                    style={{
                                        width: screenWidth > 1024 ? '33.333%' : screenWidth > 768 ? '50%' : '100%',
                                        paddingHorizontal: 8,
                                        marginBottom: 16,
                                    }}
                                >
                                    <ResourceCard resource={resource} onDelete={handleDelete} router={router} />
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View className="items-center py-10">
                            <ImageIcon size={48} color="#9CA3AF" />
                            <Text className="text-gray-400 mt-4 text-center">No {title.toLowerCase()} found</Text>
                            <TouchableOpacity
                                onPress={() => router.push('/(admin)/resources/upload')}
                                className="mt-4 bg-indigo-600 px-6 py-3 rounded-xl"
                            >
                                <Text className="text-white font-bold">Upload First Resource</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
