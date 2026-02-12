import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SP_RED = '#E30512';
const SP_GREEN = '#009933';

export default function About() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About Us</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.hero}>
                    <MaterialCommunityIcons name="bicycle" size={60} color={SP_RED} />
                    <Text style={styles.heroTitle}>समाजवादी टेक फ़ोर्स</Text>
                    <Text style={styles.heroSubtitle}>Samajwadi Tech Force</Text>
                    <Text style={styles.heroTagline}>Digitally Empowering the Socialist Movement</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Mission</Text>
                    <Text style={styles.text}>
                        Samajwadi Tech Force is the digital wing of the Samajwadi Party, dedicated to leveraging technology to strengthen grassroots organization, enhance communication, and empower party workers across Uttar Pradesh and beyond.
                    </Text>
                    <Text style={styles.text}>
                        We believe in using modern technology to connect with the masses, streamline party operations, and build a more inclusive and transparent political movement.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Vision</Text>
                    <Text style={styles.text}>
                        To create a digitally empowered socialist movement where every worker has access to:
                    </Text>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="star" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Real-time party updates and news</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="star" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Digital resources and training materials</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="star" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Tools for ground-level organization</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="star" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Direct communication channels with leadership</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Key Features</Text>

                    <View style={styles.featureCard}>
                        <View style={[styles.featureIcon, { backgroundColor: `${SP_RED}15` }]}>
                            <MaterialCommunityIcons name="account-group" size={32} color={SP_RED} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.featureTitle}>Member Management</Text>
                            <Text style={styles.featureDesc}>Comprehensive database of party workers and volunteers</Text>
                        </View>
                    </View>

                    <View style={styles.featureCard}>
                        <View style={[styles.featureIcon, { backgroundColor: `${SP_GREEN}15` }]}>
                            <MaterialCommunityIcons name="newspaper" size={32} color={SP_GREEN} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.featureTitle}>News & Updates</Text>
                            <Text style={styles.featureDesc}>Real-time party news and announcements</Text>
                        </View>
                    </View>

                    <View style={styles.featureCard}>
                        <View style={[styles.featureIcon, { backgroundColor: '#3B82F615' }]}>
                            <MaterialCommunityIcons name="image-multiple" size={32} color="#3B82F6" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.featureTitle}>Digital Resources</Text>
                            <Text style={styles.featureDesc}>Posters, banners, and campaign materials</Text>
                        </View>
                    </View>

                    <View style={styles.featureCard}>
                        <View style={[styles.featureIcon, { backgroundColor: '#F59E0B15' }]}>
                            <MaterialCommunityIcons name="chart-line" size={32} color="#F59E0B" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.featureTitle}>Task Management</Text>
                            <Text style={styles.featureDesc}>Assign and track grassroots activities</Text>
                        </View>
                    </View>

                    <View style={styles.featureCard}>
                        <View style={[styles.featureIcon, { backgroundColor: '#8B5CF615' }]}>
                            <MaterialCommunityIcons name="school" size={32} color="#8B5CF6" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.featureTitle}>Training Programs</Text>
                            <Text style={styles.featureDesc}>Digital courses for party workers</Text>
                        </View>
                    </View>

                    <View style={styles.featureCard}>
                        <View style={[styles.featureIcon, { backgroundColor: '#EC489915' }]}>
                            <MaterialCommunityIcons name="card-account-details" size={32} color="#EC4899" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.featureTitle}>Digital ID Cards</Text>
                            <Text style={styles.featureDesc}>Official party identification for members</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Values</Text>

                    <View style={styles.valueCard}>
                        <MaterialCommunityIcons name="hand-heart" size={24} color={SP_RED} />
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Text style={styles.valueTitle}>Social Justice</Text>
                            <Text style={styles.valueText}>Fighting for equality and rights of all</Text>
                        </View>
                    </View>

                    <View style={styles.valueCard}>
                        <MaterialCommunityIcons name="account-group" size={24} color={SP_RED} />
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Text style={styles.valueTitle}>Inclusivity</Text>
                            <Text style={styles.valueText}>Ensuring representation for all communities</Text>
                        </View>
                    </View>

                    <View style={styles.valueCard}>
                        <MaterialCommunityIcons name="lightbulb-on" size={24} color={SP_RED} />
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Text style={styles.valueTitle}>Innovation</Text>
                            <Text style={styles.valueText}>Embracing technology for better governance</Text>
                        </View>
                    </View>

                    <View style={styles.valueCard}>
                        <MaterialCommunityIcons name="shield-check" size={24} color={SP_RED} />
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Text style={styles.valueTitle}>Transparency</Text>
                            <Text style={styles.valueText}>Open and accountable operations</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Admin Panel Features</Text>
                    <Text style={styles.text}>
                        This admin panel empowers party administrators to:
                    </Text>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check-circle" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Manage member registrations and verifications</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check-circle" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Create and publish news articles</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check-circle" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Upload and organize resources</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check-circle" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Assign and monitor tasks</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check-circle" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Conduct training programs</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check-circle" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Generate digital ID cards</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Technology Stack</Text>
                    <Text style={styles.text}>
                        Built with modern technologies for scalability and performance:
                    </Text>
                    <View style={styles.techRow}>
                        <View style={styles.techBadge}>
                            <Text style={styles.techText}>React Native</Text>
                        </View>
                        <View style={styles.techBadge}>
                            <Text style={styles.techText}>Expo</Text>
                        </View>
                        <View style={styles.techBadge}>
                            <Text style={styles.techText}>Node.js</Text>
                        </View>
                    </View>
                    <View style={styles.techRow}>
                        <View style={styles.techBadge}>
                            <Text style={styles.techText}>MongoDB</Text>
                        </View>
                        <View style={styles.techBadge}>
                            <Text style={styles.techText}>Cloudflare R2</Text>
                        </View>
                        <View style={styles.techBadge}>
                            <Text style={styles.techText}>AI/ML</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.contactSection}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <View style={styles.contactCard}>
                        <MaterialCommunityIcons name="email" size={24} color={SP_RED} />
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Text style={styles.contactLabel}>Email</Text>
                            <Text style={styles.contactValue}>samajwadi332@gmail.com</Text>
                        </View>
                    </View>
                    <View style={styles.contactCard}>
                        <MaterialCommunityIcons name="web" size={24} color={SP_RED} />
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Text style={styles.contactLabel}>Website</Text>
                            <Text style={styles.contactValue}>www.samajwaditechforce.com</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2024 Samajwadi Tech Force</Text>
                    <Text style={styles.footerSubtext}>Version 1.0.0</Text>
                    <Text style={styles.footerTagline}>जय समाजवाद! 🚲</Text>
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
        backgroundColor: SP_GREEN,
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
    hero: {
        backgroundColor: '#fff',
        padding: 32,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
        marginTop: 16,
    },
    heroSubtitle: {
        fontSize: 18,
        color: '#64748b',
        marginTop: 4,
    },
    heroTagline: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 8,
        fontStyle: 'italic',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
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
    featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    featureIcon: {
        width: 56,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    featureDesc: {
        fontSize: 14,
        color: '#64748b',
    },
    valueCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    valueTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    valueText: {
        fontSize: 14,
        color: '#64748b',
    },
    techRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    techBadge: {
        backgroundColor: SP_GREEN,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    techText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    contactSection: {
        marginBottom: 24,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    contactLabel: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 15,
        color: '#1e293b',
        fontWeight: '500',
    },
    footer: {
        padding: 24,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '600',
        marginBottom: 4,
    },
    footerSubtext: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 8,
    },
    footerTagline: {
        fontSize: 16,
        fontWeight: 'bold',
        color: SP_RED,
        marginTop: 8,
    },
});
