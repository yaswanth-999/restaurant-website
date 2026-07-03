const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      validate: {
        validator: function(v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: 'Phone number must be 10 digits'
      }
    },
    date: {
      type: Date,
      required: [true, 'Reservation date is required'],
      validate: {
        validator: function(value) {
          return new Date(value) > new Date();
        },
        message: 'Reservation date cannot be in the past'
      }
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      validate: {
        validator: function(v) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'Time must be in HH:MM format'
      }
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'Minimum 1 guest required'],
      max: [20, 'Maximum 20 guests allowed']
    },
    specialRequests: {
      type: String,
      maxlength: [300, 'Special requests cannot exceed 300 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Confirmed', 'Cancelled'],
        message: 'Status must be Pending, Confirmed, or Cancelled'
      },
      default: 'Pending'
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['Pending', 'Completed', 'Failed'],
        message: 'Payment status must be Pending, Completed, or Failed'
      },
      default: 'Pending'
    },
    depositAmount: {
      type: Number,
      required: [true, 'Deposit amount is required'],
      min: [0, 'Deposit cannot be negative']
    },
    razorpayOrderId: {
      type: String,
      default: null
    },
    razorpayPaymentId: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for admin queries
reservationSchema.index({ date: 1, status: 1 });
reservationSchema.index({ email: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
