import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Modal, TextInput, FlatList, Alert, Switch, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Save, Edit2, ArrowLeft, Star, TrendingUp, User, History, Grid, Layout, Check, X, Plus, Trash2 } from 'lucide-react-native';

import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const API_URL = Platform.OS === 'android' ? 'http://192.168.1.38:5001/api' : (Platform.OS === 'ios' ? 'http://localhost:5001/api' : (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api'));

// Cloudinary
const CLOUDINARY_CLOUD_NAME = 'dssmutzly';
const CLOUDINARY_UPLOAD_PRESET = 'multimallpro';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const uploadToCloudinary = async (imageUri: string): Promise<string> => {
    try {
        const formData = new FormData();
        if (Platform.OS === 'web') {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            formData.append('file', blob);
        } else {
            const filename = imageUri.split('/').pop() || `upload_${Date.now()}.jpg`;
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';
            formData.append('file', { uri: imageUri, name: filename, type } as any);
        }
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: formData });
        const data = await res.json();
        if (data.secure_url) return data.secure_url;
        throw new Error('Upload failed');
    } catch (error) {
        console.error(error);
        return '';
    }
};

// Default Data Structure
const DEFAULT_CONTENT = [
    {
        id: 'hero',
        label: 'Hero Section',
        icon: Star,
        color: '#E11D48',
        data: {
            slides: [
                {
                    badge: 'भारत की सबसे बड़ी समाजवादी पार्टी',
                    title: 'समाजवादी पार्टी में\nआपका स्वागत है!',
                    subtitle: 'समाज के हर वर्ग के विकास के लिए समर्पित।',
                    image: '',
                    stats: [
                        { num: '25L+', label: 'सक्रिय सदस्य' },
                        { num: '75+', label: 'सीटें जीतीं' },
                        { num: '1000+', label: 'विकास परियोजनाएं' }
                    ],
                    highlights: ['Free Laptop योजना', 'किसान पेंशन योजना', 'रोजगार गारंटी']
                }
            ]
        }
    },
    {
        id: 'track_record',
        label: 'Our Track Record',
        icon: TrendingUp,
        color: '#059669',
        data: {
            title: 'Our Track Record',
            items: [
                { icon: 'account-group', num: '10L+', label: 'Active Members' },
                { icon: 'city', num: '75', label: 'Districts Covered' },
                { icon: 'checkbox-marked-circle', num: '1M+', label: 'Tasks Completed' },
                { icon: 'bullhorn', num: '5000+', label: 'Campaigns Run' }
            ]
        }
    },
    {
        id: 'president',
        label: 'National President',
        icon: User,
        color: '#E11D48',
        data: {
            title: 'Our Leaders',
            slides: [{
                badge: 'National President',
                name: 'Akhilesh Yadav',
                subtitle: 'समाजवादी पार्टी के राष्ट्रीय अध्यक्ष',
                quote: 'समाजवाद का अर्थ है - समानता, न्याय और विकास।',
                achievements: [
                    'Former Chief Minister of UP (2012-2017)',
                    'Member of 17th Lok Sabha',
                    'Launched 1000+ Development Projects'
                ],
                image: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Akhilesh_Yadav_Lok_Sabha.jpg',
                isActive: true
            }],
            autoPlayInterval: 5000
        }
    },
    {
        id: 'legacy',
        label: 'Our Legacy',
        icon: History,
        color: '#D97706',
        data: {
            title: 'Our Legacy',
            leaders: [{
                name: 'Mulayam Singh Yadav',
                role: 'Founder',
                image: 'https://i.pinimg.com/474x/a5/ba/d8/a5bad8e597e3fb5b4256385476659dc9.jpg',
                description: 'Visionary leader who founded Samajwadi Party in 1992',
                isActive: true
            }],
            cards: [
                { title: 'Founded in 1992', desc: '30+ Years of Service' },
                { title: 'Multiple Terms', desc: '3 CM Tenures' }
            ]
        }
    },


    {
        id: 'explore',
        label: 'Explore Pages',
        icon: Layout,
        color: '#8B5CF6',
        data: {
            title: 'Explore Pages',
            selectedPageIds: []
        }
    },
    {
        id: 'footer',
        label: 'Footer Manager',
        icon: Layout,
        color: '#334155',
        data: {
            columns: [
                {
                    id: 'about_col',
                    title: 'About Us',
                    type: 'text',
                    content: 'The official digital wing of Samajwadi Party, dedicated to spreading the message of development and social justice.',
                    links: [],
                    contact: { address: '', phone: '', email: '' },
                    social: { facebook: '', twitter: '', instagram: '', youtube: '' }
                },
                {
                    id: 'quick_links',
                    title: 'Quick Links',
                    type: 'links',
                    content: '',
                    links: [
                        { label: 'About Us', path: '/about' },
                        { label: 'Latest News', path: '/news' },
                        { label: 'Join Us', path: '/joinus' },
                        { label: 'Contact', path: '/contact' }
                    ],
                    contact: { address: '', phone: '', email: '' },
                    social: { facebook: '', twitter: '', instagram: '', youtube: '' }
                },
                {
                    id: 'resources',
                    title: 'Resources',
                    type: 'links',
                    content: '',
                    links: [
                        { label: 'Posters', path: '/posters' },
                        { label: 'ID Card', path: '/idcard' },
                        { label: 'Daily Tasks', path: '/daily-work' },
                        { label: 'Events', path: '/events' }
                    ],
                    contact: { address: '', phone: '', email: '' },
                    social: { facebook: '', twitter: '', instagram: '', youtube: '' }
                },
                {
                    id: 'contact_info',
                    title: 'Contact Info',
                    type: 'contact',
                    content: '',
                    links: [],
                    contact: {
                        address: 'Samajwadi Party HQ\n19, Vikramaditya Marg\nLucknow, Uttar Pradesh',
                        phone: '',
                        email: 'contact@samajwadiparty.in'
                    },
                    social: { facebook: '', twitter: '', instagram: '', youtube: '' }
                },
                {
                    id: 'social_media',
                    title: 'Follow Us',
                    type: 'social',
                    content: '',
                    links: [],
                    contact: { address: '', phone: '', email: '' },
                    social: {
                        facebook: 'https://facebook.com/samajwadiparty',
                        twitter: 'https://twitter.com/samajwadiparty',
                        instagram: 'https://instagram.com/samajwadiparty',
                        youtube: 'https://youtube.com/samajwadiparty'
                    }
                }
            ],
            copyright: '© 2024 Samajwadi Party. All rights reserved.'
        }
    }
];

