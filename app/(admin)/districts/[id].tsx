import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, Alert, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft, MapPin, User, Phone, Mail, Building2, CheckCircle
} from 'lucide-react-native';
import { getApiUrl } from '../../../utils/api';

const screenWidth = Dimensions.get('window').width;

const AnimatedBubble = ({ size, top, left }: { size: number; top: number; left: number }) => (
    <View
        style={{
            position: 'absolute',
            width: size,
            height: size,
            top, left,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: size / 2,
            opacity: 0.6,
        }}
    />
);

export default function EditDistrictPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        head: '',
        headPhone: '',
        headEmail: '',
        assemblies: '',
    });

    const API_URL = `${getApiUrl()}/districts`;

    useEffect(() => {
        fetchDistrict();
    }, [id]);

    const fetchDistrict = async () => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const data = await response.json();

            if (response.ok) {
                const district = data.data || data;
                setFormData({
                    name: district.name || '',
                    head: district.headName || '',
                    headPhone: district.headPhone || '',
                    headEmail: district.headEmail || '',
                    assemblies: district.assemblyCount?.toString() || '',
                });
            } else {
                showAlert('Error', 'Failed to fetch district details');
            }
        } catch (error) {
            console.error('Error fetching district:', error);
            showAlert('Error', 'Network error. Please try again.');
        } finally {
            setFetching(false);
        }
    };

    const showAlert = (title: string, message: string, onPress?: () => void) => {
        if (Platform.OS === 'web') {
            alert(`${title}: ${message}`);
            if (onPress) onPress();
        } else {
            Alert.alert(title, message, onPress ? [{ text: 'OK', onPress }] : undefined);
        }
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            showAlert('Validation Error', 'Please enter district name');
            return false;
        }
        if (!formData.head.trim()) {
            showAlert('Validation Error', 'Please enter head name');
            return false;
        }
        if (!formData.headPhone.trim()) {
            showAlert('Validation Error', 'Please enter phone number');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                name: formData.name.trim(),
                headName: formData.head.trim(),
                headPhone: formData.headPhone.trim(),
                headEmail: formData.headEmail.trim(),
                assemblyCount: parseInt(formData.assemblies) || 0,
            };

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                showAlert('Success!', 'District updated successfully', () => router.back());
            } else {
                showAlert('Error', data.message || 'Failed to update district');
            }
        } catch (error) {
            console.error('Error updating district:', error);
            showAlert('Error', 'Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text className="text-gray-500 mt-4">Loading district...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 mb-24 bg-gray-50" showsVerticalScrollIndicator={false}>
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#4F46E5', '#7C3AED']} className="pt-12 pb-16 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={80} left={20} />

                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold">Edit District</Text>
                            <Text className="text-indigo-200 text-sm mt-1">Update district details</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-6 pb-8">
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-4">District Information</Text>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">District Name *</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                            <MapPin size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                placeholder="Enter district name"
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                            />
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Number of Assemblies</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                            <Building2 size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                placeholder="Enter number of assemblies"
                                keyboardType="numeric"
                                value={formData.assemblies}
                                onChangeText={(text) => setFormData({ ...formData, assemblies: text })}
                            />
                        </View>
                    </View>
                </View>

                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-4">District Head Details</Text>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Head Name *</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                            <User size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                placeholder="Enter head name"
                                value={formData.head}
                                onChangeText={(text) => setFormData({ ...formData, head: text })}
                            />
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Phone Number *</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                            <Phone size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                placeholder="Enter phone number"
                                keyboardType="phone-pad"
                                value={formData.headPhone}
                                onChangeText={(text) => setFormData({ ...formData, headPhone: text })}
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-600 font-medium mb-2">Email Address</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                            <Mail size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                placeholder="Enter email address"
                                keyboardType="email-address"
                                value={formData.headEmail}
                                onChangeText={(text) => setFormData({ ...formData, headEmail: text })}
                            />
                        </View>
                    </View>
                </View>

                <View className="flex-row space-x-3">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 bg-gray-100 py-4 rounded-2xl items-center"
                        disabled={loading}
                    >
                        <Text className="text-gray-700 font-bold text-base">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="flex-1"
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={loading ? ['#9CA3AF', '#6B7280'] : ['#6366f1', '#8b5cf6']}
                            className="py-4 rounded-2xl items-center flex-row justify-center"
                        >
                            {loading ? (
                                <>
                                    <ActivityIndicator size="small" color="white" />
                                    <Text className="text-white font-bold text-base ml-2">Updating...</Text>
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} color="white" />
                                    <Text className="text-white font-bold text-base ml-2">Update District</Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
