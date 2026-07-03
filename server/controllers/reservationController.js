const Reservation = require('../models/Reservation');
const razorpayInstance = require('../config/razorpay');

// Create reservation and generate Razorpay order
exports.createReservation = async (req, res, next) => {
  try {
    const { name, email, phone, date, time, guests, specialRequests } = req.body;

    // Calculate deposit amount: 10% of estimated bill or ₹500 minimum
    const estimatedBill = guests * 500; // Average bill per person
    const depositAmount = Math.max(estimatedBill * 0.1, 500);

    // Create Razorpay order
    const order = await razorpayInstance.orders.create({
      amount: Math.round(depositAmount * 100), // Amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        name,
        email,
        phone,
        guests
      }
    });

    // Create reservation with Razorpay order ID
    const reservation = await Reservation.create({
      name,
      email,
      phone,
      date,
      time,
      guests,
      specialRequests: specialRequests || '',
      depositAmount,
      razorpayOrderId: order.id,
      status: 'Pending',
      paymentStatus: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Reservation created. Please complete payment.',
      data: {
        reservation,
        razorpayOrder: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Verify Razorpay payment and confirm reservation
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify signature (simplified - in production use crypto)
    const crypto = require('crypto');
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update reservation status
    const reservation = await Reservation.findOneAndUpdate(
      { razorpayOrderId },
      {
        paymentStatus: 'Completed',
        status: 'Confirmed',
        razorpayPaymentId
      },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified. Reservation confirmed!',
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

// Get all reservations (admin only)
exports.getAllReservations = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const reservations = await Reservation.find(filter)
      .sort({ date: -1, time: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    next(error);
  }
};

// Get single reservation
exports.getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

// Update reservation status (admin only)
exports.updateReservationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reservation status updated',
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

// Delete reservation (admin only)
exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reservation deleted',
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

// Get reservation statistics (admin only)
exports.getReservationStats = async (req, res, next) => {
  try {
    const stats = await Reservation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalGuests: { $sum: '$guests' }
        }
      }
    ]);

    const totalReservations = await Reservation.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalReservations,
        byStatus: stats
      }
    });
  } catch (error) {
    next(error);
  }
};
