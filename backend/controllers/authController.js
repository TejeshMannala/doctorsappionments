const User = require('../models/User');
const jwt = require('jsonwebtoken');

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_BLOCK_MS = 60 * 60 * 1000;
const loginAttempts = new Map();

const getLoginKey = (req, email = '') => `${String(email).trim().toLowerCase()}::${req.ip || 'unknown'}`;

const clearLoginAttempt = (key) => {
  loginAttempts.delete(key);
};

const registerFailedAttempt = (key) => {
  const now = Date.now();
  const existing = loginAttempts.get(key);

  if (!existing || (existing.blockedUntil && existing.blockedUntil <= now)) {
    loginAttempts.set(key, { count: 1, blockedUntil: 0 });
    return;
  }

  const nextCount = (existing.count || 0) + 1;
  if (nextCount >= LOGIN_MAX_ATTEMPTS) {
    loginAttempts.set(key, { count: 0, blockedUntil: now + LOGIN_BLOCK_MS });
    return;
  }

  loginAttempts.set(key, { count: nextCount, blockedUntil: 0 });
};

const getRemainingBlockMinutes = (blockedUntil) => {
  const remainingMs = blockedUntil - Date.now();
  return Math.max(1, Math.ceil(remainingMs / (60 * 1000)));
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_secret_key', {
    expiresIn: '7d',
  });
};

// Register User
const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, role } = req.body;

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered.',
      });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      password,
      role: role === 'doctor' ? 'doctor' : 'patient',
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed.',
      error: error.message,
    });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginKey = getLoginKey(req, email);
    const loginState = loginAttempts.get(loginKey);

    if (loginState?.blockedUntil && loginState.blockedUntil > Date.now()) {
      const remainingMinutes = getRemainingBlockMinutes(loginState.blockedUntil);
      return res.status(429).json({
        success: false,
        message: `Too many login attempts. Try again in ${remainingMinutes} minute(s).`,
      });
    }

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Find user and select password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      registerFailedAttempt(loginKey);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      registerFailedAttempt(loginKey);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    clearLoginAttempt(loginKey);

    // Generate token
    const token = generateToken(user._id);

    user.loginCount = (user.loginCount || 0) + 1;
    user.lastLoginAt = new Date();
    user.lastLoginIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    user.lastLoginUserAgent = req.headers['user-agent'] || '';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        loginCount: user.loginCount,
        lastLoginAt: user.lastLoginAt,
        lastLoginIp: user.lastLoginIp,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed.',
      error: error.message,
    });
  }
};

// Verify Token
const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        loginCount: user.loginCount,
        lastLoginAt: user.lastLoginAt,
        lastLoginIp: user.lastLoginIp,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token verification failed.',
      error: error.message,
    });
  }
};

module.exports = { register, login, verifyToken };
