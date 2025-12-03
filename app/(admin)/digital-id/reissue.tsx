import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Search, RefreshCw, AlertCircle, CheckCircle,
    User, Phone, MapPin, Calendar, Shield, CreditCard
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

const MOCK_MEMBERS = [
    {
        id: 1,
        name: 'Rahul Yadav',
        district: 'Lucknow',
        role: 'District Head',
        phone: '9876543210',
        photo: 'https://avatar.iran.liara.run/public/1',
        oldIdNumber: 'STF-2023-001',
        issueDate: '2023-01-15'
    },
    {
        id: 2,
        name: 'Priya Singh',
        district: 'Varanasi',
        role: 'Coordinator',
        phone: '9876543211',
        photo: 'https://avatar.iran.liara.run/public/2',
        oldIdNumber: 'STF-2023-045',
        issueDate: '2023-02-20'
    },
    {
        id: 3,
        name: 'Amit Kumar',
        district: 'Agra',
        role: 'Volunteer',
        phone: '9876543212',
        photo: 'https://avatar.iran.liara.run/public/3',
        oldIdNumber: 'STF-2023-078',
        issueDate: '2023-03-10'
    },
];

const REISSUE_REASONS = [
    { id: 'lost', label: 'Lost Card', icon: AlertCircle, color: '#F59E0B' },
    { id: 'damaged', label: 'Damaged Card', icon: AlertCircle, color: '#EF4444' },
    { id: 'update', label: 'Information Update', icon: RefreshCw, color: '#3B82F6' },
    { id: 'expired', label: 'Expired', icon: Calendar, color: '#8B5CF6' },
];

