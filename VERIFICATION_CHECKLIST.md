# Verification Checklist - Scalable REST API

Use this checklist to verify that all components are working correctly.

## ✅ Pre-Verification Setup

### 1. Start All Services
```bash
# Terminal 1: MongoDB
mongod  # or: docker run -d -p 27017:27017 mongo:6.0

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Frontend  
cd frontend && npm start
```

### 2. Seed Database (Optional but recommended)
```bash
# Terminal 4: Seed
cd backend && npm run seed
```

---

## 🔍 Verification Steps

### A. Backend API Verification

#### 1. Health Check
```bash
curl http://localhost:5000/api/v1
# Expected: { success: true, message: "Scalable REST API v1 is running", version: "1.0.0" }
```
✅ **Verified**: [ ]

#### 2. Register New User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!"
  }'
```
Expected: `{ success: true, data: { user: {...}, accessToken: "...", refreshToken: "..." } }`
✅ **Verified**: [ ]

#### 3. Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```
Expected: `{ success: true, data: { user: {...}, accessToken: "...", refreshToken: "..." } }`
✅ **Verified**: [ ] (Save the accessToken for next tests)

#### 4. Get Current User
```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
Expected: `{ success: true, data: { _id: "...", email: "...", username: "..." } }`
✅ **Verified**: [ ]

#### 5. Create Task
```bash
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Test Task",
    "description": "Verify CRUD",
    "priority": "high"
  }'
```
Expected: `{ success: true, message: "Task created successfully", data: { _id: "...", title: "..." } }`
✅ **Verified**: [ ] (Save the task _id)

#### 6. Get Tasks
```bash
curl http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
Expected: `{ success: true, data: [...], pagination: { total: 1, page: 1, ... } }`
✅ **Verified**: [ ]

#### 7. Get Single Task
```bash
curl http://localhost:5000/api/v1/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
Expected: `{ success: true, data: { _id: "...", title: "Test Task", ... } }`
✅ **Verified**: [ ]

#### 8. Update Task
```bash
curl -X PUT http://localhost:5000/api/v1/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "status": "in-progress",
    "priority": "medium"
  }'
```
Expected: `{ success: true, message: "Task updated successfully", data: { ... } }`
✅ **Verified**: [ ]

#### 9. Delete Task
```bash
curl -X DELETE http://localhost:5000/api/v1/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
Expected: `{ success: true, message: "Task deleted successfully" }`
✅ **Verified**: [ ]

#### 10. Task Statistics (After creating multiple tasks)
```bash
curl http://localhost:5000/api/v1/tasks/stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
Expected: `{ success: true, data: { total: X, byStatus: [...] } }`
✅ **Verified**: [ ]

#### 11. API Documentation (Swagger)
Navigate to: **http://localhost:5000/api-docs**

Verify:
- [ ] Swagger UI loads
- [ ] All endpoints listed
- [ ] Can expand each endpoint
- [ ] Authentication section visible
- [ ] Models/schemas displayed

✅ **Verified**: [ ]

---

### B. Frontend Verification

#### 1. Home Page
Navigate to: **http://localhost:3000**

Verify:
- [ ] Home page loads
- [ ] Header displays "Scalable REST API"
- [ ] Features section visible
- [ ] Login and Register buttons present

✅ **Verified**: [ ]

#### 2. Registration
1. Click "Register" button (or go to http://localhost:3000/register)
2. Fill form:
   - Username: testuser
   - Email: frontend@example.com
   - Password: TestPass123!
   - Confirm: TestPass123!
3. Click "Register"

Verify:
- [ ] Form validates input
- [ ] Success message appears (or redirects to dashboard)
- [ ] Dashboard displays after registration

✅ **Verified**: [ ]

#### 3. Dashboard Features
After registration, on dashboard:

Verify:
- [ ] Welcome message shows username
- [ ] Task statistics card displays
- [ ] "New Task" button visible
- [ ] Filters (Status, Priority) available
- [ ] Logout button present

✅ **Verified**: [ ]

#### 4. Create Task from UI
1. Click "New Task" button
2. Fill form:
   - Title: "Test from UI"
   - Description: "Testing frontend functionality"
   - Priority: "high"
   - Status: "pending"
3. Click "Create Task"

Verify:
- [ ] Success message appears
- [ ] Task appears in list
- [ ] Task card shows correct data

✅ **Verified**: [ ]

#### 5. Update Task from UI
1. Click "Edit" on a task card
2. Form opens with current data
3. Change priority to "low"
4. Click "Update Task"

Verify:
- [ ] Success message appears
- [ ] Task updated in list
- [ ] Changes persist

✅ **Verified**: [ ]

#### 6. Delete Task from UI
1. Click "Delete" on a task card
2. Confirm deletion

Verify:
- [ ] Confirmation dialog appears
- [ ] Task removed from list
- [ ] Success message shown

✅ **Verified**: [ ]

#### 7. Filter Tasks
1. Select "in-progress" from Status dropdown
2. Select "high" from Priority dropdown

Verify:
- [ ] List filters correctly
- [ ] Only matching tasks shown
- [ ] Filters work in real-time

✅ **Verified**: [ ]

#### 8. Login/Logout
1. Click Logout button
2. Redirected to login page
3. Enter credentials:
   - Email: frontend@example.com
   - Password: TestPass123!
4. Click Login

Verify:
- [ ] Logout successful
- [ ] Dashboard only accessible with token
- [ ] Login redirects to dashboard
- [ ] Can view tasks after login

✅ **Verified**: [ ]

#### 9. Token Persistence
1. Dashboard displayed
2. Refresh page (F5)

Verify:
- [ ] Dashboard still displays (token persisted)
- [ ] User stays logged in

✅ **Verified**: [ ]

#### 10. Protected Routes
1. Logged out
2. Try accessing http://localhost:3000/dashboard
3. Should redirect to login

Verify:
- [ ] Can't access dashboard without token
- [ ] Redirected to login page

✅ **Verified**: [ ]

---

### C. Security Verification

#### 1. Password Hashing
```javascript
// In MongoDB:
// Check that passwords are hashed (not plaintext)
db.users.findOne({email: "test@example.com"})
// password field should be long hash, not "TestPass123!"
```
✅ **Verified**: [ ]

#### 2. JWT Token Format
```bash
# Token from login should be valid JWT
# Decode at https://jwt.io/
# Should contain: { userId, role, type, iat, exp }
```
✅ **Verified**: [ ]

#### 3. Invalid Token Rejection
```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer invalid_token"
# Expected: 401 Unauthorized
```
✅ **Verified**: [ ]

#### 4. Expired Token Handling
(Create a token, wait for expiry in logs)

Verify:
- [ ] Expired token returns 401
- [ ] User redirected to login on frontend

✅ **Verified**: [ ]

#### 5. Role-Based Access
If using seeded admin account:
```bash
# Login as regular user - can't access /admin routes
curl http://localhost:5000/api/v1/admin/stats \
  -H "Authorization: Bearer USER_TOKEN"
