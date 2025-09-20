const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
  mentee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: [true, 'Mentee ID is required']
  },
  mentor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: [true, 'Mentor ID is required']
  },
  proposal: {
    type: String,
    required: [true, 'Proposal is required'],
    trim: true,
    maxlength: [2000, 'Proposal cannot exceed 2000 characters']
  },
  preferred_time: {
    type: Date,
    required: [true, 'Preferred time is required']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['pending', 'accepted', 'declined'],
      message: 'Status must be pending, accepted, or declined'
    },
    default: 'pending'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Indexes for better query performance
mentorshipRequestSchema.index({ mentee_id: 1 });
mentorshipRequestSchema.index({ mentor_id: 1 });
mentorshipRequestSchema.index({ status: 1 });
mentorshipRequestSchema.index({ created_at: -1 });

// Prevent duplicate requests from same mentee to same mentor
mentorshipRequestSchema.index({ mentee_id: 1, mentor_id: 1 }, { unique: true });

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
