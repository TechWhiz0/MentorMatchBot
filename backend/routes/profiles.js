const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const {
  successResponse,
  errorResponse,
  notFoundResponse,
} = require("../utils/response");
const { validateProfile } = require("../middleware/validation");
const { protect, hasProfile, isMentor } = require("../middleware/auth");

// @route   POST /api/profiles
// @desc    Create user profile
// @access  Private
router.post("/", protect, validateProfile, async (req, res) => {
  try {
    const { name, role, industries, about } = req.body;

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ user_id: req.user._id });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
    }

    // Create profile
    const profile = await Profile.create({
      user_id: req.user._id,
      name,
      role,
      industries: role === "mentor" ? industries : [],
      about,
    });

    // Transform _id to id for frontend compatibility
    const transformedProfile = {
      id: profile._id.toString(),
      user_id: profile.user_id.toString(),
      name: profile.name,
      role: profile.role,
      industries: profile.industries,
      about: profile.about,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };

    successResponse(
      res,
      transformedProfile,
      "Profile created successfully",
      201
    );
  } catch (error) {
    console.error("Profile creation error:", error);
    errorResponse(res, error, "Profile creation failed");
  }
});

// @route   GET /api/profiles/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", protect, hasProfile, async (req, res) => {
  try {
    // Transform _id to id for frontend compatibility
    const transformedProfile = {
      id: req.profile._id.toString(),
      user_id: req.profile.user_id.toString(),
      name: req.profile.name,
      role: req.profile.role,
      industries: req.profile.industries,
      about: req.profile.about,
      created_at: req.profile.created_at,
      updated_at: req.profile.updated_at,
    };

    successResponse(res, transformedProfile, "Profile retrieved successfully");
  } catch (error) {
    console.error("Get profile error:", error);
    errorResponse(res, error, "Failed to get profile");
  }
});

// @route   PUT /api/profiles/me
// @desc    Update current user's profile
// @access  Private
router.put("/me", protect, hasProfile, validateProfile, async (req, res) => {
  try {
    const { name, role, industries, about } = req.body;

    // Update profile
    const updatedProfile = await Profile.findByIdAndUpdate(
      req.profile._id,
      {
        name,
        role,
        industries: role === "mentor" ? industries : [],
        about,
      },
      { new: true, runValidators: true }
    );

    // Transform _id to id for frontend compatibility
    const transformedProfile = {
      id: updatedProfile._id.toString(),
      user_id: updatedProfile.user_id.toString(),
      name: updatedProfile.name,
      role: updatedProfile.role,
      industries: updatedProfile.industries,
      about: updatedProfile.about,
      created_at: updatedProfile.created_at,
      updated_at: updatedProfile.updated_at,
    };

    successResponse(res, transformedProfile, "Profile updated successfully");
  } catch (error) {
    console.error("Profile update error:", error);
    errorResponse(res, error, "Profile update failed");
  }
});

// @route   GET /api/profiles/mentors
// @desc    Get all mentors
// @access  Public
router.get("/mentors", async (req, res) => {
  try {
    const mentors = await Profile.find({ role: "mentor" })
      .select("_id name industries created_at")
      .sort({ created_at: -1 });

    // Transform _id to id for frontend compatibility
    const transformedMentors = mentors.map((mentor) => ({
      id: mentor._id.toString(),
      name: mentor.name,
      industries: mentor.industries,
      created_at: mentor.created_at,
    }));

    successResponse(res, transformedMentors, "Mentors retrieved successfully");
  } catch (error) {
    console.error("Get mentors error:", error);
    errorResponse(res, error, "Failed to get mentors");
  }
});

// @route   GET /api/profiles/mentors/:id
// @desc    Get specific mentor profile
// @access  Public
router.get("/mentors/:id", async (req, res) => {
  try {
    const mentor = await Profile.findOne({
      _id: req.params.id,
      role: "mentor",
    }).select("_id name industries created_at");

    if (!mentor) {
      return notFoundResponse(res, "Mentor not found");
    }

    // Transform _id to id for frontend compatibility
    const transformedMentor = {
      id: mentor._id.toString(),
      name: mentor.name,
      industries: mentor.industries,
      created_at: mentor.created_at,
    };

    successResponse(
      res,
      transformedMentor,
      "Mentor profile retrieved successfully"
    );
  } catch (error) {
    console.error("Get mentor error:", error);
    errorResponse(res, error, "Failed to get mentor profile");
  }
});

// @route   GET /api/profiles/mentees
// @desc    Get all mentees (mentors only)
// @access  Private
router.get("/mentees", protect, hasProfile, isMentor, async (req, res) => {
  try {
    const mentees = await Profile.find({ role: "mentee" })
      .select("name created_at")
      .sort({ created_at: -1 });

    successResponse(res, mentees, "Mentees retrieved successfully");
  } catch (error) {
    console.error("Get mentees error:", error);
    errorResponse(res, error, "Failed to get mentees");
  }
});

// @route   GET /api/profiles/:id
// @desc    Get profile by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).select(
      "_id name role industries created_at"
    );

    if (!profile) {
      return notFoundResponse(res, "Profile not found");
    }

    // Transform _id to id for frontend compatibility
    const transformedProfile = {
      id: profile._id.toString(),
      name: profile.name,
      role: profile.role,
      industries: profile.industries,
      created_at: profile.created_at,
    };

    successResponse(res, transformedProfile, "Profile retrieved successfully");
  } catch (error) {
    console.error("Get profile error:", error);
    errorResponse(res, error, "Failed to get profile");
  }
});

module.exports = router;
