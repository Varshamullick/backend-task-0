const User = require('../models/User');
const Task = require('../models/Task');
const { AppError } = require('../utils/errorHandler');
const logger = require('../config/logger');

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Get all users error: ${error.message}`);
    next(error);
  }
};

// Update user role
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return next(new AppError('Invalid role', 400));
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    logger.info(`User role updated by admin: ${user.email} -> ${role}`);

    res.status(200).json({
      success: true,
      message: 'User role updated',
      data: user,
    });
  } catch (error) {
    logger.error(`Update user role error: ${error.message}`);
    next(error);
  }
};

// Deactivate user
exports.deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    logger.info(`User deactivated by admin: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'User deactivated',
      data: user,
    });
  } catch (error) {
    logger.error(`Deactivate user error: ${error.message}`);
    next(error);
  }
};

// Get system statistics
exports.getSystemStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const admins = await User.countDocuments({ role: 'admin' });
    const totalTasks = await Task.countDocuments();

    const tasksByStatus = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const tasksByPriority = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          admins,
        },
        tasks: {
          total: totalTasks,
          byStatus: tasksByStatus,
          byPriority: tasksByPriority,
        },
      },
    });
  } catch (error) {
    logger.error(`Get system stats error: ${error.message}`);
    next(error);
  }
};

// Get all tasks (admin view)
exports.getAllTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.$or = [{ createdBy: userId }, { assignedTo: userId }];

    const tasks = await Task.find(filter)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email')
      .sort({ dueDate: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Get all tasks error: ${error.message}`);
    next(error);
  }
};
