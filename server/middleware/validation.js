const { body, validationResult, query } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Reservation validation rules
const validateReservation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be 10 digits'),
  body('date')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom(value => {
      if (new Date(value) <= new Date()) {
        throw new Error('Reservation date cannot be in the past');
      }
      return true;
    }),
  body('time')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Time must be in HH:MM format'),
  body('guests')
    .isInt({ min: 1, max: 20 })
    .withMessage('Guests must be between 1 and 20'),
  body('specialRequests')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Special requests cannot exceed 300 characters'),
  handleValidationErrors
];

// Contact form validation rules
const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be 10 digits if provided'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  handleValidationErrors
];

// Admin login validation
const validateAdminLogin = [
  body('username')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Username must be between 4 and 20 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

// Menu item validation rules
const validateMenuItem = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0'),
  body('category')
    .isIn(['Appetizers', 'Mains', 'Desserts', 'Drinks'])
    .withMessage('Category must be one of: Appetizers, Mains, Desserts, Drinks'),
  body('prepTime')
    .optional()
    .isInt({ min: 5, max: 120 })
    .withMessage('Prep time must be between 5 and 120 minutes'),
  body('spicyLevel')
    .optional()
    .isIn(['Mild', 'Medium', 'Spicy'])
    .withMessage('Spicy level must be Mild, Medium, or Spicy'),
  body('isVegetarian')
    .optional()
    .isBoolean()
    .withMessage('isVegetarian must be true or false'),
  handleValidationErrors
];

// Query parameter validation for menu filtering
const validateMenuQuery = [
  query('category')
    .optional()
    .isIn(['Appetizers', 'Mains', 'Desserts', 'Drinks'])
    .withMessage('Invalid category'),
  handleValidationErrors
];

// Query validation for reservations listing
const validateReservationQuery = [
  query('status')
    .optional()
    .isIn(['Pending', 'Confirmed', 'Cancelled'])
    .withMessage('Invalid status'),
  query('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  handleValidationErrors
];

module.exports = {
  validateReservation,
  validateContactForm,
  validateAdminLogin,
  validateMenuItem,
  validateMenuQuery,
  validateReservationQuery,
  handleValidationErrors
};
