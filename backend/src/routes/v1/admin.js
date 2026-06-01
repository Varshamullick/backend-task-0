const express = require('express');
const adminController = require('../../controllers/adminController');
const { authenticate, authorize } = require('../../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, authorize('admin'));

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Not authorized
 */
router.get('/users', adminController.getAllUsers);

/**
 * @swagger
 * /admin/users/{userId}/role:
 *   patch:
 *     summary: Update user role (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: User role updated
 */
router.patch('/users/:userId/role', adminController.updateUserRole);

/**
 * @swagger
 * /admin/users/{userId}/deactivate:
 *   patch:
 *     summary: Deactivate user (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deactivated
 */
router.patch('/users/:userId/deactivate', adminController.deactivateUser);

/**
 * @swagger
 * /admin/tasks:
 *   get:
 *     summary: Get all tasks (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All tasks in system
 */
router.get('/tasks', adminController.getAllTasks);

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get system statistics (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics
 */
router.get('/stats', adminController.getSystemStats);

module.exports = router;
