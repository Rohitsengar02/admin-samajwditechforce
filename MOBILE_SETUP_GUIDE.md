# Mobile Device Configuration Guide

## Problem
Login and Register not working on Android/iOS devices (works on web only)

## Solution
Mobile devices cannot use `localhost` to connect to your backend server because `localhost` refers to the device itself, not your computer.

## Steps to Fix

### 1. Find Your Computer's Local IP Address

**On macOS:**
```bash
ipconfig getifaddr en0
```
Or go to: System Preferences → Network → Your active connection → IP Address

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter

**On Linux:**
```bash
hostname -I
```

### 2. Update the IP Address in Code

Both `login.tsx` and `register.tsx` have been updated with a `getApiUrl()` function.

**Update line 11-12 in both files:**
```typescript
if (Platform.OS === 'android') {
    return 'http://YOUR_IP_ADDRESS:5001/api'; // Replace with your actual IP
}
```

**Example:**
If your computer's IP is `192.168.1.100`, change it to:
```typescript
if (Platform.OS === 'android') {
    return 'http://192.168.1.100:5001/api';
}
```

### 3. Make Sure Your Backend is Running

Your backend must be accessible on your network:
```bash
cd backend
npm run dev
```

The backend should be running on port 5001.

### 4. Ensure Same Network

Both your computer (running the backend) and your mobile device must be on the **same WiFi network**.

### 5. Test the Connection

On your mobile device, try opening this URL in a browser:
```
http://YOUR_IP_ADDRESS:5001/api/auth/test
```

If you see a response, the connection is working!

## Firewall Issues

If it still doesn't work, check if your firewall is blocking incoming connections:

**On macOS:**
- System Preferences → Security & Privacy → Firewall
- Allow incoming connections for Node.js

**On Windows:**
- Windows Firewall → Allow an app through firewall
- Add Node.js if needed

## Current Configuration

Files updated with platform-aware API URLs:
- ✅ `/admin/app/login.tsx`
- ✅ `/admin/app/register.tsx`
- ✅ `/admin/app/(admin)/posters.tsx` (already had this)

## Delete Function in Posters

**The delete function already exists!** 

Each poster card has a delete button (trash icon) at the bottom right. To delete a poster:
1. Open the Posters page
2. Find the poster you want to delete
3. Tap the red trash icon on the poster card
4. Confirm deletion

The delete button is visible on hover/tap in the poster overlay.

## Next Steps

1. Find your computer's IP address using the commands above
2. Update the IP in `login.tsx` and `register.tsx` (line 11)
3. Restart your Expo app: `npm start` in the admin folder
4. Test login/register on your mobile device
