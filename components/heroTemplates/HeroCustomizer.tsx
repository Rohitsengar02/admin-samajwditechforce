import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Platform, Dimensions, Modal } from 'react-native';
import { Save, X, Image as ImageIcon, Palette } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

interface HeroCustomizerProps {
    visible: boolean;
    onClose: () => void;
    onSave: (props: any) => void;
    initialProps: any;
    templateId: number;
}

export default function HeroCustomizer({ visible, onClose, onSave, initialProps, templateId }: HeroCustomizerProps) {
    const [props, setProps] = useState(initialProps);

    const updateProp = (key: string, value: any) => {
        setProps({ ...props, [key]: value });
    };

    const handleSave = () => {
        onSave(props);
        onClose();
    };

    const ColorPicker = ({ label, value, onChange }: any) => (
        <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                {label}
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <TextInput
                    style={{
                        flex: 1,
                        backgroundColor: '#f9fafb',
                        borderWidth: 1,
                        borderColor: '#e5e7eb',
                        borderRadius: 10,
                        padding: 12,
                        fontSize: 14,
                        fontFamily: 'monospace',
                    }}
                    value={value}
                    onChangeText={onChange}
                    placeholder="#000000"
                />
                <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    backgroundColor: value,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                }} />
            </View>
        </View>
    );

    const TextField = ({ label, value, onChange, multiline = false }: any) => (
        <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                {label}
            </Text>
            <TextInput
                style={{
                    backgroundColor: '#f9fafb',
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 14,
                    minHeight: multiline ? 80 : 48,
                    textAlignVertical: multiline ? 'top' : 'center',
                }}
                value={value}
                onChangeText={onChange}
                multiline={multiline}
                placeholder={`Enter ${label.toLowerCase()}`}
            />
        </View>
    );

    const content = (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: '#e5e7eb',
            }}>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>
                        Customize Hero
                    </Text>
                    <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                        Edit content and design
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={onClose}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: '#f3f4f6',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <X size={20} color="#6b7280" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 20 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Content Section */}
                <View style={{
                    marginBottom: 24,
                    paddingBottom: 24,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e5e7eb',
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <ImageIcon size={18} color="#6366f1" />
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827', marginLeft: 8 }}>
                            Content
                        </Text>
                    </View>

                    <TextField
                        label="Title"
                        value={props.title}
                        onChange={(text: string) => updateProp('title', text)}
                    />

                    <TextField
                        label="Subtitle / Description"
                        value={props.subtitle}
                        onChange={(text: string) => updateProp('subtitle', text)}
                        multiline
                    />

                    <TextField
                        label="Button Text"
                        value={props.buttonText}
                        onChange={(text: string) => updateProp('buttonText', text)}
                    />

                    {props.imageUrl !== undefined && (
                        <TextField
                            label="Image URL"
                            value={props.imageUrl}
                            onChange={(text: string) => updateProp('imageUrl', text)}
                        />
                    )}
                </View>

                {/* Design Section */}
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <Palette size={18} color="#6366f1" />
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827', marginLeft: 8 }}>
                            Design & Colors
                        </Text>
                    </View>

                    {props.backgroundColor !== undefined && (
                        <ColorPicker
                            label="Background Color"
                            value={props.backgroundColor}
                            onChange={(text: string) => updateProp('backgroundColor', text)}
                        />
                    )}

                    {props.accentColor !== undefined && (
                        <ColorPicker
                            label="Accent Color"
                            value={props.accentColor}
                            onChange={(text: string) => updateProp('accentColor', text)}
                        />
                    )}

                    {props.primaryColor !== undefined && (
                        <ColorPicker
                            label="Primary Color"
                            value={props.primaryColor}
                            onChange={(text: string) => updateProp('primaryColor', text)}
                        />
                    )}

                    {props.secondaryColor !== undefined && (
                        <ColorPicker
                            label="Secondary Color"
                            value={props.secondaryColor}
                            onChange={(text: string) => updateProp('secondaryColor', text)}
                        />
                    )}

                    {props.gradientStart !== undefined && (
                        <ColorPicker
                            label="Gradient Start"
                            value={props.gradientStart}
                            onChange={(text: string) => updateProp('gradientStart', text)}
                        />
                    )}

                    {props.gradientEnd !== undefined && (
                        <ColorPicker
                            label="Gradient End"
                            value={props.gradientEnd}
                            onChange={(text: string) => updateProp('gradientEnd', text)}
                        />
                    )}

                    {props.textColor !== undefined && (
                        <ColorPicker
                            label="Text Color"
                            value={props.textColor}
                            onChange={(text: string) => updateProp('textColor', text)}
                        />
                    )}
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={{
                padding: 20,
                borderTopWidth: 1,
                borderTopColor: '#e5e7eb',
                flexDirection: 'row',
                gap: 12,
            }}>
                <TouchableOpacity
                    onPress={onClose}
                    style={{
                        flex: 1,
                        backgroundColor: '#f3f4f6',
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: '#374151', fontWeight: 'bold', fontSize: 15 }}>
                        Cancel
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSave}
                    style={{
                        flex: 1,
                        backgroundColor: '#6366f1',
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 8,
                    }}
                >
                    <Save size={18} color="white" />
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
                        Save Changes
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (isMobile) {
        // Bottom sheet for mobile
        return (
            <Modal
                visible={visible}
                transparent
                animationType="slide"
                onRequestClose={onClose}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'flex-end',
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        maxHeight: '90%',
                        overflow: 'hidden',
                    }}>
                        {content}
                    </View>
                </View>
            </Modal>
        );
    }

    // Sidebar for desktop
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, flexDirection: 'row' }}>
                {/* Overlay */}
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onPress={onClose}
                    activeOpacity={1}
                />

                {/* Sidebar */}
                <View style={{
                    width: 400,
                    backgroundColor: 'white',
                    shadowColor: '#000',
                    shadowOffset: { width: -4, height: 0 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 8,
                }}>
                    {content}
                </View>
            </View>
        </Modal>
    );
}
