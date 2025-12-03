import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, User, Phone, Mail, MapPin, Briefcase, Calendar,
    Upload, CheckCircle
} from 'lucide-react-native';

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

export default function AddMemberPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        district: '',
        role: 'Volunteer',
        joinDate: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        router.back();
    };

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#4F46E5', '#7C3AED']} className="pt-12 pb-16 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={80} left={20} />

                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold">Add New Member</Text>
                            <Text className="text-indigo-200 text-sm mt-1">Fill in member details</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-6 pb-8">
                {/* Profile Photo Upload */}
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-4">Profile Photo</Text>
                    <TouchableOpacity className="bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-2xl p-8 items-center">
                        <View className="bg-indigo-100 p-4 rounded-full mb-3">
                            <Upload size={32} color="#6366f1" />
                        </View>
                        <Text className="text-indigo-600 font-semibold">Upload Photo</Text>
                        <Text className="text-gray-400 text-xs mt-1">PNG, JPG up to 5MB</Text>
                    </TouchableOpacity>
                </View>

                {/* Personal Information */}
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-4">Personal Information</Text>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Full Name *</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                            <User size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                placeholder="Enter full name"
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
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
                                value={formData.phone}
                                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            />
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Email Address</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                            <Mail size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                placeholder="Enter email address"
                                keyboardType="email-address"
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                            />
                        </View>
                    </View>
                </View>

                {/* Role & Location */}
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-4">Role & Location</Text>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">District *</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                            <MapPin size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                placeholder="Select district"
                                value={formData.district}
                                onChangeText={(text) => setFormData({ ...formData, district: text })}
                            />
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-600 font-medium mb-2">Role *</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                            <Briefcase size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                placeholder="Select role"
                                value={formData.role}
                                onChangeText={(text) => setFormData({ ...formData, role: text })}
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-600 font-medium mb-2">Join Date</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                            <Calendar size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                placeholder="YYYY-MM-DD"
                                value={formData.joinDate}
                                onChangeText={(text) => setFormData({ ...formData, joinDate: text })}
                            />
                        </View>
                    </View>
                </View>

                {/* Submit Buttons */}
                <View className="flex-row space-x-3">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 bg-gray-100 py-4 rounded-2xl items-center"
                    >
                        <Text className="text-gray-700 font-bold text-base">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="flex-1"
                    >
                        <LinearGradient
                            colors={['#6366f1', '#8b5cf6']}
                            className="py-4 rounded-2xl items-center flex-row justify-center"
                        >
                            <CheckCircle size={20} color="white" />
                            <Text className="text-white font-bold text-base ml-2">Add Member</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
