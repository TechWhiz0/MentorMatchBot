const express = require("express");
const router = express.Router();
const MentorshipRequest = require("../models/MentorshipRequest");
const Profile = require("../models/Profile");
const {
  successResponse,
  errorResponse,
  notFoundResponse,
  forbiddenResponse,
} = require("../utils/response");
const { validateMentorshipRequest } = require("../middleware/validation");
const {
  protect,
  hasProfile,
  isMentee,
  isMentor,
} = require("../middleware/auth");

// @route   POST /api/mentorship/requests
// @desc    Create mentorship request
// @access  Private (Mentees only)
router.post(
  "/requests",
  protect,
  hasProfile,
  isMentee,
  validateMentorshipRequest,
  async (req, res) => {
    try {
      const { mentor_id, proposal, preferred_time } = req.body;

      // Check if mentor exists and is actually a mentor
      const mentor = await Profile.findOne({ _id: mentor_id, role: "mentor" });
      if (!mentor) {
        return notFoundResponse(res, "Mentor not found");
      }

      // Check if request already exists
      const existingRequest = await MentorshipRequest.findOne({
        mentee_id: req.profile._id,
        mentor_id,
      });

      if (existingRequest) {
        return res.status(400).json({
          success: false,
          message: "Mentorship request already exists for this mentor",
        });
      }

      // Create mentorship request
      const request = await MentorshipRequest.create({
        mentee_id: req.profile._id,
        mentor_id,
        proposal,
        preferred_time: new Date(preferred_time),
      });

      // Populate mentor details
      await request.populate("mentor_id", "name");

      // Transform _id to id for frontend compatibility
      const transformedRequest = {
        id: request._id.toString(),
        mentee_id: request.mentee_id.toString(),
        mentor_id: {
          id: request.mentor_id._id.toString(),
          name: request.mentor_id.name
        },
        proposal: request.proposal,
        preferred_time: request.preferred_time,
        status: request.status,
        created_at: request.created_at,
        updated_at: request.updated_at
      };

      successResponse(
        res,
        transformedRequest,
        "Mentorship request created successfully",
        201
      );
    } catch (error) {
      console.error("Create request error:", error);
      errorResponse(res, error, "Failed to create mentorship request");
    }
  }
);

// @route   GET /api/mentorship/requests/me
// @desc    Get current user's mentorship requests
// @access  Private
router.get("/requests/me", protect, hasProfile, async (req, res) => {
  try {
    let requests;

    if (req.profile.role === "mentee") {
      // Get requests sent by mentee
      requests = await MentorshipRequest.find({ mentee_id: req.profile._id })
        .populate("mentor_id", "name industries")
        .sort({ created_at: -1 });
    } else {
      // Get requests received by mentor
      requests = await MentorshipRequest.find({ mentor_id: req.profile._id })
        .populate("mentee_id", "name")
        .sort({ created_at: -1 });
    }

    // Transform _id to id for frontend compatibility
    const transformedRequests = requests.map(request => {
      const baseRequest = {
        id: request._id.toString(),
        mentee_id: request.mentee_id.toString(),
        mentor_id: request.mentor_id.toString(),
        proposal: request.proposal,
        preferred_time: request.preferred_time,
        status: request.status,
        created_at: request.created_at,
        updated_at: request.updated_at
      };

      // Add populated data
      if (request.mentor_id && typeof request.mentor_id === 'object') {
        baseRequest.mentor_id = {
          id: request.mentor_id._id.toString(),
          name: request.mentor_id.name,
          industries: request.mentor_id.industries
        };
      }

      if (request.mentee_id && typeof request.mentee_id === 'object') {
        baseRequest.mentee_id = {
          id: request.mentee_id._id.toString(),
          name: request.mentee_id.name
        };
      }

      return baseRequest;
    });

    successResponse(
      res,
      transformedRequests,
      "Mentorship requests retrieved successfully"
    );
  } catch (error) {
    console.error("Get requests error:", error);
    errorResponse(res, error, "Failed to get mentorship requests");
  }
});

