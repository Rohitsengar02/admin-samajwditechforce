import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform,
    ActivityIndicator,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function EditEvent() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        status: 'upcoming',
        attendees: '0',
        type: 'rally',
        updates: '',
        image: '',
    });

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/events/${id}`);
            const data = await response.json();

            if (data.success) {
                const event = data.data;
                // Convert date to DD/MM/YYYY format
                const eventDate = new Date(event.date);
                const formattedDate = `${String(eventDate.getDate()).padStart(2, '0')}/${String(eventDate.getMonth() + 1).padStart(2, '0')}/${eventDate.getFullYear()}`;

                setFormData({
                    title: event.title || '',
                    description: event.description || '',
                    date: formattedDate,
                    time: event.time || '',
                    location: event.location || '',
                    status: event.status || 'upcoming',
                    attendees: String(event.attendees || 0),
                    type: event.type || 'rally',
                    updates: event.updates ? event.updates.join('\n') : '',
                    image: event.image || '',
                });
            }
        } catch (error) {
            console.error('Error fetching event:', error);
            showAlert('Error', 'Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    // Platform-aware alert function
    const showAlert = (title: string, message: string, onOk?: () => void) => {
        if (Platform.OS === 'web') {
            // Web uses window.alert
            window.alert(`${title}\n\n${message}`);
            if (onOk) onOk();
        } else {
            // Mobile uses React Native Alert
            Alert.alert(title, message, [
                {
                    text: 'OK',
                    onPress: onOk,
                }
            ]);
        }
    };

    const pickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                showAlert('Permission Required', 'Please allow access to your photo library');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images' as any,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                uploadToBackend(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            showAlert('Error', 'Failed to pick image');
        }
    };

    const uploadToBackend = async (uri: string) => {
        try {
            setUploading(true);

            // Convert image to base64
            const response = await fetch(uri);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64data = reader.result;

                try {
                    const token = await AsyncStorage.getItem('adminToken');

                    const uploadResponse = await fetch(`${API_URL}/upload/image`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            image: base64data,
                            folder: 'events'
                        }),
                    });

                    const data = await uploadResponse.json();

                    if (data.success) {
                        setFormData({ ...formData, image: data.data.url });
                        showAlert('✅ Success', 'Image uploaded successfully!');
                    } else {
                        showAlert('Error', data.message || 'Failed to upload image');
                    }
                } catch (error) {
                    console.error('Error uploading to backend:', error);
                    showAlert('Error', 'Failed to upload image');
                }
            };

            reader.readAsDataURL(blob);
        } catch (error) {
            console.error('Error processing image:', error);
            showAlert('Error', 'Failed to process image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.title || !formData.description || !formData.time || !formData.location) {
            showAlert('Error', 'Please fill all required fields');
            return;
        }

        try {
            setSaving(true);
            const token = await AsyncStorage.getItem('adminToken');

            // Convert updates string to array
            const updates = formData.updates
                ? formData.updates.split('\n').filter(u => u.trim())
                : [];

            const response = await fetch(`${API_URL}/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    attendees: parseInt(formData.attendees) || 0,
                    updates,
                }),
            });

            const data = await response.json();

            if (data.success) {
                showAlert('✅ Success', 'Event updated successfully!', () => {
                    router.back();
                });
            } else {
                showAlert('Error', data.message || 'Failed to update event');
            }
        } catch (error) {
            console.error('Error updating event:', error);
            showAlert('Error', 'Failed to update event');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#E30512" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Event</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Title */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Event Title *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter event title"
                        value={formData.title}
                        onChangeText={(text) => setFormData({ ...formData, title: text })}
                    />
                </View>

                {/* Description */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Description *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Enter event description"
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                {/* Date & Time Row */}
                <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                        <Text style={styles.label}>Date *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.date}
                            onChangeText={(text) => setFormData({ ...formData, date: text })}
                            placeholder="DD/MM/YYYY"
                        />
                    </View>

                    <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                        <Text style={styles.label}>Time *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., 4:00 PM"
                            value={formData.time}
                            onChangeText={(text) => setFormData({ ...formData, time: text })}
                        />
                    </View>
                </View>

                {/* Location */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Location *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter event location"
                        value={formData.location}
                        onChangeText={(text) => setFormData({ ...formData, location: text })}
                    />
                </View>

                {/* Type */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Event Type *</Text>
                    <View style={styles.optionsGrid}>
                        {['rally', 'meeting', 'training', 'campaign'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.optionButton,
                                    formData.type === type && styles.optionButtonActive
                                ]}
                                onPress={() => setFormData({ ...formData, type })}
                            >
                                <MaterialCommunityIcons
                                    name={
                                        type === 'rally' ? 'bullhorn' :
                                            type === 'meeting' ? 'account-group' :
                                                type === 'training' ? 'school' :
                                                    'flag'
                                    }
                                    size={20}
                                    color={formData.type === type ? '#fff' : '#64748b'}
                                />
                                <Text style={[
                                    styles.optionText,
                                    formData.type === type && styles.optionTextActive
                                ]}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Status */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Status</Text>
                    <View style={styles.optionsGrid}>
                        {['upcoming', 'ongoing', 'closed'].map((status) => (
                            <TouchableOpacity
                                key={status}
                                style={[
                                    styles.optionButton,
                                    formData.status === status && styles.optionButtonActive
                                ]}
                                onPress={() => setFormData({ ...formData, status })}
                            >
                                <Text style={[
                                    styles.optionText,
                                    formData.status === status && styles.optionTextActive
                                ]}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Attendees */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Expected Attendees</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter number of attendees"
                        value={formData.attendees}
                        onChangeText={(text) => setFormData({ ...formData, attendees: text })}
                        keyboardType="numeric"
                    />
                </View>

                {/* Updates */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Event Updates</Text>
                    <Text style={styles.hint}>One update per line</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Enter event updates (one per line)"
                        value={formData.updates}
                        onChangeText={(text) => setFormData({ ...formData, updates: text })}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                {/* Image Upload */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Event Image (Optional)</Text>
                    <TouchableOpacity
                        style={styles.imagePickerButton}
                        onPress={pickImage}
                        disabled={uploading}
                    >
                        <MaterialCommunityIcons
                            name="image-plus"
                            size={24}
                            color={uploading ? '#94a3b8' : '#E30512'}
                        />
                        <Text style={styles.imagePickerText}>
                            {uploading ? 'Uploading...' : 'Upload Image from Device'}
                        </Text>
                    </TouchableOpacity>

                    {formData.image && (
                        <View style={styles.imagePreview}>
                            <Image
                                source={{ uri: formData.image }}
                                style={styles.previewImage}
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={() => setFormData({ ...formData, image: '' })}
                            >
                                <MaterialCommunityIcons name="close-circle" size={24} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, (saving || uploading) && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={saving || uploading}
                >
                    <Text style={styles.submitButtonText}>
                        {saving ? 'Updating...' : 'Update Event'}
                    </Text>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    hint: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1e293b',
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
    },
    dateText: {
        fontSize: 15,
        color: '#1e293b',
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#fff',
    },
    optionButtonActive: {
        backgroundColor: '#E30512',
        borderColor: '#E30512',
    },
    optionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    optionTextActive: {
        color: '#fff',
    },
    imagePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        borderWidth: 2,
        borderColor: '#E30512',
        borderStyle: 'dashed',
        borderRadius: 12,
        paddingVertical: 20,
        backgroundColor: '#FEF2F2',
    },
    imagePickerText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#E30512',
    },
    imagePreview: {
        marginTop: 12,
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    removeImageButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#fff',
        borderRadius: 20,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E30512',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        marginTop: 16,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});
