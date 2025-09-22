# 🚀 Oxford Tailors - Firebase + Render Deployment Guide

## ✅ Current Status
- **Frontend**: ✅ Deployed to Firebase Hosting
  - **Live URL**: https://varadharajan-tailoring-app.web.app
- **Backend**: Deploy to Render.com (Free tier)

## 🔧 Backend Deployment to Render.com

### Step 1: Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub account
3. Connect your GitHub repository: `V-Varadharajan/Oxford-Tailors`

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Select your GitHub repository: `Oxford-Tailors`
3. Configure the service:
   - **Name**: `oxford-tailors-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Add Environment Variables
In Render dashboard, add these environment variables:
```
DB_HOST=sql12.freesqldatabase.com
DB_USER=sql12799628
DB_PASSWORD=GUw4wuhJgJ
DB_NAME=sql12799628
DB_PORT=3306
PORT=10000
```

### Step 4: Deploy
- Click "Create Web Service"
- Render will automatically deploy your backend
- You'll get a URL like: `https://oxford-tailors-backend.onrender.com`

## 🔄 Update Frontend API URL

Once your backend is deployed, update the frontend:

1. **Edit `.env` file**:
```env
VITE_API_BASE_URL=https://oxford-tailors-backend.onrender.com/api
```

2. **Rebuild and redeploy frontend**:
```bash
npm run build
firebase deploy --only hosting
```

## 🌐 Alternative: Deploy Backend to Railway

If you prefer Railway.app:

1. Go to [Railway.app](https://railway.app)
2. Connect GitHub → Select `Oxford-Tailors`
3. Select `backend` folder
4. Add same environment variables
5. Railway will auto-deploy

## 📱 Final URLs
- **Frontend**: https://varadharajan-tailoring-app.web.app
- **Backend**: https://oxford-tailors-backend.onrender.com (or Railway URL)
- **API**: https://oxford-tailors-backend.onrender.com/api

## ✅ Benefits of This Setup
- **Frontend**: Firebase Hosting (Free, Fast CDN)
- **Backend**: Render.com (Free tier, 750 hours/month)
- **Database**: FreeSQLDatabase.com (Already connected)
- **Zero monthly costs** on free tiers!

Your Oxford Tailors app will be fully live and accessible worldwide! 🌍