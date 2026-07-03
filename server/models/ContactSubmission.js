const mongoose = require('mongoose');

const contactSubmissionSchema = new mongoose.Schema(
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
      validate: {
        validator: function(v) {
          return !v || /^[0-9]{10}$/.test(v); // Optional field
        },
        message: 'Phone number must be 10 digits if provided'
      },
      default: ''
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    status: {
      type: String,
      enum: {
        values: ['Unread', 'Read', 'Resolved'],
        message: 'Status must be Unread, Read, or Resolved'
      },
      default: 'Unread'
    },
    ipAddress: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Index for admin queries
contactSubmissionSchema.index({ status: 1, createdAt: -1 });
contactSubmissionSchema.index({ email: 1 });

module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema);
