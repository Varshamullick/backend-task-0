require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Task = require('./src/models/Task');
const logger = require('./src/config/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scalable-api', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    logger.info('Cleared existing data');

    // Create default admin user
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'AdminPassword123!';
    const admin = new User({
      username: 'admin',
      email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      isActive: true,
      profile: {
        firstName: 'Admin',
        lastName: 'User',
      },
    });

    await admin.save();
    logger.info(`Admin user created: ${admin.email}`);

    // Create sample user
    const user = new User({
      username: 'john_doe',
      email: 'john@example.com',
      password: 'UserPassword123!',
      role: 'user',
      isActive: true,
      profile: {
        firstName: 'John',
        lastName: 'Doe',
      },
    });

    await user.save();
    logger.info(`Sample user created: ${user.email}`);

    // Create sample tasks
    const tasks = [
      {
        title: 'Complete project setup',
        description: 'Set up the initial project structure and dependencies',
        status: 'completed',
        priority: 'high',
        createdBy: admin._id,
        assignedTo: user._id,
      },
      {
        title: 'Implement authentication',
        description: 'Add JWT-based authentication system',
        status: 'in-progress',
        priority: 'high',
        createdBy: admin._id,
        assignedTo: user._id,
      },
      {
        title: 'Create API documentation',
        description: 'Write Swagger documentation for all endpoints',
        status: 'pending',
        priority: 'medium',
        createdBy: admin._id,
        assignedTo: null,
      },
      {
        title: 'Build React frontend',
        description: 'Create React UI for the API',
        status: 'pending',
        priority: 'high',
        createdBy: admin._id,
        assignedTo: user._id,
      },
      {
        title: 'Set up deployment',
        description: 'Docker setup and cloud deployment',
        status: 'pending',
        priority: 'medium',
        createdBy: admin._id,
        assignedTo: null,
      },
    ];

    await Task.insertMany(tasks);
    logger.info(`${tasks.length} sample tasks created`);

    logger.info('Database seeded successfully!');
    console.log('\nDefault Credentials:');
    console.log(`Admin Email: ${process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com'}`);
    console.log(`Admin Password: ${adminPassword}`);
    console.log(`\nUser Email: john@example.com`);
    console.log('User Password: UserPassword123!');
  } catch (error) {
    logger.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

(async () => {
  await connectDB();
  await seedDatabase();
  await mongoose.connection.close();
  process.exit(0);
})();
