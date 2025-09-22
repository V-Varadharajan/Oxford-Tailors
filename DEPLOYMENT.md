# Oxford Tailors - Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel + Railway (Recommended)

#### Backend Deployment (Railway)
1. Go to [Railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your backend folder
5. Railway will auto-detect Node.js and deploy
6. Add environment variables in Railway dashboard:
   - `DB_HOST`: sql12.freesqldatabase.com
   - `DB_USER`: your_username
   - `DB_PASSWORD`: your_password
   - `DB_NAME`: your_database_name
   - `DB_PORT`: 3306
   - `PORT`: 3001

#### Frontend Deployment (Vercel)
1. Go to [Vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project" → Import your repository
4. Vercel will auto-detect Vite and deploy
5. Update API_BASE_URL in your frontend code to Railway backend URL

### Option 2: Netlify + Render

#### Backend (Render)
1. Go to [Render.com](https://render.com)
2. Create new Web Service from GitHub
3. Use these settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables

#### Frontend (Netlify)
1. Go to [Netlify.com](https://netlify.com)
2. Drag and drop your `dist` folder
3. Or connect GitHub for automatic deployments

### Option 3: One-Click Heroku
1. Create `Procfile` in backend: `web: node server.js`
2. Deploy backend to Heroku
3. Deploy frontend to Vercel/Netlify

## 🔧 Environment Variables Needed

### Backend (.env)
```
DB_HOST=sql12.freesqldatabase.com
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
DB_PORT=3306
PORT=3001
```

### Frontend
Update `src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://your-backend-url.railway.app';
```

## 📱 Post-Deployment Checklist
- [ ] Backend API accessible
- [ ] Database connection working
- [ ] Frontend loads correctly
- [ ] API calls working
- [ ] All features functional

## 🌐 Expected Live URLs
- Frontend: `https://oxford-tailors.vercel.app`
- Backend API: `https://oxford-tailors-backend.railway.app`

Your Oxford Tailors app is production-ready! 🎉