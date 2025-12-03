import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, User, Phone, Mail, MapPin, Briefcase, Calendar,
    Upload, CreditCard, Download, Shield, CheckCircle
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

export default function IDGeneratorPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        district: '',
        phone: '',
        email: '',
        photo: null,
    });

    const [showPreview, setShowPreview] = useState(false);

    const handleGenerate = () => {
        setShowPreview(true);
        console.log('Generate ID:', formData);
    };

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#10b981', '#059669']} className="pt-12 pb-16 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={80} left={20} />

                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold">ID Generator</Text>
                            <Text className="text-emerald-100 text-sm mt-1">Create new digital ID cards</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            <View className="px-6 pb-8">
                {/* Photo Upload */}
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-4">Member Photo</Text>
                    <TouchableOpacity className="bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl p-8 items-center">
                        <View className="bg-emerald-100 p-4 rounded-full mb-3">
                            <Upload size={32} color="#10B981" />
                        </View>
                        <Text className="text-emerald-600 font-semibold">Upload Photo</Text>
                        <Text className="text-gray-400 text-xs mt-1">PNG, JPG • Max 5MB • 400x400px</Text>
                    </TouchableOpacity>
                </View>

                {/* Member Details Form */}
                <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-4">Member Details</Text>

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
                        <Text className="text-gray-600 font-medium mb-2">Role *</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-4">
                            <Briefcase size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800"
                                placeholder="e.g. District Head, Volunteer"
                                value={formData.role}
                                onChangeText={(text) => setFormData({ ...formData, role: text })}
                            />
                        </View>
                    </View>

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

                    <View>
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

                {/* ID Card Preview */}
                {showPreview && (
                    <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                        <Text className="text-gray-800 font-bold text-lg mb-4">ID Card Preview</Text>
                        <View className="items-center mb-6">
                            <LinearGradient
                                colors={['#6366f1', '#8b5cf6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="w-full max-w-sm rounded-2xl p-6 shadow-xl relative overflow-hidden"
                                style={{ aspectRatio: 1.586 }}
                            >
                                <AnimatedBubble size={100} top={-30} left={-20} />
                                <AnimatedBubble size={80} top={120} left={250} />

                                <View className="flex-row items-center mb-6">
                                    <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3">
                                        <Shield size={20} color="#6366f1" />
                                    </View>
                                    <View>
                                        <Text className="text-white font-bold text-lg">Samajwadi Tech Force</Text>
                                        <Text className="text-white/80 text-xs">Official Member ID</Text>
                                    </View>
                                </View>

                                <View className="flex-row">
                                    <View className="w-24 h-24 bg-white/20 rounded-2xl mr-4 items-center justify-center">
                                        <User size={40} color="white" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-xl mb-1">{formData.name || 'Member Name'}</Text>
                                        <Text className="text-white/90 text-sm mb-2">{formData.role || 'Role'}</Text>
                                        <Text className="text-white/80 text-sm">{formData.district || 'District'}</Text>
                                        <View className="mt-3 bg-white/20 px-3 py-1 rounded-lg self-start">
                                            <Text className="text-white text-xs font-bold">ID: STF-{new Date().getFullYear()}-###</Text>
                                        </View>
                                    </View>
                                </View>
                            </LinearGradient>
                        </View>

                        <TouchableOpacity className="bg-emerald-600 py-4 rounded-2xl flex-row items-center justify-center">
                            <Download size={20} color="white" />
                            <Text className="text-white font-bold ml-2">Download ID Card</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Action Buttons */}
                <View className="flex-row space-x-3">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 bg-gray-100 py-4 rounded-2xl items-center"
                    >
                        <Text className="text-gray-700 font-bold text-base">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleGenerate}
                        className="flex-1"
                    >
                        <LinearGradient
                            colors={['#10b981', '#059669']}
                            className="py-4 rounded-2xl items-center flex-row justify-center"
                        >
                            <CreditCard size={20} color="white" />
                            <Text className="text-white font-bold text-base ml-2">Generate ID</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
