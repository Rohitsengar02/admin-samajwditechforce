import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, Paperclip, Smile, MoreVertical } from 'lucide-react-native';

// Mock chat data
const MOCK_MESSAGES = [
    { id: 1, text: 'Hello! How are you?', sender: 'them', time: '10:30 AM', avatar: 'https://avatar.iran.liara.run/public/1' },
    { id: 2, text: 'Hi! I\'m doing great, thanks for asking!', sender: 'me', time: '10:31 AM' },
    { id: 3, text: 'Great to hear! I wanted to discuss the upcoming event preparation.', sender: 'them', time: '10:32 AM', avatar: 'https://avatar.iran.liara.run/public/1' },
    { id: 4, text: 'Sure! What do you need help with?', sender: 'me', time: '10:33 AM' },
    { id: 5, text: 'We need to finalize the booth assignments for next week.', sender: 'them', time: '10:35 AM', avatar: 'https://avatar.iran.liara.run/public/1' },
    { id: 6, text: 'I have the list ready. Should I send it over?', sender: 'me', time: '10:36 AM' },
    { id: 7, text: 'Yes please! That would be perfect.', sender: 'them', time: '10:37 AM', avatar: 'https://avatar.iran.liara.run/public/1' },
];

const MEMBER_DATA = {
    name: 'Rahul Yadav',
    role: 'District Head',
    status: 'online',
    avatar: 'https://avatar.iran.liara.run/public/1',
};

export default function MemberChatPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(MOCK_MESSAGES);

    const sendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: message,
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages([...messages, newMessage]);
            setMessage('');
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            {/* Header */}
            <LinearGradient colors={['#6366f1', '#8b5cf6']} className="pt-12 pb-4 px-6">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-3">
                            <ArrowLeft size={20} color="white" />
                        </TouchableOpacity>

                        <View className="relative mr-3">
                            <Image source={{ uri: MEMBER_DATA.avatar }} className="w-10 h-10 rounded-full" />
                            {MEMBER_DATA.status === 'online' && (
                                <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                            )}
                        </View>

                        <View className="flex-1">
                            <Text className="text-white font-bold text-base">{MEMBER_DATA.name}</Text>
                            <Text className="text-white/70 text-xs">{MEMBER_DATA.status}</Text>
                        </View>
                    </View>

                    <TouchableOpacity className="bg-white/20 p-2 rounded-xl">
                        <MoreVertical size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Messages */}
            <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
                {messages.map((msg) => (
                    <View
                        key={msg.id}
                        className={`flex-row mb-4 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.sender === 'them' && (
                            <Image source={{ uri: msg.avatar }} className="w-8 h-8 rounded-full mr-2 mt-1" />
                        )}

                        <View className={`max-w-[75%] ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                            <View
                                className={`rounded-2xl px-4 py-3 ${msg.sender === 'me'
                                        ? 'bg-indigo-600 rounded-tr-sm'
                                        : 'bg-white rounded-tl-sm shadow-sm'
                                    }`}
                            >
                                <Text className={msg.sender === 'me' ? 'text-white' : 'text-gray-800'}>
                                    {msg.text}
                                </Text>
                            </View>
                            <Text className="text-gray-400 text-xs mt-1 px-2">{msg.time}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Input Area */}
            <View className="bg-white border-t border-gray-200 px-4 py-3">
                <View className="flex-row items-center space-x-2">
                    <TouchableOpacity className="bg-gray-100 p-3 rounded-xl">
                        <Paperclip size={20} color="#6B7280" />
                    </TouchableOpacity>

                    <View className="flex-1 flex-row items-center bg-gray-100 rounded-2xl px-4">
                        <TextInput
                            className="flex-1 py-3 text-gray-800"
                            placeholder="Type a message..."
                            value={message}
                            onChangeText={setMessage}
                            multiline
                        />
                        <TouchableOpacity className="ml-2">
                            <Smile size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={sendMessage}
                        className="bg-indigo-600 p-3 rounded-xl"
                    >
                        <Send size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
