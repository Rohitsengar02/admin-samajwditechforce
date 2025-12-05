import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SP_RED = '#E30512';
const SP_GREEN = '#009933';

export default function ChildSafety() {
    const router = useRouter();

    const callHelpline = (number: string) => {
        Linking.openURL(`tel:${number}`);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Child Safety</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Alert Banner */}
                <View style={styles.alertBanner}>
                    <MaterialCommunityIcons name="shield-alert" size={40} color="#dc2626" />
                    <View style={{ flex: 1, marginLeft: 16 }}>
                        <Text style={styles.alertTitle}>Zero Tolerance Policy</Text>
                        <Text style={styles.alertText}>
                            Samajwadi Tech Force has ZERO TOLERANCE for child abuse and exploitation
                        </Text>
                    </View>
                </View>

                <Text style={styles.title}>Child Safety & Protection Policy</Text>
                <Text style={styles.lastUpdated}>Our Commitment to Protecting Children</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Our Commitment</Text>
                    <Text style={styles.text}>
                        Samajwadi Tech Force is committed to creating a safe environment for all children. We believe that every child has the right to protection from abuse, neglect, and exploitation.
                    </Text>
                </View>

                {/* Emergency Helplines */}
                <View style={styles.helplinesSection}>
                    <Text style={styles.sectionTitle}>📞 Emergency Helplines</Text>
                    <TouchableOpacity style={styles.helplineCard} onPress={() => callHelpline('1098')}>
                        <View style={styles.helplineIcon}>
                            <MaterialCommunityIcons name="phone-in-talk" size={32} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.helplineNumber}>1098</Text>
                            <Text style={styles.helplineLabel}>Childline India</Text>
                            <Text style={styles.helplineDesc}>24/7 Free Helpline for Children in Distress</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#64748b" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.helplineCard} onPress={() => callHelpline('100')}>
                        <View style={[styles.helplineIcon, { backgroundColor: '#1e40af' }]}>
                            <MaterialCommunityIcons name="shield-star" size={32} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.helplineNumber}>100</Text>
                            <Text style={styles.helplineLabel}>Police Helpline</Text>
                            <Text style={styles.helplineDesc}>Immediate Emergency Assistance</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#64748b" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.helplineCard} onPress={() => callHelpline('181')}>
                        <View style={[styles.helplineIcon, { backgroundColor: '#c026d3' }]}>
                            <MaterialCommunityIcons name="hand-heart" size={32} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.helplineNumber}>181</Text>
                            <Text style={styles.helplineLabel}>Women Helpline</Text>
                            <Text style={styles.helplineDesc}>Support for Women and Children</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#64748b" />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Types of Child Abuse</Text>
                    <View style={styles.abuseCard}>
                        <MaterialCommunityIcons name="hand-back-right" size={24} color="#dc2626" />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.abuseTitle}>Physical Abuse</Text>
                            <Text style={styles.abuseDesc}>Any intentional act causing physical harm or injury to a child</Text>
                        </View>
                    </View>
                    <View style={styles.abuseCard}>
                        <MaterialCommunityIcons name="emoticon-sad" size={24} color="#dc2626" />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.abuseTitle}>Emotional Abuse</Text>
                            <Text style={styles.abuseDesc}>Persistent emotional maltreatment causing psychological harm</Text>
                        </View>
                    </View>
                    <View style={styles.abuseCard}>
                        <MaterialCommunityIcons name="alert-octagon" size={24} color="#dc2626" />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.abuseTitle}>Sexual Abuse</Text>
                            <Text style={styles.abuseDesc}>Any sexual activity involving a child</Text>
                        </View>
                    </View>
                    <View style={styles.abuseCard}>
                        <MaterialCommunityIcons name="account-off" size={24} color="#dc2626" />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.abuseTitle}>Neglect</Text>
                            <Text style={styles.abuseDesc}>Failure to provide necessary care, supervision, or protection</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Warning Signs of Abuse</Text>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="alert" size={16} color="#ef4444" />
                        <Text style={styles.bulletText}>Unexplained injuries or bruises</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="alert" size={16} color="#ef4444" />
                        <Text style={styles.bulletText}>Sudden changes in behavior</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="alert" size={16} color="#ef4444" />
                        <Text style={styles.bulletText}>Fear of certain people or places</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="alert" size={16} color="#ef4444" />
                        <Text style={styles.bulletText}>Withdrawal from friends and activities</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="alert" size={16} color="#ef4444" />
                        <Text style={styles.bulletText}>Poor hygiene or neglected appearance</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. How to Report</Text>
                    <Text style={styles.text}>
                        If you suspect child abuse, it is your responsibility to report it immediately:
                    </Text>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="phone" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Call Childline 1098 (24/7 available)</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="police-badge" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Contact local police (100)</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="web" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Report online at www.cybercrime.gov.in</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="email" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Email: samajwadi332@gmail.com</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Admin Responsibilities</Text>
                    <Text style={styles.text}>As an admin, you must:</Text>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check-circle" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Report any suspicion of child abuse immediately</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check-circle" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Never share or distribute child abuse material</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check-circle" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Protect children's privacy and personal information</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="check-circle" size={16} color={SP_GREEN} />
                        <Text style={styles.bulletText}>Follow all child protection guidelines</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>6. Content Moderation</Text>
                    <Text style={styles.text}>
                        All content uploaded to the platform is monitored. Any content depicting or promoting child abuse will result in:
                    </Text>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="block-helper" size={16} color="#dc2626" />
                        <Text style={styles.bulletText}>Immediate account termination</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="block-helper" size={16} color="#dc2626" />
                        <Text style={styles.bulletText}>Reporting to law enforcement</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <MaterialCommunityIcons name="block-helper" size={16} color="#dc2626" />
                        <Text style={styles.bulletText}>Legal action as per Indian law</Text>
                    </View>
                </View>

                <View style={styles.importantBox}>
                    <MaterialCommunityIcons name="shield-check" size={32} color={SP_GREEN} />
                    <View style={{ flex: 1, marginLeft: 16 }}>
                        <Text style={styles.importantTitle}>Remember:</Text>
                        <Text style={styles.importantText}>
                            Every child deserves to be safe. If you see something, say something. Your report could save a child's life.
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2024 Samajwadi Tech Force. Protecting Children, Building Future.</Text>
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
        backgroundColor: '#dc2626',
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
    alertBanner: {
        backgroundColor: '#fee2e2',
        padding: 20,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#dc2626',
    },
    alertTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#991b1b',
        marginBottom: 4,
    },
    alertText: {
        fontSize: 14,
        color: '#991b1b',
        lineHeight: 20,
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
    helplinesSection: {
        marginBottom: 24,
    },
    helplineCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    helplineIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#dc2626',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    helplineNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    helplineLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
        marginTop: 2,
    },
    helplineDesc: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 2,
    },
    abuseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    abuseTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    abuseDesc: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
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
    importantBox: {
        flexDirection: 'row',
        backgroundColor: '#dcfce7',
        padding: 20,
        borderRadius: 12,
        marginVertical: 20,
        borderWidth: 2,
        borderColor: '#16a34a',
    },
    importantTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#15803d',
        marginBottom: 8,
    },
    importantText: {
        fontSize: 14,
        color: '#15803d',
        lineHeight: 22,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 13,
        color: '#94a3b8',
        textAlign: 'center',
    },
});
