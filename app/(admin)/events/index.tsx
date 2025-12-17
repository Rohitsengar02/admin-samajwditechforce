import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    Image,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api';

interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    status: 'upcoming' | 'ongoing' | 'closed';
    attendees: number;
    type: 'rally' | 'meeting' | 'training' | 'campaign';
    updates?: string[];
    image?: string;
}

interface Registration {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        profileImage?: string;
    } | null;
    event: {
        _id: string;
        title: string;
        date: string;
        time: string;
        location: string;
        image?: string;
    } | null;
    name: string;
    email: string;
    phone: string;
    address: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled';
    createdAt: string;
}

export default function EventsManagement() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'ongoing' | 'closed'>('all');

    // Submissions State
    const [viewMode, setViewMode] = useState<'events' | 'submissions'>('events');
    const [submissions, setSubmissions] = useState<Registration[]>([]);
    const [selectedEventFilter, setSelectedEventFilter] = useState<string | null>(null);
    const [showEventDropdown, setShowEventDropdown] = useState(false);

    useEffect(() => {
        fetchEvents();
        if (viewMode === 'submissions') {
            fetchSubmissions();
        }
    }, [viewMode]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/events`);
            const data = await response.json();

            if (data.success) {
                setEvents(data.data);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            Alert.alert('Error', 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/events/registrations/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                setSubmissions(data.data);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
            Alert.alert('Error', 'Failed to fetch submissions');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmissionStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const token = await AsyncStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/events/registrations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                fetchSubmissions();
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            Alert.alert('Error', 'Failed to update status');
        }
    };

    const handleDeleteSubmission = async (id: string) => {
        const deleteSubmission = async () => {
            try {
                const token = await AsyncStorage.getItem('adminToken');
                await fetch(`${API_URL}/events/registrations/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                fetchSubmissions();
            } catch (error) {
                Alert.alert('Error', 'Failed to delete');
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to delete this registration?')) {
                deleteSubmission();
            }
        } else {
            Alert.alert('Delete Registration', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: deleteSubmission
                }
            ]);
        }
    };

    const handleDelete = async (id: string) => {
        const deleteEvent = async () => {
            try {
                const token = await AsyncStorage.getItem('adminToken');
                const response = await fetch(`${API_URL}/events/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                const data = await response.json();

                if (data.success) {
                    if (Platform.OS !== 'web') Alert.alert('Success', 'Event deleted successfully');
                    fetchEvents();
                } else {
                    Alert.alert('Error', data.message);
                }
            } catch (error) {
                console.error('Error deleting event:', error);
                Alert.alert('Error', 'Failed to delete event');
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to delete this event?')) {
                deleteEvent();
            }
        } else {
            Alert.alert(
                'Delete Event',
                'Are you sure you want to delete this event?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: deleteEvent
                    }
                ]
            );
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming': return '#3B82F6';
            case 'ongoing': return '#10B981';
            case 'closed': return '#6B7280';
            default: return '#6B7280';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'rally': return 'bullhorn';
            case 'meeting': return 'account-group';
            case 'training': return 'school';
            case 'campaign': return 'flag';
            default: return 'calendar';
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#E30512" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Events Management</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/(admin)/events/create')}
                    >
                        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* View Mode Toggle */}
                <View style={styles.viewToggleContainer}>
                    <TouchableOpacity
                        style={[styles.viewToggle, viewMode === 'events' && styles.viewToggleActive]}
                        onPress={() => setViewMode('events')}
                    >
                        <Text style={[styles.viewToggleText, viewMode === 'events' && styles.viewToggleTextActive]}>Events</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.viewToggle, viewMode === 'submissions' && styles.viewToggleActive]}
                        onPress={() => setViewMode('submissions')}
                    >
                        <Text style={[styles.viewToggleText, viewMode === 'submissions' && styles.viewToggleTextActive]}>Submissions</Text>
                    </TouchableOpacity>
                </View>

                {viewMode === 'events' && (
                    <>
                        {/* Search Bar */}
                        <View style={styles.searchContainer}>
                            <MaterialCommunityIcons name="magnify" size={20} color="#64748b" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search events..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        {/* Filter Tabs */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.filterContainer}
                        >
                            {(['all', 'upcoming', 'ongoing', 'closed'] as const).map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    style={[
                                        styles.filterTab,
                                        filterStatus === status && styles.filterTabActive
                                    ]}
                                    onPress={() => setFilterStatus(status)}
                                >
                                    <Text style={[
                                        styles.filterTabText,
                                        filterStatus === status && styles.filterTabTextActive
                                    ]}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </>
                )}
            </View>

            {viewMode === 'events' ? (
                /* Events List */
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {filteredEvents.length === 0 ? (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="calendar-blank" size={64} color="#CBD5E1" />
                            <Text style={styles.emptyText}>No events found</Text>
                            <TouchableOpacity
                                style={styles.createButton}
                                onPress={() => router.push('/(admin)/events/create')}
                            >
                                <Text style={styles.createButtonText}>Create First Event</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        filteredEvents.map((event) => (
                            <View key={event._id} style={styles.eventCard}>
                                {/* Status Badge */}
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) }]}>
                                    <Text style={styles.statusText}>{event.status}</Text>
                                </View>

                                {/* Event Header */}
                                <View style={styles.eventHeader}>
                                    <View style={styles.typeIconContainer}>
                                        <MaterialCommunityIcons
                                            name={getTypeIcon(event.type)}
                                            size={24}
                                            color={getStatusColor(event.status)}
                                        />
                                    </View>
                                    <View style={styles.eventHeaderText}>
                                        <Text style={styles.eventTitle}>{event.title}</Text>
                                        <Text style={styles.eventDescription} numberOfLines={2}>
                                            {event.description}
                                        </Text>
                                    </View>
                                </View>

                                {/* Event Details */}
                                <View style={styles.eventDetails}>
                                    <View style={styles.detailRow}>
                                        <MaterialCommunityIcons name="calendar" size={16} color="#64748b" />
                                        <Text style={styles.detailText}>
                                            {new Date(event.date).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <MaterialCommunityIcons name="clock-outline" size={16} color="#64748b" />
                                        <Text style={styles.detailText}>{event.time}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <MaterialCommunityIcons name="map-marker" size={16} color="#64748b" />
                                        <Text style={styles.detailText} numberOfLines={1}>{event.location}</Text>
                                    </View>
                                </View>

                                {/* Actions */}
                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.editButton]}
                                        onPress={() => router.push(`/(admin)/events/edit/${event._id}`)}
                                    >
                                        <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
                                        <Text style={styles.actionButtonText}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.deleteButton]}
                                        onPress={() => handleDelete(event._id)}
                                    >
                                        <MaterialCommunityIcons name="delete" size={18} color="#fff" />
                                        <Text style={styles.actionButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            ) : (
                /* Submissions List */
                <View style={{ flex: 1 }}>
                    {/* Stats Dashboard */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>
                                {submissions.filter(s => selectedEventFilter ? s.event?._id === selectedEventFilter : true).length}
                            </Text>
                            <Text style={styles.statLabel}>Total</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={[styles.statValue, { color: '#10B981' }]}>
                                {submissions.filter(s => (selectedEventFilter ? s.event?._id === selectedEventFilter : true) && s.status === 'Confirmed').length}
                            </Text>
                            <Text style={styles.statLabel}>Confirmed</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                                {submissions.filter(s => (selectedEventFilter ? s.event?._id === selectedEventFilter : true) && s.status === 'Pending').length}
                            </Text>
                            <Text style={styles.statLabel}>Pending</Text>
                        </View>
                    </View>

                    {/* Event Filter Dropdown */}
                    <View style={styles.filterSection}>
                        <TouchableOpacity
                            style={styles.dropdownButton}
                            onPress={() => setShowEventDropdown(!showEventDropdown)}
                        >
                            <Text style={styles.dropdownButtonText}>
                                {selectedEventFilter
                                    ? (events.find(e => e._id === selectedEventFilter)?.title || 'Selected Event')
                                    : 'All Events'}
                            </Text>
                            <MaterialCommunityIcons name={showEventDropdown ? "chevron-up" : "chevron-down"} size={24} color="#64748b" />
                        </TouchableOpacity>

                        {showEventDropdown && (
                            <View style={styles.dropdownList}>
                                <TouchableOpacity
                                    style={[styles.dropdownItem, !selectedEventFilter && styles.dropdownItemActive]}
                                    onPress={() => {
                                        setSelectedEventFilter(null);
                                        setShowEventDropdown(false);
                                    }}
                                >
                                    <Text style={[styles.dropdownItemText, !selectedEventFilter && styles.dropdownItemTextActive]}>All Events</Text>
                                </TouchableOpacity>
                                {events.map(event => (
                                    <TouchableOpacity
                                        key={event._id}
                                        style={[styles.dropdownItem, selectedEventFilter === event._id && styles.dropdownItemActive]}
                                        onPress={() => {
                                            setSelectedEventFilter(event._id);
                                            setShowEventDropdown(false);
                                        }}
                                    >
                                        <Text style={[styles.dropdownItemText, selectedEventFilter === event._id && styles.dropdownItemTextActive]} numberOfLines={1}>
                                            {event.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {submissions.filter(s => selectedEventFilter ? s.event?._id === selectedEventFilter : true).length === 0 ? (
                            <View style={styles.emptyState}>
                                <MaterialCommunityIcons name="file-document-outline" size={64} color="#CBD5E1" />
                                <Text style={styles.emptyText}>No submissions found</Text>
                            </View>
                        ) : (
                            submissions
                                .filter(s => selectedEventFilter ? s.event?._id === selectedEventFilter : true)
                                .map((reg) => (
                                    <View key={reg._id} style={styles.eventCard}>

                                        {/* User Profile Header */}
                                        <View style={styles.eventHeader}>
                                            <View style={styles.profileImageContainer}>
                                                {reg.user?.profileImage ? (
                                                    <Image source={{ uri: reg.user.profileImage }} style={styles.profileImage} />
                                                ) : (
                                                    <View style={styles.profilePlaceholder}>
                                                        <MaterialCommunityIcons name="account" size={24} color="#64748b" />
                                                    </View>
                                                )}
                                            </View>
                                            <View style={styles.eventHeaderText}>
                                                <Text style={styles.eventTitle}>{reg.user?.name || reg.name}</Text>
                                                <Text style={styles.detailText}>Reg: {new Date(reg.createdAt).toLocaleDateString()}</Text>
                                            </View>
                                        </View>

                                        {/* Event Bar */}
                                        <View style={styles.eventBar}>
                                            <View style={styles.eventBarIcon}>
                                                <MaterialCommunityIcons name="calendar-star" size={20} color="#E30512" />
                                            </View>
                                            <View style={styles.eventBarContent}>
                                                <Text style={styles.eventBarTitle} numberOfLines={1}>{reg.event?.title || 'Unknown Event'}</Text>
                                                <Text style={styles.eventBarDate}>{reg.event?.date ? new Date(reg.event.date).toLocaleDateString() : 'N/A'}</Text>
                                            </View>
                                            {reg.event?.image && (
                                                <Image source={{ uri: reg.event.image }} style={styles.eventBarImage} />
                                            )}
                                        </View>

                                        {/* User Details */}
                                        <View style={styles.eventDetails}>
                                            <View style={styles.detailRow}>
                                                <MaterialCommunityIcons name="email" size={16} color="#64748b" />
                                                <Text style={styles.detailText}>{reg.email}</Text>
                                            </View>
                                            <View style={styles.detailRow}>
                                                <MaterialCommunityIcons name="phone" size={16} color="#64748b" />
                                                <Text style={styles.detailText}>{reg.phone}</Text>
                                            </View>
                                            <View style={styles.detailRow}>
                                                <MaterialCommunityIcons name="map-marker" size={16} color="#64748b" />
                                                <Text style={styles.detailText} numberOfLines={2}>{reg.address}</Text>
                                            </View>
                                        </View>

                                        {/* Actions */}
                                        <View style={styles.actions}>
                                            {reg.status === 'Pending' && (
                                                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10B981' }]} onPress={() => handleSubmissionStatusUpdate(reg._id, 'Confirmed')}>
                                                    <MaterialCommunityIcons name="check" size={18} color="#fff" />
                                                    <Text style={styles.actionButtonText}>Confirm</Text>
                                                </TouchableOpacity>
                                            )}
                                            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDeleteSubmission(reg._id)}>
                                                <MaterialCommunityIcons name="delete" size={18} color="#fff" />
                                                <Text style={styles.actionButtonText}>Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                        )}
                    </ScrollView>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E30512',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        color: '#1e293b',
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
    },
    filterTabActive: {
        backgroundColor: '#E30512',
    },
    filterTabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    filterTabTextActive: {
        color: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#94A3B8',
        marginTop: 16,
        marginBottom: 24,
    },
    createButton: {
        backgroundColor: '#E30512',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    eventCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
        textTransform: 'capitalize',
    },
    eventHeader: {
        flexDirection: 'row',
        marginBottom: 16,
        paddingRight: 80,
    },
    typeIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    eventHeaderText: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    eventDescription: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
    },
    eventDetails: {
        gap: 8,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#64748b',
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        gap: 6,
    },
    editButton: {
        backgroundColor: '#3B82F6',
    },
    deleteButton: {
        backgroundColor: '#EF4444',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    viewToggleContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        padding: 4,
    },
    viewToggle: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    viewToggleActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    viewToggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    viewToggleTextActive: {
        color: '#1e293b',
    },
    profileImageContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        marginRight: 12,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    profilePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e2e8f0',
    },
    eventBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 10,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    eventBarIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#FFE4E6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    eventBarContent: {
        flex: 1,
    },
    eventBarTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 2,
    },
    eventBarDate: {
        fontSize: 12,
        color: '#64748B',
    },
    eventBarImage: {
        width: 40,
        height: 40,
        borderRadius: 6,
        marginLeft: 10,
    },
    // Stats Styles
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    // Filter Styles
    filterSection: {
        paddingHorizontal: 20,
        marginBottom: 16,
        zIndex: 10,
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    dropdownButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
    },
    dropdownList: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        maxHeight: 200,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    dropdownItemActive: {
        backgroundColor: '#eff6ff',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#64748b',
    },
    dropdownItemTextActive: {
        color: '#3B82F6',
        fontWeight: '600',
    },
});
