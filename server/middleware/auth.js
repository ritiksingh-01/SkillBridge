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

    try {
      // Try JWT first
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('👤 JWT decoded:', decoded.id);
      
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('❌ User not found for JWT token');
        return res.status(401).json({ 
          success: false,
          message: 'Token is not valid' 
        });
      }

      console.log('✅ User authenticated via JWT:', user.email);
      req.user = user;
      next();
      
    } catch (jwtError) {
      // Fallback to simple token for development
      console.log('🔄 JWT failed, trying simple token...');
      
      const tokenParts = token.split('_');
      if (tokenParts.length >= 3 && tokenParts[0] === 'simple' && tokenParts[1] === 'token') {
        const userId = tokenParts[2];
        
        console.log('👤 Looking for user with simple token:', userId);
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
          console.log('❌ User not found for simple token');
          return res.status(401).json({ 
            success: false,
            message: 'Token is not valid' 
          });
        }

        console.log('✅ User authenticated via simple token:', user.email);
        req.user = user;
        next();
      } else {
        console.log('❌ Invalid token format');
        return res.status(401).json({ 
          success: false,
          message: 'Invalid token format' 
        });
      }
    }
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
};

module.exports = auth;