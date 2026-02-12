import { Platform } from 'react-native';
import { getApiUrl } from './api';

/**
 * Upload an image through the backend API to Cloudflare R2
 * Replaces all direct Cloudinary uploads.
 * 
 * Accepts:
 * - File URI (from ImagePicker)
 * - Base64 string (data:image/... or raw base64)
 * - Blob/File (web)
 * 
 * @param imageSource - URI string, base64 string, or Blob
 * @param folder - R2 folder name (default: 'uploads')
 * @returns The public URL of the uploaded image
 */
export const uploadImageToAPI = async (
    imageSource: string,
    folder: string = 'uploads'
): Promise<string> => {
    const API_URL = getApiUrl();

    try {
        // Check if it's a base64 string
        if (imageSource.startsWith('data:')) {
            // Send base64 directly to backend
            const response = await fetch(`${API_URL}/upload/image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: imageSource,
                    folder,
                }),
            });

            const data = await response.json();
            if (data.success && data.data?.url) {
                return data.data.url;
            }
            throw new Error(data.message || 'Upload failed');
        }

        // For file URIs - convert to base64 or use FormData
        if (Platform.OS === 'web') {
            // Web: fetch the blob and convert to base64
            const blobResponse = await fetch(imageSource);
            const blob = await blobResponse.blob();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    try {
                        const base64 = reader.result as string;
                        const response = await fetch(`${API_URL}/upload/image`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                image: base64,
                                folder,
                            }),
                        });
                        const data = await response.json();
                        if (data.success && data.data?.url) {
                            resolve(data.data.url);
                        } else {
                            reject(new Error(data.message || 'Upload failed'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsDataURL(blob);
            });
        } else {
            // Native: Use FormData with file URI
            const filename = imageSource.split('/').pop() || `upload_${Date.now()}.jpg`;
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            // Convert to base64 using XMLHttpRequest for React Native
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = async function () {
                    try {
                        const blob = xhr.response;
                        const reader = new FileReader();
                        reader.onloadend = async () => {
                            try {
                                const base64 = reader.result as string;
                                const response = await fetch(`${API_URL}/upload/image`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        image: base64,
                                        folder,
                                    }),
                                });
                                const data = await response.json();
                                if (data.success && data.data?.url) {
                                    resolve(data.data.url);
                                } else {
                                    reject(new Error(data.message || 'Upload failed'));
                                }
                            } catch (error) {
                                reject(error);
                            }
                        };
                        reader.onerror = () => reject(new Error('Failed to convert to base64'));
                        reader.readAsDataURL(blob);
                    } catch (error) {
                        reject(error);
                    }
                };
                xhr.onerror = () => reject(new Error('Failed to fetch file'));
                xhr.responseType = 'blob';
                xhr.open('GET', imageSource, true);
                xhr.send(null);
            });
        }
    } catch (error) {
        console.error('❌ Upload error:', error);
        throw error;
    }
};

/**
 * Upload a video through the backend API to Cloudflare R2
 * 
 * @param videoUri - URI of the video file
 * @param folder - R2 folder name (default: 'reels')
 * @returns Object with url and optimizedUrl
 */
export const uploadVideoToAPI = async (
    videoUri: string,
    folder: string = 'reels'
): Promise<{ url: string; optimizedUrl: string }> => {
    const API_URL = getApiUrl();

    try {
        if (Platform.OS === 'web') {
            // Web: fetch blob and convert to base64
            const blobResponse = await fetch(videoUri);
            const blob = await blobResponse.blob();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    try {
                        const base64 = reader.result as string;
                        const response = await fetch(`${API_URL}/upload/video`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                video: base64,
                                folder,
                            }),
                        });
                        const data = await response.json();
                        if (data.success && data.data?.url) {
                            resolve({
                                url: data.data.url,
                                optimizedUrl: data.data.optimizedUrl || data.data.url,
                            });
                        } else {
                            reject(new Error(data.message || 'Video upload failed'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = () => reject(new Error('Failed to read video'));
                reader.readAsDataURL(blob);
            });
        } else {
            // Native: Use XMLHttpRequest
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = async function () {
                    try {
                        const blob = xhr.response;
                        const reader = new FileReader();
                        reader.onloadend = async () => {
                            try {
                                const base64 = reader.result as string;
                                const response = await fetch(`${API_URL}/upload/video`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        video: base64,
                                        folder,
                                    }),
                                });
                                const data = await response.json();
                                if (data.success && data.data?.url) {
                                    resolve({
                                        url: data.data.url,
                                        optimizedUrl: data.data.optimizedUrl || data.data.url,
                                    });
                                } else {
                                    reject(new Error(data.message || 'Video upload failed'));
                                }
                            } catch (error) {
                                reject(error);
                            }
                        };
                        reader.onerror = () => reject(new Error('Failed to convert video'));
                        reader.readAsDataURL(blob);
                    } catch (error) {
                        reject(error);
                    }
                };
                xhr.onerror = () => reject(new Error('Failed to fetch video'));
                xhr.responseType = 'blob';
                xhr.open('GET', videoUri, true);
                xhr.send(null);
            });
        }
    } catch (error) {
        console.error('❌ Video upload error:', error);
        throw error;
    }
};

/**
 * Upload a base64 image through the backend API
 * Convenience wrapper for components that already have base64 data
 * 
 * @param base64String - Base64 encoded image (with or without data: prefix)
 * @param folder - R2 folder name
 * @returns The public URL of the uploaded image
 */
export const uploadBase64ToAPI = async (
    base64String: string,
    folder: string = 'uploads'
): Promise<string> => {
    // Ensure it has the data URI prefix
    const image = base64String.startsWith('data:')
        ? base64String
        : `data:image/jpeg;base64,${base64String}`;

    return uploadImageToAPI(image, folder);
};