const MemberCard = ({ member, onReissue }: any) => (
    <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-4">
        <LinearGradient colors={['#f59e0b', '#ef4444']} className="p-5 relative">
            <AnimatedBubble size={80} top={-20} left={200} />
            <AnimatedBubble size={60} top={40} left={-10} />

            <View className="flex-row items-center">
                <View className="bg-white/20 p-1 rounded-2xl mr-4">
                    <Image source={{ uri: member.photo }} className="w-16 h-16 rounded-xl" />
                </View>
                <View className="flex-1">
                    <Text className="text-white font-bold text-xl mb-1">{member.name}</Text>
                    <Text className="text-white/80 text-sm">{member.role} • {member.district}</Text>
                    <View className="bg-white/20 px-3 py-1 rounded-lg mt-2 self-start">
                        <Text className="text-white text-xs font-semibold">{member.oldIdNumber}</Text>
                    </View>
                </View>
            </View>
        </LinearGradient>

        <View className="p-5">
            <View className="flex-row items-center mb-4">
                <View className="bg-amber-50 p-2 rounded-lg mr-3">
                    <Calendar size={16} color="#F59E0B" />
                </View>
                <View>
                    <Text className="text-gray-400 text-xs">Original Issue Date</Text>
                    <Text className="text-gray-800 font-semibold">{new Date(member.issueDate).toLocaleDateString()}</Text>
                </View>
            </View>

            <View className="flex-row items-center mb-4">
                <View className="bg-green-50 p-2 rounded-lg mr-3">
                    <Phone size={16} color="#10B981" />
                </View>
                <View>
                    <Text className="text-gray-400 text-xs">Phone</Text>
                    <Text className="text-gray-800 font-semibold">{member.phone}</Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => onReissue(member)}
                className="bg-amber-600 py-3 rounded-xl flex-row items-center justify-center"
            >
                <RefreshCw size={18} color="white" />
                <Text className="text-white font-bold ml-2">Request Reissue</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const ReissueModal = ({ member, onClose, onSubmit }: any) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [notes, setNotes] = useState('');

    return (
        <View className="bg-white rounded-3xl shadow-2xl p-6">
            <Text className="text-gray-900 font-bold text-2xl mb-2">Reissue ID Card</Text>
            <Text className="text-gray-500 mb-6">Select reason for {member?.name}</Text>

            <View className="mb-6">
                {REISSUE_REASONS.map((reason) => (
                    <TouchableOpacity
                        key={reason.id}
                        onPress={() => setSelectedReason(reason.id)}
                        className={`flex-row items-center p-4 rounded-2xl mb-3 border-2 ${selectedReason === reason.id ? 'bg-amber-50 border-amber-500' : 'bg-gray-50 border-gray-200'
                            }`}
                    >
                        <View className={`p-3 rounded-xl mr-3 ${selectedReason === reason.id ? 'bg-amber-100' : 'bg-white'
                            }`}>
                            <reason.icon size={20} color={reason.color} />
                        </View>
                        <Text className={`font-semibold ${selectedReason === reason.id ? 'text-amber-900' : 'text-gray-700'
                            }`}>{reason.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View className="mb-6">
                <Text className="text-gray-700 font-medium mb-2">Additional Notes (Optional)</Text>
                <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800"
                    placeholder="Add any additional details..."
                    multiline
                    numberOfLines={3}
                    value={notes}
                    onChangeText={setNotes}
                />
            </View>

            <View className="flex-row space-x-3">
                <TouchableOpacity
                    onPress={onClose}
                    className="flex-1 bg-gray-100 py-4 rounded-2xl items-center"
                >
                    <Text className="text-gray-700 font-bold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onSubmit({ reason: selectedReason, notes })}
                    className="flex-1 bg-amber-600 py-4 rounded-2xl flex-row items-center justify-center"
                    disabled={!selectedReason}
                >
                    <CheckCircle size={18} color="white" />
                    <Text className="text-white font-bold ml-2">Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function IDReissuePage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleReissue = (member: any) => {
        setSelectedMember(member);
        setShowModal(true);
    };

    const handleSubmit = (data: any) => {
        console.log('Reissue request:', { member: selectedMember, ...data });
        setShowModal(false);
        setSelectedMember(null);
    };

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="relative overflow-hidden mb-6">
                <LinearGradient colors={['#f59e0b', '#ef4444']} className="pt-12 pb-12 px-6 rounded-b-[40px]">
                    <AnimatedBubble size={120} top={-30} left={screenWidth - 100} />
                    <AnimatedBubble size={80} top={60} left={20} />

                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-xl mr-4">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-white text-3xl font-bold">ID Reissue</Text>
                            <Text className="text-amber-100 text-sm mt-1">Reissue lost or damaged IDs</Text>
                        </View>
                    </View>

                    {/* Search Bar */}
                    <View className="flex-row items-center bg-white/20 backdrop-blur-md px-4 rounded-2xl border border-white/30">
                        <Search size={20} color="white" />
                        <TextInput
                            className="flex-1 py-3 px-3 text-white"
                            placeholder="Search by name or ID number..."
                            placeholderTextColor="rgba(255,255,255,0.6)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </LinearGradient>
            </View>

            <View className="px-4">
                {/* Info Banner */}
                <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex-row items-start">
                    <View className="bg-amber-100 p-2 rounded-lg mr-3">
                        <AlertCircle size={20} color="#F59E0B" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-amber-900 font-bold mb-1">Reissue Process</Text>
                        <Text className="text-amber-700 text-sm">
                            Select a member and specify the reason for ID card reissue. The new card will be generated after approval.
                        </Text>
                    </View>
                </View>

                {/* Member List */}
                <View className="mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Select Member</Text>
                    {MOCK_MEMBERS.map(member => (
                        <MemberCard key={member.id} member={member} onReissue={handleReissue} />
                    ))}
                </View>

                {/* Reissue Modal */}
                {showModal && selectedMember && (
                    <View className="mb-6">
                        <ReissueModal
                            member={selectedMember}
                            onClose={() => {
                                setShowModal(false);
                                setSelectedMember(null);
                            }}
                            onSubmit={handleSubmit}
                        />
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
