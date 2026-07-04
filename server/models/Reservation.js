const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "Please provide a valid email",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: (v) => /^[0-9]{10}$/.test(v),
        message: "Phone number must be exactly 10 digits",
      },
    },

    date: {
      type: Date,
      required: [true, "Reservation date is required"],
      validate: {
        validator: (value) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const selected = new Date(value);
          selected.setHours(0, 0, 0, 0);

          return selected >= today;
        },
        message: "Reservation date cannot be in the past",
      },
    },

    time: {
      type: String,
      required: [true, "Reservation time is required"],
      validate: {
        validator: (v) =>
          /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(v),
        message: "Time must be in HH:MM format",
      },
    },

    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "Minimum 1 guest required"],
      max: [20, "Maximum 20 guests allowed"],
    },

    specialRequests: {
      type: String,
      trim: true,
      maxlength: [300, "Special requests cannot exceed 300 characters"],
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },

    depositAmount: {
      type: Number,
      required: true,
      default: 500,
      min: [0, "Deposit amount cannot be negative"],
    },

    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

reservationSchema.index({ date: 1, status: 1 });
reservationSchema.index({ email: 1 });

module.exports = mongoose.model("Reservation", reservationSchema);