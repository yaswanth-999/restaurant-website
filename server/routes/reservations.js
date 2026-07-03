const express = require('express');
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middleware/authMiddleware');
const { reservationLimiter } = require('../middleware/rateLimiter');
const { validateReservation, validateReservationQuery } = require('../middleware/validation');

const router = express.Router();

// Public routes (rate limited)
router.post('/', reservationLimiter, validateReservation, reservationController.createReservation);
router.post('/verify-payment', reservationController.verifyPayment);

// Admin routes (protected)
router.get('/', authMiddleware, validateReservationQuery, reservationController.getAllReservations);
router.get('/stats', authMiddleware, reservationController.getReservationStats);
router.get('/:id', authMiddleware, reservationController.getReservationById);
router.patch('/:id', authMiddleware, reservationController.updateReservationStatus);
router.delete('/:id', authMiddleware, reservationController.deleteReservation);

module.exports = router;
