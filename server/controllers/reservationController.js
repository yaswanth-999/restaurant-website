const Reservation = require("../models/Reservation");
const razorpayInstance = require("../config/razorpay");

// ==========================================
// Create Reservation
// ==========================================
exports.createReservation = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      date,
      time,
      guests,
      specialRequests,
    } = req.body;

    // Calculate deposit
    const estimatedBill = guests * 500;
    const depositAmount = Math.max(Math.round(estimatedBill * 0.1), 500);

    let order = null;

    // Create Razorpay Order (only if configured)
    if (razorpayInstance) {
      order = await razorpayInstance.orders.create({
        amount: depositAmount * 100,
        currency: "INR",
        receipt: `order_${Date.now()}`,
        notes: {
          name,
          email,
          phone,
          guests,
        },
      });
    }

    // Create Reservation
    const reservation = await Reservation.create({
      name,
      email,
      phone,
      date,
      time,
      guests,
      specialRequests: specialRequests || "",

      depositAmount,

      razorpayOrderId: order ? order.id : null,

      // Reservation Status
      status: razorpayInstance ? "Pending" : "Confirmed",

      // Payment Status
      paymentStatus: razorpayInstance
        ? "Pending"
        : "Completed",
    });

    res.status(201).json({
      success: true,
      message: razorpayInstance
        ? "Reservation created. Please complete payment."
        : "Reservation booked successfully.",

      data: {
        reservation,

        razorpayOrder: order
          ? {
              orderId: order.id,
              amount: order.amount,
              currency: order.currency,
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Verify Payment
// ==========================================
exports.verifyPayment = async (req, res, next) => {
  try {
    if (!razorpayInstance) {
      return res.status(400).json({
        success: false,
        message: "Payment gateway is not configured.",
      });
    }

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    const crypto = require("crypto");

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature.",
      });
    }

    const reservation = await Reservation.findOneAndUpdate(
      {
        razorpayOrderId,
      },
      {
        paymentStatus: "Completed",
        status: "Confirmed",
        razorpayPaymentId,
      },
      {
        new: true,
      }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get All Reservations
// ==========================================
exports.getAllReservations = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.date) {
      const start = new Date(req.query.date);
      const end = new Date(req.query.date);
      end.setDate(end.getDate() + 1);

      filter.date = {
        $gte: start,
        $lt: end,
      };
    }

    const reservations = await Reservation.find(filter)
      .sort({
        date: -1,
        time: -1,
      })
      .lean();

    res.json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Reservation By ID
// ==========================================
exports.getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    res.json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Update Reservation
// ==========================================
exports.updateReservationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (
      !["Pending", "Confirmed", "Cancelled"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status.",
      });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    res.json({
      success: true,
      message: "Reservation updated successfully.",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Delete Reservation
// ==========================================
exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(
      req.params.id
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    res.json({
      success: true,
      message: "Reservation deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Reservation Statistics
// ==========================================
exports.getReservationStats = async (req, res, next) => {
  try {
    const stats = await Reservation.aggregate([
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
          totalGuests: {
            $sum: "$guests",
          },
        },
      },
    ]);

    const totalReservations =
      await Reservation.countDocuments();

    res.json({
      success: true,
      data: {
        totalReservations,
        byStatus: stats,
      },
    });
  } catch (error) {
    next(error);
  }
};