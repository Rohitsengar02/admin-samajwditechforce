import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Key, Save, Map, Bell } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

export default function ApiKeysPage() {
    const router = useRouter();
    const [keys, setKeys] = useState({
        googleMaps: 'AIzaSyD...',
        firebase: 'AAAA...',
    });

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#F59E0B', '#D97706']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">API Keys</Text>
                        <Text className="text-amber-100 text-sm mt-1">Manage external integrations</Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="px-6">
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <View className="mb-6">
                        <View className="flex-row items-center mb-2">
                            <Map size={20} color="#F59E0B" />
                            <Text className="text-gray-800 font-bold ml-2">Google Maps API Key</Text>
                        </View>
                        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
                            <Key size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                value={keys.googleMaps}
                                onChangeText={(text) => setKeys({ ...keys, googleMaps: text })}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <View className="mb-6">
                        <View className="flex-row items-center mb-2">
                            <Bell size={20} color="#F59E0B" />
                            <Text className="text-gray-800 font-bold ml-2">Firebase Server Key</Text>
                        </View>
                        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
                            <Key size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                value={keys.firebase}
                                onChangeText={(text) => setKeys({ ...keys, firebase: text })}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <TouchableOpacity className="bg-amber-600 py-4 rounded-2xl flex-row justify-center items-center shadow-lg shadow-amber-200">
                        <Save size={20} color="white" />
                        <Text className="text-white font-bold ml-2 text-lg">Update Keys</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
