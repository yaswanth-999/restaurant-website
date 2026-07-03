const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Admin login
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find admin with password field selected
    const admin = await Admin.findOne({ username, active: true }).select('+passwordHash');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Check password
    const isPasswordValid = await admin.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create admin user (only for initial setup or super admin)
exports.createAdmin = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const admin = await Admin.create({
      username,
      email,
      passwordHash: password,
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current admin info
exports.getAdminInfo = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update admin password
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin.id).select('+passwordHash');

    // Verify current password
    const isPasswordValid = await admin.matchPassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.passwordHash = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Verify token (for checking if user is still logged in)
exports.verifyToken = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin || !admin.active) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or user is inactive'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};
