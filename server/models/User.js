const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  profileImage: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    trim: true
  },
  about: {
    type: String,
    maxlength: 1000
  },
  skills: [{
    type: String,
    trim: true
  }],
  education: [{
    school: String,
    degree: String,
    year: String,
    grade: String
  }],
  experience: [{
    company: String,
    position: String,
    duration: String,
    location: String,
    description: String
  }],
  socialLinks: {
    linkedin: String,
    github: String,
    website: String,
    twitter: String
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    privacy: {
      profileVisibility: { type: String, enum: ['public', 'private'], default: 'public' },
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

// Index for search functionality
userSchema.index({ firstName: 'text', lastName: 'text', skills: 'text' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Calculate profile completion percentage
userSchema.methods.getProfileCompletion = function() {
  let completed = 0;
  const total = 8;
  
  if (this.about) completed++;
  if (this.skills.length > 0) completed++;
  if (this.education.length > 0) completed++;
  if (this.experience.length > 0) completed++;
  if (this.phone) completed++;
  if (this.location) completed++;
  if (this.socialLinks.linkedin || this.socialLinks.github || this.socialLinks.website) completed++;
  completed++; // Basic info always present
  
  return Math.round((completed / total) * 100);
};

module.exports = mongoose.model('User', userSchema);