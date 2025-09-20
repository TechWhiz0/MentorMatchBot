const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const MentorshipRequest = require('../models/MentorshipRequest');
const { successResponse, errorResponse, notFoundResponse, forbiddenResponse } = require('../utils/response');
const { validateSession } = require('../middleware/validation');
const { protect, hasProfile, isMentor } = require('../middleware/auth');

// @route   POST /api/sessions
// @desc    Create session with meeting link
// @access  Private (Mentors only)
router.post('/', protect, hasProfile, isMentor, validateSession, async (req, res) => {
  try {
    const { request_id, meeting_link, scheduled_time } = req.body;

    // Check if mentorship request exists and is accepted
    const request = await MentorshipRequest.findById(request_id);
    if (!request) {
      return notFoundResponse(res, 'Mentorship request not found');
    }

    if (request.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Mentorship request must be accepted before creating a session'
      });
    }

    // Check if mentor is authorized to create session for this request
    if (request.mentor_id.toString() !== req.profile._id.toString()) {
      return forbiddenResponse(res, 'Not authorized to create session for this request');
    }

    // Check if session already exists
    const existingSession = await Session.findOne({ request_id });
    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: 'Session already exists for this request'
      });
    }

    // Create session
    const session = await Session.create({
      request_id,
      meeting_link,
      scheduled_time: new Date(scheduled_time)
    });

    // Populate request details
    await session.populate({
      path: 'request_id',
      populate: [
        { path: 'mentee_id', select: 'name' },
        { path: 'mentor_id', select: 'name' }
      ]
    });

    // Transform _id to id for frontend compatibility
    const transformedSession = {
      id: session._id.toString(),
      request_id: {
        id: session.request_id._id.toString(),
        mentee_id: {
          id: session.request_id.mentee_id._id.toString(),
          name: session.request_id.mentee_id.name
        },
        mentor_id: {
          id: session.request_id.mentor_id._id.toString(),
          name: session.request_id.mentor_id.name
        }
      },
      meeting_link: session.meeting_link,
      scheduled_time: session.scheduled_time,
      status: session.status,
      created_at: session.created_at,
      updated_at: session.updated_at
    };

    successResponse(res, transformedSession, 'Session created successfully', 201);

  } catch (error) {
    console.error('Create session error:', error);
    errorResponse(res, error, 'Failed to create session');
  }
});

// @route   GET /api/sessions/me
// @desc    Get current user's sessions
// @access  Private
router.get('/me', protect, hasProfile, async (req, res) => {
  try {
    let sessions;

    if (req.profile.role === 'mentee') {
      // Get sessions where user is mentee
      sessions = await Session.find()
        .populate({
          path: 'request_id',
          match: { mentee_id: req.profile._id },
          populate: [
            { path: 'mentee_id', select: 'name' },
            { path: 'mentor_id', select: 'name industries' }
          ]
        })
        .sort({ scheduled_time: -1 });

      // Filter out sessions where request doesn't match (due to populate match)
      sessions = sessions.filter(session => session.request_id);
    } else {
      // Get sessions where user is mentor
      sessions = await Session.find()
        .populate({
          path: 'request_id',
          match: { mentor_id: req.profile._id },
          populate: [
            { path: 'mentee_id', select: 'name' },
            { path: 'mentor_id', select: 'name' }
          ]
        })
        .sort({ scheduled_time: -1 });

      // Filter out sessions where request doesn't match (due to populate match)
      sessions = sessions.filter(session => session.request_id);
    }

    // Transform _id to id for frontend compatibility
    const transformedSessions = sessions.map(session => ({
      id: session._id.toString(),
      request_id: {
        id: session.request_id._id.toString(),
        mentee_id: {
          id: session.request_id.mentee_id._id.toString(),
          name: session.request_id.mentee_id.name
        },
        mentor_id: {
          id: session.request_id.mentor_id._id.toString(),
          name: session.request_id.mentor_id.name,
          industries: session.request_id.mentor_id.industries
        }
      },
      meeting_link: session.meeting_link,
      scheduled_time: session.scheduled_time,
      status: session.status,
      created_at: session.created_at,
      updated_at: session.updated_at
    }));

    successResponse(res, transformedSessions, 'Sessions retrieved successfully');

  } catch (error) {
    console.error('Get sessions error:', error);
    errorResponse(res, error, 'Failed to get sessions');
  }
});

