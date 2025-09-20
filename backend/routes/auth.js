const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Profile = require('../models/Profile');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse, unauthorizedResponse } = require('../utils/response');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    successResponse(res, {
      user: {
        id: user._id,
        email: user.email
      },
      token
    }, 'User registered successfully', 201);

  } catch (error) {
    console.error('Registration error:', error);
    errorResponse(res, error, 'Registration failed');
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return unauthorizedResponse(res, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return unauthorizedResponse(res, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(user._id);

    // Get user profile if exists
    const profile = await Profile.findOne({ user_id: user._id });

    successResponse(res, {
      user: {
        id: user._id,
        email: user.email
      },
      profile,
      token
    }, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    errorResponse(res, error, 'Login failed');
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user_id: req.user._id });

    successResponse(res, {
      user: {
        id: req.user._id,
        email: req.user.email
      },
      profile
    }, 'User data retrieved successfully');

  } catch (error) {
    console.error('Get user error:', error);
    errorResponse(res, error, 'Failed to get user data');
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', protect, (req, res) => {
  successResponse(res, {}, 'Logged out successfully');
});

module.exports = router;
