# Scalable REST API with Authentication & Role-Based Access

A production-ready full-stack application demonstrating secure backend API design with JWT authentication, role-based access control (RBAC), and a React frontend.

## 🎯 Project Overview

This project implements a complete scalable architecture with:
- **Backend**: Node.js + Express REST API with MongoDB
- **Frontend**: React.js UI for user interaction
- **Security**: JWT authentication, password hashing, input validation
- **Database**: MongoDB with Mongoose ODM
- **Documentation**: Swagger/OpenAPI specs

## ✨ Core Features

### Backend
✅ **User Management**
- User registration & login with email verification
- JWT token-based authentication
- Refresh token mechanism
- Password hashing with bcryptjs

✅ **Role-Based Access Control (RBAC)**
- User and Admin roles
- Granular permission system
- Protected routes with role validation

✅ **Task Management (CRUD)**
- Create, read, update, delete tasks
- Task filtering by status/priority
- Pagination support
- Task statistics and analytics

✅ **Security & Validation**
- Input validation with Joi
- CORS protection
- Rate limiting
- Helmet.js security headers
- Error handling middleware

✅ **API Documentation**
- Swagger/OpenAPI documentation
- Available at `/api-docs`
- Complete endpoint documentation

### Frontend
✅ **User Authentication**
- Registration page
- Login page
- Protected routes
- JWT token management

✅ **Dashboard**
- Task overview with statistics
- CRUD operations for tasks
- Real-time filtering
- Status and priority management

✅ **UI/UX**
- Responsive design
- Error/success notifications
- Loading states
- Intuitive navigation

## 🏗️ Project Structure

```
scalable-api/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Auth, rate limiting, etc.
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/
│   │   │   └── v1/          # API v1 routes
│   │   ├── utils/           # Utilities (JWT, validation, error)
│   │   └── server.js        # Entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service
│   │   ├── context/        # Auth context
│   │   ├── styles/         # CSS files
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB >= 4.4 (or use Docker)

### Installation

#### 1. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
```

Update `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/scalable-api
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000
```

If you want to use MongoDB Atlas instead of local MongoDB, use a connection string like:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.if1daae.mongodb.net/<database>?retryWrites=true&w=majority
```
Do not include the literal placeholder `<password>` in your final URI.

#### 2. Frontend Setup

```bash
cd ../frontend
cp .env.example .env
npm install
```

Update `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### Running the Application

#### With Local MongoDB

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm start
```

#### With Docker

```bash
docker-compose up -d
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api-docs
- Postman collection: Postman_collection.json
- MongoDB: mongodb://localhost:27017/scalable-api

## 📚 API Documentation

### Available Endpoints

#### Authentication
```
POST   /api/v1/auth/register      - Register new user
POST   /api/v1/auth/login         - Login user
POST   /api/v1/auth/logout        - Logout user
GET    /api/v1/auth/me            - Get current user
PUT    /api/v1/auth/profile       - Update profile
```

#### Tasks
```
GET    /api/v1/tasks              - Get all tasks (paginated)
GET    /api/v1/tasks/:id          - Get task by ID
POST   /api/v1/tasks              - Create new task
PUT    /api/v1/tasks/:id          - Update task
DELETE /api/v1/tasks/:id          - Delete task
GET    /api/v1/tasks/stats        - Get task statistics
```

#### Admin Only
```
GET    /api/v1/admin/users        - Get all users
PATCH  /api/v1/admin/users/:id/role        - Update user role
PATCH  /api/v1/admin/users/:id/deactivate  - Deactivate user
GET    /api/v1/admin/tasks        - Get all tasks (admin view)
GET    /api/v1/admin/stats        - Get system statistics
```

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication with access & refresh tokens
- Password hashing with bcrypt (salt rounds: 10)
- Token expiration & refresh mechanism
- Role-based access control (User, Admin)

### Input Validation
- Request validation with Joi schemas
- Type checking and sanitization
- Maximum request size limits (10KB)

### Middleware Security
- CORS protection with configurable origins
- Helmet.js for security headers
- Rate limiting (100 requests/15 min default)
- Request logging with log4js

### Database Security
- MongoDB connection with authentication
- Indexed queries for performance
- Schema validation
- Unique constraints on email/username

