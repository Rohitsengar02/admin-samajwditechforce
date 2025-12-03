import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="flex-1 justify-center items-center p-4">
                <View className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                    <View className="items-center mb-8">
                        <Text className="text-2xl font-bold text-gray-800">Reset Password</Text>
                        <Text className="text-gray-500 mt-2 text-center">Create a new strong password.</Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-gray-700 mb-1">New Password</Text>
                            <TextInput
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                                placeholder="••••••••"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <View>
                            <Text className="text-gray-700 mb-1">Confirm Password</Text>
                            <TextInput
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                                placeholder="••••••••"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>

                        <TouchableOpacity
                            className="w-full bg-indigo-600 py-4 rounded-xl mt-4 active:bg-indigo-700"
                            onPress={() => router.replace('/')}
                        >
                            <Text className="text-white text-center font-bold text-lg">Reset & Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
