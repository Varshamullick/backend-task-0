require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('./config/swagger');
const connectDB = require('./config/database');
const logger = require('./config/logger');
const { limiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./utils/errorHandler');

// Import routes
const healthRoutes = require('./routes/v1/index');
const authRoutes = require('./routes/v1/auth');
const taskRoutes = require('./routes/v1/tasks');
const adminRoutes = require('./routes/v1/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Database connection
connectDB();

// API Documentation
if (process.env.SWAGGER_ENABLED !== 'false') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc));
  logger.info('Swagger documentation available at /api-docs');
}

// Routes
app.use('/health', healthRoutes);
app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error(`Unhandled Rejection: ${error.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

module.exports = app;
