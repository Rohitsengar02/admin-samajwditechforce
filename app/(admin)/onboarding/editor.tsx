import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Image as ImageIcon, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const getApiUrl = () => {
    if (Platform.OS === 'android') {
        return 'http://192.168.1.39:5000/api';
    }
    let url = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
    if (!url.endsWith('/api')) {
        url += '/api';
    }
    return url;
};

const API_URL = `${getApiUrl()}/onboarding`;

export default function OnboardingEditor() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const isEditing = !!id;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [order, setOrder] = useState('0');
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isEditing) {
            fetchSlideDetails();
        }
    }, [id]);

    const fetchSlideDetails = async () => {
        try {
            setLoading(true);
            // Since we don't have a single item endpoint in the controller yet (oops, I forgot getById),
            // I'll fetch all and find it. Or I should add getById.
            // Actually, I'll update the controller later if needed, but for now let's fetch all.
            // Wait, I should probably add getById to the controller.
            // But to save time, I'll just fetch all and filter.
            const response = await fetch(API_URL);
            const data = await response.json();
            if (data.success) {
                const slide = data.slides.find((s: any) => s._id === id);
                if (slide) {
                    setTitle(slide.title);
                    setDescription(slide.description);
                    setOrder(slide.order.toString());
                    setImage(slide.imageUrl);
                }
            }
        } catch (error) {
            console.error('Error fetching slide:', error);
            Alert.alert('Error', 'Failed to fetch slide details');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Onboarding images are usually square or portrait. Let's stick to 1:1 or 4:5.
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!title || !description || !image) {
            Alert.alert('Error', 'Please fill all fields and select an image');
            return;
        }

        try {
            setSaving(true);
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('order', order);

            if (image && !image.startsWith('http')) {
                if (Platform.OS === 'web') {
                    const response = await fetch(image);
                    const blob = await response.blob();
                    formData.append('image', blob, 'slide.jpg');
                } else {
                    formData.append('image', {
                        uri: image,
                        name: 'slide.jpg',
                        type: 'image/jpeg',
                    } as any);
                }
            } else if (image) {
                formData.append('imageUrl', image);
            }

            const url = isEditing ? `${API_URL}/${id}` : API_URL;
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert('Success', 'Slide saved successfully', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            } else {
                Alert.alert('Error', data.error || 'Failed to save slide');
            }
        } catch (error) {
            console.error('Error saving slide:', error);
            Alert.alert('Error', 'Failed to save slide');
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
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditing ? 'Edit Slide' : 'New Slide'}</Text>
                <TouchableOpacity
                    onPress={handleSave}
                    style={[styles.saveButton, saving && styles.disabledButton]}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Save size={18} color="#fff" />
                            <Text style={styles.saveButtonText}>Save</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter slide title"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter slide description"
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Order (Position)</Text>
                    <TextInput
                        style={styles.input}
                        value={order}
                        onChangeText={setOrder}
                        placeholder="0"
                        keyboardType="numeric"
                    />
                    <Text style={styles.helperText}>Lower numbers appear first. Position 2 (Order 1) is reserved for the Carousel.</Text>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Image</Text>
                    <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.previewImage} resizeMode="cover" />
                        ) : (
                            <View style={styles.placeholder}>
                                <ImageIcon size={40} color="#94a3b8" />
                                <Text style={styles.placeholderText}>Tap to select image</Text>
                            </View>
                        )}
                        <View style={styles.uploadIcon}>
                            <Upload size={16} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
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
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    saveButton: {
        backgroundColor: '#E30512',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    disabledButton: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    content: {
        padding: 20,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1e293b',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    helperText: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
    },
    imagePicker: {
        width: '100%',
        height: 300,
        backgroundColor: '#e2e8f0',
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    placeholderText: {
        color: '#64748b',
        fontSize: 14,
    },
    uploadIcon: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 20,
    }
});
