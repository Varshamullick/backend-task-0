# Quick Start Guide - Scalable REST API

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 16+ and npm 8+
- MongoDB 4.4+ (local or Docker)
- Git

### Option 1: Local Setup (Recommended for Development)

#### Step 1: Clone and Navigate
```bash
cd C:\Projects\scalable-api
```

#### Step 2: Setup Backend
```bash
cd backend
cp .env.example .env
npm install
```

#### Step 3: Setup Frontend
```bash
cd ../frontend
cp .env.example .env
npm install
```

#### Step 4: Start MongoDB
```bash
# Option A: If MongoDB is installed locally
mongod

# Option B: Using Docker
docker run -d -p 27017:27017 --name scalable-api-mongodb mongo:6.0
```

#### Step 5: Start Services (in separate terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server running at http://localhost:5000
# Swagger docs at http://localhost:5000/api-docs
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# App running at http://localhost:3000
```

#### Step 6: Seed Database (Optional)
```bash
cd backend
npm run seed
# Creates admin and sample user
```

---

### Option 2: Docker Setup (Production-like)

#### Prerequisites
- Docker & Docker Compose

#### Start Everything
```bash
# From project root
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f
```

#### Stop Services
```bash
docker-compose down
```

---

## 📝 Default Login Credentials

After seeding the database:

**Admin Account:**
- Email: `admin@example.com`
- Password: `AdminPassword123!`

**Demo User:**
- Email: `john@example.com`
- Password: `UserPassword123!`

---

## 🧪 Testing the API

### Using cURL

**1. Register:**
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

**2. Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

**3. Create Task (replace TOKEN with accessToken from login):**
```bash
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "My First Task",
    "description": "This is a test task",
    "priority": "high"
  }'
```

**4. Get Tasks:**
```bash
curl -X GET http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer TOKEN"
```

### Using Swagger UI

Navigate to: http://localhost:5000/api-docs

- Click "Try it out" on any endpoint
- Fill in required fields
- Click "Execute"

---

## 📁 Project Structure Overview

```
scalable-api/
├── backend/
│   ├── src/
│   │   ├── config/        # Database, logging, swagger
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Auth, rate limiting
│   │   ├── models/        # User, Task schemas
│   │   ├── routes/v1/     # API endpoints
│   │   ├── utils/         # JWT, validation, errors
│   │   └── server.js      # Express app
│   ├── package.json
│   ├── .env.example
│   └── seed.js            # Database seeding
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API calls
│   │   ├── context/       # Auth context
│   │   └── styles/        # CSS
│   ├── package.json
│   └── .env.example
├── README.md              # Full documentation
├── SCALABILITY.md         # Deployment guide
└── docker-compose.yml     # Docker setup
```

---

## 🔐 Key Features to Try

### 1. User Authentication
- Register new account
- Login and get JWT token
- Logout

### 2. Task Management
- Create tasks with title, description, status, priority
- Edit existing tasks
- Delete tasks
- Filter by status or priority
- View task statistics

### 3. Role-Based Access
- Login as admin → see all users & system stats
- Login as user → see only own tasks

### 4. API Documentation
- Visit http://localhost:5000/api-docs
- Explore all endpoints
- Try endpoints directly in Swagger UI

---

## 🛠️ Development Commands

### Backend
```bash
cd backend

# Development (with hot-reload)
npm run dev

# Production
npm start

# Seed database
npm run seed

# Lint code
npm run lint

# Run tests
npm test
```

### Frontend
```bash
cd frontend

# Development
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject (not reversible!)
npm run eject
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution: 
- Make sure MongoDB is running
- Check MONGODB_URI in .env
- Try: mongod (if installed locally)
- Or: docker run -d -p 27017:27017 mongo:6.0
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000

Solution (Windows):
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F

Solution (Mac/Linux):
  lsof -i :5000
  kill -9 <PID>
```

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy

Solution:
- Check CORS_ORIGIN in .env
- Default: http://localhost:3000
- Add your frontend URL if different
```

### Module Not Found
```
Error: Cannot find module 'express'

Solution:
  cd backend
  npm install
  # or
  npm install express
```

---

## 📊 API Response Examples

### Successful Response
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My Task",
    "status": "pending",
    "priority": "high",
    "createdAt": "2026-06-01T10:00:00Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "title",
      "message": "title is required"
    }
  ]
}
```

---

## 🚀 Next Steps

1. **Explore the codebase**
   - Read through controllers to understand logic
   - Check models for database schema
   - Review middleware for auth/validation

2. **Add features**
   - Task categories/labels
   - User notifications
   - Task sharing between users
   - Comments on tasks

3. **Deploy to production**
   - See SCALABILITY.md for deployment guide
   - Use Docker for containerization
   - Set up environment variables for production
   - Enable HTTPS
   - Configure database backups

4. **Optimize performance**
   - Add Redis caching
   - Implement database indexing
   - Set up monitoring
   - Configure logging

---

## 📚 Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Docs](https://react.dev/)
- [JWT Docs](https://jwt.io/)
- [Swagger Editor](https://editor.swagger.io/)

---

## ✅ Checklist Before Submission

- [ ] Backend runs without errors
- [ ] Frontend loads and displays home page
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Dashboard displays after login
- [ ] Can create a task
- [ ] Can update a task
- [ ] Can delete a task
- [ ] API docs available at /api-docs
- [ ] Admin endpoints are protected
- [ ] Swagger documentation is complete

---

**Ready to start? Begin with Option 1 or 2 above!**

Need help? Check README.md for detailed documentation.
