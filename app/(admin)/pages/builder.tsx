import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Platform, Dimensions, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import {
    ArrowLeft, Save, Plus, Edit2, Trash2, MoveUp, MoveDown, Eye, X, ChevronLeft,
    Type, AlignLeft, Image as ImageIcon, Grid, Video, Quote,
    List, CheckSquare, Code, Mail, Map, Star, Users, Award,
    MessageSquare, Calendar, FileText
} from 'lucide-react-native';
import { HERO_TEMPLATES } from '../../../components/heroTemplates';
import Hero1 from '../../../components/heroTemplates/Hero1';
import Hero2 from '../../../components/heroTemplates/Hero2';
import Hero3 from '../../../components/heroTemplates/Hero3';
import Hero4 from '../../../components/heroTemplates/Hero4';
import Hero5 from '../../../components/heroTemplates/Hero5';
import { GALLERY_COMPONENTS, GALLERY_TEMPLATES } from '../../../components/galleryTemplates';
import Gallery1 from '../../../components/galleryTemplates/Gallery1';
import Gallery2 from '../../../components/galleryTemplates/Gallery2';
import { getApiUrl } from '../../../utils/api';

const { width } = Dimensions.get('window');

const API_URL = `${getApiUrl()}/pages`;

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = 'dssmutzly';
const CLOUDINARY_UPLOAD_PRESET = 'multimallpro';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Upload image to Cloudinary with OPTIMIZATION
const uploadToCloudinary = async (imageUri: string): Promise<string> => {
    try {
        console.log('Starting upload for:', imageUri);

        const formData = new FormData();

        if (Platform.OS === 'web') {
            // For web, fetch the blob and append
            const response = await fetch(imageUri);
            const blob = await response.blob();
            formData.append('file', blob);
        } else {
            // For mobile, create proper file object
            const filename = imageUri.split('/').pop() || `upload_${Date.now()}.jpg`;
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('file', {
                uri: imageUri,
                name: filename,
                type: type,
            } as any);
        }

        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        console.log('Uploading to Cloudinary...');
        const uploadResponse = await fetch(CLOUDINARY_UPLOAD_URL, {
            method: 'POST',
            body: formData,
        });

        const data = await uploadResponse.json();
        console.log('Cloudinary response:', data);

        if (data.secure_url) {
            // Return OPTIMIZED URL - reduces size by 60-80%
            const optimizedUrl = data.secure_url.replace(
                '/upload/',
                '/upload/f_auto,q_auto:best/'
            );
            console.log('✅ Upload successful (optimized):', optimizedUrl);
            return optimizedUrl;
        }

        if (data.error) {
            console.error('Cloudinary error:', data.error);
            throw new Error(data.error.message || JSON.stringify(data.error));
        }

        throw new Error('Upload failed - no URL returned');
    } catch (error: any) {
        console.error('Cloudinary upload error:', error);
        console.error('Error details:', error.message);
        throw error;
    }
};

const HERO_COMPONENTS: any = {
    1: Hero1,
    2: Hero2,
    3: Hero3,
    4: Hero4,
    5: Hero5,
};


// Heading Style Templates
const HEADING_TEMPLATES = [
    {
        id: 1,
        name: 'Bold Display',
        preview: 'Bold & Powerful',
        defaults: {
            text: 'Your Heading Here',
            fontSize: 48,
            fontWeight: 'bold',
            color: '#111827',
            align: 'center',
            lineHeight: 1.2,
            letterSpacing: -1,
            fontFamily: 'System',
            textTransform: 'none',
        }
    },
    {
        id: 2,
        name: 'Elegant Serif',
        preview: 'Elegant & Classic',
        defaults: {
            text: 'Your Heading Here',
            fontSize: 40,
            fontWeight: '600',
            color: '#1f2937',
            align: 'left',
            lineHeight: 1.3,
            letterSpacing: 0,
            fontFamily: 'serif',
            textTransform: 'none',
        }
    },
    {
        id: 3,
        name: 'Modern Light',
        preview: 'Modern & Minimal',
        defaults: {
            text: 'Your Heading Here',
            fontSize: 36,
            fontWeight: '300',
            color: '#374151',
            align: 'center',
            lineHeight: 1.4,
            letterSpacing: 2,
            fontFamily: 'System',
            textTransform: 'none',
        }
    },
    {
        id: 4,
        name: 'Gradient Pop',
        preview: 'Colorful & Fun',
        defaults: {
            text: 'Your Heading Here',
            fontSize: 44,
            fontWeight: 'bold',
            color: '#6366f1',
            gradientColors: ['#6366f1', '#ec4899'],
            align: 'center',
            lineHeight: 1.2,
            letterSpacing: 0,
            fontFamily: 'System',
            textTransform: 'none',
        }
    },
    {
        id: 5,
        name: 'Compact Strong',
        preview: 'Strong & Direct',
        defaults: {
            text: 'Your Heading Here',
            fontSize: 32,
            fontWeight: '800',
            color: '#0f172a',
            align: 'left',
            lineHeight: 1.1,
            letterSpacing: -0.5,
            textTransform: 'uppercase',
            fontFamily: 'System',
        }
    },
];

// Paragraph Templates
const PARAGRAPH_TEMPLATES = [
    {
        id: 1,
        name: 'Standard Body',
        preview: 'Clean and readable',
        defaults: {
            text: 'Your paragraph text goes here. Write engaging content that connects with your audience.',
            fontSize: 16,
            fontWeight: '400',
            color: '#374151',
            align: 'left',
            lineHeight: 1.6,
            letterSpacing: 0,
            fontFamily: 'System',
        }
    },
    {
        id: 2,
        name: 'Large Reading',
        preview: 'Easy on the eyes',
        defaults: {
            text: 'Your paragraph text goes here. Write engaging content that connects with your audience.',
            fontSize: 18,
            fontWeight: '400',
            color: '#1f2937',
            align: 'left',
            lineHeight: 1.8,
            letterSpacing: 0.3,
            fontFamily: 'serif',
        }
    },
    {
        id: 3,
        name: 'Centered Caption',
        preview: 'Perfect for quotes',
        defaults: {
            text: 'Your paragraph text goes here. Write engaging content that connects with your audience.',
            fontSize: 17,
            fontWeight: '500',
            color: '#6b7280',
            align: 'center',
            lineHeight: 1.7,
            letterSpacing: 0.2,
            fontFamily: 'System',
        }
    },
    {
        id: 4,
        name: 'Compact Dense',
        preview: 'Information rich',
        defaults: {
            text: 'Your paragraph text goes here. Write engaging content that connects with your audience.',
            fontSize: 14,
            fontWeight: '400',
            color: '#4b5563',
            align: 'justify',
            lineHeight: 1.5,
            letterSpacing: 0,
            fontFamily: 'System',
        }
    },
    {
        id: 5,
        name: 'Emphasis Style',
        preview: 'Bold statements',
        defaults: {
            text: 'Your paragraph text goes here. Write engaging content that connects with your audience.',
            fontSize: 19,
            fontWeight: '600',
            color: '#111827',
            align: 'left',
            lineHeight: 1.6,
            letterSpacing: -0.2,
            fontFamily: 'System',
        }
    },
];

// Section Types
const SECTION_TYPES = [
    { id: 'hero', label: 'Hero Section', icon: Star, description: 'Full-width banner', color: '#3b82f6' },
    { id: 'heading', label: 'Heading', icon: Type, description: 'Large title text', color: '#8b5cf6' },
    { id: 'paragraph', label: 'Paragraph', icon: AlignLeft, description: 'Body text', color: '#6b7280' },

    { id: 'gallery', label: 'Gallery', icon: Grid, description: 'Image grid', color: '#f59e0b' },

];

