import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SP_RED = '#E30512';
const SP_GREEN = '#009933';

export default function PrivacyPolicy() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Privacy Policy</Text>
                <Text style={styles.lastUpdated}>Last Updated: December 2024</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Introduction</Text>
                    <Text style={styles.text}>
                        Welcome to Samajwadi Tech Force Admin Panel. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our admin application.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Information We Collect</Text>
                    <Text style={styles.text}>We collect the following types of information:</Text>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="checkbox-marked-circle" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Personal identification information (Name, email address, phone number)</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="checkbox-marked-circle" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Admin role and permissions data</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="checkbox-marked-circle" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Activity logs and usage data</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="checkbox-marked-circle" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Content uploaded by admins (posters, resources, etc.)</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
                    <Text style={styles.text}>We use your information to:</Text>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check" size={16} color={SP_RED} />
                        <Text style={styles.bulletText}>Facilitate admin account creation and authentication</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check" size={16} color={SP_RED} />
                        <Text style={styles.bulletText}>Manage party resources and communications</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check" size={16} color={SP_RED} />
                        <Text style={styles.bulletText}>Monitor and analyze usage patterns</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check" size={16} color={SP_RED} />
                        <Text style={styles.bulletText}>Ensure security and prevent fraud</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Data Security</Text>
                    <Text style={styles.text}>
                        We implement industry-standard security measures to protect your data including:
                    </Text>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="shield-check" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Encrypted data transmission (HTTPS/SSL)</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="shield-check" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Secure password hashing</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="shield-check" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Regular security audits</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="shield-check" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Role-based access control</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Data Retention</Text>
                    <Text style={styles.text}>
                        We retain your personal information only for as long as necessary for the purposes set out in this Privacy Policy, or as required by law. Admin data is retained while the admin account is active and for a reasonable period thereafter for backup and audit purposes.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>6. Your Rights</Text>
                    <Text style={styles.text}>You have the right to:</Text>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="account-check" size={16} color={SP_RED} />
                        <Text style={styles.bulletText}>Access your personal data</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="account-check" size={16} color={SP_RED} />
                        <Text style={styles.bulletText}>Request correction of inaccurate data</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="account-check" size={16} color={SP_RED} />
                        <Text style={styles.bulletText}>Request deletion of your data</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="account-check" size={16} color={SP_RED} />
                        <Text style={styles.bulletText}>Withdraw consent for data processing</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>7. Third-Party Services</Text>
                    <Text style={styles.text}>
                        We use the following third-party services:
                    </Text>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="cloud" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Cloudflare R2 - For media storage and management</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="cloud" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>MongoDB Atlas - For database hosting</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="cloud" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Google AI - For content generation features</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>8. Updates to This Policy</Text>
                    <Text style={styles.text}>
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>9. Contact Us</Text>
                    <Text style={styles.text}>
                        If you have any questions about this Privacy Policy, please contact us at:
                    </Text>
                    <View style={styles.contactCard}>
                        <MaterialCommunityIcons name="email" size={20} color={SP_RED} />
                        <Text style={styles.contactText}>samajwadi332@gmail.com</Text>
                    </View>
                    <View style={styles.contactCard}>
                        <MaterialCommunityIcons name="web" size={20} color={SP_RED} />
                        <Text style={styles.contactText}>samajwaditechforce.com</Text>
                    </View>
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
