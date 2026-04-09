const express = require('express');
const {
  getDashboardData,
  getUsers,
  getDoctors,
  getPayments,
  getSupportMessages,
  replyToSupportMessage,
  updatePaymentStatus,
  confirmPayment,
} = require('../controllers/adminController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', authMiddleware, authorize(['admin']), getDashboardData);
router.get('/users', authMiddleware, authorize(['admin']), getUsers);
router.get('/doctors', authMiddleware, authorize(['admin']), getDoctors);
router.get('/payments', authMiddleware, authorize(['admin']), getPayments);
router.get('/support', authMiddleware, authorize(['admin']), getSupportMessages);
router.put('/support/:id/reply', authMiddleware, authorize(['admin']), replyToSupportMessage);
router.put('/payments/:id/status', authMiddleware, authorize(['admin']), updatePaymentStatus);
router.put('/payments/:id/confirm', authMiddleware, authorize(['admin']), confirmPayment);

module.exports = router;