# Expected: 403 Forbidden
```
✅ **Verified**: [ ]

---

### D. Error Handling Verification

#### 1. Validation Error
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "t",  # Too short!
    "email": "invalid",  # Invalid format!
    "password": "weak",
    "confirmPassword": "weak"
  }'
# Expected: 400 with field errors
```
✅ **Verified**: [ ]

#### 2. Not Found Error
```bash
curl http://localhost:5000/api/v1/tasks/invalid_id \
  -H "Authorization: Bearer YOUR_TOKEN"
# Expected: 404 Task not found
```
✅ **Verified**: [ ]

#### 3. Unauthorized Error
```bash
curl http://localhost:5000/api/v1/tasks \
  # No Authorization header
# Expected: 401 No token provided
```
✅ **Verified**: [ ]

#### 4. Duplicate Email Error
```bash
# Try registering with same email twice
# Expected: 400 Email already registered
```
✅ **Verified**: [ ]

---

### E. Database Verification

#### 1. User Collection
```javascript
db.users.find().count()  // Should have at least 1 user
db.users.findOne()  // Check structure
```
✅ **Verified**: [ ]

#### 2. Task Collection
```javascript
db.tasks.find().count()  // Should have created tasks
db.tasks.findOne()  // Check structure and references
```
✅ **Verified**: [ ]

#### 3. Indexes
```javascript
db.tasks.getIndexes()  // Should see indexes on createdBy, assignedTo
db.users.getIndexes()  // Should see unique index on email
```
✅ **Verified**: [ ]

---

### F. Docker Verification (Optional)

If using Docker:

```bash
# Check running containers
docker-compose ps

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Execute command in container
docker-compose exec backend npm run seed
```

Verify:
- [ ] 3 containers running (backend, frontend, mongodb)
- [ ] Backend logs show "Server running on port 5000"
- [ ] Frontend logs show "On Localhost"
- [ ] MongoDB logs show "waiting for connections"

✅ **Verified**: [ ]

---

## 📋 Final Verification Summary

### All Tests Passed?
- Backend API: [ ]
- Frontend UI: [ ]
- Security: [ ]
- Error Handling: [ ]
- Database: [ ]
- Docker (if used): [ ]

### Outstanding Issues (If any)
```
1. 
2. 
3. 
```

---

## 🚀 Deployment Readiness Checklist

Before deploying:
- [ ] All unit tests pass
- [ ] All API endpoints tested
- [ ] Frontend UI fully functional
- [ ] Security best practices verified
- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] Error handling comprehensive
- [ ] API documentation complete
- [ ] Docker images build successfully
- [ ] Production dependencies installed

---

## ✅ Sign-Off

**Verification Date**: ________________
**Verified By**: ________________
**Status**: ☐ PASSED  ☐ FAILED

**Notes**: _______________________________________________

---

For issues, refer to QUICK_START.md troubleshooting section.
