require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const ensureAdminAccount = require('../utils/ensureAdminAccount');

const doctorsSeed = [
  {
    user: {
      fullName: 'Dr. Ananya Sharma',
      email: 'ananya.sharma@medcare.com',
      password: 'Doctor123',
      role: 'doctor',
      phone: '9876543210',
      profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
    },
    doctor: {
      specialization: 'General Physician',
      experience: 8,
      qualification: 'MBBS, MD',
      licenseNumber: 'MC-GP-1001',
      bio: 'Experienced general physician focused on fever, cold, diabetes follow-ups, and family medicine.',
      consultationFee: 500,
      rating: 4.7,
      availableSlots: [
        { day: 'Monday', startTime: '09:00', endTime: '13:00', maxPatients: 10 },
        { day: 'Tuesday', startTime: '10:00', endTime: '14:00', maxPatients: 10 },
        { day: 'Wednesday', startTime: '09:00', endTime: '13:00', maxPatients: 10 },
        { day: 'Thursday', startTime: '10:00', endTime: '14:00', maxPatients: 10 },
        { day: 'Friday', startTime: '09:00', endTime: '13:00', maxPatients: 10 },
      ],
    },
  },
  {
    user: {
      fullName: 'Dr. Rahul Verma',
      email: 'rahul.verma@medcare.com',
      password: 'Doctor123',
      role: 'doctor',
      phone: '9876543211',
      profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80',
    },
    doctor: {
      specialization: 'Cardiologist',
      experience: 12,
      qualification: 'MBBS, DM Cardiology',
      licenseNumber: 'MC-CD-1002',
      bio: 'Treats chest pain, hypertension, cardiac screening, and preventive heart care.',
      consultationFee: 1200,
      rating: 4.9,
      availableSlots: [
        { day: 'Monday', startTime: '14:00', endTime: '18:00', maxPatients: 8 },
        { day: 'Wednesday', startTime: '14:00', endTime: '18:00', maxPatients: 8 },
        { day: 'Friday', startTime: '14:00', endTime: '18:00', maxPatients: 8 },
      ],
    },
  },
  {
    user: {
      fullName: 'Dr. Meera Iyer',
      email: 'meera.iyer@medcare.com',
      password: 'Doctor123',
      role: 'doctor',
      phone: '9876543212',
      profileImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=80',
    },
    doctor: {
      specialization: 'Dermatologist',
      experience: 9,
      qualification: 'MBBS, MD Dermatology',
      licenseNumber: 'MC-DM-1003',
      bio: 'Specialist in acne, skin allergy, pigmentation, rash, and hair fall treatment.',
      consultationFee: 900,
      rating: 4.8,
      availableSlots: [
        { day: 'Tuesday', startTime: '09:30', endTime: '13:30', maxPatients: 8 },
        { day: 'Thursday', startTime: '09:30', endTime: '13:30', maxPatients: 8 },
        { day: 'Saturday', startTime: '10:00', endTime: '14:00', maxPatients: 8 },
      ],
    },
  },
  {
    user: {
      fullName: 'Dr. Sandeep Reddy',
      email: 'sandeep.reddy@medcare.com',
      password: 'Doctor123',
      role: 'doctor',
      phone: '9876543213',
      profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80',
    },
    doctor: {
      specialization: 'Orthopedic',
      experience: 11,
      qualification: 'MBBS, MS Orthopedics',
      licenseNumber: 'MC-OR-1004',
      bio: 'Treats joint pain, fractures, sports injuries, and long-term bone conditions.',
      consultationFee: 1000,
      rating: 4.6,
      availableSlots: [
        { day: 'Monday', startTime: '11:00', endTime: '15:00', maxPatients: 8 },
        { day: 'Thursday', startTime: '11:00', endTime: '15:00', maxPatients: 8 },
        { day: 'Saturday', startTime: '09:00', endTime: '12:00', maxPatients: 6 },
      ],
    },
  },
  {
    user: {
      fullName: 'Dr. Kavya Nair',
      email: 'kavya.nair@medcare.com',
      password: 'Doctor123',
      role: 'doctor',
      phone: '9876543214',
      profileImage: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=800&q=80',
    },
    doctor: {
      specialization: 'Pediatrician',
      experience: 10,
      qualification: 'MBBS, MD Pediatrics',
      licenseNumber: 'MC-PD-1005',
      bio: 'Focused on child fever care, vaccination guidance, nutrition, and developmental consultations.',
      consultationFee: 850,
      rating: 4.8,
      availableSlots: [
        { day: 'Monday', startTime: '09:00', endTime: '12:30', maxPatients: 10 },
        { day: 'Wednesday', startTime: '09:00', endTime: '12:30', maxPatients: 10 },
        { day: 'Saturday', startTime: '09:00', endTime: '13:00', maxPatients: 10 },
      ],
    },
  },
  {
    user: {
      fullName: 'Dr. Arjun Malhotra',
      email: 'arjun.malhotra@medcare.com',
      password: 'Doctor123',
      role: 'doctor',
      phone: '9876543215',
      profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    },
    doctor: {
      specialization: 'Neurologist',
      experience: 14,
      qualification: 'MBBS, DM Neurology',
      licenseNumber: 'MC-NR-1006',
      bio: 'Supports migraine, dizziness, nerve pain, and long-term neurological care plans.',
      consultationFee: 1500,
      rating: 4.9,
      availableSlots: [
        { day: 'Tuesday', startTime: '11:00', endTime: '15:00', maxPatients: 6 },
        { day: 'Thursday', startTime: '11:00', endTime: '15:00', maxPatients: 6 },
        { day: 'Friday', startTime: '10:00', endTime: '13:00', maxPatients: 6 },
      ],
    },
  },
  {
    user: {
      fullName: 'Dr. Sneha Kulkarni',
      email: 'sneha.kulkarni@medcare.com',
      password: 'Doctor123',
      role: 'doctor',
      phone: '9876543216',
      profileImage: 'https://images.unsplash.com/photo-1591604025217-1c0ca0c29f08?auto=format&fit=crop&w=800&q=80',
    },
    doctor: {
      specialization: 'Gynecologist',
      experience: 13,
      qualification: 'MBBS, MS Obstetrics & Gynecology',
      licenseNumber: 'MC-GY-1007',
      bio: 'Helps with women’s health, pregnancy advice, menstrual concerns, and preventive consultations.',
      consultationFee: 1100,
      rating: 4.8,
      availableSlots: [
        { day: 'Monday', startTime: '15:00', endTime: '18:00', maxPatients: 8 },
        { day: 'Thursday', startTime: '15:00', endTime: '18:00', maxPatients: 8 },
        { day: 'Saturday', startTime: '11:00', endTime: '15:00', maxPatients: 8 },
      ],
    },
  },
  {
    user: {
      fullName: 'Dr. Vivek Menon',
      email: 'vivek.menon@medcare.com',
      password: 'Doctor123',
      role: 'doctor',
      phone: '9876543217',
      profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80',
    },
    doctor: {
      specialization: 'ENT Specialist',
      experience: 7,
      qualification: 'MBBS, MS ENT',
      licenseNumber: 'MC-ENT-1008',
      bio: 'Treats ear pain, sinus issues, throat infection, allergies, and voice-related concerns.',
      consultationFee: 700,
      rating: 4.6,
      availableSlots: [
        { day: 'Tuesday', startTime: '09:00', endTime: '12:00', maxPatients: 8 },
        { day: 'Friday', startTime: '09:00', endTime: '12:00', maxPatients: 8 },
        { day: 'Saturday', startTime: '14:00', endTime: '17:00', maxPatients: 8 },
      ],
    },
  },
  {
    user: {
      fullName: 'Dr. Priya Deshmukh',
      email: 'priya.deshmukh@medcare.com',
      password: 'Doctor123',
      role: 'doctor',
      phone: '9876543218',
      profileImage: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=800&q=80',
    },
    doctor: {
      specialization: 'Psychiatrist',
      experience: 10,
      qualification: 'MBBS, MD Psychiatry',
      licenseNumber: 'MC-PSY-1009',
      bio: 'Supports anxiety, stress, depression, sleep issues, and long-term mental wellness care.',
      consultationFee: 1300,
      rating: 4.8,
      availableSlots: [
        { day: 'Monday', startTime: '16:00', endTime: '19:00', maxPatients: 6 },
        { day: 'Wednesday', startTime: '16:00', endTime: '19:00', maxPatients: 6 },
        { day: 'Friday', startTime: '16:00', endTime: '19:00', maxPatients: 6 },
      ],
    },
  },
  {
    user: {
      fullName: 'Dr. Nikhil Joshi',
      email: 'nikhil.joshi@medcare.com',
      password: 'Doctor123',
      role: 'doctor',
      phone: '9876543219',
      profileImage: 'https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?auto=format&fit=crop&w=800&q=80',
    },
    doctor: {
      specialization: 'Ophthalmologist',
      experience: 9,
      qualification: 'MBBS, MS Ophthalmology',
      licenseNumber: 'MC-OPH-1010',
      bio: 'Treats eye infections, blurred vision, eye strain, cataract screenings, and routine eye checkups.',
      consultationFee: 950,
      rating: 4.7,
      availableSlots: [
        { day: 'Tuesday', startTime: '10:00', endTime: '13:00', maxPatients: 8 },
        { day: 'Thursday', startTime: '10:00', endTime: '13:00', maxPatients: 8 },
        { day: 'Saturday', startTime: '09:00', endTime: '12:00', maxPatients: 8 },
      ],
    },
  },
  {
    user: {
      fullName: 'Dr. Farah Khan',
      email: 'farah.khan@medcare.com',
      password: 'Doctor123',
      role: 'doctor',
      phone: '9876543220',
      profileImage: 'https://images.unsplash.com/photo-1594824475544-95d5b0d87f66?auto=format&fit=crop&w=800&q=80',
    },
    doctor: {
      specialization: 'Endocrinologist',
      experience: 11,
      qualification: 'MBBS, DM Endocrinology',
      licenseNumber: 'MC-END-1011',
      bio: 'Helps manage thyroid issues, diabetes, hormone disorders, and metabolic health plans.',
      consultationFee: 1400,
      rating: 4.9,
      availableSlots: [
        { day: 'Monday', startTime: '12:00', endTime: '16:00', maxPatients: 7 },
        { day: 'Thursday', startTime: '12:00', endTime: '16:00', maxPatients: 7 },
        { day: 'Friday', startTime: '11:00', endTime: '14:00', maxPatients: 7 },
      ],
    },
  },
  {
    user: {
      fullName: 'Dr. Harish Patel',
      email: 'harish.patel@medcare.com',
      password: 'Doctor123',
      role: 'doctor',
      phone: '9876543221',
      profileImage: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80',
    },
    doctor: {
      specialization: 'Pulmonologist',
      experience: 13,
      qualification: 'MBBS, DM Pulmonology',
      licenseNumber: 'MC-PUL-1012',
      bio: 'Treats asthma, chronic cough, breathing difficulty, allergies, and lung health conditions.',
      consultationFee: 1250,
      rating: 4.8,
      availableSlots: [
        { day: 'Tuesday', startTime: '14:00', endTime: '18:00', maxPatients: 7 },
        { day: 'Thursday', startTime: '14:00', endTime: '18:00', maxPatients: 7 },
        { day: 'Saturday', startTime: '10:00', endTime: '13:00', maxPatients: 7 },
      ],
    },
  },
  {
    user: {
      fullName: 'Dr. Aisha Thomas',
      email: 'aisha.thomas@medcare.com',
      password: 'Doctor123',
      role: 'doctor',
      phone: '9876543222',
      profileImage: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80',
    },
    doctor: {
      specialization: 'Dentist',
      experience: 8,
      qualification: 'BDS, MDS',
      licenseNumber: 'MC-DEN-1013',
      bio: 'Provides dental pain care, gum treatment, cleaning, cavity consultation, and oral hygiene guidance.',
      consultationFee: 800,
      rating: 4.7,
      availableSlots: [
        { day: 'Monday', startTime: '09:00', endTime: '12:00', maxPatients: 10 },
        { day: 'Wednesday', startTime: '09:00', endTime: '12:00', maxPatients: 10 },
        { day: 'Friday', startTime: '09:00', endTime: '12:00', maxPatients: 10 },
      ],
    },
  },
  {
    user: {
      fullName: 'Dr. Rohit Banerjee',
      email: 'rohit.banerjee@medcare.com',
      password: 'Doctor123',
      role: 'doctor',
      phone: '9876543223',
      profileImage: 'https://images.unsplash.com/photo-1536064479547-7ee40b74b807?auto=format&fit=crop&w=800&q=80',
    },
    doctor: {
      specialization: 'Urologist',
      experience: 12,
      qualification: 'MBBS, MCh Urology',
      licenseNumber: 'MC-URO-1014',
      bio: 'Treats kidney stone symptoms, urinary infections, prostate concerns, and male urological conditions.',
      consultationFee: 1350,
      rating: 4.8,
      availableSlots: [
        { day: 'Tuesday', startTime: '15:00', endTime: '18:00', maxPatients: 6 },
        { day: 'Friday', startTime: '15:00', endTime: '18:00', maxPatients: 6 },
        { day: 'Saturday', startTime: '11:00', endTime: '14:00', maxPatients: 6 },
      ],
    },
  },
];

const seedDoctors = async () => {
  try {
    await connectDB();
    await ensureAdminAccount();

    for (const entry of doctorsSeed) {
      let user = await User.findOne({ email: entry.user.email }).select('+password');

      if (!user) {
        user = await User.create(entry.user);
      } else {
        user.fullName = entry.user.fullName;
        user.role = 'doctor';
        user.phone = entry.user.phone;
        user.profileImage = entry.user.profileImage;
        await user.save();
      }

      await Doctor.findOneAndUpdate(
        {
          $or: [{ userId: user._id }, { licenseNumber: entry.doctor.licenseNumber }],
        },
        {
          userId: user._id,
          ...entry.doctor,
          isAvailable: true,
        },
        { upsert: true, new: true, runValidators: true }
      );
    }

    const count = await Doctor.countDocuments();
    console.log(`Seed complete. Total doctors available: ${count}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedDoctors();
