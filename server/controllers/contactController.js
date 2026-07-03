const ContactSubmission = require('../models/ContactSubmission');

// Submit contact form
exports.submitContactForm = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    const submission = await ContactSubmission.create({
      name,
      email,
      phone: phone || '',
      message,
      ipAddress,
      status: 'Unread'
    });

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully. We will get back to you soon!',
      data: {
        id: submission._id,
        status: submission.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all contact submissions (admin only)
exports.getAllSubmissions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const submissions = await ContactSubmission.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

// Get single submission
exports.getSubmissionById = async (req, res, next) => {
  try {
    const submission = await ContactSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// Update submission status (mark as read/resolved)
exports.updateSubmissionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Unread', 'Read', 'Resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Submission status updated',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// Delete submission (admin only)
exports.deleteSubmission = async (req, res, next) => {
  try {
    const submission = await ContactSubmission.findByIdAndDelete(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Submission deleted',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// Get contact form statistics (admin only)
exports.getContactStats = async (req, res, next) => {
  try {
    const stats = await ContactSubmission.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalSubmissions = await ContactSubmission.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalSubmissions,
        byStatus: stats
      }
    });
  } catch (error) {
    next(error);
  }
};
