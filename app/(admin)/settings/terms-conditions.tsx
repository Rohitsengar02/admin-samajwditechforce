import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SP_RED = '#E30512';
const SP_GREEN = '#009933';

export default function TermsConditions() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms & Conditions</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Terms and Conditions</Text>
                <Text style={styles.lastUpdated}>Effective Date: December 2024</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                    <Text style={styles.text}>
                        By accessing and using the Samajwadi Tech Force Admin Panel ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms and Conditions, please do not use this Service.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Admin Account Requirements</Text>
                    <Text style={styles.text}>
                        To use this Service, you must:
                    </Text>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check-circle" size={16} color={SP_RED} />
                        <Text style={styles.bulletText}>Be an authorized admin of Samajwadi Tech Force</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check-circle" size={16} color={SP_RED} />
                        <Text style={styles.bulletText}>Provide accurate and complete registration information</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check-circle" size={16} color={SP_RED} />
                        <Text style={styles.bulletText}>Maintain the confidentiality of your account credentials</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check-circle" size={16} color={SP_RED} />
                        <Text style={styles.bulletText}>Be at least 18 years of age</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Account Responsibilities</Text>
                    <Text style={styles.text}>You are responsible for:</Text>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="shield-account" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>All activities that occur under your account</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="shield-account" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Keeping your password secure and confidential</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="shield-account" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Immediately notifying us of any unauthorized use</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Acceptable Use</Text>
                    <Text style={styles.text}>You agree NOT to:</Text>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="close-circle" size={16} color="#ef4444" />
                        <Text style={styles.bulletText}>Use the Service for any unlawful purpose</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="close-circle" size={16} color="#ef4444" />
                        <Text style={styles.bulletText}>Upload or distribute malicious content</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="close-circle" size={16} color="#ef4444" />
                        <Text style={styles.bulletText}>Attempt to gain unauthorized access to the system</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="close-circle" size={16} color="#ef4444" />
                        <Text style={styles.bulletText}>Share confidential party information publicly</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="close-circle" size={16} color="#ef4444" />
                        <Text style={styles.bulletText}>Harass, abuse, or harm other users</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Content Ownership and Rights</Text>
                    <Text style={styles.text}>
                        All content uploaded to the platform, including posters, resources, and news articles, becomes the property of Samajwadi Tech Force. You grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute such content for party purposes.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>6. Data Usage and Privacy</Text>
                    <Text style={styles.text}>
                        Your use of the Service is also governed by our Privacy Policy. By using this Service, you consent to the collection and use of information as outlined in our Privacy Policy.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>7. Service Modifications</Text>
                    <Text style={styles.text}>
                        We reserve the right to:
                    </Text>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="cog" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Modify or discontinue any part of the Service</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="cog" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Update these Terms and Conditions at any time</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="cog" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Suspend or terminate accounts that violate these terms</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>8. Confidentiality</Text>
                    <Text style={styles.text}>
                        As an admin, you may have access to confidential party information. You agree to:
                    </Text>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="lock" size={16} color={SP_RED} />
                        <Text style={styles.bulletText}>Keep all confidential information private</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="lock" size={16} color={SP_RED} />
                        <Text style={styles.bulletText}>Not share login credentials with unauthorized persons</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="lock" size={16} color={SP_RED} />
                        <Text style={styles.bulletText}>Use information only for official party purposes</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>9. Disclaimer of Warranties</Text>
                    <Text style={styles.text}>
                        The Service is provided "AS IS" and "AS AVAILABLE" without any warranties of any kind. We do not guarantee that the Service will be uninterrupted, secure, or error-free.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>10. Limitation of Liability</Text>
                    <Text style={styles.text}>
                        To the maximum extent permitted by law, Samajwadi Tech Force shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>11. Termination</Text>
                    <Text style={styles.text}>
                        We may terminate or suspend your account immediately, without prior notice, for any reason including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>12. Governing Law</Text>
                    <Text style={styles.text}>
                        These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>13. Contact Information</Text>
                    <Text style={styles.text}>
                        For questions about these Terms and Conditions, please contact:
                    </Text>
                    <View style={styles.contactCard}>
                        <MaterialCommunityIcons name="email" size={20} color={SP_RED} />
                        <Text style={styles.contactText}>samajwadi332@gmail.com</Text>
                    </View>
                </View>

                <View style={styles.agreementBox}>
                    <MaterialCommunityIcons name="information" size={24} color="#3b82f6" />
                    <Text style={styles.agreementText}>
                        By using this admin panel, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2024 Samajwadi Tech Force. All rights reserved.</Text>
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
    header: {
        backgroundColor: SP_RED,
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 8,
    },
    lastUpdated: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 12,
    },
    text: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 24,
        marginBottom: 12,
    },
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        paddingLeft: 8,
    },
    bulletText: {
        fontSize: 15,
        color: '#475569',
        marginLeft: 12,
        flex: 1,
        lineHeight: 22,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    contactText: {
        fontSize: 15,
        color: '#1e293b',
        marginLeft: 12,
        fontWeight: '500',
    },
    agreementBox: {
        flexDirection: 'row',
        backgroundColor: '#dbeafe',
        padding: 20,
        borderRadius: 12,
        marginVertical: 20,
        gap: 16,
    },
    agreementText: {
        flex: 1,
        fontSize: 14,
        color: '#1e40af',
        lineHeight: 22,
        fontWeight: '500',
    },
    footer: {
        padding: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 13,
        color: '#94a3b8',
    },
});
