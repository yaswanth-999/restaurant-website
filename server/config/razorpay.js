const Razorpay = require('razorpay');

let razorpayInstance = null;

// Only initialize Razorpay if credentials are provided
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('[RAZORPAY] Initialized with provided credentials');
} else {
  console.log('[RAZORPAY] No credentials provided. Payment features will be limited.');
}

module.exports = razorpayInstance;
