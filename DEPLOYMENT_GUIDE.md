# 🚀 Complete Deployment Guide - Scalable REST API

## Prerequisites
- ✅ GitHub account (code already pushed: `https://github.com/Varshamullick/backend-task-0`)
- ✅ MongoDB Atlas account (database already configured at `cluster0.if1daae.mongodb.net`)
- ✅ Render.com account (free tier)
- ✅ Node.js 16+ and npm 8+

---

## 📋 Step 1: MongoDB Atlas Setup (Already Done ✅)

### What's Already Configured:
```
Cluster: cluster0.if1daae.mongodb.net
Database: scalable-api
Username: varshamullick01_db_user
Password: varshamullick01_db_user
Connection URI: mongodb+srv://varshamullick01_db_user:varshamullick01_db_user@cluster0.if1daae.mongodb.net/scalable-api?retryWrites=true&w=majority
```

### Complete These Steps:

**1. Allow Render IP Addresses in MongoDB Atlas:**

**Option A: Allow All (Simplest for Free Tier)**
- Go to: https://cloud.mongodb.com/v2/[projectId]#security/network/access
- Click "Add IP Address"
- Enter: `0.0.0.0/0` (allows all IPs)
- Click "Confirm"

**Option B: Add Render's IP Range (More Secure)**
- Click "Add IP Address"
- Enter specific Render IP ranges (ask Render support)
- Click "Confirm"

**2. Verify Database User Permissions:**
- Go to: https://cloud.mongodb.com/v2/[projectId]#security/database/users
- Find: `varshamullick01_db_user`
- Permissions: Should be "atlasAdmin" or "readWriteAnyDatabase"
- If not, edit and update permissions

**Status:** ✅ Complete - Database is ready

---

## 🔧 Step 2: Update Configuration Files

### Backend Environment Variables
File: `backend/.env`

**Current Configuration (for local/Render):**
```env
# Database Configuration
MONGODB_URI=mongodb+srv://varshamullick01_db_user:varshamullick01_db_user@cluster0.if1daae.mongodb.net/scalable-api?retryWrites=true&w=majority
DB_NAME=scalable-api

# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# API Documentation
SWAGGER_ENABLED=true

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# CORS - Update after frontend deployment
CORS_ORIGIN=http://localhost:3000
```

**For Production (Render):**
- Update `CORS_ORIGIN` after frontend deployment
- Update `JWT_SECRET` to a strong random string
- Set `NODE_ENV=production`

### Frontend Environment Variables
File: `frontend/.env`

**For Local Development:**
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

**For Production (Render):**
```env
REACT_APP_API_URL=https://scalable-api-backend.onrender.com/api/v1
```

---

## 🌐 Step 3: Deploy on Render

### 3A: Connect GitHub Repository

1. **Go to Render Dashboard:** https://dashboard.render.com/
2. **Click "New +"** → Select **"Web Service"**
3. **Connect GitHub:**
   - Click "Connect account" 
   - Authorize Render to access GitHub
   - Select repository: `Varshamullick/backend-task-0`
   - Branch: `main`

### 3B: Deploy Backend Service

**Create Backend Service:**

1. **Name:** `scalable-api-backend`
2. **Environment:** `Node`
3. **Build Command:** `cd backend && npm install`
4. **Start Command:** `cd backend && npm start`
5. **Plan:** `Free`
6. **Region:** Choose closest to you

**Set Environment Variables:**

Click "Advanced" → Add environment variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://varshamullick01_db_user:varshamullick01_db_user@cluster0.if1daae.mongodb.net/scalable-api?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your-random-secret-key-here-change-this` |
| `JWT_EXPIRE` | `7d` |
| `JWT_REFRESH_EXPIRE` | `30d` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `CORS_ORIGIN` | `https://scalable-api-frontend.onrender.com` (update after frontend deployment) |
| `LOG_LEVEL` | `info` |

**Click "Create Web Service"**

**Wait for deployment** (3-5 minutes)

✅ **Check Service URL:** You'll get something like `https://scalable-api-backend.onrender.com`

---

### 3C: Deploy Frontend Service

1. **Go back to Render Dashboard**
2. **Click "New +"** → Select **"Static Site"**
3. **Connect same repository (`Varshamullick/backend-task-0`)**

**Configure Static Site:**

1. **Name:** `scalable-api-frontend`
2. **Build Command:** `cd frontend && npm install && npm run build`
3. **Publish Directory:** `frontend/build`
4. **Plan:** `Free`
5. **Region:** Same as backend

**Set Environment Variables:**

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://scalable-api-backend.onrender.com/api/v1` |

**Click "Create Static Site"**

**Wait for deployment** (2-3 minutes)

✅ **Check Site URL:** You'll get something like `https://scalable-api-frontend.onrender.com`

---

### 3D: Update Backend CORS

Now that frontend is deployed, update backend CORS:

