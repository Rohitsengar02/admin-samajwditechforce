import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, Image, Alert, ActivityIndicator, Modal, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft, Save, Image as ImageIcon, Type, AlignLeft, List,
    Trash2, Plus, CheckCircle, Upload, MoreVertical, X, Sparkles
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { getApiUrl } from '../../../utils/api';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

const API_URL = `${getApiUrl()}/news`;
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dssmutzly/image/upload';
const UPLOAD_PRESET = 'multimallpro';


type BlockType = 'heading' | 'paragraph' | 'image' | 'list';

interface ContentBlock {
    id: string;
    type: BlockType;
    content: string;
    meta?: any;
}

// Success Modal Component
const SuccessModal = ({ visible, onClose, isEditing }: { visible: boolean; onClose: () => void; isEditing: boolean }) => (
    <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
    >
        <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
        }}>
            <View style={{
                backgroundColor: 'white',
                borderRadius: 32,
                padding: 32,
                alignItems: 'center',
                width: '100%',
                maxWidth: 340,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.25,
                shadowRadius: 20,
                elevation: 10,
            }}>
                {/* Success Icon */}
                <View style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: '#dcfce7',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 24,
                }}>
                    <View style={{
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        backgroundColor: '#22c55e',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <CheckCircle size={40} color="white" />
                    </View>
                </View>

                {/* Sparkles decoration */}
                <View style={{ position: 'absolute', top: 40, left: 40 }}>
                    <Sparkles size={24} color="#fbbf24" />
                </View>
                <View style={{ position: 'absolute', top: 60, right: 50 }}>
                    <Sparkles size={18} color="#f472b6" />
                </View>

                {/* Title */}
                <Text style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: 12,
                    textAlign: 'center',
                }}>
                    🎉 {isEditing ? 'Updated!' : 'Published!'}
                </Text>

                {/* Message */}
                <Text style={{
                    fontSize: 16,
                    color: '#6b7280',
                    textAlign: 'center',
                    marginBottom: 32,
                    lineHeight: 24,
                }}>
                    Your news article has been {isEditing ? 'updated' : 'published'} successfully and is now live!
                </Text>

                {/* Button */}
                <TouchableOpacity
                    onPress={onClose}
                    style={{
                        width: '100%',
                        borderRadius: 16,
                        overflow: 'hidden',
                    }}
                >
                    <LinearGradient
                        colors={['#22c55e', '#16a34a']}
                        style={{
                            paddingVertical: 16,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{
                            color: 'white',
                            fontSize: 18,
                            fontWeight: 'bold',
                        }}>
                            View News 🚀
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

export default function NewsEditorPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const isEditing = !!params.id;

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        console.log('API_URL:', API_URL);
        if (isEditing) {
            fetchNewsDetails();
        }
    }, [isEditing]);

    const fetchNewsDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/${params.id}`);
            const data = await response.json();
            if (data.success) {
                const news = data.data;
                setTitle(news.title);
                setExcerpt(news.excerpt);
                setCoverImage(news.coverImage);
                setBlocks(news.content.map((b: any) => ({ ...b, id: b._id || Date.now().toString() })));
            }
        } catch (error) {
            console.error('Error fetching news details:', error);
            Alert.alert('Error', 'Failed to load news details');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async (callback: (url: string) => void) => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled && result.assets[0].base64) {
                uploadToCloudinary(result.assets[0].base64, callback);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const uploadToCloudinary = async (base64: string, callback: (url: string) => void) => {
        try {
            setUploading(true);
            const data = new FormData();
            data.append('file', `data:image/jpeg;base64,${base64}`);
            data.append('upload_preset', UPLOAD_PRESET);

            const response = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: data,
            });

            const result = await response.json();
            if (result.secure_url) {
                callback(result.secure_url);
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const saveNews = async (status: 'Draft' | 'Published') => {
        console.log('=== SAVE NEWS CALLED ===');
        console.log('Status:', status);
        console.log('API_URL:', API_URL);

        if (!title || !excerpt) {
            if (Platform.OS === 'web') {
                alert('⚠️ Title and Excerpt are required');
            } else {
                Alert.alert('Validation Error', 'Title and Excerpt are required');
            }
            return;
        }

        const newsData = {
            title,
            excerpt,
            coverImage: coverImage || undefined,
            content: blocks.map(({ id, ...rest }) => rest),
            status
        };

        console.log('Data to save:', JSON.stringify(newsData, null, 2));

        try {
            setLoading(true);
            const url = isEditing ? `${API_URL}/${params.id}` : API_URL;
            const method = isEditing ? 'PUT' : 'POST';

            console.log('Calling API:', url);
            console.log('Method:', method);

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newsData),
            });

            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Response text:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                throw new Error('Server returned invalid JSON: ' + responseText);
            }

            if (data.success) {
                // Show beautiful success modal
                setShowSuccessModal(true);
            } else {
                const errorMessage = Array.isArray(data.error) ? data.error.join('\n') : (data.error || 'Failed to save news');
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('=== ERROR SAVING NEWS ===');
            console.error(error);
            if (Platform.OS === 'web') {
                alert(`❌ Failed to save: ${(error as Error).message}`);
            } else {
                Alert.alert('Error', `Failed to save: ${(error as Error).message}\n\nAPI: ${API_URL}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        router.push('/(admin)/news' as any);
    };

    const addBlock = (type: BlockType) => {
        const newBlock: ContentBlock = {
            id: Date.now().toString(),
            type,
            content: '',
            meta: type === 'heading' ? { size: 'h2' } : type === 'list' ? { items: [''] } : undefined
        };
        setBlocks([...blocks, newBlock]);
    };

    const updateBlock = (id: string, content: string) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
    };

    const updateBlockMeta = (id: string, meta: any) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, meta: { ...b.meta, ...meta } } : b));
    };

    const removeBlock = (id: string) => {
        setBlocks(prevBlocks => prevBlocks.filter(b => b.id !== id));
    };

    const renderBlock = (block: ContentBlock, index: number) => {
        switch (block.type) {
            case 'heading':
                return (
                    <View key={block.id} className="mb-24">
                        <View className="flex-row justify-between items-center mb-2">
                            <View className="flex-row space-x-2">
                                {['h1', 'h2', 'h3'].map((size) => (
                                    <TouchableOpacity
                                        key={size}
                                        onPress={() => updateBlockMeta(block.id, { size })}
                                        className={`px-3 py-1 rounded-lg border ${block.meta.size === size ? 'bg-indigo-600 border-indigo-600' : 'bg-gray-50 border-gray-200'}`}
                                    >
                                        <Text className={`text-xs font-bold ${block.meta.size === size ? 'text-white' : 'text-gray-500'}`}>{size.toUpperCase()}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TouchableOpacity onPress={() => removeBlock(block.id)}>
                                <Trash2 size={16} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            className={`bg-white border border-gray-200 rounded-xl p-4 text-gray-900 font-bold ${block.meta.size === 'h1' ? 'text-2xl' : block.meta.size === 'h2' ? 'text-xl' : 'text-lg'
                                }`}
                            placeholder="Heading Text"
                            value={block.content}
                            onChangeText={(text) => updateBlock(block.id, text)}
                        />
                    </View>
                );

            case 'paragraph':
                return (
                    <View key={block.id} className="mb-4 relative">
                        <TouchableOpacity
                            onPress={() => removeBlock(block.id)}
                            className="absolute right-2 top-2 z-10 bg-gray-100 p-1.5 rounded-lg"
                        >
                            <Trash2 size={14} color="#EF4444" />
                        </TouchableOpacity>
                        <TextInput
                            className="bg-white border border-gray-200 rounded-xl p-4 text-gray-700 leading-6 min-h-[100px]"
                            placeholder="Write your paragraph here..."
                            multiline
                            textAlignVertical="top"
                            value={block.content}
                            onChangeText={(text) => updateBlock(block.id, text)}
                        />
                    </View>
                );

            case 'list':
                return (
                    <View key={block.id} className="mb-4 bg-white border border-gray-200 rounded-xl p-4">
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="font-bold text-gray-700 flex-row items-center">
                                <List size={16} color="#4B5563" /> Bullet Points
                            </Text>
                            <TouchableOpacity onPress={() => removeBlock(block.id)}>
                                <Trash2 size={16} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                        {block.meta.items.map((item: string, idx: number) => (
                            <View key={idx} className="flex-row items-center mb-2">
                                <View className="w-2 h-2 rounded-full bg-indigo-500 mr-3" />
                                <TextInput
                                    className="flex-1 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm"
                                    placeholder={`Point ${idx + 1}`}
                                    value={item}
                                    onChangeText={(text) => {
                                        const newItems = [...block.meta.items];
                                        newItems[idx] = text;
                                        updateBlockMeta(block.id, { items: newItems });
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        const newItems = block.meta.items.filter((_: any, i: number) => i !== idx);
                                        updateBlockMeta(block.id, { items: newItems });
                                    }}
                                    className="ml-2"
                                >
                                    <X size={16} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity
                            onPress={() => updateBlockMeta(block.id, { items: [...block.meta.items, ''] })}
                            className="mt-2 flex-row items-center justify-center py-2 bg-gray-50 rounded-lg border border-dashed border-gray-300"
                        >
                            <Plus size={14} color="#6B7280" />
                            <Text className="text-gray-500 text-xs font-bold ml-1">Add Point</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'image':
                return (
                    <View key={block.id} className="mb-4">
                        <View className="flex-row justify-end mb-2">
                            <TouchableOpacity onPress={() => removeBlock(block.id)}>
                                <Trash2 size={16} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                        {block.content ? (
                            <View>
                                <Image source={{ uri: block.content }} className="w-full h-48 rounded-xl bg-gray-100" resizeMode="cover" />
                                <TouchableOpacity
                                    onPress={() => updateBlock(block.id, '')}
                                    className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full"
                                >
                                    <X size={14} color="white" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={() => pickImage((url) => updateBlock(block.id, url))}
                                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl h-48 items-center justify-center"
                            >
                                {uploading ? (
                                    <ActivityIndicator color="#4F46E5" />
                                ) : (
                                    <>
                                        <ImageIcon size={32} color="#9CA3AF" />
                                        <Text className="text-gray-400 font-medium mt-2">Tap to upload image</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}
                        <TextInput
                            className="mt-2 bg-white border border-gray-200 rounded-lg p-3 text-sm"
                            placeholder="Image Caption (Optional)"
                            value={block.meta?.caption || ''}
                            onChangeText={(text) => updateBlockMeta(block.id, { caption: text })}
                        />
                    </View>
                );

            default:
                return null;
        }
    };

    if (loading && !uploading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#0284c7" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <LinearGradient colors={['#0ea5e9', '#0284c7']} className="pt-12 pb-16 px-6 rounded-b-[40px] mb-6">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold">{isEditing ? 'Edit Article' : 'New Article'}</Text>
                            <Text className="text-sky-100 text-sm mt-1">Compose your news story</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View className="w-full max-w-5xl mx-auto px-4 pb-64">
                    {/* Main Title */}
                    <View className="bg-white rounded-3xl p-6 shadow-lg mb-6 -mt-10">
                        <Text className="text-gray-500 font-bold text-xs uppercase mb-2">Article Title</Text>
                        <TextInput
                            className="text-2xl font-bold text-gray-900 leading-tight mb-4"
                            placeholder="Enter article title..."
                            multiline
                            value={title}
                            onChangeText={setTitle}
                        />
                        <Text className="text-gray-500 font-bold text-xs uppercase mb-2">Description</Text>
                        <TextInput
                            className="text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-2"
                            placeholder="Enter description..."
                            multiline
                            value={excerpt}
                            onChangeText={setExcerpt}
                        />
                    </View>

                    {/* Cover Image */}
                    <TouchableOpacity
                        onPress={() => !coverImage && pickImage(setCoverImage)}
                        className="bg-white rounded-3xl p-4 shadow-lg mb-6"
                    >
                        {coverImage ? (
                            <View>
                                <Image source={{ uri: coverImage }} className="w-full h-48 rounded-2xl" resizeMode="cover" />
                                <TouchableOpacity
                                    onPress={() => setCoverImage(null)}
                                    className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                                >
                                    <Trash2 size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="h-48 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 items-center justify-center">
                                {uploading ? (
                                    <ActivityIndicator color="#4F46E5" />
                                ) : (
                                    <>
                                        <Upload size={32} color="#9CA3AF" />
                                        <Text className="text-gray-400 font-bold mt-2">Upload Cover Image</Text>
                                    </>
                                )}
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Content Blocks */}
                    <View>
                        {blocks.map((block, index) => renderBlock(block, index))}
                    </View>

                    {/* Add Block Buttons */}
                    <Text className="text-center text-gray-400 text-xs font-bold mb-3 uppercase tracking-widest">Add Content Block</Text>
                    <View className="flex-row justify-between mb-8">
                        <TouchableOpacity onPress={() => addBlock('heading')} className="bg-white p-4 rounded-2xl shadow-sm items-center flex-1 mr-2 border border-gray-100">
                            <Type size={24} color="#4F46E5" />
                            <Text className="text-gray-600 text-xs font-bold mt-2">Heading</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => addBlock('paragraph')} className="bg-white p-4 rounded-2xl shadow-sm items-center flex-1 mr-2 border border-gray-100">
                            <AlignLeft size={24} color="#10B981" />
                            <Text className="text-gray-600 text-xs font-bold mt-2">Text</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => addBlock('list')} className="bg-white p-4 rounded-2xl shadow-sm items-center flex-1 mr-2 border border-gray-100">
                            <List size={24} color="#F59E0B" />
                            <Text className="text-gray-600 text-xs font-bold mt-2">List</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => addBlock('image')} className="bg-white p-4 rounded-2xl shadow-sm items-center flex-1 border border-gray-100">
                            <ImageIcon size={24} color="#EC4899" />
                            <Text className="text-gray-600 text-xs font-bold mt-2">Image</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                backgroundColor: 'white',
                borderTopWidth: 1,
                borderTopColor: '#f3f4f6',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 10,
                paddingBottom: Platform.OS === 'ios' ? 44 : 74,
            }}>
                <View style={{
                    width: '100%',
                    maxWidth: 800,
                    marginHorizontal: 'auto',
                    paddingHorizontal: 24,
                    paddingTop: 16,
                    paddingBottom: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            console.log('Draft button pressed!');
                            saveNews('Draft');
                        }}
                        disabled={loading}
                        style={{
                            backgroundColor: '#F3F4F6',
                            paddingHorizontal: 32,
                            paddingVertical: 16,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            opacity: loading ? 0.5 : 1
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#6B7280" />
                        ) : (
                            <Text style={{ color: '#4B5563', fontWeight: 'bold', fontSize: 16 }}>Save Draft</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            console.log('Publish button pressed!');
                            saveNews('Published');
                        }}
                        disabled={loading}
                        style={{
                            flex: 1,
                            marginLeft: 16,
                            borderRadius: 16,
                            overflow: 'hidden',
                            opacity: loading ? 0.5 : 1
                        }}
                    >
                        <LinearGradient
                            colors={['#0ea5e9', '#0284c7']}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 16
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <>
                                    <CheckCircle size={20} color="white" />
                                    <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 8, fontSize: 18 }}>Publish News</Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Success Modal */}
            <SuccessModal
                visible={showSuccessModal}
                onClose={handleSuccessModalClose}
                isEditing={isEditing}
            />
        </View>
    );
}

