# 🚀 DEPLOYMENT CHECKLIST - Copy & Paste Steps

## ✅ Phase 1: MongoDB Atlas Setup (5 minutes)

### Step 1: Allow IPs in MongoDB Atlas
- [ ] Go to: https://cloud.mongodb.com
- [ ] Login with your MongoDB account
- [ ] Go to: Network Access (Security menu)
- [ ] Click "Add IP Address"
- [ ] Enter: `0.0.0.0/0`
- [ ] Click "Confirm"

**Why?** Render servers need to connect to your MongoDB


---

## ✅ Phase 2: Code Commit (1 minute)

Run these commands in `c:\Projects\scalable-api`:

```powershell
cd c:\Projects\scalable-api
git add .
git commit -m "Add deployment configuration and guides"
git push origin main
```

- [ ] Confirm push successful (should see "origin/main")
- [ ] Visit https://github.com/Varshamullick/backend-task-0 - verify new files visible


---

## ✅ Phase 3: Deploy Backend on Render (10 minutes)

### Step 1: Create Backend Service
- [ ] Go to: https://dashboard.render.com
- [ ] Click "New +" → "Web Service"
- [ ] Select GitHub repo: `Varshamullick/backend-task-0`
- [ ] Name: `scalable-api-backend`
- [ ] Environment: `Node`
- [ ] Build Command: `cd backend && npm install`
- [ ] Start Command: `cd backend && npm start`
- [ ] Plan: `Free`
- [ ] Click "Create Web Service"

**Save your backend URL from the page!** (e.g., `https://scalable-api-backend.onrender.com`)

### Step 2: Add Environment Variables
- [ ] While on the backend service page, click "Advanced"
- [ ] Add these variables:

```
MONGODB_URI = mongodb+srv://varshamullick01_db_user:varshamullick01_db_user@cluster0.if1daae.mongodb.net/scalable-api?retryWrites=true&w=majority
JWT_SECRET = your-random-secret-key-here
JWT_EXPIRE = 7d
JWT_REFRESH_EXPIRE = 30d
NODE_ENV = production
CORS_ORIGIN = (leave empty for now, update later)
LOG_LEVEL = info
```

- [ ] Click "Save Changes"
- [ ] Wait for deployment (3-5 minutes)
- [ ] Check logs - should see "Server running on port 5000"

### Step 3: Verify Backend Works
- [ ] Open: `https://scalable-api-backend.onrender.com/api/v1`
- [ ] Should see: `{"success":true,"message":"Scalable REST API v1 is running"...}`
- [ ] ✅ Backend is live!


---

## ✅ Phase 4: Deploy Frontend on Render (10 minutes)

### Step 1: Create Frontend Service
- [ ] Go to: https://dashboard.render.com
- [ ] Click "New +" → "Static Site"
- [ ] Select GitHub repo: `Varshamullick/backend-task-0`
- [ ] Name: `scalable-api-frontend`
- [ ] Build Command: `cd frontend && npm install && npm run build`
- [ ] Publish Directory: `frontend/build`
- [ ] Plan: `Free`
- [ ] Click "Create Static Site"

**Save your frontend URL!** (e.g., `https://scalable-api-frontend.onrender.com`)

### Step 2: Add Environment Variable
- [ ] Click "Environment"
- [ ] Add:

```
REACT_APP_API_URL = https://scalable-api-backend.onrender.com/api/v1
```

(Replace with your actual backend URL from Phase 3)

- [ ] Click "Save"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Check logs - should see build successful

### Step 3: Verify Frontend Works
- [ ] Open: `https://scalable-api-frontend.onrender.com`
- [ ] Should see: Login page
- [ ] ✅ Frontend is live!


---

## ✅ Phase 5: Update Backend CORS (2 minutes)

- [ ] Go back to backend service on Render
- [ ] Click "Environment"
- [ ] Find `CORS_ORIGIN`
- [ ] Update to: `https://scalable-api-frontend.onrender.com` (your actual frontend URL)
- [ ] Click "Save"
- [ ] Click "Redeploy" to apply changes


---

## ✅ Phase 6: Full Test (5 minutes)

### Test Backend
```bash
# Test 1: Health Check
curl https://scalable-api-backend.onrender.com/api/v1

# Test 2: Login (Replace YOUR_BACKEND_URL)
curl -X POST https://scalable-api-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testflow1@example.com","password":"Password123!"}'
```

### Test Frontend
- [ ] Open: `https://scalable-api-frontend.onrender.com`
- [ ] **Test 1:** Login with `testflow1@example.com` / `Password123!`
- [ ] **Test 2:** Create a new task
- [ ] **Test 3:** Edit the task
- [ ] **Test 4:** Delete the task
- [ ] **Test 5:** Logout and login again (verify token works)
- [ ] **Test 6:** Visit: `/api-docs` on backend (should see Swagger docs)

- [ ] ✅ All tests passed!


---

## 🎉 COMPLETE!

Your app is now live in production:
- **Backend:** `https://scalable-api-backend.onrender.com`
- **Frontend:** `https://scalable-api-frontend.onrender.com`
- **Docs:** `https://scalable-api-backend.onrender.com/api-docs`

**Credentials for testing:**
- Email: `testflow1@example.com`
- Password: `Password123!`

**Features:**
✅ User registration & login
✅ JWT authentication with refresh tokens
✅ Task CRUD operations
✅ Role-based access control (RBAC)
✅ Input validation & error handling
✅ API documentation (Swagger)
✅ Secure password hashing
✅ Production-ready architecture

---

## 🆘 Something Not Working?

### Check logs:
- **Backend logs:** Render dashboard → Backend service → Logs tab
- **Frontend build logs:** Render dashboard → Frontend service → Logs tab

### Common issues:
1. **MongoDB auth failed:** Check IP whitelist in MongoDB Atlas
2. **Frontend can't reach backend:** Check `REACT_APP_API_URL` env var
3. **Deployment failed:** Check build command in Render config

### Questions?
Visit: https://docs.render.com/

