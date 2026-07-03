const rateLimit = require('express-rate-limit');

// Rate limiter for reservations - 5 requests per minute per IP
const reservationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: {
    success: false,
    message: 'Too many reservation requests. Please try again in a minute.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    // Skip rate limiting for admin users with valid JWT
    return req.headers.authorization?.startsWith('Bearer ');
  }
});

// Rate limiter for contact form - 3 requests per minute per IP
const contactLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3,
  message: {
    success: false,
    message: 'Too many contact form submissions. Please try again in a minute.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter for login attempts - 10 requests per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  reservationLimiter,
  contactLimiter,
  loginLimiter
};