1. **Go to:** Backend service dashboard on Render
2. **Click "Environment"**
3. **Find:** `CORS_ORIGIN`
4. **Update to:** `https://scalable-api-frontend.onrender.com` (your actual frontend URL)
5. **Save & Deploy**

---

## ✅ Step 4: Verify Deployment

### 4A: Test Backend Health

```bash
curl https://scalable-api-backend.onrender.com/api/v1
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Scalable REST API v1 is running",
  "version": "1.0.0"
}
```

### 4B: Test Login Endpoint

```bash
curl -X POST https://scalable-api-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testflow1@example.com",
    "password": "Password123!"
  }'
```

### 4C: Test Frontend

1. Open: `https://scalable-api-frontend.onrender.com`
2. **Register** a new account or login with:
   - Email: `testflow1@example.com`
   - Password: `Password123!`
3. **Test CRUD:**
   - Create a new task
   - Edit a task
   - Delete a task
   - Refresh page (verify token persistence)

### 4D: Check API Documentation

Access Swagger docs at:
```
https://scalable-api-backend.onrender.com/api-docs
```

---

## 🔍 Troubleshooting

### Issue: MongoDB Authentication Failed

**Symptoms:**
- Backend logs show: `Error connecting to MongoDB: bad auth`
- Status: "Exited with status 1"

**Solutions:**
1. **Check IP Whitelist:**
   - Go to MongoDB Atlas → Network Access
   - Verify `0.0.0.0/0` is added or Render IPs are whitelisted
   
2. **Verify Credentials:**
   - Check username is exactly: `varshamullick01_db_user`
   - Check password is exactly: `varshamullick01_db_user`
   - Check URI has no typos

3. **Redeploy:**
   - Click backend service
   - Click "Depl" tab
   - Hit "Redeploy"

### Issue: Frontend Can't Connect to Backend

**Symptoms:**
- Login fails with CORS error or timeout

**Solutions:**
1. **Check CORS:**
   - Backend `CORS_ORIGIN` must match frontend URL
   - Must include `https://` 
   - No trailing slash

2. **Check Environment Variable:**
   - Frontend `REACT_APP_API_URL` must be correct backend URL
   - Must end with `/api/v1`
   - Redeploy frontend after changing

3. **Check Backend Status:**
   - Visit backend URL in browser
   - Should see API response

### Issue: Services Won't Deploy

**Solutions:**
1. Check build logs in Render dashboard
2. Verify all files are committed to GitHub
3. Check branch is set to `main`
4. Check buildCommand and startCommand are correct

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────┐
│   Frontend (React)                      │
│   https://scalable-api-frontend.onrender.com
│   - Registration/Login pages            │
│   - Task Dashboard                      │
│   - CRUD Operations                     │
└──────────────────┬──────────────────────┘
                   │
                   │ HTTP/HTTPS (CORS configured)
                   │
┌──────────────────▼──────────────────────┐
│   Backend (Node.js/Express)             │
│   https://scalable-api-backend.onrender.com
│   - Auth endpoints                      │
│   - Task CRUD endpoints                 │
│   - JWT validation middleware           │
│   - Swagger documentation at /api-docs  │
└──────────────────┬──────────────────────┘
                   │
                   │ MongoDB Protocol
                   │
┌──────────────────▼──────────────────────┐
│   MongoDB Atlas (Cloud Database)        │
│   cluster0.if1daae.mongodb.net          │
│   - Database: scalable-api              │
│   - Collections: users, tasks           │
│   - Indexed for performance             │
└─────────────────────────────────────────┘
```

---

## 📝 Useful Commands

### View Backend Logs (Render)
```bash
# In Render dashboard → Backend service → Logs tab
```

### View Frontend Logs (Render)
```bash
# In Render dashboard → Frontend service → Logs tab
```

### Local Testing Before Deploy
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start

# Terminal 3 - Test API
curl http://localhost:5000/api/v1
```

### Trigger Redeploy from GitHub
Just push new code to main branch:
```bash
git add .
git commit -m "Update configuration"
git push origin main
```

---

## ✨ Success Indicators

After deployment, you should see:

✅ Backend service marked as "Live" in Render
✅ Frontend static site marked as "Live" in Render
✅ Backend health check responding
✅ Frontend loads without 404 errors
✅ Login works with MongoDB Atlas
✅ Create/Read/Update/Delete tasks work
✅ Swagger docs accessible at `/api-docs`

---

## 🎯 Summary

| Component | Status | URL |
|-----------|--------|-----|
| Code | ✅ Pushed to GitHub | `https://github.com/Varshamullick/backend-task-0` |
| Database | ✅ MongoDB Atlas | `cluster0.if1daae.mongodb.net` |
| Backend | 🔄 Deploying on Render | `https://scalable-api-backend.onrender.com` |
| Frontend | 🔄 Deploying on Render | `https://scalable-api-frontend.onrender.com` |

Next step: Follow MongoDB Atlas IP whitelist fix → Deploy both services on Render → Verify all endpoints work!

