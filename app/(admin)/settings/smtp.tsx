import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Save, Server, Lock, User } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;
const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View style={{ position: 'absolute', width: size, height: size, top, left, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: size / 2, opacity: 0.6 }} />
);

export default function SmtpSettingsPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        host: 'smtp.gmail.com',
        port: '587',
        username: 'admin@samajwadiparty.in',
        password: '••••••••',
    });

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <LinearGradient colors={['#10B981', '#059669']} className="pt-12 pb-12 px-6 rounded-b-[40px] mb-6">
                <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-3xl font-bold">SMTP Settings</Text>
                        <Text className="text-emerald-100 text-sm mt-1">Email server configuration</Text>
                    </View>
                </View>
            </LinearGradient>

            <View className="px-6">
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">SMTP Host</Text>
                        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
                            <Server size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                value={formData.host}
                                onChangeText={(text) => setFormData({ ...formData, host: text })}
                            />
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Port</Text>
                        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
                            <Server size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                value={formData.port}
                                keyboardType="numeric"
                                onChangeText={(text) => setFormData({ ...formData, port: text })}
                            />
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Username</Text>
                        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
                            <User size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                value={formData.username}
                                onChangeText={(text) => setFormData({ ...formData, username: text })}
                            />
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="text-gray-600 font-medium mb-2">Password</Text>
                        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4">
                            <Lock size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                value={formData.password}
                                secureTextEntry
                                onChangeText={(text) => setFormData({ ...formData, password: text })}
                            />
                        </View>
                    </View>

                    <TouchableOpacity className="bg-emerald-600 py-4 rounded-2xl flex-row justify-center items-center shadow-lg shadow-emerald-200">
                        <Save size={20} color="white" />
                        <Text className="text-white font-bold ml-2 text-lg">Save Configuration</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
