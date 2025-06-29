const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    console.log('📍 Database URL:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📡 Ready State: ${conn.connection.readyState}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('🔧 Please check:');
    console.error('   1. Your internet connection');
    console.error('   2. MongoDB Atlas credentials');
    console.error('   3. IP whitelist in MongoDB Atlas');
    console.error('   4. Network firewall settings');
    
    // Retry connection after 5 seconds
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Connect to database
connectDB();

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected from MongoDB Atlas');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/mentors', require('./routes/mentors'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  res.status(200).json({ 
    status: 'OK', 
    message: 'SkillBridge API is running',
    timestamp: new Date().toISOString(),
    database: {
      status: states[dbState],
      name: mongoose.connection.name || 'Not connected',
      host: mongoose.connection.host || 'Unknown'
    }
  });
});

// Test database endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting'
    };
    
    if (dbState !== 1) {
      return res.status(500).json({
        status: 'error',
        message: 'Database not connected',
        database: {
          state: states[dbState]
        }
      });
    }
    
    // Test database operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    res.json({
      status: 'success',
      message: 'Database connection test successful',
      database: {
        state: states[dbState],
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        collections: collections.map(c => c.name)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection test failed',
      error: error.message
    });
  }
});

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.message);
  console.error('🚨 Stack:', err.stack);
  
  // MongoDB specific errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      message: 'Validation Error',
      errors
    });
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${field} already exists`
    });
  }
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/test',
      'GET /api/test-db',
      'POST /api/auth/register',
      'POST /api/auth/login'
    ]
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
  console.log(`💾 Test DB: http://localhost:${PORT}/api/test-db`);
  console.log(`📱 Frontend URL: ${process.env.CLIENT_URL}`);
});

module.exports = app;