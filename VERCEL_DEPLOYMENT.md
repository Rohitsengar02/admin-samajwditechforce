# Admin Panel - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
1. GitHub repository (already done ✅)
2. Vercel account (free tier works fine)
3. Backend deployed and accessible via HTTPS

### Step 1: Import Project to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository: `admin-samajwditechforce`
4. Vercel will auto-detect the settings

### Step 2: Configure Build Settings

Vercel should auto-configure based on `vercel.json`, but verify:

- **Framework Preset:** Other
- **Build Command:** `npx expo export -p web`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 3: Set Environment Variables

In Vercel Project Settings → Environment Variables, add:

```
EXPO_PUBLIC_API_URL=https://your-backend-url.com/api
```

**IMPORTANT:** Replace with your actual backend URL (e.g., Railway, Heroku, or your server)

### Step 4: Deploy!

Click "Deploy" and wait 2-3 minutes.

---

## 🧪 Test Locally Before Deploying

### 1. Build for Web
```bash
npm run build:web
```

### 2. Preview the Build
```bash
npx serve dist
```

This will start a local server at `http://localhost:3000`

### 3. Test on Web
```bash
npm run web
```

---

## 📝 Environment Variables

### Development (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:5001/api
```

### Production (Set in Vercel)
```env
EXPO_PUBLIC_API_URL=https://your-backend.com/api
```

---

## 🔧 Troubleshooting

### Build Fails
- Check Node version (should be 18.x or 20.x)
- Clear cache: `npx expo start --clear`
- Delete `node_modules` and `package-lock.json`, reinstall

### White Screen After Deploy
- Check browser console for errors
- Verify `EXPO_PUBLIC_API_URL` is set correctly
- Ensure backend CORS allows your Vercel domain

### Routing Issues
- `vercel.json` has rewrite rules for client-side routing
- All routes redirect to `index.html`

---

##  Platform-Specific Code

Some components use `Platform.OS === 'web'` checks:
- Sidebar shows on web
- Tabs show on mobile
- Alerts work differently

These are already handled in the codebase.

---

## 📱 Features on Web

✅ **Responsive Design**
- Sidebar on desktop
- Full admin functionality
- Works on tablets and mobile browsers

✅ **All Features Available**
- Dashboard
- Member management
- Admin approvals (Master Admin only)
- District management
- Verifications
- Settings
- And more...

✅ **Authentication**
- Login/Register
- Role-based access
- Secure token storage (using AsyncStorage polyfill for web)

---

## 🎯 Post-Deployment Checklist

- [ ] Test login functionality
- [ ] Test admin registration and approval flow
- [ ] Verify all API calls work with production backend
- [ ] Check responsive design on different screen sizes
- [ ] Test Master Admin features
- [ ] Verify logout redirects properly
- [ ] Check all images and assets load correctly

---

## 🔐 Security Notes

- Never commit `.env` file with real credentials
- Use Vercel environment variables for secrets
- Backend should have CORS configured for your Vercel domain
- Use HTTPS for both frontend and backend

---

## 📊 Performance

- Vercel provides automatic caching
- CDN distribution worldwide
- Fast load times
- Automatic HTTPS

---

## 🆘 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables are set
4. Test backend API independently

---

## 🎉 Success!

Once deployed, your admin panel will be available at:
`https://your-project-name.vercel.app`

You can also add a custom domain in Vercel settings.
