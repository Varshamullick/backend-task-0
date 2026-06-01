const Task = require('../models/Task');
const { AppError } = require('../utils/errorHandler');
const logger = require('../config/logger');

// Get all tasks (with pagination and filtering)
exports.getTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority, assignedTo } = req.query;
    const skip = (page - 1) * limit;

    const filter = { $or: [{ createdBy: req.user.userId }] };

    // Admins can see all tasks, users see their own
    if (req.user.role !== 'admin' && assignedTo) {
      filter.$or.push({ assignedTo: req.user.userId });
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo && req.user.role === 'admin') filter.assignedTo = assignedTo;

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
    logger.error(`Get tasks error: ${error.message}`);
    next(error);
  }
};

// Get single task
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email');

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    // Check authorization
    if (
      task.createdBy._id.toString() !== req.user.userId &&
      task.assignedTo?._id.toString() !== req.user.userId &&
      req.user.role !== 'admin'
    ) {
      return next(new AppError('You do not have permission to view this task', 403));
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    logger.error(`Get task error: ${error.message}`);
    next(error);
  }
};

// Create task
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.validatedData;

    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo: assignedTo || null,
      createdBy: req.user.userId,
    });

    await task.save();
    await task.populate('createdBy', 'username email');
    await task.populate('assignedTo', 'username email');

    logger.info(`Task created by ${req.user.email}: ${task._id}`);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    logger.error(`Create task error: ${error.message}`);
    next(error);
  }
};

// Update task
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    // Check authorization - only creator or admin can update
    if (task.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return next(new AppError('You do not have permission to update this task', 403));
    }

    const updateData = req.validatedData;
    Object.assign(task, updateData);

    await task.save();
    await task.populate('createdBy', 'username email');
    await task.populate('assignedTo', 'username email');

    logger.info(`Task updated by ${req.user.email}: ${task._id}`);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    logger.error(`Update task error: ${error.message}`);
    next(error);
  }
};

// Delete task
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    // Check authorization - only creator or admin can delete
    if (task.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return next(new AppError('You do not have permission to delete this task', 403));
    }

    await Task.findByIdAndDelete(req.params.id);

    logger.info(`Task deleted by ${req.user.email}: ${task._id}`);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete task error: ${error.message}`);
    next(error);
  }
};

// Get task statistics
exports.getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      {
        $match: {
          $or: [{ createdBy: req.user.userId }, ...(req.user.role === 'admin' ? [{}] : [])],
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalTasks = await Task.countDocuments({
      $or: [{ createdBy: req.user.userId }, ...(req.user.role === 'admin' ? [{}] : [])],
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalTasks,
        byStatus: stats,
      },
    });
  } catch (error) {
    logger.error(`Get task stats error: ${error.message}`);
    next(error);
  }
};
