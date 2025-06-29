const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ 
        success: false,
        message: 'No token, authorization denied' 
      });
    }

    // For development: handle simple token format
    if (token.startsWith('simple_token_')) {
      const tokenParts = token.split('_');
      if (tokenParts.length >= 3) {
        const userId = tokenParts[2];
        
        console.log('👤 Looking for user:', userId);
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
          console.log('❌ User not found for token');
          return res.status(401).json({ 
            success: false,
            message: 'Token is not valid' 
          });
        }

        console.log('✅ User authenticated:', user.email);
        req.user = user;
        return next();
      }
    }

    // Handle JWT tokens
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      console.log('👤 JWT decoded for user:', decoded.id);
      
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('❌ User not found for JWT');
        return res.status(401).json({ 
          success: false,
          message: 'Token is not valid' 
        });
      }

      console.log('✅ User authenticated via JWT:', user.email);
      req.user = user;
      next();
    } catch (jwtError) {
      console.log('❌ JWT verification failed:', jwtError.message);
      return res.status(401).json({ 
        success: false,
        message: 'Token is not valid' 
      });
    }
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Server error in authentication' 
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }

    next();
  };
};

module.exports = { auth, authorize };