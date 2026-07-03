const express = require('express');
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');
const { contactLimiter } = require('../middleware/rateLimiter');
const { validateContactForm } = require('../middleware/validation');

const router = express.Router();

// Public route (rate limited)
router.post('/', contactLimiter, validateContactForm, contactController.submitContactForm);

// Admin routes (protected)
router.get('/', authMiddleware, contactController.getAllSubmissions);
router.get('/stats', authMiddleware, contactController.getContactStats);
router.get('/:id', authMiddleware, contactController.getSubmissionById);
router.patch('/:id', authMiddleware, contactController.updateSubmissionStatus);
router.delete('/:id', authMiddleware, contactController.deleteSubmission);

module.exports = router;