## 📊 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  username: String (unique, 3-30 chars),
  email: String (unique, email format),
  password: String (hashed),
  role: String (user|admin),
  isActive: Boolean,
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String
  },
  lastLogin: Date,
  refreshTokens: [{token: String, createdAt: Date}],
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  _id: ObjectId,
  title: String (required, max 200),
  description: String (max 1000),
  status: String (pending|in-progress|completed),
  priority: String (low|medium|high),
  createdBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  dueDate: Date,
  tags: [String],
  attachments: [{url: String, name: String}],
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Development

### Running Tests
```bash
cd backend
npm test

cd ../frontend
npm test
```

### Linting
```bash
cd backend
npm run lint

cd ../frontend
npm run lint
```

### Building for Production
```bash
cd frontend
npm run build

cd ../backend
# No build needed for Node.js, ready to deploy
```

## 📈 Scalability Considerations

### For Production Deployment

1. **Microservices Architecture**
   - Separate auth, task, and user services
   - API Gateway for routing
   - Message queues (RabbitMQ/Redis) for async operations

2. **Caching**
   - Redis for session management
   - Cache task data & statistics
   - Cache frequently accessed resources

3. **Load Balancing**
   - Nginx or AWS ELB
   - Horizontal scaling with Docker/Kubernetes
   - Session management across instances

4. **Database Optimization**
   - Database replication (MongoDB Replica Set)
   - Sharding for large collections
   - Proper indexing strategy
   - Regular backups

5. **Monitoring & Logging**
   - ELK Stack (Elasticsearch, Logstash, Kibana)
   - Application Performance Monitoring (APM)
   - Error tracking (Sentry)
   - Health checks & alerts

6. **Security**
   - SSL/TLS certificates
   - Secrets management (HashiCorp Vault)
   - API authentication versioning
   - DDoS protection

7. **CI/CD Pipeline**
   - GitHub Actions / GitLab CI
   - Automated testing
   - Docker image building
   - Automated deployments

## 🐳 Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📝 Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/scalable-api
DB_NAME=scalable-api

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# API
SWAGGER_ENABLED=true
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
LOG_FILE=logs/app.log

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

## � Deployment

### Ready for GitHub
1. Initialize the repository:
```bash
cd scalable-api
git init
git add .
git commit -m "Initial commit: backend, frontend, deploy config"
```
2. Create a GitHub repository and add the remote:
```bash
git remote add origin https://github.com/<your-username>/scalable-api.git
git push -u origin main
```

### Deploy on Render (recommended)
1. Push the repository to GitHub.
2. Sign in to Render and create a new service from GitHub.
3. Select `render.yaml` in the root to deploy both services.
4. Configure environment variables for the backend:
   - `MONGODB_URI` (use MongoDB Atlas free cluster or another hosted MongoDB)
   - `JWT_SECRET`
   - `CORS_ORIGIN` (set to the frontend service URL)
5. Deploy the backend and frontend services.

### Deploy frontend on Vercel + backend on Render
- Frontend: connect the repo to Vercel and deploy the `frontend` folder.
- Backend: deploy the `backend` folder on Render with the `render.yaml` config.
- Set `REACT_APP_API_URL` in Vercel environment variables to the Render backend URL.

### Notes
- This project requires an external MongoDB instance for production.
- Use the free MongoDB Atlas tier for a zero-cost database.

## �🔄 API Request/Response Flow

### Authentication Flow
1. User registers/logs in
2. Server verifies credentials & generates JWT tokens
3. Client stores accessToken (short-lived) & refreshToken (long-lived)
4. Client includes Bearer token in Authorization header
5. Server validates token before processing requests
6. Refresh token used to obtain new accessToken when expired

### Error Handling
All endpoints return consistent error response:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 📦 Dependencies

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **joi**: Input validation
- **cors**: CORS middleware
- **helmet**: Security headers
- **swagger-ui-express**: API documentation UI
- **log4js**: Logging

### Frontend
- **react**: UI library
- **react-router-dom**: Routing
- **axios**: HTTP client

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check existing issues
2. Create a detailed bug report
3. Include steps to reproduce
4. Share error logs

## 📞 Contact

- Project Repository: https://github.com/yourusername/scalable-api
- Issues: Use GitHub Issues
- Email: support@example.com

---

**Built with ❤️ for scalability and security**