// @route   GET /api/sessions/:id
// @desc    Get specific session
// @access  Private
router.get('/:id', protect, hasProfile, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate({
        path: 'request_id',
        populate: [
          { path: 'mentee_id', select: 'name' },
          { path: 'mentor_id', select: 'name industries' }
        ]
      });

    if (!session) {
      return notFoundResponse(res, 'Session not found');
    }

    // Check if user is authorized to view this session
    const request = session.request_id;
    if (request.mentee_id._id.toString() !== req.profile._id.toString() && 
        request.mentor_id._id.toString() !== req.profile._id.toString()) {
      return forbiddenResponse(res, 'Not authorized to view this session');
    }

    // Transform _id to id for frontend compatibility
    const transformedSession = {
      id: session._id.toString(),
      request_id: {
        id: session.request_id._id.toString(),
        mentee_id: {
          id: session.request_id.mentee_id._id.toString(),
          name: session.request_id.mentee_id.name
        },
        mentor_id: {
          id: session.request_id.mentor_id._id.toString(),
          name: session.request_id.mentor_id.name,
          industries: session.request_id.mentor_id.industries
        }
      },
      meeting_link: session.meeting_link,
      scheduled_time: session.scheduled_time,
      status: session.status,
      created_at: session.created_at,
      updated_at: session.updated_at
    };

    successResponse(res, transformedSession, 'Session retrieved successfully');

  } catch (error) {
    console.error('Get session error:', error);
    errorResponse(res, error, 'Failed to get session');
  }
});

// @route   PUT /api/sessions/:id
// @desc    Update session
// @access  Private (Mentors only)
router.put('/:id', protect, hasProfile, isMentor, validateSession, async (req, res) => {
  try {
    const { meeting_link, scheduled_time } = req.body;

    const session = await Session.findById(req.params.id)
      .populate('request_id');

    if (!session) {
      return notFoundResponse(res, 'Session not found');
    }

    // Check if mentor is authorized to update this session
    if (session.request_id.mentor_id.toString() !== req.profile._id.toString()) {
      return forbiddenResponse(res, 'Not authorized to update this session');
    }

    // Update session
    session.meeting_link = meeting_link;
    session.scheduled_time = new Date(scheduled_time);
    await session.save();

    // Populate request details
    await session.populate({
      path: 'request_id',
      populate: [
        { path: 'mentee_id', select: 'name' },
        { path: 'mentor_id', select: 'name' }
      ]
    });

    // Transform _id to id for frontend compatibility
    const transformedSession = {
      id: session._id.toString(),
      request_id: {
        id: session.request_id._id.toString(),
        mentee_id: {
          id: session.request_id.mentee_id._id.toString(),
          name: session.request_id.mentee_id.name
        },
        mentor_id: {
          id: session.request_id.mentor_id._id.toString(),
          name: session.request_id.mentor_id.name
        }
      },
      meeting_link: session.meeting_link,
      scheduled_time: session.scheduled_time,
      status: session.status,
      created_at: session.created_at,
      updated_at: session.updated_at
    };

    successResponse(res, transformedSession, 'Session updated successfully');

  } catch (error) {
    console.error('Update session error:', error);
    errorResponse(res, error, 'Failed to update session');
  }
});

// @route   PUT /api/sessions/:id/status
// @desc    Update session status
// @access  Private
router.put('/:id/status', protect, hasProfile, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be scheduled, completed, or cancelled'
      });
    }

    const session = await Session.findById(req.params.id)
      .populate('request_id');

    if (!session) {
      return notFoundResponse(res, 'Session not found');
    }

    // Check if user is authorized to update this session
    const request = session.request_id;
    if (request.mentee_id.toString() !== req.profile._id.toString() && 
        request.mentor_id.toString() !== req.profile._id.toString()) {
      return forbiddenResponse(res, 'Not authorized to update this session');
    }

    // Update session status
    session.status = status;
    await session.save();

    // Transform _id to id for frontend compatibility
    const transformedSession = {
      id: session._id.toString(),
      request_id: session.request_id.toString(),
      meeting_link: session.meeting_link,
      scheduled_time: session.scheduled_time,
      status: session.status,
      created_at: session.created_at,
      updated_at: session.updated_at
    };

    successResponse(res, transformedSession, 'Session status updated successfully');

  } catch (error) {
    console.error('Update session status error:', error);
    errorResponse(res, error, 'Failed to update session status');
  }
});

// @route   DELETE /api/sessions/:id
// @desc    Delete session
// @access  Private (Mentors only)
router.delete('/:id', protect, hasProfile, isMentor, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('request_id');

    if (!session) {
      return notFoundResponse(res, 'Session not found');
    }

    // Check if mentor is authorized to delete this session
    if (session.request_id.mentor_id.toString() !== req.profile._id.toString()) {
      return forbiddenResponse(res, 'Not authorized to delete this session');
    }

    await session.remove();

    successResponse(res, {}, 'Session deleted successfully');

  } catch (error) {
    console.error('Delete session error:', error);
    errorResponse(res, error, 'Failed to delete session');
  }
});

module.exports = router;
