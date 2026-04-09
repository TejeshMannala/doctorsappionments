const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Feedback = require('../models/Feedback');
const Payment = require('../models/Payment');
const User = require('../models/User');

const userQuery = () => User.find().select('-password').sort({ createdAt: -1 });
const doctorQuery = () =>
  Doctor.find()
    .populate('userId', 'fullName email phone profileImage')
    .sort({ createdAt: -1 });
const paymentQuery = () =>
  Payment.find()
    .populate('appointmentId')
    .populate('patientId', 'fullName email')
    .populate({
      path: 'doctorId',
      populate: {
        path: 'userId',
        select: 'fullName email',
      },
    })
    .sort({ createdAt: -1 });
const supportQuery = () =>
  Feedback.find()
    .populate('user', 'fullName email')
    .populate('repliedBy', 'fullName email')
    .sort({ createdAt: -1 });
const appointmentQuery = () =>
  Appointment.find()
    .populate('patientId', 'fullName email')
    .populate({
      path: 'doctorId',
      populate: {
        path: 'userId',
        select: 'fullName email',
      },
    })
    .sort({ createdAt: -1 });

const getDashboardData = async (req, res) => {
  try {
    const [users, doctors, payments, supportTickets, appointments] = await Promise.all([
      userQuery(),
      doctorQuery(),
      paymentQuery(),
      supportQuery(),
      appointmentQuery(),
    ]);

    const stats = {
      totalUsers: users.length,
      totalDoctors: doctors.length,
      totalPatients: users.filter((user) => user.role === 'patient').length,
      totalAdmins: users.filter((user) => user.role === 'admin').length,
      pendingPayments: payments.filter((payment) => payment.status === 'pending').length,
      completedPayments: payments.filter((payment) => payment.status === 'completed').length,
      openSupportTickets: supportTickets.filter((ticket) => ticket.status !== 'resolved').length,
      totalAppointments: appointments.length,
      recentLogins: users.filter((user) => user.lastLoginAt).length,
    };

    res.status(200).json({
      success: true,
      stats,
      users,
      doctors,
      payments,
      supportTickets,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to load admin dashboard.', error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userQuery();
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to load users.', error: error.message });
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctors = await doctorQuery();
    res.status(200).json({ success: true, count: doctors.length, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to load doctors.', error: error.message });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await paymentQuery();
    res.status(200).json({ success: true, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to load payments.', error: error.message });
  }
};

const getSupportMessages = async (req, res) => {
  try {
    const supportTickets = await supportQuery();
    res.status(200).json({ success: true, count: supportTickets.length, supportTickets });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to load support messages.',
      error: error.message,
    });
  }
};

const replyToSupportMessage = async (req, res) => {
  try {
    const { adminReply, status = 'resolved' } = req.body;

    if (!adminReply?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required.',
      });
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Support message not found.',
      });
    }

    feedback.adminReply = adminReply.trim();
    feedback.status = status;
    feedback.repliedBy = req.user.id;
    feedback.repliedAt = new Date();

    if (status === 'resolved') {
      feedback.resolvedAt = new Date();
    }

    await feedback.save();

    res.status(200).json({
      success: true,
      message: 'Support reply sent successfully.',
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to reply to support message.',
      error: error.message,
    });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'completed', 'failed', 'refunded'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status.' });
    }

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found.' });
    }

    payment.status = status;
    await payment.save();

    const appointmentUpdate = {
      isPaid: status === 'completed',
    };

    if (status === 'completed') {
      appointmentUpdate.status = 'confirmed';
    }

    await Appointment.findByIdAndUpdate(payment.appointmentId, appointmentUpdate);

    res.status(200).json({
      success: true,
      message: `Payment marked as ${status}.`,
      payment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to update payment.', error: error.message });
  }
};

const confirmPayment = async (req, res) => {
  req.body = { ...(req.body || {}), status: 'completed' };
  return updatePaymentStatus(req, res);
};

module.exports = {
  getDashboardData,
  getUsers,
  getDoctors,
  getPayments,
  getSupportMessages,
  replyToSupportMessage,
  updatePaymentStatus,
  confirmPayment,
};
