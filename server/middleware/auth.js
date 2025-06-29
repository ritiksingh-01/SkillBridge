const User = require('../models/User');

// Simplified auth middleware (no JWT for now)
const auth = async (req, res, next) => {
  try {
    // For development, we'll use a simple token system
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Extract user ID from simple token
    const tokenParts = token.split('_');
    if (tokenParts.length >= 3 && tokenParts[0] === 'simple' && tokenParts[1] === 'token') {
      const userId = tokenParts[2];
      
      console.log('👤 Looking for user:', userId);
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        console.log('❌ User not found for token');
        return res.status(401).json({ message: 'Token is not valid' });
      }

      console.log('✅ User authenticated:', user.email);
      req.user = user;
      next();
    } else {
      console.log('❌ Invalid token format');
      return res.status(401).json({ message: 'Invalid token format' });
    }
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;