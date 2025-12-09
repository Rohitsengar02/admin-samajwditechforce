import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Platform, Dimensions } from 'react-native';
import Hero1 from './Hero1';
import Hero2 from './Hero2';
import Hero3 from './Hero3';
import Hero4 from './Hero4';
import Hero5 from './Hero5';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

interface HeroTemplateSelectorProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (templateId: number, defaultProps: any) => void;
}

const HERO_TEMPLATES = [
    {
        id: 1,
        name: 'IT Services',
        description: 'Professional business layout with side-by-side content',
        component: Hero1,
        defaultProps: {
            title: 'IT Services & Solutions',
            subtitle: 'Unlock and unleash the next level business model of innovation.',
            buttonText: 'Get Started',
            imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
            backgroundColor: '#1a1f3a',
            accentColor: '#ff6b35',
            textColor: '#ffffff',
        }
    },
    {
        id: 2,
        name: 'Business Empowerment',
        description: 'Bold diagonal design with trust indicators',
        component: Hero2,
        defaultProps: {
            title: 'Empowering your business future',
            subtitle: 'Transform your business with cutting-edge technology solutions',
            buttonText: 'Learn More',
            imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
            backgroundColor: '#000000',
            accentColor: '#00ff88',
            textColor: '#ffffff',
        }
    },
    {
        id: 3,
        name: 'SaaS Product',
        description: 'Clean centered layout with floating elements',
        component: Hero3,
        defaultProps: {
            title: "Manage Your Team's Productivity",
            subtitle: 'Plan projects, stay on track, and deliver on time without overworking your team.',
            buttonText: 'Try Now - Free!',
            backgroundColor: '#ffffff',
            primaryColor: '#7c3aed',
            secondaryColor: '#ff4d4f',
            textColor: '#1a1a1a',
        }
    },
    {
        id: 4,
        name: 'Digital Innovation',
        description: 'Gradient background with centered content',
        component: Hero4,
        defaultProps: {
            title: 'Digital Innovation',
            subtitle: 'We transform businesses through cutting-edge digital solutions and strategic technology partnerships.',
            buttonText: 'Explore Solutions',
            imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
            gradientStart: '#667eea',
            gradientEnd: '#764ba2',
            textColor: '#ffffff',
        }
    },
    {
        id: 5,
        name: 'Tech Future',
        description: 'Futuristic design with grid pattern and stats',
        component: Hero5,
        defaultProps: {
            title: 'Next Generation Solutions',
            subtitle: 'Innovative technology that drives your business forward in the digital age',
            buttonText: 'Get Started Today',
            imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
            backgroundColor: '#0a0e27',
            accentColor: '#00d4ff',
            textColor: '#ffffff',
        }
    },
];

export default function HeroTemplateSelector({ visible, onClose, onSelect }: HeroTemplateSelectorProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.7)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
            }}>
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 24,
                    width: '100%',
                    maxWidth: 1200,
                    maxHeight: '90%',
                    overflow: 'hidden',
                }}>
                    {/* Header */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 24,
                        borderBottomWidth: 1,
                        borderBottomColor: '#e5e7eb',
                    }}>
                        <View>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>
                                Choose Hero Template
                            </Text>
                            <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                                Select a design that fits your vision
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: '#f3f4f6',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 20, color: '#6b7280' }}>×</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Templates Grid */}
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ padding: 24 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 20,
                        }}>
                            {HERO_TEMPLATES.map((template) => {
                                const HeroComponent = template.component;
                                return (
                                    <TouchableOpacity
                                        key={template.id}
                                        onPress={() => {
                                            onSelect(template.id, template.defaultProps);
                                            onClose();
                                        }}
                                        style={{
                                            width: isMobile ? '100%' : '48%',
                                            backgroundColor: '#f9fafb',
                                            borderRadius: 16,
                                            overflow: 'hidden',
                                            borderWidth: 2,
                                            borderColor: 'transparent',
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        {/* Preview */}
                                        <View style={{
                                            height: 200,
                                            overflow: 'hidden',
                                            transform: [{ scale: 0.3 }],
                                            transformOrigin: 'top left',
                                            width: 333.33,
                                        }}>
                                            <HeroComponent {...template.defaultProps} />
                                        </View>

                                        {/* Info */}
                                        <View style={{ padding: 16, backgroundColor: 'white' }}>
                                            <Text style={{
                                                fontSize: 18,
                                                fontWeight: '600',
                                                color: '#111827',
                                                marginBottom: 4,
                                            }}>
                                                {template.name}
                                            </Text>
                                            <Text style={{
                                                fontSize: 14,
                                                color: '#6b7280',
                                                lineHeight: 20,
                                            }}>
                                                {template.description}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

export { HERO_TEMPLATES };
