const express = require('express');

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Scalable REST API v1 is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
