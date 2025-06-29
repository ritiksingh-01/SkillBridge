const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  type: {
    type: String,
    enum: ['query', 'one-on-one', 'group'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  scheduledAt: {
    type: Date,
    required: function() {
      return this.type !== 'query';
    }
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  meetingLink: {
    type: String
  },
  meetingType: {
    type: String,
    enum: ['video', 'audio', 'chat'],
    default: 'video'
  },
  price: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
  notes: {
    menteeNotes: String,
    mentorNotes: String,
    sessionSummary: String
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: { type: Date, default: Date.now }
  }],
  feedback: {
    menteeRating: {
      type: Number,
      min: 1,
      max: 5
    },
    mentorRating: {
      type: Number,
      min: 1,
      max: 5
    },
    menteeReview: String,
    mentorReview: String,
    feedbackDate: Date
  },
  actualStartTime: Date,
  actualEndTime: Date,
  cancellationReason: String,
  rescheduledFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  }
}, {
  timestamps: true
});

// Index for efficient queries
sessionSchema.index({ mentee: 1, status: 1 });
sessionSchema.index({ mentor: 1, status: 1 });
sessionSchema.index({ scheduledAt: 1 });

// Calculate session duration
sessionSchema.methods.getActualDuration = function() {
  if (this.actualStartTime && this.actualEndTime) {
    return Math.round((this.actualEndTime - this.actualStartTime) / (1000 * 60));
  }
  return this.duration;
};

module.exports = mongoose.model('Session', sessionSchema);