const User = require('../models/User');
const { generateAuthTokens, verifyToken } = require('../utils/jwt');
const { AppError } = require('../utils/errorHandler');
const logger = require('../config/logger');

const createTokens = async (user) => {
  const tokens = generateAuthTokens(user._id, user.role);
  await user.addRefreshToken(tokens.refreshToken);
  return tokens;
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.validatedData;
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) return next(new AppError('Email or username already registered', 400));

    user = new User({ username, email, password, role: 'user' });
    await user.save();

    const tokens = await createTokens(user);
    res.status(201).json({
      success: true,
      message: 'User registered',
      data: {
        user: { _id: user._id, username: user.username, email: user.email, role: user.role },
        ...tokens,
      },
    });
  } catch (error) {
    logger.error(`Register failed: ${error.message}`);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid credentials', 401));
    }
    if (!user.isActive) return next(new AppError('Account disabled', 403));

    user.lastLogin = new Date();
    await user.save();

    const tokens = await createTokens(user);
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { _id: user._id, username: user.username, email: user.email, role: user.role },
        ...tokens,
      },
    });
  } catch (error) {
    logger.error(`Login failed: ${error.message}`);
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.validatedData;
    const user = await User.findById(req.user.userId);
    if (user && refreshToken) await user.removeRefreshToken(refreshToken);
    res.json({ success: true, message: 'Logged out' });
  } catch (error) {
    logger.error(`Logout failed: ${error.message}`);
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.validatedData;
    const decoded = verifyToken(refreshToken);
    if (decoded.type !== 'refresh') return next(new AppError('Invalid refresh token', 401));

    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens.some((t) => t.token === refreshToken)) {
      return next(new AppError('Invalid refresh token', 401));
    }

    await user.removeRefreshToken(refreshToken);
    const tokens = await createTokens(user);
    res.json({ success: true, data: tokens });
  } catch (error) {
    logger.error(`Refresh token failed: ${error.message}`);
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return next(new AppError('User not found', 404));

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    logger.error(`Get user failed: ${error.message}`);
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return next(new AppError('User not found', 404));

    const { username, email } = req.validatedData;
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return next(new AppError('Email already in use', 400));
      user.email = email;
    }
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) return next(new AppError('Username already taken', 400));
      user.username = username;
    }

    await user.save();
    res.json({
      success: true,
      message: 'Profile updated',
      data: { _id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    logger.error(`Update profile failed: ${error.message}`);
    next(error);
  }
};