interface Section {
    id: string;
    type: string;
    templateId?: number;
    content: any;
    order: number;
}

type SidebarView = 'sections' | 'heroTemplates' | 'headingTemplates' | 'paragraphTemplates' | 'galleryTemplates' | 'customize';


export default function PageBuilder() {
    const router = useRouter();
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();

    const [page, setPage] = useState<any>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewport, setViewport] = useState<'mobile' | 'desktop'>(width < 768 ? 'mobile' : 'desktop');

    // Sidebar state
    const [sidebarView, setSidebarView] = useState<SidebarView>('sections');
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);
    const [customizingProps, setCustomizingProps] = useState<any>(null);
    const [showMobileSections, setShowMobileSections] = useState(false);

    // Hide tab bar on this page
    useEffect(() => {
        navigation.setOptions({
            tabBarStyle: { display: 'none' }
        });

        return () => {
            navigation.setOptions({
                tabBarStyle: { display: 'flex' }
            });
        };
    }, [navigation]);

    useEffect(() => {
        if (id) {
            fetchPage();
        }
    }, [id]);

    const fetchPage = async () => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const data = await response.json();

            if (data.success) {
                setPage(data.data);
                try {
                    // Check if content is already an array (new format) or a string (old format)
                    let sectionsData = data.data.content;
                    if (typeof sectionsData === 'string') {
                        sectionsData = JSON.parse(sectionsData || '[]');
                    } else if (!Array.isArray(sectionsData)) {
                        sectionsData = [];
                    }

                    // Ensure all sections have unique IDs
                    const seenIds = new Set();
                    const cleanSections = sectionsData.map((s: any) => {
                        let newId = s.id;
                        if (!newId || seenIds.has(newId)) {
                            // Generate new unique ID for duplicate or missing ID
                            newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                        }
                        seenIds.add(newId);
                        return { ...s, id: newId };
                    });

                    setSections(cleanSections);
                } catch (e) {
                    console.error('Error parsing sections:', e);
                    setSections([]);
                }
            }
        } catch (error) {
            console.error('Error fetching page:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSectionType = (type: string) => {
        if (type === 'hero') {
            setSidebarView('heroTemplates');
        } else if (type === 'heading') {
            setSidebarView('headingTemplates');
        } else if (type === 'paragraph') {
            setSidebarView('paragraphTemplates');
        } else if (type === 'gallery') {
            setSidebarView('galleryTemplates');
        } else {
            // For other types, add directly
            const newSection: Section = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                type,
                content: getDefaultContent(type),
                order: sections.length,
            };
            const newSections = [...sections, newSection];
            setSections(newSections);
            savePage(newSections, true);
        }
    };

    const handleSelectHeadingTemplate = (templateId: number) => {
        const template = HEADING_TEMPLATES.find((t: any) => t.id === templateId);
        if (template) {
            const newSection: Section = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                type: 'heading',
                templateId,
                content: template.defaults,
                order: sections.length,
            };
            const newSections = [...sections, newSection];
            setSections(newSections);
            setSelectedSection(newSection);
            setCustomizingProps(template.defaults);
            setSidebarView('customize');
            savePage(newSections, true);
        }
    };

    const handleSelectParagraphTemplate = (templateId: number) => {
        const template = PARAGRAPH_TEMPLATES.find((t: any) => t.id === templateId);
        if (template) {
            const newSection: Section = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                type: 'paragraph',
                templateId,
                content: template.defaults,
                order: sections.length,
            };
            const newSections = [...sections, newSection];
            setSections(newSections);
            setSelectedSection(newSection);
            setCustomizingProps(template.defaults);
            setSidebarView('customize');
            savePage(newSections, true);
        }
    };

    const handleSelectGalleryTemplate = (templateId: number) => {
        const template = GALLERY_TEMPLATES.find((t: any) => t.id === templateId);
        if (template) {
            const newSection: Section = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                type: 'gallery',
                templateId,
                content: template.defaults,
                order: sections.length,
            };
            const newSections = [...sections, newSection];
            setSections(newSections);
            setSelectedSection(newSection);
            setCustomizingProps(template.defaults);
            setSidebarView('customize');
            savePage(newSections, true);
        }
    };

    const handleSelectHeroTemplate = (templateId: number) => {
        const template = HERO_TEMPLATES.find((t: any) => t.id === templateId);
        if (template) {
            const newSection: Section = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                type: 'hero',
                templateId,
                content: template.defaultProps,
                order: sections.length,
            };
            const newSections = [...sections, newSection];
            setSections(newSections);
            setSelectedSection(newSection);
            setCustomizingProps(template.defaultProps);
            setSidebarView('customize');
            savePage(newSections, true);
        }
    };

    const handleEditSection = (section: Section) => {
        setSelectedSection(section);
        // Deep clone content to prevent reference issues
        const contentCopy = JSON.parse(JSON.stringify(section.content));
        setCustomizingProps(contentCopy);
        setSidebarView('customize');
    };

    const handleSaveCustomization = async () => {
        if (selectedSection && customizingProps) {
            // 1. Optimistic Update (Update local UI immediately)
            const updatedSections = sections.map(s =>
                s.id === selectedSection.id ? { ...s, content: customizingProps } : s
            );
            setSections(updatedSections);

            // 2. Clear selection state
            setSidebarView('sections');
            setSelectedSection(null);
            setCustomizingProps(null);

            // 3. Save to Database
            const success = await savePage(updatedSections, false); // Not silent, show success alert

            // 4. Verification: Re-fetch from DB to ensure data consistency as requested
            if (success) {
                await fetchPage();
            }
        }
    };

    const updateProp = (key: string, value: any) => {
        setCustomizingProps({ ...customizingProps, [key]: value });
    };

    const getDefaultContent = (type: string) => {
        const defaults: any = {
            heading: { text: 'Heading Text', level: 'h2' },
            paragraph: { text: 'Paragraph content...' },
            image: { url: '', caption: '', alt: '' },
        };
        return defaults[type] || {};
    };

    const deleteSection = (sectionId: string) => {
        const newSections = sections.filter(s => s.id !== sectionId).map((s, i) => ({ ...s, order: i }));
        setSections(newSections);
        savePage(newSections, true);
    };

    const moveSection = (sectionId: string, direction: 'up' | 'down') => {
        const index = sections.findIndex(s => s.id === sectionId);
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) return;

        const newSections = [...sections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
        const orderedSections = newSections.map((s, i) => ({ ...s, order: i }));
        setSections(orderedSections);
        savePage(orderedSections, true);
    };

    const savePage = async (sectionsToSave = sections, silent = false) => {
        try {
            // If called from onPress event (which passes an object), use current sections
            const finalSections = Array.isArray(sectionsToSave) ? sectionsToSave : sections;

            // Use PATCH for content updates if silent (auto-save), otherwise PUT for full save
            const method = silent ? 'PATCH' : 'PUT';
            const url = silent ? `${API_URL}/${id}/content` : `${API_URL}/${id}`;
            const body = silent
                ? { content: finalSections }
                : { ...page, content: finalSections };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                if (!silent) Alert.alert('Success', 'Page saved successfully!');
                return true;
            } else {
                if (!silent) Alert.alert('Error', 'Failed to save page');
                return false;
            }
        } catch (error) {
            Alert.alert('Error', 'Network error');
            return false;
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                <Text style={{ color: '#6b7280', fontWeight: '500' }}>Loading builder...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#f9fafb' }}>
            {/* Main Content Area */}
            <View style={{ flex: 1 }}>
                {/* Header */}
                <LinearGradient
                    colors={['#6366f1', '#4f46e5']}
                    style={{
                        paddingTop: width < 768 ? 56 : 48,
                        paddingBottom: width < 768 ? 16 : 20,
                        paddingHorizontal: width < 768 ? 16 : 20,
                    }}
                >
                    {/* Mobile Layout */}
                    {width < 768 ? (
                        <View>
                            {/* Top Row - Back and Save */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                <TouchableOpacity
                                    onPress={() => router.back()}
                                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12 }}
                                >
                                    <ArrowLeft size={20} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => savePage()}
                                    style={{
                                        backgroundColor: 'white',
                                        paddingHorizontal: 16,
                                        paddingVertical: 8,
                                        borderRadius: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 6,
                                    }}
                                >
                                    <Save size={16} color="#4f46e5" />
                                    <Text style={{ color: '#4f46e5', fontWeight: 'bold', fontSize: 13 }}>Save</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Title */}
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{page?.title}</Text>

                            {/* Viewport Toggle - Compact */}
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                borderRadius: 8,
                                padding: 3,
                                alignSelf: 'flex-start',
                            }}>
                                <TouchableOpacity
                                    onPress={() => setViewport('desktop')}
                                    style={{
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        borderRadius: 6,
                                        backgroundColor: viewport === 'desktop' ? 'white' : 'transparent',
                                    }}
                                >
                                    <Text style={{
                                        color: viewport === 'desktop' ? '#4f46e5' : 'white',
                                        fontWeight: '600',
                                        fontSize: 11,
                                    }}>
                                        Desktop
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setViewport('mobile')}
                                    style={{
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        borderRadius: 6,
                                        backgroundColor: viewport === 'mobile' ? 'white' : 'transparent',
                                    }}
                                >
                                    <Text style={{
                                        color: viewport === 'mobile' ? '#4f46e5' : 'white',
                                        fontWeight: '600',
                                        fontSize: 11,
                                    }}>
                                        Mobile
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        /* Desktop Layout */
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 14 }}
                            >
                                <ArrowLeft size={24} color="white" />
                            </TouchableOpacity>

                            <View style={{ flex: 1, marginHorizontal: 16 }}>
                                <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>{page?.title}</Text>
                                <Text style={{ color: '#c7d2fe', fontSize: 13, marginTop: 4 }}>Page Builder</Text>
                            </View>

                            {/* Viewport Toggle */}
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                borderRadius: 10,
                                padding: 4,
                                marginRight: 12,
                            }}>
                                <TouchableOpacity
                                    onPress={() => setViewport('desktop')}
                                    style={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 8,
                                        borderRadius: 7,
                                        backgroundColor: viewport === 'desktop' ? 'white' : 'transparent',
                                    }}
                                >
                                    <Text style={{
                                        color: viewport === 'desktop' ? '#4f46e5' : 'white',
                                        fontWeight: '600',
                                        fontSize: 13,
                                    }}>
                                        Desktop
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setViewport('mobile')}
                                    style={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 8,
                                        borderRadius: 7,
                                        backgroundColor: viewport === 'mobile' ? 'white' : 'transparent',
                                    }}
                                >
                                    <Text style={{
                                        color: viewport === 'mobile' ? '#4f46e5' : 'white',
                                        fontWeight: '600',
                                        fontSize: 13,
                                    }}>
                                        Mobile
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                onPress={() => savePage()}
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
                                <Save size={18} color="#4f46e5" />
                                <Text style={{ color: '#4f46e5', fontWeight: 'bold', fontSize: 14 }}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </LinearGradient>

                {/* Preview Area */}
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        padding: width < 768 && viewport === 'desktop' ? 0 : 16,
                        paddingTop: width < 768 && viewport === 'desktop' ? 40 : 16,
                        paddingBottom: 100,
                        alignItems: 'center',
                    }}
                    horizontal={width < 768 && viewport === 'desktop'}
                    showsHorizontalScrollIndicator={false}
                >
                    {/* Wrapper for scaling */}
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: width < 768 && viewport === 'desktop' ? 320 : '100%',
                    }}>
                        {/* Responsive Canvas */}
                        <View style={{
                            width: viewport === 'mobile' ? (width < 768 ? width - 32 : 375) : (width < 768 ? 800 : '100%'),
                            maxWidth: viewport === 'desktop' ? 1200 : 375,
                            backgroundColor: 'white',
                            borderRadius: viewport === 'mobile' ? 24 : (width < 768 && viewport === 'desktop' ? 16 : 0),
                            overflow: width < 768 && viewport === 'desktop' ? 'hidden' : 'visible',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: viewport === 'mobile' || (width < 768 && viewport === 'desktop') ? 0.15 : 0,
                            shadowRadius: viewport === 'mobile' || (width < 768 && viewport === 'desktop') ? 20 : 0,
                            elevation: viewport === 'mobile' || (width < 768 && viewport === 'desktop') ? 8 : 0,
                            transform: width < 768 && viewport === 'desktop' ? [{ scale: 0.38 }] : [],
                            transformOrigin: 'top center',
                        }}>
                            {sections.length === 0 ? (
                                <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 40, alignItems: 'center' }}>
                                    <FileText size={64} color="#d1d5db" />
                                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#6b7280', marginTop: 16 }}>
                                        No sections yet
                                    </Text>
                                    <Text style={{ fontSize: 14, color: '#9ca3af', marginTop: 8 }}>
                                        Add sections from the right sidebar
                                    </Text>
                                </View>
                            ) : (
                                sections.map((section, index) => (
                                    <View key={section.id} style={{ marginBottom: 16 }}>
                                        {/* Section Preview */}
                                        {section.type === 'hero' && section.templateId && (
                                            <View style={{
                                                borderRadius: 16,
                                                overflow: 'hidden',
                                                marginBottom: 12,
                                                maxHeight: width < 768 && viewport === 'desktop' ? 600 : undefined,
                                            }}>
                                                {React.createElement(HERO_COMPONENTS[section.templateId], {
                                                    ...(selectedSection?.id === section.id ? customizingProps : section.content),
                                                    viewport
                                                })}
                                            </View>
                                        )}

                                        {section.type === 'heading' && (
                                            <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, marginBottom: 12 }}>
                                                <Text style={{
                                                    fontSize: (selectedSection?.id === section.id ? customizingProps : section.content).fontSize,
                                                    fontWeight: (selectedSection?.id === section.id ? customizingProps : section.content).fontWeight as any,
                                                    color: (selectedSection?.id === section.id ? customizingProps : section.content).color,
                                                    textAlign: (selectedSection?.id === section.id ? customizingProps : section.content).align as any,
                                                    lineHeight: (selectedSection?.id === section.id ? customizingProps : section.content).fontSize * (selectedSection?.id === section.id ? customizingProps : section.content).lineHeight,
                                                    letterSpacing: (selectedSection?.id === section.id ? customizingProps : section.content).letterSpacing,
                                                    textTransform: (selectedSection?.id === section.id ? customizingProps : section.content).textTransform as any,
                                                    fontFamily: (selectedSection?.id === section.id ? customizingProps : section.content).fontFamily,
                                                }}>
                                                    {(selectedSection?.id === section.id ? customizingProps : section.content).text}
                                                </Text>
                                            </View>
                                        )}

                                        {section.type === 'paragraph' && (
                                            <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 12 }}>
                                                <Text style={{
                                                    fontSize: (selectedSection?.id === section.id ? customizingProps : section.content).fontSize,
                                                    fontWeight: (selectedSection?.id === section.id ? customizingProps : section.content).fontWeight as any,
                                                    color: (selectedSection?.id === section.id ? customizingProps : section.content).color,
                                                    textAlign: (selectedSection?.id === section.id ? customizingProps : section.content).align as any,
                                                    lineHeight: (selectedSection?.id === section.id ? customizingProps : section.content).fontSize * (selectedSection?.id === section.id ? customizingProps : section.content).lineHeight,
                                                    letterSpacing: (selectedSection?.id === section.id ? customizingProps : section.content).letterSpacing,
                                                    fontFamily: (selectedSection?.id === section.id ? customizingProps : section.content).fontFamily,
                                                }}>
                                                    {(selectedSection?.id === section.id ? customizingProps : section.content).text}
                                                </Text>
                                            </View>
                                        )}

                                        {section.type === 'gallery' && section.templateId && (
                                            <View style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
                                                {React.createElement(GALLERY_COMPONENTS[section.templateId], {
                                                    ...(selectedSection?.id === section.id ? customizingProps : section.content),
                                                    viewport
                                                })}
                                            </View>
                                        )}

                                        {/* Section Controls */}
                                        <View style={{
                                            backgroundColor: 'white',
                                            borderRadius: 12,
                                            padding: 12,
                                            flexDirection: 'row',
                                            gap: 8,
                                        }}>
                                            <TouchableOpacity
                                                onPress={() => handleEditSection(section)}
                                                style={{ flex: 1, backgroundColor: '#eef2ff', paddingVertical: 10, borderRadius: 8, alignItems: 'center' }}
                                            >
                                                <Edit2 size={16} color="#6366f1" />
                                            </TouchableOpacity>

                                            {index > 0 && (
                                                <TouchableOpacity
                                                    onPress={() => moveSection(section.id, 'up')}
                                                    style={{ backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 }}
                                                >
                                                    <MoveUp size={16} color="#6b7280" />
                                                </TouchableOpacity>
                                            )}

                                            {index < sections.length - 1 && (
                                                <TouchableOpacity
                                                    onPress={() => moveSection(section.id, 'down')}
                                                    style={{ backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 }}
                                                >
                                                    <MoveDown size={16} color="#6b7280" />
                                                </TouchableOpacity>
                                            )}

                                            <TouchableOpacity
                                                onPress={() => deleteSection(section.id)}
                                                style={{ backgroundColor: '#fef2f2', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 }}
                                            >
                                                <Trash2 size={16} color="#dc2626" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>
                    </View>
                    {/* End Wrapper */}
                </ScrollView>
            </View>

            {/* Right Sidebar - Desktop Only */}
            {width >= 768 && (
                <View style={{
                    width: 380,
                    backgroundColor: 'white',
                    borderLeftWidth: 1,
                    borderLeftColor: '#e5e7eb',
                    shadowColor: '#000',
                    shadowOffset: { width: -4, height: 0 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                }}>
                    <RightSidebar
                        view={sidebarView}
                        onBack={() => {
                            if (sidebarView === 'customize') {
                                const prevView = selectedSection?.type === 'hero' ? 'heroTemplates' :
                                    selectedSection?.type === 'heading' ? 'headingTemplates' :
                                        selectedSection?.type === 'paragraph' ? 'paragraphTemplates' :
                                            selectedSection?.type === 'gallery' ? 'galleryTemplates' : 'sections';
                                setSidebarView(prevView);
                            } else if (sidebarView === 'heroTemplates' || sidebarView === 'headingTemplates' || sidebarView === 'paragraphTemplates' || sidebarView === 'galleryTemplates') {
                                setSidebarView('sections');
                            }
                        }}
                        onSelectSectionType={handleSelectSectionType}
                        onSelectHeroTemplate={handleSelectHeroTemplate}
                        onSelectHeadingTemplate={handleSelectHeadingTemplate}
                        onSelectParagraphTemplate={handleSelectParagraphTemplate}
                        onSelectGalleryTemplate={handleSelectGalleryTemplate}
                        customizingProps={customizingProps}
                        updateProp={updateProp}
                        onSaveCustomization={handleSaveCustomization}
                        selectedSection={selectedSection}
                    />
                </View>
            )}

            {/* Bottom Sheet - Mobile Only */}
            {width < 768 && sidebarView !== 'sections' && (
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    maxHeight: '80%',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 10,
                }}>
                    <RightSidebar
                        view={sidebarView}
                        onBack={() => {
                            if (sidebarView === 'customize') {
                                const prevView = selectedSection?.type === 'hero' ? 'heroTemplates' :
                                    selectedSection?.type === 'heading' ? 'headingTemplates' :
                                        selectedSection?.type === 'paragraph' ? 'paragraphTemplates' :
                                            selectedSection?.type === 'gallery' ? 'galleryTemplates' : 'sections';
                                setSidebarView(prevView);
                            } else if (sidebarView === 'heroTemplates' || sidebarView === 'headingTemplates' || sidebarView === 'paragraphTemplates' || sidebarView === 'galleryTemplates') {
                                setSidebarView('sections');
                            }
                        }}
                        onSelectSectionType={handleSelectSectionType}
                        onSelectHeroTemplate={handleSelectHeroTemplate}
                        onSelectHeadingTemplate={handleSelectHeadingTemplate}
                        onSelectParagraphTemplate={handleSelectParagraphTemplate}
                        onSelectGalleryTemplate={handleSelectGalleryTemplate}
                        customizingProps={customizingProps}
                        updateProp={updateProp}
                        onSaveCustomization={handleSaveCustomization}
                        selectedSection={selectedSection}
                    />
                </View>
            )}

            {/* Mobile FAB - Add Section Button */}
            {width < 768 && sidebarView === 'sections' && (
                <TouchableOpacity
                    onPress={() => setShowMobileSections(true)}
                    style={{
                        position: 'absolute',
                        bottom: 24,
                        right: 24,
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        backgroundColor: '#6366f1',
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                >
                    <Plus size={28} color="white" />
                </TouchableOpacity>
            )}

            {/* Mobile Sections Bottom Sheet */}
            {width < 768 && showMobileSections && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 1000,
                }}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => setShowMobileSections(false)}
                        activeOpacity={1}
                    />
                    <View style={{
                        backgroundColor: 'white',
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        maxHeight: '70%',
                        paddingTop: 8,
                    }}>
                        <View style={{
                            width: 40,
                            height: 4,
                            backgroundColor: '#d1d5db',
                            borderRadius: 2,
                            alignSelf: 'center',
                            marginBottom: 16,
                        }} />
                        <ScrollView>
                            <RightSidebar
                                view="sections"
                                onBack={() => setShowMobileSections(false)}
                                onSelectSectionType={(type: string) => {
                                    handleSelectSectionType(type);
                                    setShowMobileSections(false);
                                }}
                                onSelectHeroTemplate={handleSelectHeroTemplate}
                                onSelectHeadingTemplate={handleSelectHeadingTemplate}
                                onSelectParagraphTemplate={handleSelectParagraphTemplate}
                                onSelectGalleryTemplate={handleSelectGalleryTemplate}
                                customizingProps={null}
                                updateProp={updateProp}
                                onSaveCustomization={handleSaveCustomization}
                                selectedSection={null}
                            />
                        </ScrollView>
                    </View>
                </View>
            )}
        </View>
    );
}

