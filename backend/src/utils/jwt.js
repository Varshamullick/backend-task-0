const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const generateToken = (payload, expiresIn = '7d') => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    return token;
  } catch (error) {
    logger.error(`Error generating token: ${error.message}`);
    throw error;
  }
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    logger.error(`Error verifying token: ${error.message}`);
    throw error;
  }
};

const generateAuthTokens = (userId, role) => {
  const accessToken = generateToken(
    { userId, role, type: 'access' },
    process.env.JWT_EXPIRE || '7d'
  );

  const refreshToken = generateToken(
    { userId, role, type: 'refresh' },
    process.env.JWT_REFRESH_EXPIRE || '30d'
  );

  return { accessToken, refreshToken };
};

module.exports = {
  generateToken,
  verifyToken,
  generateAuthTokens,
};
