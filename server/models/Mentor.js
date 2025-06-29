const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    required: true,
    trim: true
  },
  currentRole: {
    type: String,
    required: true,
    trim: true
  },
  workExperience: {
    type: String,
    required: true
  },
  headline: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  expertise: [{
    type: String,
    trim: true
  }],
  pricing: {
    querySession: {
      type: Number,
      default: 150
    },
    oneOnOneSession: {
      type: Number,
      default: 500
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mentor', mentorSchema);