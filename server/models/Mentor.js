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
    required: true,
    maxlength: 200
  },
  bio: {
    type: String,
    required: true,
    maxlength: 1000
  },
  expertise: [{
    type: String,
    trim: true
  }],
  categories: [{
    type: String,
    enum: ['Technology', 'Business', 'Design', 'Marketing', 'Finance', 'Leadership', 'Product', 'Engineering', 'Data', 'AI', 'Cloud', 'Security']
  }],
  pricing: {
    querySession: {
      type: Number,
      default: 150
    },
    oneOnOneSession: {
      type: Number,
      default: 500
    },
    packageDeals: [{
      sessions: Number,
      price: Number,
      description: String
    }]
  },
  availability: {
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    schedule: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      slots: [{
        startTime: String,
        endTime: String,
        isAvailable: { type: Boolean, default: true }
      }]
    }]
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
  stats: {
    totalSessions: {
      type: Number,
      default: 0
    },
    totalMentees: {
      type: Number,
      default: 0
    },
    responseTime: {
      type: String,
      default: '~2 hours'
    },
    completionRate: {
      type: Number,
      default: 100
    }
  },
  badges: [{
    name: String,
    description: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  resume: {
    filename: String,
    url: String,
    uploadedAt: Date
  }
}, {
  timestamps: true
});

// Index for search and filtering
mentorSchema.index({ expertise: 'text', categories: 1, 'rating.average': -1 });
mentorSchema.index({ isActive: 1, isVerified: 1 });

// Calculate mentor score for ranking
mentorSchema.methods.calculateScore = function() {
  const ratingWeight = 0.4;
  const sessionWeight = 0.3;
  const responseWeight = 0.2;
  const completionWeight = 0.1;
  
  const ratingScore = (this.rating.average / 5) * 100;
  const sessionScore = Math.min(this.stats.totalSessions / 50, 1) * 100;
  const responseScore = this.stats.responseTime.includes('1') ? 100 : 
                       this.stats.responseTime.includes('2') ? 80 : 60;
  const completionScore = this.stats.completionRate;
  
  return (ratingScore * ratingWeight) + 
         (sessionScore * sessionWeight) + 
         (responseScore * responseWeight) + 
         (completionScore * completionWeight);
};

module.exports = mongoose.model('Mentor', mentorSchema);