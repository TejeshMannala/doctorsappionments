const express = require('express');
const {
  getAllDoctors,
  getDoctorById,
  createDoctorProfile,
  updateDoctorProfile,
  searchDoctorsBySpecialization,
} = require('../controllers/doctorController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllDoctors);
router.get('/search', searchDoctorsBySpecialization);
router.get('/:id', getDoctorById);

// Protected routes
router.post('/profile', authMiddleware, authorize(['doctor']), createDoctorProfile);
router.put('/profile', authMiddleware, authorize(['doctor']), updateDoctorProfile);

module.exports = router;
