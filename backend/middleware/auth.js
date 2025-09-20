const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ error: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
};

// Get user profile middleware
const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user_id: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    req.profile = profile;
    next();
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Check if user has profile
const hasProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user_id: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found. Please complete your profile first.' });
    }
    req.profile = profile;
    next();
  } catch (error) {
    console.error('Profile check error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Check if user is mentor
const isMentor = async (req, res, next) => {
  if (req.profile.role !== 'mentor') {
    return res.status(403).json({ error: 'Access denied. Mentor role required.' });
  }
  next();
};

// Check if user is mentee
const isMentee = async (req, res, next) => {
  if (req.profile.role !== 'mentee') {
    return res.status(403).json({ error: 'Access denied. Mentee role required.' });
  }
  next();
};

module.exports = {
  protect,
  getProfile,
  hasProfile,
  isMentor,
  isMentee
};