// Right Sidebar Component
function RightSidebar({ view, onBack, onSelectSectionType, onSelectHeroTemplate, onSelectHeadingTemplate, onSelectParagraphTemplate, onSelectGalleryTemplate, customizingProps, updateProp, onSaveCustomization, selectedSection }: any) {
    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: '#e5e7eb',
            }}>
                {view !== 'sections' && (
                    <TouchableOpacity onPress={onBack} style={{ marginRight: 12 }}>
                        <ChevronLeft size={24} color="#6b7280" />
                    </TouchableOpacity>
                )}
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>
                        {view === 'sections' && 'Add Section'}
                        {view === 'heroTemplates' && 'Choose Hero Style'}
                        {view === 'customize' && 'Customize'}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                        {view === 'sections' && 'Select section type'}
                        {view === 'heroTemplates' && '5 templates available'}
                        {view === 'customize' && 'Edit content & colors'}
                    </Text>
                </View>
            </View>

            {/* Content */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                {view === 'sections' && (
                    <View style={{ gap: 12 }}>
                        {SECTION_TYPES.map((type) => {
                            const Icon = type.icon;
                            return (
                                <TouchableOpacity
                                    key={type.id}
                                    onPress={() => onSelectSectionType(type.id)}
                                    style={{
                                        backgroundColor: '#f9fafb',
                                        borderRadius: 14,
                                        padding: 16,
                                        borderWidth: 1,
                                        borderColor: '#e5e7eb',
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                        <View style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 10,
                                            backgroundColor: `${type.color}15`,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Icon size={22} color={type.color} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
                                                {type.label}
                                            </Text>
                                            <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                                                {type.description}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {view === 'heroTemplates' && (
                    <View style={{ gap: 16 }}>
                        {HERO_TEMPLATES.map((template: any) => {
                            const HeroComponent = [Hero1, Hero2, Hero3, Hero4, Hero5][template.id - 1];
                            return (
                                <TouchableOpacity
                                    key={template.id}
                                    onPress={() => onSelectHeroTemplate(template.id)}
                                    style={{
                                        backgroundColor: '#f9fafb',
                                        borderRadius: 14,
                                        overflow: 'hidden',
                                        borderWidth: 2,
                                        borderColor: '#e5e7eb',
                                    }}
                                    activeOpacity={0.8}
                                >
                                    {/* Desktop Preview Card (Scaled) */}
                                    <View style={{
                                        height: 140,
                                        overflow: 'hidden',
                                        backgroundColor: '#ffffff',
                                    }}>
                                        <View style={{
                                            transform: [{ scale: 0.28 }],
                                            transformOrigin: 'top left',
                                            width: 500,
                                            height: 500,
                                        }}>
                                            <HeroComponent {...template.defaultProps} />
                                        </View>
                                    </View>

                                    <View style={{ padding: 14, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#e5e7eb' }}>
                                        <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
                                            {template.name}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: '#6b7280' }}>
                                            {template.description}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {view === 'headingTemplates' && (
                    <View style={{ gap: 14 }}>
                        {HEADING_TEMPLATES.map((template: any) => (
                            <TouchableOpacity
                                key={template.id}
                                onPress={() => onSelectHeadingTemplate(template.id)}
                                style={{
                                    backgroundColor: '#f9fafb',
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: '#e5e7eb',
                                    padding: 16,
                                }}
                                activeOpacity={0.8}
                            >
                                {/* Preview */}
                                <View style={{
                                    backgroundColor: 'white',
                                    borderRadius: 8,
                                    padding: 20,
                                    marginBottom: 12,
                                    minHeight: 80,
                                    justifyContent: 'center',
                                }}>
                                    <Text style={{
                                        fontSize: template.defaults.fontSize / 2,
                                        fontWeight: template.defaults.fontWeight as any,
                                        color: template.defaults.color,
                                        textAlign: template.defaults.align as any,
                                        letterSpacing: template.defaults.letterSpacing,
                                        textTransform: template.defaults.textTransform as any,
                                    }}>
                                        {template.preview}
                                    </Text>
                                </View>

                                {/* Info */}
                                <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
                                    {template.name}
                                </Text>
                                <Text style={{ fontSize: 11, color: '#6b7280' }}>
                                    {template.defaults.fontSize}px • {template.defaults.fontWeight} • {template.defaults.align}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {view === 'paragraphTemplates' && (
                    <View style={{ gap: 14 }}>
                        {PARAGRAPH_TEMPLATES.map((template: any) => (
                            <TouchableOpacity
                                key={template.id}
                                onPress={() => onSelectParagraphTemplate(template.id)}
                                style={{
                                    backgroundColor: '#f9fafb',
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: '#e5e7eb',
                                    padding: 16,
                                }}
                                activeOpacity={0.8}
                            >
                                <View style={{
                                    backgroundColor: 'white',
                                    borderRadius: 8,
                                    padding: 16,
                                    marginBottom: 12,
                                    minHeight: 70,
                                }}>
                                    <Text style={{
                                        fontSize: 12,
                                        fontWeight: template.defaults.fontWeight as any,
                                        color: template.defaults.color,
                                        textAlign: template.defaults.align as any,
                                        lineHeight: 18,
                                    }}>
                                        {template.defaults.text.substring(0, 80)}...
                                    </Text>
                                </View>

                                <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
                                    {template.name}
                                </Text>
                                <Text style={{ fontSize: 11, color: '#6b7280' }}>
                                    {template.preview} • {template.defaults.fontSize}px
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {view === 'galleryTemplates' && (
                    <View style={{ gap: 14 }}>
                        {GALLERY_TEMPLATES.map((template: any) => (
                            <TouchableOpacity
                                key={template.id}
                                onPress={() => onSelectGalleryTemplate(template.id)}
                                style={{
                                    backgroundColor: '#f9fafb',
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: '#e5e7eb',
                                    padding: 16,
                                }}
                                activeOpacity={0.8}
                            >
                                {/* Preview - Small Grid of Images */}
                                <View style={{
                                    backgroundColor: 'white',
                                    borderRadius: 8,
                                    padding: 12,
                                    marginBottom: 12,
                                }}>
                                    <View style={{ flexDirection: 'row', gap: 6 }}>
                                        {template.defaults.images.slice(0, 4).map((img: any, i: number) => (
                                            <View
                                                key={i}
                                                style={{
                                                    flex: 1,
                                                    height: 60,
                                                    backgroundColor: '#e5e7eb',
                                                    borderRadius: 6,
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Image
                                                    source={{ uri: img }}
                                                    style={{ width: '100%', height: '100%' }}
                                                    resizeMode="cover"
                                                />
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
                                    {template.name}
                                </Text>
                                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>
                                    {template.description}
                                </Text>
                                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                                    <View style={{
                                        backgroundColor: '#eff6ff',
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        borderRadius: 6,
                                    }}>
                                        <Text style={{ fontSize: 10, color: '#3b82f6', fontWeight: '600' }}>
                                            {template.defaults.layout === 'grid' ? 'Grid' : 'Carousel'}
                                        </Text>
                                    </View>
                                    <View style={{
                                        backgroundColor: '#f0fdf4',
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        borderRadius: 6,
                                    }}>
                                        <Text style={{ fontSize: 10, color: '#16a34a', fontWeight: '600' }}>
                                            {template.defaults.images.length} Images
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {view === 'customize' && customizingProps && (
                    <CustomizePanel
                        props={customizingProps}
                        updateProp={updateProp}
                        onSave={onSaveCustomization}
                        sectionType={selectedSection?.type}
                    />
                )}
            </ScrollView>
        </View>
    );
}

// Customize Panel Component
function CustomizePanel({ props, updateProp, onSave, sectionType }: any) {
    return (
        <View>
            {/* Top Save Button for Visibility */}
            <TouchableOpacity
                onPress={onSave}
                style={{
                    backgroundColor: '#6366f1',
                    paddingVertical: 10,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginBottom: 20,
                    shadowColor: '#6366f1',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>Save Changes</Text>
            </TouchableOpacity>

            {/* Text Fields */}
            {props.text !== undefined && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Heading Text</Text>
                    <TextInput
                        style={{
                            backgroundColor: '#f9fafb',
                            borderWidth: 1,
                            borderColor: '#e5e7eb',
                            borderRadius: 10,
                            padding: 12,
                            fontSize: 14,
                            minHeight: 60,
                            textAlignVertical: 'top',
                        }}
                        value={props.text}
                        onChangeText={(text) => updateProp('text', text)}
                        multiline
                    />
                </View>
            )}

            {props.title !== undefined && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Title</Text>
                    <TextInput
                        style={{
                            backgroundColor: '#f9fafb',
                            borderWidth: 1,
                            borderColor: '#e5e7eb',
                            borderRadius: 10,
                            padding: 12,
                            fontSize: 14,
                        }}
                        value={props.title}
                        onChangeText={(text) => updateProp('title', text)}
                    />
                </View>
            )}

            {props.subtitle !== undefined && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Subtitle</Text>
                    <TextInput
                        style={{
                            backgroundColor: '#f9fafb',
                            borderWidth: 1,
                            borderColor: '#e5e7eb',
                            borderRadius: 10,
                            padding: 12,
                            fontSize: 14,
                            minHeight: 70,
                            textAlignVertical: 'top',
                        }}
                        value={props.subtitle}
                        onChangeText={(text) => updateProp('subtitle', text)}
                        multiline
                    />
                </View>
            )}

            {/* Typography Options for Headings */}
            {props.fontSize !== undefined && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                        Font Size: {props.fontSize}px
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: '#f9fafb',
                            borderWidth: 1,
                            borderColor: '#e5e7eb',
                            borderRadius: 10,
                            padding: 12,
                            fontSize: 14,
                        }}
                        value={props.fontSize?.toString()}
                        onChangeText={(text) => updateProp('fontSize', parseInt(text) || 16)}
                        keyboardType="numeric"
                        placeholder="e.g., 24"
                    />
                </View>
            )}

            {props.fontWeight !== undefined && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Font Weight</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {['300', '400', '500', '600', '700', '800', 'bold'].map((weight) => (
                            <TouchableOpacity
                                key={weight}
                                onPress={() => updateProp('fontWeight', weight)}
                                style={{
                                    backgroundColor: props.fontWeight === weight ? '#6366f1' : '#f3f4f6',
                                    paddingVertical: 8,
                                    paddingHorizontal: 12,
                                    borderRadius: 8,
                                }}
                            >
                                <Text style={{
                                    color: props.fontWeight === weight ? 'white' : '#374151',
                                    fontSize: 13,
                                    fontWeight: '600',
                                }}>
                                    {weight}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {props.align !== undefined && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Text Alignment</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        {['left', 'center', 'right'].map((alignment) => (
                            <TouchableOpacity
                                key={alignment}
                                onPress={() => updateProp('align', alignment)}
                                style={{
                                    flex: 1,
                                    backgroundColor: props.align === alignment ? '#6366f1' : '#f3f4f6',
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{
                                    color: props.align === alignment ? 'white' : '#374151',
                                    fontSize: 13,
                                    fontWeight: '600',
                                    textTransform: 'capitalize',
                                }}>
                                    {alignment}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {props.lineHeight !== undefined && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                        Line Height: {props.lineHeight}
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: '#f9fafb',
                            borderWidth: 1,
                            borderColor: '#e5e7eb',
                            borderRadius: 10,
                            padding: 12,
                            fontSize: 14,
                        }}
                        value={props.lineHeight?.toString()}
                        onChangeText={(text) => updateProp('lineHeight', parseFloat(text) || 1.2)}
                        keyboardType="decimal-pad"
                        placeholder="e.g., 1.5"
                    />
                </View>
            )}

            {props.letterSpacing !== undefined && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                        Letter Spacing: {props.letterSpacing}
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: '#f9fafb',
                            borderWidth: 1,
                            borderColor: '#e5e7eb',
                            borderRadius: 10,
                            padding: 12,
                            fontSize: 14,
                        }}
                        value={props.letterSpacing?.toString()}
                        onChangeText={(text) => updateProp('letterSpacing', parseFloat(text) || 0)}
                        keyboardType="decimal-pad"
                        placeholder="e.g., 0.5"
                    />
                </View>
            )}

            {props.color !== undefined && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Text Color</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {['#111827', '#1f2937', '#374151', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'].map((color) => (
                            <TouchableOpacity
                                key={color}
                                onPress={() => updateProp('color', color)}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: color,
                                    borderWidth: props.color === color ? 3 : 2,
                                    borderColor: props.color === color ? '#6366f1' : '#e5e7eb',
                                }}
                            />
                        ))}
                    </View>
                    <TextInput
                        style={{
                            backgroundColor: '#f9fafb',
                            borderWidth: 1,
                            borderColor: '#e5e7eb',
                            borderRadius: 10,
                            padding: 12,
                            fontSize: 14,
                            marginTop: 8,
                        }}
                        value={props.color}
                        onChangeText={(text) => updateProp('color', text)}
                        placeholder="#000000"
                    />
                </View>
            )}

            {props.fontFamily !== undefined && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Font Family</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {[
                            { label: 'System', value: 'System' },
                            { label: 'Serif', value: 'serif' },
                            { label: 'Monospace', value: 'monospace' },
                        ].map((font) => (
                            <TouchableOpacity
                                key={font.value}
                                onPress={() => updateProp('fontFamily', font.value)}
                                style={{
                                    flex: 1,
                                    minWidth: 100,
                                    backgroundColor: props.fontFamily === font.value ? '#6366f1' : '#f3f4f6',
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{
                                    color: props.fontFamily === font.value ? 'white' : '#374151',
                                    fontSize: 13,
                                    fontWeight: '600',
                                }}>
                                    {font.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {props.textTransform !== undefined && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Text Transform</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        {['none', 'uppercase', 'lowercase', 'capitalize'].map((transform) => (
                            <TouchableOpacity
                                key={transform}
                                onPress={() => updateProp('textTransform', transform)}
                                style={{
                                    flex: 1,
                                    backgroundColor: props.textTransform === transform ? '#6366f1' : '#f3f4f6',
                                    paddingVertical: 8,
                                    paddingHorizontal: 8,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{
                                    color: props.textTransform === transform ? 'white' : '#374151',
                                    fontSize: 11,
                                    fontWeight: '600',
                                }}>
                                    {transform}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Image Upload/URL for Hero Sections */}
            {props.imageUrl !== undefined && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Hero Image</Text>

                    {/* Current Image Preview */}
                    {props.imageUrl && (
                        <View style={{
                            backgroundColor: '#f9fafb',
                            borderRadius: 10,
                            padding: 12,
                            marginBottom: 12,
                            alignItems: 'center',
                        }}>
                            <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>Current Image:</Text>
                            <View style={{
                                width: '100%',
                                height: 120,
                                backgroundColor: '#e5e7eb',
                                borderRadius: 8,
                                overflow: 'hidden',
                            }}>
                                {Platform.OS === 'web' ? (
                                    <img
                                        src={props.imageUrl}
                                        alt="Hero"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <Text style={{ padding: 20, color: '#9ca3af', textAlign: 'center' }}>
                                        Image: {props.imageUrl.substring(0, 40)}...
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Upload Button */}
                    <TouchableOpacity
                        onPress={async () => {
                            try {
                                // Request permission
                                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                                if (status !== 'granted') {
                                    Alert.alert('Permission required', 'Please grant permission to access your photos');
                                    return;
                                }

                                // Pick image
                                const result = await ImagePicker.launchImageLibraryAsync({
                                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                    allowsEditing: true,
                                    aspect: [16, 9],
                                    quality: 0.8,
                                });

                                if (!result.canceled && result.assets[0]) {
                                    const imageUri = result.assets[0].uri;

                                    // Show uploading state
                                    Alert.alert('Uploading...', 'Please wait while we upload your image');

                                    try {
                                        // Upload to Cloudinary
                                        const uploadedUrl = await uploadToCloudinary(imageUri);
                                        updateProp('imageUrl', uploadedUrl);
                                        Alert.alert('Success', 'Image uploaded successfully!');
                                    } catch (error) {
                                        Alert.alert('Upload failed', 'Could not upload image. Please try pasting a URL instead.');
                                    }
                                }
                            } catch (error) {
                                console.error('Image picker error:', error);
                                Alert.alert('Error', 'Could not open image picker');
                            }
                        }}
                        style={{
                            backgroundColor: '#6366f1',
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderRadius: 10,
                            alignItems: 'center',
                            marginBottom: 12,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <ImageIcon size={18} color="white" />
                            <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
                                Upload Image
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* OR Divider */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
                        <Text style={{ fontSize: 12, color: '#9ca3af', marginHorizontal: 12 }}>OR</Text>
                        <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
                    </View>

                    {/* Image URL Input */}
                    <Text style={{ fontSize: 13, fontWeight: '500', color: '#6b7280', marginBottom: 6 }}>Paste Image URL:</Text>
                    <TextInput
                        style={{
                            backgroundColor: '#f9fafb',
                            borderWidth: 1,
                            borderColor: '#e5e7eb',
                            borderRadius: 10,
                            padding: 12,
                            fontSize: 14,
                            marginBottom: 8,
                        }}
                        value={props.imageUrl}
                        onChangeText={(text) => updateProp('imageUrl', text)}
                        placeholder="https://res.cloudinary.com/..."
                        multiline
                    />

                    <Text style={{ fontSize: 11, color: '#9ca3af', fontStyle: 'italic' }}>
                        Use the upload button above or paste a Cloudinary URL
                    </Text>
                </View>
            )}

            {props.buttonText !== undefined && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Button Text</Text>
                    <TextInput
                        style={{
                            backgroundColor: '#f9fafb',
                            borderWidth: 1,
                            borderColor: '#e5e7eb',
                            borderRadius: 10,
                            padding: 12,
                            fontSize: 14,
                        }}
                        value={props.buttonText}
                        onChangeText={(text) => updateProp('buttonText', text)}
                    />
                </View>
            )}

            {props.buttonUrl !== undefined && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Button Link/URL</Text>
                    <TextInput
                        style={{
                            backgroundColor: '#f9fafb',
                            borderWidth: 1,
                            borderColor: '#e5e7eb',
                            borderRadius: 10,
                            padding: 12,
                            fontSize: 14,
                        }}
                        value={props.buttonUrl}
                        onChangeText={(text) => updateProp('buttonUrl', text)}
                        placeholder="https://example.com or /page-path"
                    />
                </View>
            )}

            {/* Color Fields */}
            {props.backgroundColor !== undefined && (
                <ColorField label="Background" value={props.backgroundColor} onChange={(v: string) => updateProp('backgroundColor', v)} />
            )}
            {props.accentColor !== undefined && (
                <ColorField label="Accent Color" value={props.accentColor} onChange={(v: string) => updateProp('accentColor', v)} />
            )}
            {props.textColor !== undefined && (
                <ColorField label="Text Color" value={props.textColor} onChange={(v: string) => updateProp('textColor', v)} />
            )}

            {/* Gallery Customization */}
            {sectionType === 'gallery' && props.images !== undefined && (
                <View>
                    {/* Layout Selection */}
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Layout Type</Text>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <TouchableOpacity
                                onPress={() => updateProp('layout', 'grid')}
                                style={{
                                    flex: 1,
                                    backgroundColor: props.layout === 'grid' ? '#6366f1' : '#f3f4f6',
                                    paddingVertical: 12,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ color: props.layout === 'grid' ? 'white' : '#374151', fontWeight: '600' }}>
                                    Grid
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => updateProp('layout', 'carousel')}
                                style={{
                                    flex: 1,
                                    backgroundColor: props.layout === 'carousel' ? '#6366f1' : '#f3f4f6',
                                    paddingVertical: 12,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ color: props.layout === 'carousel' ? 'white' : '#374151', fontWeight: '600' }}>
                                    Carousel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                    {/* Columns (Grid only) */}
                    {props.layout === 'grid' && (
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                                Cards Per Row
                            </Text>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                {[1, 2, 3, 4].map((col) => (
                                    <TouchableOpacity
                                        key={col}
                                        onPress={() => updateProp('columns', col)}
                                        style={{
                                            flex: 1,
                                            backgroundColor: props.columns === col ? '#6366f1' : '#f3f4f6',
                                            paddingVertical: 12,
                                            borderRadius: 8,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{
                                            color: props.columns === col ? 'white' : '#374151',
                                            fontWeight: '600',
                                        }}>
                                            {col}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Cards Per Slide (Carousel only) */}
                    {props.layout === 'carousel' && (
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                                Cards Per Slide
                            </Text>
                            <View style={{ flexDirection: 'row', gap: 6 }}>
                                {[1, 2, 3, 4, 5].map((col) => (
                                    <TouchableOpacity
                                        key={col}
                                        onPress={() => updateProp('columns', col)}
                                        style={{
                                            flex: 1,
                                            backgroundColor: props.columns === col ? '#6366f1' : '#f3f4f6',
                                            paddingVertical: 12,
                                            borderRadius: 8,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{
                                            color: props.columns === col ? 'white' : '#374151',
                                            fontWeight: '600',
                                            fontSize: 13,
                                        }}>
                                            {col}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, fontStyle: 'italic' }}>
                                Show {props.columns || 1} card{(props.columns || 1) > 1 ? 's' : ''} at once in carousel
                            </Text>
                        </View>
                    )}

                    {/* Spacing Between Cards */}
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                            Card Spacing: {props.spacing}px
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            {[8, 12, 16, 20, 24].map((space) => (
                                <TouchableOpacity
                                    key={space}
                                    onPress={() => updateProp('spacing', space)}
                                    style={{
                                        flex: 1,
                                        backgroundColor: props.spacing === space ? '#6366f1' : '#f3f4f6',
                                        paddingVertical: 10,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{
                                        color: props.spacing === space ? 'white' : '#374151',
                                        fontWeight: '600',
                                        fontSize: 12,
                                    }}>
                                        {space}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Auto-Scroll (Carousel only) */}
                    {props.layout === 'carousel' && (
                        <>
                            <View style={{ marginBottom: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>Auto-Scroll</Text>
                                    <TouchableOpacity
                                        onPress={() => updateProp('autoScroll', !props.autoScroll)}
                                        style={{
                                            backgroundColor: props.autoScroll ? '#10b981' : '#e5e7eb',
                                            paddingHorizontal: 16,
                                            paddingVertical: 8,
                                            borderRadius: 20,
                                        }}
                                    >
                                        <Text style={{
                                            color: props.autoScroll ? 'white' : '#6b7280',
                                            fontWeight: '600',
                                            fontSize: 12,
                                        }}>
                                            {props.autoScroll ? 'ON' : 'OFF'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Scroll Speed */}
                            {props.autoScroll && (
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                                        Scroll Speed: {props.scrollSpeed / 1000}s
                                    </Text>
                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                        {[2000, 3000, 4000, 5000].map((speed) => (
                                            <TouchableOpacity
                                                key={speed}
                                                onPress={() => updateProp('scrollSpeed', speed)}
                                                style={{
                                                    flex: 1,
                                                    backgroundColor: props.scrollSpeed === speed ? '#6366f1' : '#f3f4f6',
                                                    paddingVertical: 10,
                                                    borderRadius: 8,
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Text style={{
                                                    color: props.scrollSpeed === speed ? 'white' : '#374151',
                                                    fontWeight: '600',
                                                    fontSize: 12,
                                                }}>
                                                    {speed / 1000}s
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </>
                    )}

                    {/* Manage Images */}
                    <View style={{ marginBottom: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>
                                Images ({props.images.length})
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    const newImages = [...props.images, { url: 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?w=400', title: '', description: '' }];
                                    updateProp('images', newImages);
                                }}
                                style={{
                                    backgroundColor: '#10b981',
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    borderRadius: 8,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 4,
                                }}
                            >
                                <Plus size={14} color="white" />
                                <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>Add Image</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ maxHeight: 400 }}>
                            {props.images.map((img: any, index: number) => (
                                <View
                                    key={index}
                                    style={{
                                        backgroundColor: '#f9fafb',
                                        borderRadius: 12,
                                        padding: 12,
                                        marginBottom: 12,
                                        borderWidth: 1,
                                        borderColor: '#e5e7eb',
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#111827' }}>
                                            Image {index + 1}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                const newImages = props.images.filter((_: any, i: number) => i !== index);
                                                updateProp('images', newImages);
                                            }}
                                            style={{
                                                backgroundColor: '#fee2e2',
                                                paddingHorizontal: 8,
                                                paddingVertical: 4,
                                                borderRadius: 6,
                                            }}
                                        >
                                            <Trash2 size={12} color="#dc2626" />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Upload Image Button */}
                                    <TouchableOpacity
                                        onPress={async () => {
                                            try {
                                                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                                                if (status !== 'granted') {
                                                    Alert.alert('Permission needed', 'Please grant camera roll permissions');
                                                    return;
                                                }

                                                const result = await ImagePicker.launchImageLibraryAsync({
                                                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                                    allowsEditing: true,
                                                    aspect: [16, 9],
                                                    quality: 0.8,
                                                });

                                                if (!result.canceled && result.assets[0]) {
                                                    const imageUri = result.assets[0].uri;
                                                    Alert.alert('Uploading...', 'Please wait while we upload your image');

                                                    const cloudinaryUrl = await uploadToCloudinary(imageUri);
                                                    if (cloudinaryUrl) {
                                                        const newImages = [...props.images];
                                                        newImages[index] = { ...newImages[index], url: cloudinaryUrl };
                                                        updateProp('images', newImages);
                                                        Alert.alert('Success', 'Image uploaded successfully!');
                                                    }
                                                }
                                            } catch (error) {
                                                console.error('Image upload error:', error);
                                                Alert.alert('Error', 'Failed to upload image');
                                            }
                                        }}
                                        style={{
                                            backgroundColor: '#3b82f6',
                                            paddingVertical: 10,
                                            borderRadius: 8,
                                            alignItems: 'center',
                                            marginBottom: 12,
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            gap: 6,
                                        }}
                                    >
                                        <ImageIcon size={14} color="white" />
                                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>
                                            Upload Image
                                        </Text>
                                    </TouchableOpacity>

                                    {/* OR Divider */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                        <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
                                        <Text style={{ marginHorizontal: 12, fontSize: 11, color: '#9ca3af', fontWeight: '500' }}>OR</Text>
                                        <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
                                    </View>

                                    {/* Image URL */}
                                    <Text style={{ fontSize: 12, fontWeight: '500', color: '#6b7280', marginBottom: 4 }}>Paste Image URL:</Text>
                                    <TextInput
                                        style={{
                                            backgroundColor: 'white',
                                            borderWidth: 1,
                                            borderColor: '#e5e7eb',
                                            borderRadius: 8,
                                            padding: 8,
                                            fontSize: 12,
                                            marginBottom: 8,
                                        }}
                                        value={img.url}
                                        onChangeText={(text) => {
                                            const newImages = [...props.images];
                                            newImages[index] = { ...newImages[index], url: text };
                                            updateProp('images', newImages);
                                        }}
                                        placeholder="https://example.com/image.jpg"
                                        multiline
                                    />

                                    {/* Title */}
                                    <Text style={{ fontSize: 12, fontWeight: '500', color: '#6b7280', marginBottom: 4 }}>Title (optional):</Text>
                                    <TextInput
                                        style={{
                                            backgroundColor: 'white',
                                            borderWidth: 1,
                                            borderColor: '#e5e7eb',
                                            borderRadius: 8,
                                            padding: 8,
                                            fontSize: 12,
                                            marginBottom: 8,
                                        }}
                                        value={img.title}
                                        onChangeText={(text) => {
                                            const newImages = [...props.images];
                                            newImages[index] = { ...newImages[index], title: text };
                                            updateProp('images', newImages);
                                        }}
                                        placeholder="Image title"
                                    />

                                    {/* Description */}
                                    <Text style={{ fontSize: 12, fontWeight: '500', color: '#6b7280', marginBottom: 4 }}>Description (optional):</Text>
                                    <TextInput
                                        style={{
                                            backgroundColor: 'white',
                                            borderWidth: 1,
                                            borderColor: '#e5e7eb',
                                            borderRadius: 8,
                                            padding: 8,
                                            fontSize: 12,
                                        }}
                                        value={img.description}
                                        onChangeText={(text) => {
                                            const newImages = [...props.images];
                                            newImages[index] = { ...newImages[index], description: text };
                                            updateProp('images', newImages);
                                        }}
                                        placeholder="Brief description"
                                        multiline
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            )}

            {/* Save Button */}
            <TouchableOpacity
                onPress={onSave}
                style={{
                    backgroundColor: '#6366f1',
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                    marginTop: 24,
                }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
}

// Color Field Component
function ColorField({ label, value, onChange }: any) {
    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>{label}</Text>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <TextInput
                    style={{
                        flex: 1,
                        backgroundColor: '#f9fafb',
                        borderWidth: 1,
                        borderColor: '#e5e7eb',
                        borderRadius: 10,
                        padding: 12,
                        fontSize: 13,
                        fontFamily: 'monospace',
                    }}
                    value={value}
                    onChangeText={onChange}
                />
                <View style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: value,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                }} />
            </View>
        </View>
    );
}
