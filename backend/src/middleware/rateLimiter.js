const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.user && req.user.role === 'admin', // Don't rate limit admins
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts, please try again after 15 minutes.',
  skipSuccessfulRequests: true,
  keyGenerator: (req) => req.body.email || req.ip,
});

module.exports = {
  limiter,
  loginLimiter,
};
