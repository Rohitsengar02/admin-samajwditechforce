import { Platform } from 'react-native';

/**
 * Get the correct API URL based on the platform
 * - Web: Uses the direct URL from env
 * - Android Emulator: Converts localhost to 10.0.2.2
 * - Android/iOS Physical Device: Uses network IP from env
 */
export const getApiUrl = (): string => {
    let baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api';

    // For Android emulator, localhost doesn't work - need to use 10.0.2.2
    if (Platform.OS === 'android' && baseUrl.includes('localhost')) {
        baseUrl = baseUrl.replace('localhost', '10.0.2.2');
    }

    // Ensure it ends with /api
    if (!baseUrl.endsWith('/api')) {
        baseUrl = `${baseUrl}/api`;
    }

    console.log(`[API] Using URL: ${baseUrl} (Platform: ${Platform.OS})`);
    return baseUrl;
};

/**
 * Get the Socket.IO server URL (without /api suffix)
 */
export const getSocketUrl = (): string => {
    let socketUrl = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001';

    // For Android emulator
    if (Platform.OS === 'android' && socketUrl.includes('localhost')) {
        socketUrl = socketUrl.replace('localhost', '10.0.2.2');
    }

    console.log(`[Socket.IO] Using URL: ${socketUrl} (Platform: ${Platform.OS})`);
    return socketUrl;
};

/**
 * Make an API request with proper error handling
 */
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const apiUrl = getApiUrl();
    const url = `${apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
        console.log(`[API Request] ${options.method || 'GET'} ${url}`);
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP ${response.status}`);
        }

        return data;
    } catch (error: any) {
        console.error(`[API Error] ${url}:`, error.message);
        throw error;
    }
};
