const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');
const { validateAdminLogin } = require('../middleware/validation');

const router = express.Router();

// Login route (public but rate limited)
router.post('/login', loginLimiter, validateAdminLogin, adminController.login);

// Protected routes
router.get('/me', authMiddleware, adminController.getAdminInfo);
router.post('/verify-token', authMiddleware, adminController.verifyToken);
router.patch('/password', authMiddleware, adminController.updatePassword);

// Admin user creation (protected) - only super admin can create new admins
router.post('/users', authMiddleware, validateAdminLogin, adminController.createAdmin);

module.exports = router;
