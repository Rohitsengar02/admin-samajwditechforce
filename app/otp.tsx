import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

export default function OTPScreen() {
    const router = useRouter();
    const [otp, setOtp] = useState('');

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="flex-1 justify-center items-center p-4">
                <View className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                    <TouchableOpacity onPress={() => router.back()} className="mb-6">
                        <ArrowLeft size={24} color="#4B5563" />
                    </TouchableOpacity>

                    <View className="items-center mb-8">
                        <Text className="text-2xl font-bold text-gray-800">Enter OTP</Text>
                        <Text className="text-gray-500 mt-2 text-center">We have sent a 6-digit code to your email.</Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <TextInput
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl tracking-widest"
                                placeholder="000000"
                                maxLength={6}
                                keyboardType="numeric"
                                value={otp}
                                onChangeText={setOtp}
                            />
                        </View>

                        <TouchableOpacity
                            className="w-full bg-indigo-600 py-4 rounded-xl mt-4 active:bg-indigo-700"
                            onPress={() => router.push('/reset-password')}
                        >
                            <Text className="text-white text-center font-bold text-lg">Verify</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
