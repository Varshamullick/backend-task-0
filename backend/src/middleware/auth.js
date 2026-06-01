const { verifyToken } = require('../utils/jwt');
const { AppError } = require('../utils/errorHandler');
const User = require('../models/User');
const logger = require('../config/logger');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return next(new AppError('User not found or inactive', 401));
    }

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      username: user.username,
    };

    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    next(new AppError('Invalid or expired token', 401));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
