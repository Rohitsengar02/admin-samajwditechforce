import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Save, Eye, Bold, Italic, List, Image as ImageIcon
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

export default function ModuleEditorPage() {
    const router = useRouter();
    const [content, setContent] = useState('');

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#8B5CF6', '#7C3AED']} className="pt-12 pb-16 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">Module Editor</Text>
                        <Text className="text-purple-100 text-sm mt-1">Edit training content</Text>
                    </View>
                    <TouchableOpacity className="bg-white px-4 py-3 rounded-2xl flex-row items-center">
                        <Eye size={18} color="#8B5CF6" />
                        <Text className="text-purple-600 font-bold ml-2">Preview</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <View className="px-6 pb-8">
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-4">Module Details</Text>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Title</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                            defaultValue="Social Media Basics"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-600 font-medium mb-2">Phase</Text>
                        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <Text className="text-blue-700 font-semibold">Phase 1 - Connect</Text>
                        </View>
                    </View>
                </View>

                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-4">Content Editor</Text>

                    <View className="flex-row flex-wrap mb-4 gap-2">
                        <TouchableOpacity className="bg-gray-100 p-3 rounded-xl">
                            <Bold size={20} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-gray-100 p-3 rounded-xl">
                            <Italic size={20} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-gray-100 p-3 rounded-xl">
                            <List size={20} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-gray-100 p-3 rounded-xl">
                            <ImageIcon size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                        placeholder="Write your content here..."
                        multiline
                        numberOfLines={15}
                        value={content}
                        onChangeText={setContent}
                        style={{ minHeight: 300 }}
                    />
                </View>

                <View className="flex-row space-x-3">
                    <TouchableOpacity onPress={() => router.back()} className="flex-1 bg-gray-100 py-4 rounded-2xl items-center">
                        <Text className="text-gray-700 font-bold">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1">
                        <LinearGradient colors={['#8B5CF6', '#7C3AED']} className="py-4 rounded-2xl items-center flex-row justify-center">
                            <Save size={20} color="white" />
                            <Text className="text-white font-bold ml-2">Save Changes</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
