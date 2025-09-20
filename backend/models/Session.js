const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  request_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorshipRequest',
    required: [true, 'Request ID is required'],
    unique: true
  },
  meeting_link: {
    type: String,
    required: [true, 'Meeting link is required'],
    trim: true
  },
  scheduled_time: {
    type: Date,
    required: [true, 'Scheduled time is required']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['scheduled', 'completed', 'cancelled'],
      message: 'Status must be scheduled, completed, or cancelled'
    },
    default: 'scheduled'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Indexes for better query performance
sessionSchema.index({ request_id: 1 });
sessionSchema.index({ status: 1 });
sessionSchema.index({ scheduled_time: 1 });

module.exports = mongoose.model('Session', sessionSchema);
