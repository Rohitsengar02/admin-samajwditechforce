import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { HeroTemplateSelector, HeroCustomizer, HERO_TEMPLATES } from '../../components/heroTemplates';
import Hero1 from '../../components/heroTemplates/Hero1';
import Hero2 from '../../components/heroTemplates/Hero2';
import Hero3 from '../../components/heroTemplates/Hero3';
import Hero4 from '../../components/heroTemplates/Hero4';
import Hero5 from '../../components/heroTemplates/Hero5';

const HERO_COMPONENTS = [Hero1, Hero2, Hero3, Hero4, Hero5];

export default function HeroDemo() {
    const router = useRouter();
    const [showSelector, setShowSelector] = useState(false);
    const [showCustomizer, setShowCustomizer] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
    const [heroProps, setHeroProps] = useState<any>(null);

    const handleSelectTemplate = (templateId: number, defaultProps: any) => {
        setSelectedTemplate(templateId);
        setHeroProps(defaultProps);
    };

    const handleCustomize = () => {
        if (heroProps) {
            setShowCustomizer(true);
        }
    };

    const handleSaveCustomization = (newProps: any) => {
        setHeroProps(newProps);
    };

    const SelectedHero = selectedTemplate ? HERO_COMPONENTS[selectedTemplate - 1] : null;

    return (
        <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            {/* Header */}
            <LinearGradient
                colors={['#6366f1', '#4f46e5']}
                style={{
                    paddingTop: 48,
                    paddingBottom: 24,
                    paddingHorizontal: 20,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 14 }}
                    >
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>

                    <View style={{ flex: 1, marginHorizontal: 16 }}>
                        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
                            Hero Section Builder
                        </Text>
                        <Text style={{ color: '#c7d2fe', fontSize: 14, marginTop: 4 }}>
                            Create stunning hero sections
                        </Text>
                    </View>

                    {selectedTemplate && (
                        <TouchableOpacity
                            onPress={handleCustomize}
                            style={{
                                backgroundColor: 'white',
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 12,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            <Sparkles size={18} color="#4f46e5" />
                            <Text style={{ color: '#4f46e5', fontWeight: 'bold', fontSize: 14 }}>
                                Customize
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </LinearGradient>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Action Card */}
                {!selectedTemplate && (
                    <View style={{
                        backgroundColor: 'white',
                        margin: 20,
                        borderRadius: 20,
                        padding: 32,
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.08,
                        shadowRadius: 12,
                        elevation: 4,
                    }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 12 }}>
                            Build Your Hero Section
                        </Text>
                        <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>
                            Choose from 5 professional templates with animations
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowSelector(true)}
                            style={{
                                backgroundColor: '#6366f1',
                                paddingHorizontal: 32,
                                paddingVertical: 14,
                                borderRadius: 12,
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
                                Choose Template
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Preview */}
                {SelectedHero && heroProps && (
                    <View style={{ margin: 20 }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 12,
                        }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#6b7280' }}>
                                Preview
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowSelector(true)}
                                style={{
                                    paddingHorizontal: 14,
                                    paddingVertical: 8,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: '#e5e7eb',
                                }}
                            >
                                <Text style={{ color: '#6b7280', fontSize: 13, fontWeight: '600' }}>
                                    Change Template
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            borderRadius: 16,
                            overflow: 'hidden',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.1,
                            shadowRadius: 16,
                            elevation: 8,
                        }}>
                            <SelectedHero {...heroProps} />
                        </View>
                    </View>
                )}

                {/* Template Info */}
                {selectedTemplate && (
                    <View style={{
                        backgroundColor: 'white',
                        marginHorizontal: 20,
                        borderRadius: 16,
                        padding: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 8,
                        elevation: 2,
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
                            {HERO_TEMPLATES[selectedTemplate - 1].name}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#6b7280', lineHeight: 22 }}>
                            {HERO_TEMPLATES[selectedTemplate - 1].description}
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Template Selector Modal */}
            <HeroTemplateSelector
                visible={showSelector}
                onClose={() => setShowSelector(false)}
                onSelect={handleSelectTemplate}
            />

            {/* Customizer Modal/Sidebar */}
            {heroProps && selectedTemplate && (
                <HeroCustomizer
                    visible={showCustomizer}
                    onClose={() => setShowCustomizer(false)}
                    onSave={handleSaveCustomization}
                    initialProps={heroProps}
                    templateId={selectedTemplate}
                />
            )}
        </View>
    );
}
