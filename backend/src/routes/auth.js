const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '7d'
  });
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Return token + user data
    res.json({
      success: true,
      token: generateToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// @route   GET /api/auth/me
// @desc    Get logged-in user info
// @access  Private
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar
    }
  });
});

// @route   POST /api/auth/seed
// @desc    Seed a demo user (run once)
// @access  Public
router.post('/seed', async (req, res) => {
  try {
    const existing = await User.findOne({ where: { email: 'demo@crm.com' } });
    if (existing) {
      return res.json({ message: 'Demo user already exists. Use demo@crm.com / Demo@1234' });
    }

    await User.create({
      name: 'Alex Morgan',
      email: 'demo@crm.com',
      password: 'Demo@1234',
      role: 'admin'
    });

    res.status(201).json({
      message: 'Demo user created!',
      credentials: { email: 'demo@crm.com', password: 'Demo@1234' }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
