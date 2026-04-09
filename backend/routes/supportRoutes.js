const express = require('express');
const {
  submitFeedback,
  getUserFeedback,
  getAllFeedback,
  replyToFeedback,
} = require('../controllers/supportController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/feedback', authMiddleware, submitFeedback);
router.get('/feedback', authMiddleware, getUserFeedback);
router.get('/admin/feedback', authMiddleware, authorize(['admin']), getAllFeedback);
router.put('/admin/feedback/:id/reply', authMiddleware, authorize(['admin']), replyToFeedback);

module.exports = router;
