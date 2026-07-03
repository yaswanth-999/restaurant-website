const express = require('express');
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateMenuItem, validateMenuQuery } = require('../middleware/validation');
const upload = require('../config/multer');

const router = express.Router();

// Public routes
router.get('/', validateMenuQuery, menuController.getAllMenuItems);
router.get('/categories', menuController.getMenuCategories);
router.get('/:id', menuController.getMenuItemById);

// Admin routes (protected)
router.post('/', authMiddleware, upload.single('image'), validateMenuItem, menuController.createMenuItem);
router.patch('/:id', authMiddleware, upload.single('image'), validateMenuItem, menuController.updateMenuItem);
router.delete('/:id', authMiddleware, menuController.deleteMenuItem);

module.exports = router;