export default function HomeManager() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [homeData, setHomeData] = useState<any>(null);
    const [sections, setSections] = useState<any[]>(DEFAULT_CONTENT);
    const [activeSection, setActiveSection] = useState<any>(null);
    const [editData, setEditData] = useState<any>(null);

    // For Explore Pages
    const [allPages, setAllPages] = useState<any[]>([]);

    useEffect(() => {
        fetchHomeData();
        fetchPagesList();
    }, []);

    const fetchHomeData = async () => {
        try {
            // Fetch Home Content
            const res = await fetch(`${API_URL}/home-content`);
            const data = await res.json();

            // Fetch Footer Content
            const footerRes = await fetch(`${API_URL}/footer`);
            const footerData = await footerRes.json();

            if (data.success && data.data) {
                setHomeData(data.data);
                // Map backend data to sections format
                const content = [
                    { ...DEFAULT_CONTENT[0], data: { slides: data.data.hero?.slides || DEFAULT_CONTENT[0].data.slides } },
                    { ...DEFAULT_CONTENT[1], data: data.data.trackRecord || DEFAULT_CONTENT[1].data },
                    { ...DEFAULT_CONTENT[2], data: data.data.president || DEFAULT_CONTENT[2].data },
                    { ...DEFAULT_CONTENT[3], data: data.data.legacy || DEFAULT_CONTENT[3].data },
                    { ...DEFAULT_CONTENT[4], data: data.data.explorePages || DEFAULT_CONTENT[4].data },
                    // Footer from dedicated API
                    { ...DEFAULT_CONTENT[5], data: footerData.success ? footerData.data : DEFAULT_CONTENT[5].data },
                ];
                setSections(content);
            }
        } catch (e) {
            console.error('Error fetching home:', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchPagesList = async () => {
        try {
            const res = await fetch(`${API_URL}/pages`);
            const data = await res.json();
            if (data.success) setAllPages(data.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Build the payload for the new API structure
            const heroSection = sections.find(s => s.id === 'hero');
            const trackSection = sections.find(s => s.id === 'track_record');
            const presSection = sections.find(s => s.id === 'president');
            const legacySection = sections.find(s => s.id === 'legacy');
            const programsSection = sections.find(s => s.id === 'programs');
            const exploreSection = sections.find(s => s.id === 'explore');
            const footerSection = sections.find(s => s.id === 'footer');

            const payload = {
                hero: { slides: heroSection?.data?.slides || [], autoPlayInterval: 5000 },
                trackRecord: trackSection?.data || {},
                president: presSection?.data || {},
                legacy: legacySection?.data || {},
                programs: programsSection?.data || {},
                explorePages: exploreSection?.data || {},
                footer: footerSection?.data || {}
            };

            const res = await fetch(`${API_URL}/home-content`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (result.success) {
                Alert.alert('Success', `Home page content saved successfully! (Footer Active: ${result.data?.footer?.description ? 'Yes' : 'No'})`);
            } else {
                Alert.alert('Error', result.message || 'Failed to save');
            }
        } catch (e) {
            console.error('Save error:', e);
            Alert.alert('Error', 'Failed to save changes');
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (section: any) => {
        setActiveSection(section);
        setEditData(JSON.parse(JSON.stringify(section.data)));
    };

    const saveEdit = async () => {
        const updatedSections = sections.map(s =>
            s.id === activeSection.id ? { ...s, data: editData } : s
        );
        setSections(updatedSections);
        setActiveSection(null);

        // Immediately save to database
        setLoading(true);
        try {
            const editedSectionId = updatedSections.find(s => s.id === activeSection.id)?.id;

            // Route to appropriate API based on section
            if (editedSectionId === 'footer') {
                // Save Footer to dedicated API
                const footerData = updatedSections.find(s => s.id === 'footer')?.data;
                const res = await fetch(`${API_URL}/footer`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(footerData)
                });
                const result = await res.json();
                if (result.success) {
                    Alert.alert('Success', 'Footer saved successfully!');
                } else {
                    Alert.alert('Error', result.message || 'Failed to save footer');
                }
            } else {
                // Save Home Content
                const heroSection = updatedSections.find(s => s.id === 'hero');
                const trackSection = updatedSections.find(s => s.id === 'track_record');
                const presSection = updatedSections.find(s => s.id === 'president');
                const legacySection = updatedSections.find(s => s.id === 'legacy');
                const programsSection = updatedSections.find(s => s.id === 'programs');
                const exploreSection = updatedSections.find(s => s.id === 'explore');

                const payload = {
                    hero: { slides: heroSection?.data?.slides || [], autoPlayInterval: 5000 },
                    trackRecord: trackSection?.data || {},
                    president: presSection?.data || {},
                    legacy: legacySection?.data || {},
                    programs: programsSection?.data || {},
                    explorePages: exploreSection?.data || {}
                };

                const res = await fetch(`${API_URL}/home-content`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await res.json();
                if (result.success) {
                    Alert.alert('Success', 'Content saved successfully!');
                } else {
                    Alert.alert('Error', result.message || 'Failed to save');
                }
            }
        } catch (e) {
            console.error('Save error:', e);
            Alert.alert('Error', 'Failed to save changes');
        } finally {
            setLoading(false);
        }
    };

    const updateEditField = (key: string, value: any) => {
        setEditData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handlePickImage = async (key: string, itemIndex?: number) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            setLoading(true);
            const url = await uploadToCloudinary(result.assets[0].uri);
            setLoading(false);
            if (url) {
                if (itemIndex !== undefined) {
                    // Check if we're editing slides (hero/president) or items (programs)
                    if (editData.slides) {
                        const slides = [...editData.slides];
                        slides[itemIndex] = { ...slides[itemIndex], [key]: url };
                        updateEditField('slides', slides);
                    } else if (editData.items) {
                        const items = [...editData.items];
                        items[itemIndex] = { ...items[itemIndex], [key]: url };
                        updateEditField('items', items);
                    }
                } else {
                    updateEditField(key, url);
                }
            }
        }
    };

    const renderEditor = () => {
        if (!activeSection) return null;
        const { id } = activeSection;

        return (
            <Modal visible={!!activeSection} animationType="slide" presentationStyle="pageSheet">
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: '#eee' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Edit {activeSection.label}</Text>
                        <TouchableOpacity onPress={() => setActiveSection(null)}>
                            <X color="#000" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{ flex: 1, padding: 20 }}>
                        {id === 'hero' && (
                            <>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={styles.label}>Slides ({editData.slides?.length || 0})</Text>
                                    <TouchableOpacity
                                        style={{ backgroundColor: '#E11D48', padding: 8, borderRadius: 6 }}
                                        onPress={() => updateEditField('slides', [...(editData.slides || []), { title: 'New Slide', subtitle: '', image: '', stats: [], highlights: [] }])}
                                    >
                                        <Plus color="#fff" size={16} />
                                    </TouchableOpacity>
                                </View>

                                {(editData.slides || []).map((slide: any, index: number) => (
                                    <View key={index} style={{ marginBottom: 30, padding: 16, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                            <Text style={{ fontWeight: 'bold', color: '#666' }}>Slide {index + 1}</Text>
                                            <TouchableOpacity onPress={() => {
                                                const newSlides = [...editData.slides];
                                                newSlides.splice(index, 1);
                                                updateEditField('slides', newSlides);
                                            }}>
                                                <Trash2 color="#EF4444" size={18} />
                                            </TouchableOpacity>
                                        </View>

                                        <Text style={styles.label}>Main Image</Text>
                                        <TouchableOpacity onPress={() => handlePickImage('image', index)} style={{ marginBottom: 10 }}>
                                            {slide.image ? (
                                                <Image source={{ uri: slide.image }} style={{ width: '100%', height: 150, borderRadius: 8 }} resizeMode="cover" />
                                            ) : (
                                                <View style={{ width: '100%', height: 100, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}>
                                                    <Text style={{ color: '#666' }}>Upload Image</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>

                                        <Text style={styles.label}>Badge</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={slide.badge}
                                            onChangeText={(t) => {
                                                const s = [...editData.slides];
                                                s[index].badge = t;
                                                updateEditField('slides', s);
                                            }}
                                        />

                                        <Text style={styles.label}>Title</Text>
                                        <TextInput
                                            style={styles.input}
                                            multiline
                                            value={slide.title}
                                            onChangeText={(t) => {
                                                const s = [...editData.slides];
                                                s[index].title = t;
                                                updateEditField('slides', s);
                                            }}
                                        />

                                        <Text style={styles.label}>Subtitle</Text>
                                        <TextInput
                                            style={styles.input}
                                            multiline
                                            value={slide.subtitle}
                                            onChangeText={(t) => {
                                                const s = [...editData.slides];
                                                s[index].subtitle = t;
                                                updateEditField('slides', s);
                                            }}
                                        />

                                        <Text style={styles.label}>Highlights (Comma separated)</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={Array.isArray(slide.highlights) ? slide.highlights.join(',') : slide.highlights}
                                            onChangeText={(t) => {
                                                const s = [...editData.slides];
                                                s[index].highlights = t.split(',');
                                                updateEditField('slides', s);
                                            }}
                                            placeholder="Highlight 1, Highlight 2..."
                                        />

                                        <Text style={styles.label}>Stats</Text>
                                        {(slide.stats || []).map((stat: any, statIndex: number) => (
                                            <View key={statIndex} style={{ marginBottom: 8, padding: 8, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#eee' }}>
                                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ fontSize: 12, marginBottom: 4, color: '#666' }}>Number</Text>
                                                        <TextInput style={[styles.input, { padding: 8 }]} value={stat.num} onChangeText={(t) => {
                                                            const s = [...editData.slides];
                                                            const newStats = [...(s[index].stats || [])];
                                                            newStats[statIndex] = { ...newStats[statIndex], num: t };
                                                            s[index].stats = newStats;
                                                            updateEditField('slides', s);
                                                        }} />
                                                    </View>
                                                    <View style={{ flex: 2 }}>
                                                        <Text style={{ fontSize: 12, marginBottom: 4, color: '#666' }}>Label</Text>
                                                        <TextInput style={[styles.input, { padding: 8 }]} value={stat.label} onChangeText={(t) => {
                                                            const s = [...editData.slides];
                                                            const newStats = [...(s[index].stats || [])];
                                                            newStats[statIndex] = { ...newStats[statIndex], label: t };
                                                            s[index].stats = newStats;
                                                            updateEditField('slides', s);
                                                        }} />
                                                    </View>
                                                    <TouchableOpacity onPress={() => {
                                                        const s = [...editData.slides];
                                                        const newStats = [...s[index].stats];
                                                        newStats.splice(statIndex, 1);
                                                        s[index].stats = newStats;
                                                        updateEditField('slides', s);
                                                    }} style={{ justifyContent: 'center', marginTop: 16 }}>
                                                        <Trash2 size={16} color="#EF4444" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))}
                                        <TouchableOpacity onPress={() => {
                                            const s = [...editData.slides];
                                            const newStats = [...(s[index].stats || []), { num: '0', label: 'New Stat' }];
                                            s[index].stats = newStats;
                                            updateEditField('slides', s);
                                        }} style={{ alignSelf: 'flex-start', padding: 8, backgroundColor: '#f1f5f9', borderRadius: 6, marginTop: 4 }}>
                                            <Text style={{ fontSize: 12, color: '#333' }}>+ Add Stat</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </>
                        )}

                        {id === 'president' && (
                            <>
                                <Text style={styles.label}>Section Title</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editData.title}
                                    onChangeText={(t) => updateEditField('title', t)}
                                    placeholder="Our Leaders"
                                />

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={styles.label}>President Slides ({editData.slides?.length || 0})</Text>
                                    <TouchableOpacity
                                        style={{ backgroundColor: '#E11D48', padding: 8, borderRadius: 6 }}
                                        onPress={() => updateEditField('slides', [...(editData.slides || []), {
                                            badge: 'Leader',
                                            name: 'New Person',
                                            subtitle: '',
                                            quote: '',
                                            image: '',
                                            achievements: [],
                                            isActive: true
                                        }])}
                                    >
                                        <Plus color="#fff" size={16} />
                                    </TouchableOpacity>
                                </View>

                                {(editData.slides || []).map((slide: any, index: number) => (
                                    <View key={index} style={{ marginBottom: 24, padding: 16, backgroundColor: slide.isActive ? '#f0fdf4' : '#fef2f2', borderRadius: 12, borderWidth: 2, borderColor: slide.isActive ? '#22c55e' : '#ef4444' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: slide.isActive ? '#16a34a' : '#dc2626' }}>
                                                Slide {index + 1} {slide.isActive ? '(Active)' : '(Inactive)'}
                                            </Text>
                                            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <Text style={{ fontSize: 12, color: '#666' }}>Active</Text>
                                                    <Switch
                                                        value={slide.isActive !== false}
                                                        onValueChange={(val) => {
                                                            const s = [...editData.slides];
                                                            s[index] = { ...s[index], isActive: val };
                                                            updateEditField('slides', s);
                                                        }}
                                                        trackColor={{ false: '#ef4444', true: '#22c55e' }}
                                                    />
                                                </View>
                                                <TouchableOpacity onPress={() => {
                                                    const s = [...editData.slides];
                                                    s.splice(index, 1);
                                                    updateEditField('slides', s);
                                                }}>
                                                    <Trash2 color="#EF4444" size={20} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <Text style={styles.label}>Photo</Text>
                                        <TouchableOpacity onPress={() => handlePickImage('image', index)} style={{ marginBottom: 12 }}>
                                            {slide.image ? (
                                                <Image source={{ uri: slide.image }} style={{ width: 120, height: 120, borderRadius: 60 }} resizeMode="cover" />
                                            ) : (
                                                <View style={{ width: 120, height: 120, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderRadius: 60 }}>
                                                    <Text style={{ color: '#666' }}>Upload</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>

                                        <Text style={styles.label}>Badge/Title</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={slide.badge}
                                            onChangeText={(t) => {
                                                const s = [...editData.slides];
                                                s[index] = { ...s[index], badge: t };
                                                updateEditField('slides', s);
                                            }}
                                            placeholder="National President, State Leader, etc."
                                        />

                                        <Text style={styles.label}>Name</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={slide.name}
                                            onChangeText={(t) => {
                                                const s = [...editData.slides];
                                                s[index] = { ...s[index], name: t };
                                                updateEditField('slides', s);
                                            }}
                                            placeholder="Full Name"
                                        />

                                        <Text style={styles.label}>Subtitle</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={slide.subtitle}
                                            onChangeText={(t) => {
                                                const s = [...editData.slides];
                                                s[index] = { ...s[index], subtitle: t };
                                                updateEditField('slides', s);
                                            }}
                                            placeholder="Designation or role description"
                                        />

                                        <Text style={styles.label}>Quote</Text>
                                        <TextInput
                                            style={[styles.input, { height: 80 }]}
                                            multiline
                                            value={slide.quote}
                                            onChangeText={(t) => {
                                                const s = [...editData.slides];
                                                s[index] = { ...s[index], quote: t };
                                                updateEditField('slides', s);
                                            }}
                                            placeholder="A memorable quote..."
                                        />

                                        <Text style={styles.label}>Achievements (comma-separated)</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={Array.isArray(slide.achievements) ? slide.achievements.join(', ') : slide.achievements}
                                            onChangeText={(t) => {
                                                const s = [...editData.slides];
                                                s[index] = { ...s[index], achievements: t.split(',').map((a: string) => a.trim()) };
                                                updateEditField('slides', s);
                                            }}
                                            placeholder="Achievement 1, Achievement 2..."
                                        />
                                    </View>
                                ))}
                            </>
                        )}

                        {id === 'explore' && (
                            <>
                                <Text style={styles.label}>Section Title</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editData.title}
                                    onChangeText={(t) => updateEditField('title', t)}
                                    placeholder="Explore Pages"
                                />

                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.label}>Select Pages to Display ({editData.selectedPageIds?.length || 0} selected)</Text>
                                    <Text style={{ color: '#666', fontSize: 12, marginBottom: 12 }}>
                                        Tap on pages below to select/deselect them for display on home page
                                    </Text>

                                    {allPages.length === 0 ? (
                                        <View style={{ padding: 20, backgroundColor: '#fef3c7', borderRadius: 8 }}>
                                            <Text style={{ color: '#92400e', textAlign: 'center' }}>
                                                No pages found. Create pages in the Page Builder first.
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={{ gap: 8 }}>
                                            {allPages.map(page => {
                                                const isSelected = editData.selectedPageIds?.includes(page._id);
                                                return (
                                                    <TouchableOpacity
                                                        key={page._id}
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            padding: 16,
                                                            backgroundColor: isSelected ? '#dcfce7' : '#f8fafc',
                                                            borderRadius: 12,
                                                            borderWidth: 2,
                                                            borderColor: isSelected ? '#22c55e' : '#e2e8f0'
                                                        }}
                                                        onPress={() => {
                                                            const current = editData.selectedPageIds || [];
                                                            const newIds = current.includes(page._id)
                                                                ? current.filter((pid: string) => pid !== page._id)
                                                                : [...current, page._id];
                                                            updateEditField('selectedPageIds', newIds);
                                                        }}
                                                    >
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ fontWeight: '700', color: isSelected ? '#166534' : '#1e293b', fontSize: 16 }}>
                                                                {page.title}
                                                            </Text>
                                                            {page.slug && (
                                                                <Text style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>
                                                                    /{page.slug}
                                                                </Text>
                                                            )}
                                                        </View>
                                                        <View style={{
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: 14,
                                                            backgroundColor: isSelected ? '#22c55e' : '#e2e8f0',
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}>
                                                            {isSelected && <Check size={18} color="#fff" />}
                                                        </View>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    )}
                                </View>
                            </>
                        )}

                        {/* Track Record Editor */}
                        {id === 'track_record' && (
                            <>
                                <Text style={styles.label}>Section Title</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editData.title}
                                    onChangeText={(t) => updateEditField('title', t)}
                                    placeholder="Our Track Record"
                                />

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 16 }}>
                                    <Text style={styles.label}>Stats Items ({editData.items?.length || 0})</Text>
                                    <TouchableOpacity
                                        style={{ backgroundColor: '#059669', padding: 8, borderRadius: 6 }}
                                        onPress={() => updateEditField('items', [...(editData.items || []), { icon: 'star', num: '0', label: 'New Stat' }])}
                                    >
                                        <Plus color="#fff" size={16} />
                                    </TouchableOpacity>
                                </View>

                                {(editData.items || []).map((item: any, index: number) => (
                                    <View key={index} style={{ marginBottom: 16, padding: 16, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                            <Text style={{ fontWeight: 'bold', color: '#059669' }}>Item {index + 1}</Text>
                                            <TouchableOpacity onPress={() => {
                                                const newItems = [...editData.items];
                                                newItems.splice(index, 1);
                                                updateEditField('items', newItems);
                                            }}>
                                                <Trash2 color="#EF4444" size={18} />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 12, marginBottom: 4, color: '#666' }}>Number/Value</Text>
                                                <TextInput
                                                    style={[styles.input, { padding: 10 }]}
                                                    value={item.num}
                                                    onChangeText={(t) => {
                                                        const newItems = [...editData.items];
                                                        newItems[index] = { ...newItems[index], num: t };
                                                        updateEditField('items', newItems);
                                                    }}
                                                    placeholder="10L+"
                                                />
                                            </View>
                                            <View style={{ flex: 2 }}>
                                                <Text style={{ fontSize: 12, marginBottom: 4, color: '#666' }}>Label</Text>
                                                <TextInput
                                                    style={[styles.input, { padding: 10 }]}
                                                    value={item.label}
                                                    onChangeText={(t) => {
                                                        const newItems = [...editData.items];
                                                        newItems[index] = { ...newItems[index], label: t };
                                                        updateEditField('items', newItems);
                                                    }}
                                                    placeholder="Active Members"
                                                />
                                            </View>
                                        </View>

                                        <Text style={{ fontSize: 12, marginBottom: 4, color: '#666' }}>Icon Name (MaterialCommunityIcons)</Text>
                                        <TextInput
                                            style={[styles.input, { padding: 10 }]}
                                            value={item.icon}
                                            onChangeText={(t) => {
                                                const newItems = [...editData.items];
                                                newItems[index] = { ...newItems[index], icon: t };
                                                updateEditField('items', newItems);
                                            }}
                                            placeholder="account-group, city, checkbox-marked-circle, bullhorn"
                                        />
                                    </View>
                                ))}
                            </>
                        )}

                        {/* Legacy Section Editor */}
                        {id === 'legacy' && (
                            <>
                                <Text style={styles.label}>Section Title</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editData.title}
                                    onChangeText={(t) => updateEditField('title', t)}
                                    placeholder="Our Legacy"
                                />

                                {/* Leaders Section */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 16 }}>
                                    <Text style={styles.label}>Legacy Leaders ({editData.leaders?.length || 0})</Text>
                                    <TouchableOpacity
                                        style={{ backgroundColor: '#D97706', padding: 8, borderRadius: 6 }}
                                        onPress={() => updateEditField('leaders', [...(editData.leaders || []), {
                                            name: 'New Leader',
                                            role: 'Role',
                                            image: '',
                                            description: '',
                                            isActive: true
                                        }])}
                                    >
                                        <Plus color="#fff" size={16} />
                                    </TouchableOpacity>
                                </View>

                                {(editData.leaders || []).map((leader: any, index: number) => (
                                    <View key={index} style={{ marginBottom: 20, padding: 16, backgroundColor: leader.isActive ? '#fef3c7' : '#fee2e2', borderRadius: 12, borderWidth: 2, borderColor: leader.isActive ? '#f59e0b' : '#ef4444' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: leader.isActive ? '#92400e' : '#dc2626' }}>
                                                Leader {index + 1} {leader.isActive ? '(Active)' : '(Inactive)'}
                                            </Text>
                                            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <Text style={{ fontSize: 12, color: '#666' }}>Active</Text>
                                                    <Switch
                                                        value={leader.isActive !== false}
                                                        onValueChange={(val) => {
                                                            const leaders = [...editData.leaders];
                                                            leaders[index] = { ...leaders[index], isActive: val };
                                                            updateEditField('leaders', leaders);
                                                        }}
                                                        trackColor={{ false: '#ef4444', true: '#f59e0b' }}
                                                    />
                                                </View>
                                                <TouchableOpacity onPress={() => {
                                                    const leaders = [...editData.leaders];
                                                    leaders.splice(index, 1);
                                                    updateEditField('leaders', leaders);
                                                }}>
                                                    <Trash2 color="#EF4444" size={20} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <Text style={{ fontSize: 12, marginBottom: 4, color: '#666' }}>Photo</Text>
                                        <TouchableOpacity onPress={() => {
                                            // Custom handler for leaders array
                                            ImagePicker.launchImageLibraryAsync({
                                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                                allowsEditing: true,
                                                quality: 0.8,
                                            }).then(async (result) => {
                                                if (!result.canceled) {
                                                    setLoading(true);
                                                    const url = await uploadToCloudinary(result.assets[0].uri);
                                                    setLoading(false);
                                                    if (url) {
                                                        const leaders = [...editData.leaders];
                                                        leaders[index] = { ...leaders[index], image: url };
                                                        updateEditField('leaders', leaders);
                                                    }
                                                }
                                            });
                                        }} style={{ marginBottom: 12 }}>
                                            {leader.image ? (
                                                <Image source={{ uri: leader.image }} style={{ width: 100, height: 100, borderRadius: 50 }} resizeMode="cover" />
                                            ) : (
                                                <View style={{ width: 100, height: 100, backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}>
                                                    <Text style={{ color: '#666' }}>Upload</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>

                                        <Text style={{ fontSize: 12, marginBottom: 4, color: '#666' }}>Name</Text>
                                        <TextInput
                                            style={[styles.input, { marginBottom: 8 }]}
                                            value={leader.name}
                                            onChangeText={(t) => {
                                                const leaders = [...editData.leaders];
                                                leaders[index] = { ...leaders[index], name: t };
                                                updateEditField('leaders', leaders);
                                            }}
                                            placeholder="Mulayam Singh Yadav"
                                        />

                                        <Text style={{ fontSize: 12, marginBottom: 4, color: '#666' }}>Role</Text>
                                        <TextInput
                                            style={[styles.input, { marginBottom: 8 }]}
                                            value={leader.role}
                                            onChangeText={(t) => {
                                                const leaders = [...editData.leaders];
                                                leaders[index] = { ...leaders[index], role: t };
                                                updateEditField('leaders', leaders);
                                            }}
                                            placeholder="Founder, Former CM, etc."
                                        />

                                        <Text style={{ fontSize: 12, marginBottom: 4, color: '#666' }}>Description</Text>
                                        <TextInput
                                            style={[styles.input, { height: 60 }]}
                                            multiline
                                            value={leader.description}
                                            onChangeText={(t) => {
                                                const leaders = [...editData.leaders];
                                                leaders[index] = { ...leaders[index], description: t };
                                                updateEditField('leaders', leaders);
                                            }}
                                            placeholder="Brief description of this leader..."
                                        />
                                    </View>
                                ))}

                                {/* Legacy Cards Section */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 }}>
                                    <Text style={styles.label}>Achievement Cards ({editData.cards?.length || 0})</Text>
                                    <TouchableOpacity
                                        style={{ backgroundColor: '#059669', padding: 8, borderRadius: 6 }}
                                        onPress={() => updateEditField('cards', [...(editData.cards || []), { title: 'New Card', desc: 'Description' }])}
                                    >
                                        <Plus color="#fff" size={16} />
                                    </TouchableOpacity>
                                </View>

                                {(editData.cards || []).map((card: any, index: number) => (
                                    <View key={index} style={{ marginBottom: 12, padding: 12, backgroundColor: '#f8fafc', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text style={{ fontWeight: 'bold', color: '#334155' }}>Card {index + 1}</Text>
                                            <TouchableOpacity onPress={() => {
                                                const newCards = [...editData.cards];
                                                newCards.splice(index, 1);
                                                updateEditField('cards', newCards);
                                            }}>
                                                <Trash2 color="#EF4444" size={16} />
                                            </TouchableOpacity>
                                        </View>
                                        <TextInput
                                            style={[styles.input, { marginBottom: 8 }]}
                                            value={card.title}
                                            onChangeText={(t) => {
                                                const newCards = [...editData.cards];
                                                newCards[index] = { ...newCards[index], title: t };
                                                updateEditField('cards', newCards);
                                            }}
                                            placeholder="Title (e.g., Founded in 1992)"
                                        />
                                        <TextInput
                                            style={styles.input}
                                            value={card.desc}
                                            onChangeText={(t) => {
                                                const newCards = [...editData.cards];
                                                newCards[index] = { ...newCards[index], desc: t };
                                                updateEditField('cards', newCards);
                                            }}
                                            placeholder="Description (e.g., 30+ Years of Service)"
                                        />
                                    </View>
                                ))}
                            </>
                        )}



                        {/* Footer Section Editor */}
                        {id === 'footer' && (
                            <>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#059669' }}>Footer Columns Manager</Text>
                                <Text style={{ fontSize: 14, marginBottom: 20, color: '#666' }}>
                                    The footer is organized into flexible columns. Each column has a type (text, links, contact, or social).
                                </Text>

                                {(editData.columns || []).map((column: any, colIndex: number) => (
                                    <View key={column.id || colIndex} style={{ marginBottom: 24, padding: 16, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#cbd5e1' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#1e293b' }}>
                                                {column.title || `Column ${colIndex + 1}`} ({column.type})
                                            </Text>
                                            <TouchableOpacity onPress={() => {
                                                const newCols = [...editData.columns];
                                                newCols.splice(colIndex, 1);
                                                updateEditField('columns', newCols);
                                            }}>
                                                <Trash2 color="#EF4444" size={20} />
                                            </TouchableOpacity>
                                        </View>

                                        <Text style={styles.label}>Column Title</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={column.title}
                                            onChangeText={(t) => {
                                                const newCols = [...editData.columns];
                                                newCols[colIndex] = { ...newCols[colIndex], title: t };
                                                updateEditField('columns', newCols);
                                            }}
                                            placeholder="Column Title"
                                        />

                                        {/* TEXT TYPE */}
                                        {column.type === 'text' && (
                                            <>
                                                <Text style={styles.label}>Content</Text>
                                                <TextInput
                                                    style={[styles.input, { height: 80 }]}
                                                    multiline
                                                    value={column.content}
                                                    onChangeText={(t) => {
                                                        const newCols = [...editData.columns];
                                                        newCols[colIndex] = { ...newCols[colIndex], content: t };
                                                        updateEditField('columns', newCols);
                                                    }}
                                                    placeholder="Text content..."
                                                />
                                            </>
                                        )}

                                        {/* LINKS TYPE */}
                                        {column.type === 'links' && (
                                            <>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 8 }}>
                                                    <Text style={{ fontSize: 14, fontWeight: '600' }}>Links ({column.links?.length || 0})</Text>
                                                    <TouchableOpacity
                                                        style={{ backgroundColor: '#059669', padding: 6, borderRadius: 4 }}
                                                        onPress={() => {
                                                            const newCols = [...editData.columns];
                                                            newCols[colIndex] = {
                                                                ...newCols[colIndex],
                                                                links: [...(newCols[colIndex].links || []), { label: 'New Link', path: '/' }]
                                                            };
                                                            updateEditField('columns', newCols);
                                                        }}>
                                                        <Plus color="#fff" size={14} />
                                                    </TouchableOpacity>
                                                </View>
                                                {(column.links || []).map((link: any, linkIdx: number) => (
                                                    <View key={linkIdx} style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                                                        <TextInput
                                                            style={[styles.input, { flex: 1, padding: 8 }]}
                                                            value={link.label}
                                                            onChangeText={(t) => {
                                                                const newCols = [...editData.columns];
                                                                const newLinks = [...newCols[colIndex].links];
                                                                newLinks[linkIdx] = { ...newLinks[linkIdx], label: t };
                                                                newCols[colIndex] = { ...newCols[colIndex], links: newLinks };
                                                                updateEditField('columns', newCols);
                                                            }}
                                                            placeholder="Label"
                                                        />
                                                        <TextInput
                                                            style={[styles.input, { flex: 1, padding: 8 }]}
                                                            value={link.path}
                                                            onChangeText={(t) => {
                                                                const newCols = [...editData.columns];
                                                                const newLinks = [...newCols[colIndex].links];
                                                                newLinks[linkIdx] = { ...newLinks[linkIdx], path: t };
                                                                newCols[colIndex] = { ...newCols[colIndex], links: newLinks };
                                                                updateEditField('columns', newCols);
                                                            }}
                                                            placeholder="Path"
                                                        />
                                                        <TouchableOpacity onPress={() => {
                                                            const newCols = [...editData.columns];
                                                            const newLinks = [...newCols[colIndex].links];
                                                            newLinks.splice(linkIdx, 1);
                                                            newCols[colIndex] = { ...newCols[colIndex], links: newLinks };
                                                            updateEditField('columns', newCols);
                                                        }}>
                                                            <Trash2 color="#EF4444" size={18} />
                                                        </TouchableOpacity>
                                                    </View>
                                                ))}
                                            </>
                                        )}

                                        {/* CONTACT TYPE */}
                                        {column.type === 'contact' && (
                                            <>
                                                <Text style={styles.label}>Address</Text>
                                                <TextInput
                                                    style={[styles.input, { height: 60 }]}
                                                    multiline
                                                    value={column.contact?.address}
                                                    onChangeText={(t) => {
                                                        const newCols = [...editData.columns];
                                                        newCols[colIndex] = {
                                                            ...newCols[colIndex],
                                                            contact: { ...newCols[colIndex].contact, address: t }
                                                        };
                                                        updateEditField('columns', newCols);
                                                    }}
                                                    placeholder="Full Address"
                                                />
                                                <Text style={styles.label}>Phone</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    value={column.contact?.phone}
                                                    onChangeText={(t) => {
                                                        const newCols = [...editData.columns];
                                                        newCols[colIndex] = {
                                                            ...newCols[colIndex],
                                                            contact: { ...newCols[colIndex].contact, phone: t }
                                                        };
                                                        updateEditField('columns', newCols);
                                                    }}
                                                    placeholder="+91 1234567890"
                                                />
                                                <Text style={styles.label}>Email</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    value={column.contact?.email}
                                                    onChangeText={(t) => {
                                                        const newCols = [...editData.columns];
                                                        newCols[colIndex] = {
                                                            ...newCols[colIndex],
                                                            contact: { ...newCols[colIndex].contact, email: t }
                                                        };
                                                        updateEditField('columns', newCols);
                                                    }}
                                                    placeholder="email@example.com"
                                                />
                                            </>
                                        )}

                                        {/* SOCIAL TYPE */}
                                        {column.type === 'social' && (
                                            <>
                                                <Text style={styles.label}>Facebook URL</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    value={column.social?.facebook}
                                                    onChangeText={(t) => {
                                                        const newCols = [...editData.columns];
                                                        newCols[colIndex] = {
                                                            ...newCols[colIndex],
                                                            social: { ...newCols[colIndex].social, facebook: t }
                                                        };
                                                        updateEditField('columns', newCols);
                                                    }}
                                                    placeholder="https://facebook.com/..."
                                                />
                                                <Text style={styles.label}>Twitter URL</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    value={column.social?.twitter}
                                                    onChangeText={(t) => {
                                                        const newCols = [...editData.columns];
                                                        newCols[colIndex] = {
                                                            ...newCols[colIndex],
                                                            social: { ...newCols[colIndex].social, twitter: t }
                                                        };
                                                        updateEditField('columns', newCols);
                                                    }}
                                                    placeholder="https://twitter.com/..."
                                                />
                                                <Text style={styles.label}>Instagram URL</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    value={column.social?.instagram}
                                                    onChangeText={(t) => {
                                                        const newCols = [...editData.columns];
                                                        newCols[colIndex] = {
                                                            ...newCols[colIndex],
                                                            social: { ...newCols[colIndex].social, instagram: t }
                                                        };
                                                        updateEditField('columns', newCols);
                                                    }}
                                                    placeholder="https://instagram.com/..."
                                                />
                                                <Text style={styles.label}>YouTube URL</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    value={column.social?.youtube}
                                                    onChangeText={(t) => {
                                                        const newCols = [...editData.columns];
                                                        newCols[colIndex] = {
                                                            ...newCols[colIndex],
                                                            social: { ...newCols[colIndex].social, youtube: t }
                                                        };
                                                        updateEditField('columns', newCols);
                                                    }}
                                                    placeholder="https://youtube.com/..."
                                                />
                                            </>
                                        )}
                                    </View>
                                ))}

                                <TouchableOpacity
                                    style={{ backgroundColor: '#059669', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 }}
                                    onPress={() => {
                                        updateEditField('columns', [
                                            ...(editData.columns || []),
                                            {
                                                id: `col_${Date.now()}`,
                                                title: 'New Column',
                                                type: 'text',
                                                content: '',
                                                links: [],
                                                contact: { address: '', phone: '', email: '' },
                                                social: { facebook: '', twitter: '', instagram: '', youtube: '' }
                                            }
                                        ]);
                                    }}>
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Add Column</Text>
                                </TouchableOpacity>

                                <View style={{ height: 2, backgroundColor: '#eee', marginVertical: 24 }} />

                                <Text style={styles.label}>Copyright Text</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editData.copyright}
                                    onChangeText={(t) => updateEditField('copyright', t)}
                                    placeholder="© 2024 Samajwadi Party. All rights reserved."
                                />
                            </>
                        )}

                        <View style={{ height: 100 }} />
                    </ScrollView>
                    <View style={{ padding: 20, borderTopWidth: 1, borderColor: '#eee' }}>
                        <TouchableOpacity onPress={saveEdit} style={styles.saveBtn}>
                            <Text style={styles.saveBtnText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#E11D48" /></View>;

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#fff', '#f8f9fa']} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><ArrowLeft color="#000" /></TouchableOpacity>
                <Text style={styles.headerTitle}>Home Page Manager</Text>
                <TouchableOpacity onPress={handleSave} style={styles.headerSaveBtn}>
                    <Save color="#fff" size={20} />
                    <Text style={{ color: '#fff', fontWeight: '600', marginLeft: 8 }}>Save</Text>
                </TouchableOpacity>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.list}>
                {sections.map(section => {
                    const Icon = section.icon || Star;
                    return (
                        <View key={section.id} style={styles.card}>
                            <View style={[styles.iconBox, { backgroundColor: section.color + '20' }]}>
                                <Icon color={section.color} size={24} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 16 }}>
                                <Text style={styles.cardTitle}>{section.label}</Text>
                                <Text style={styles.cardDesc} numberOfLines={1}>Manage {section.id.replace('_', ' ')} content</Text>
                            </View>
                            <TouchableOpacity onPress={() => openEdit(section)} style={styles.editBtn}>
                                <Edit2 color="#666" size={20} />
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
            {renderEditor()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { padding: 20, paddingTop: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#eee' },
    backBtn: { padding: 8 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    headerSaveBtn: { flexDirection: 'row', backgroundColor: '#E11D48', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
    list: { padding: 20 },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    cardTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
    cardDesc: { fontSize: 13, color: '#64748b', marginTop: 2 },
    editBtn: { padding: 8, backgroundColor: '#f1f5f9', borderRadius: 8 },
    // Editor Styles
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
    input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12, fontSize: 15 },
    rowInput: { flexDirection: 'row', gap: 10, marginBottom: 8 },
    saveBtn: { backgroundColor: '#E11D48', padding: 16, borderRadius: 12, alignItems: 'center' },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    pageSelect: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 8 },
    pageSelectActive: { backgroundColor: '#E11D48', borderColor: '#E11D48' }
});
