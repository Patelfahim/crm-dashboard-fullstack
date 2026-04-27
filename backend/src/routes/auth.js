console.log("🔥 AUTH ROUTES LOADED");

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { protect } = require('../middleware/auth');

// 🔐 Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '7d' }
  );
};

// 🚀 LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("📥 Login attempt:", email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    console.log("✅ Match result:", isMatch);

    if (!isMatch) {
      console.log("❌ Password mismatch for user:", email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log("🎉 Login successful for user:", email);

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔐 GET CURRENT USER
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// 🌱 SEED USERS
router.get('/seed', async (req, res) => {
  try {
    console.log("🌱 Seeding users...");

    await User.deleteMany({});

    const usersToSeed = [
      { name: 'Admin User', email: 'admin@crm.com', password: 'Admin@1234', role: 'admin' },
      { name: 'Regular User', email: 'user@crm.com', password: 'User@1234', role: 'user' },
      { name: 'Sales Rep', email: 'sales@crm.com', password: 'Sales@1234', role: 'sales' },
    ];

    for (const u of usersToSeed) {
      await User.create(u);
      console.log(`✅ ${u.role} user created: ${u.email}`);
    }

    res.json({
      message: 'All users seeded successfully',
      users: usersToSeed.map(u => ({ email: u.email, password: u.password, role: u.role }))
    });

  } catch (error) {
    console.error("❌ Seed error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;