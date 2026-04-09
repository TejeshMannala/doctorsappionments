const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, notes } = req.body;
    const doctorProfile = await Doctor.findOne({ userId: req.user._id });
    const parsedMedicines = typeof medicines === 'string' ? JSON.parse(medicines) : medicines;

    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointment = await Appointment.findById(appointmentId).populate('patientId doctorId');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctorId._id.toString() !== doctorProfile._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const existingPrescription = await Prescription.findOne({ appointmentId });
    if (existingPrescription) {
      return res.status(400).json({ message: 'Prescription already exists for this appointment' });
    }

    const prescription = new Prescription({
      appointmentId,
      patientId: appointment.patientId,
      doctorId: doctorProfile._id,
      medicines: Array.isArray(parsedMedicines) ? parsedMedicines : [],
      notes,
    });

    await prescription.save();
    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrescriptionsByPatient = async (req, res) => {
  try {
    const patientId = req.user._id;
    const prescriptions = await Prescription.find({ patientId })
      .populate('appointmentId')
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'fullName email profileImage',
        },
      });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrescriptionsByDoctor = async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ userId: req.user._id });

    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const prescriptions = await Prescription.find({ doctorId: doctorProfile._id })
      .populate('appointmentId')
      .populate('patientId');
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('appointmentId')
      .populate('patientId')
      .populate('doctorId');
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPrescription,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
  getPrescriptionById,
};