// @route   GET /api/mentorship/requests/:id
// @desc    Get specific mentorship request
// @access  Private
router.get("/requests/:id", protect, hasProfile, async (req, res) => {
  try {
    const request = await MentorshipRequest.findById(req.params.id)
      .populate("mentee_id", "name")
      .populate("mentor_id", "name industries");

    if (!request) {
      return notFoundResponse(res, "Mentorship request not found");
    }

    // Check if user is authorized to view this request
    if (
      request.mentee_id._id.toString() !== req.profile._id.toString() &&
      request.mentor_id._id.toString() !== req.profile._id.toString()
    ) {
      return forbiddenResponse(res, "Not authorized to view this request");
    }

    // Transform _id to id for frontend compatibility
    const transformedRequest = {
      id: request._id.toString(),
      mentee_id: {
        id: request.mentee_id._id.toString(),
        name: request.mentee_id.name
      },
      mentor_id: {
        id: request.mentor_id._id.toString(),
        name: request.mentor_id.name,
        industries: request.mentor_id.industries
      },
      proposal: request.proposal,
      preferred_time: request.preferred_time,
      status: request.status,
      created_at: request.created_at,
      updated_at: request.updated_at
    };

    successResponse(res, transformedRequest, "Mentorship request retrieved successfully");
  } catch (error) {
    console.error("Get request error:", error);
    errorResponse(res, error, "Failed to get mentorship request");
  }
});

// @route   PUT /api/mentorship/requests/:id/accept
// @desc    Accept mentorship request
// @access  Private (Mentors only)
router.put(
  "/requests/:id/accept",
  protect,
  hasProfile,
  isMentor,
  async (req, res) => {
    try {
      const request = await MentorshipRequest.findById(req.params.id);

      if (!request) {
        return notFoundResponse(res, "Mentorship request not found");
      }

      // Check if mentor is authorized to accept this request
      if (request.mentor_id.toString() !== req.profile._id.toString()) {
        return forbiddenResponse(res, "Not authorized to accept this request");
      }

      // Check if request is pending
      if (request.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Request is not pending",
        });
      }

      // Update request status
      request.status = "accepted";
      await request.save();

      // Transform _id to id for frontend compatibility
      const transformedRequest = {
        id: request._id.toString(),
        mentee_id: request.mentee_id.toString(),
        mentor_id: request.mentor_id.toString(),
        proposal: request.proposal,
        preferred_time: request.preferred_time,
        status: request.status,
        created_at: request.created_at,
        updated_at: request.updated_at
      };

      successResponse(res, transformedRequest, "Mentorship request accepted successfully");
    } catch (error) {
      console.error("Accept request error:", error);
      errorResponse(res, error, "Failed to accept mentorship request");
    }
  }
);

// @route   PUT /api/mentorship/requests/:id/decline
// @desc    Decline mentorship request
// @access  Private (Mentors only)
router.put(
  "/requests/:id/decline",
  protect,
  hasProfile,
  isMentor,
  async (req, res) => {
    try {
      const request = await MentorshipRequest.findById(req.params.id);

      if (!request) {
        return notFoundResponse(res, "Mentorship request not found");
      }

      // Check if mentor is authorized to decline this request
      if (request.mentor_id.toString() !== req.profile._id.toString()) {
        return forbiddenResponse(res, "Not authorized to decline this request");
      }

      // Check if request is pending
      if (request.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Request is not pending",
        });
      }

      // Update request status
      request.status = "declined";
      await request.save();

      // Transform _id to id for frontend compatibility
      const transformedRequest = {
        id: request._id.toString(),
        mentee_id: request.mentee_id.toString(),
        mentor_id: request.mentor_id.toString(),
        proposal: request.proposal,
        preferred_time: request.preferred_time,
        status: request.status,
        created_at: request.created_at,
        updated_at: request.updated_at
      };

      successResponse(res, transformedRequest, "Mentorship request declined successfully");
    } catch (error) {
      console.error("Decline request error:", error);
      errorResponse(res, error, "Failed to decline mentorship request");
    }
  }
);

// @route   DELETE /api/mentorship/requests/:id
// @desc    Cancel mentorship request (mentees only)
// @access  Private (Mentees only)
router.delete(
  "/requests/:id",
  protect,
  hasProfile,
  isMentee,
  async (req, res) => {
    try {
      const request = await MentorshipRequest.findById(req.params.id);

      if (!request) {
        return notFoundResponse(res, "Mentorship request not found");
      }

      // Check if mentee is authorized to cancel this request
      if (request.mentee_id.toString() !== req.profile._id.toString()) {
        return forbiddenResponse(res, "Not authorized to cancel this request");
      }

      // Check if request is pending
      if (request.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Cannot cancel non-pending request",
        });
      }

      await request.remove();

      successResponse(res, {}, "Mentorship request cancelled successfully");
    } catch (error) {
      console.error("Cancel request error:", error);
      errorResponse(res, error, "Failed to cancel mentorship request");
    }
  }
);

module.exports = router;
