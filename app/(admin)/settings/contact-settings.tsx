import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function ContactSettings() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        pageTitle: '',
        pageSubtitle: '',
        address: '',
        email: '',
        phone: '',
        formTitle: '',
        nameLabel: '',
        emailLabel: '',
        messageLabel: '',
        submitButtonText: '',
        successMessage: '',
        officeHours: '',
        additionalInfo: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${API_URL}/contact-settings`);
            const data = await res.json();
            if (data.success) {
                setSettings(data.data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            Alert.alert('Error', 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/contact-settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            const data = await res.json();
            if (data.success) {
                Alert.alert('Success', 'Contact settings updated successfully!');
            } else {
                Alert.alert('Error', data.message || 'Failed to update settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            Alert.alert('Error', 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#dc2626" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#1f2937" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Contact Page Settings</Text>
                        <Text style={styles.headerSubtitle}>Customize contact page content</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Page Header Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="text-box" size={24} color="#dc2626" />
                        <Text style={styles.sectionTitle}>Page Header</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Page Title</Text>
                        <TextInput
                            style={styles.input}
                            value={settings.pageTitle}
                            onChangeText={(val) => updateField('pageTitle', val)}
                            placeholder="e.g., Get in Touch"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Page Subtitle</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={settings.pageSubtitle}
                            onChangeText={(val) => updateField('pageSubtitle', val)}
                            placeholder="Brief description..."
                            multiline
                            numberOfLines={3}
                        />
                    </View>
                </View>

                {/* Contact Information */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="information" size={24} color="#dc2626" />
                        <Text style={styles.sectionTitle}>Contact Information</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Address</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={settings.address}
                            onChangeText={(val) => updateField('address', val)}
                            placeholder="Enter full address"
                            multiline
                            numberOfLines={2}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={settings.email}
                            onChangeText={(val) => updateField('email', val)}
                            placeholder="contact@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone</Text>
                        <TextInput
                            style={styles.input}
                            value={settings.phone}
                            onChangeText={(val) => updateField('phone', val)}
                            placeholder="+91 1234567890"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Office Hours</Text>
                        <TextInput
                            style={styles.input}
                            value={settings.officeHours}
                            onChangeText={(val) => updateField('officeHours', val)}
                            placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
                        />
                    </View>
                </View>



                {/* Additional Info */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="text" size={24} color="#dc2626" />
                        <Text style={styles.sectionTitle}>Additional Information</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Additional Text (Optional)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={settings.additionalInfo}
                            onChangeText={(val) => updateField('additionalInfo', val)}
                            placeholder="Any additional information to display..."
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </View>

                {/* Preview Button */}
                <TouchableOpacity style={styles.previewButton}>
                    <MaterialCommunityIcons name="eye" size={20} color="#dc2626" />
                    <Text style={styles.previewButtonText}>Preview Contact Page</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 2,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#dc2626',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        color: '#1f2937',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    previewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#fff',
        paddingVertical: 14,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#dc2626',
    },
    previewButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#dc2626',
    },
});
