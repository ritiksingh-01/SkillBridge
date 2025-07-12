const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "https://localhost:5173",
      /^https:\/\/.*\.webcontainer-api\.io$/,
      /^https:\/\/.*\.local-credentialless\.webcontainer-api\.io$/
    ],
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    "https://skill-bridge-sage.vercel.app",
    "http://localhost:5173",
    "https://localhost:5173",
    process.env.CLIENT_URL || "http://localhost:5173",
    /^https:\/\/.*\.webcontainer-api\.io$/,
    /^https:\/\/.*\.local-credentialless\.webcontainer-api\.io$/
  ],
  credentials: true
}));

// Rate limiting (more lenient for development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // increased limit for development
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Make io available to routes
app.set('io', io);

// Database connection with simplified error handling
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ritikrajput4141:3o3A98At8Dehzy8M@cluster0.q0hsrle.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('🔧 Please check:');
    console.error('   1. Your internet connection');
    console.error('   2. MongoDB Atlas credentials');
    console.error('   3. IP whitelist in MongoDB Atlas');
    console.error('   4. Network firewall settings');
    
    // Don't exit in development, keep trying
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

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  // Store user information in socket
  socket.userId = null;

  // Listen for user ID to join their personal room
  socket.on('join-user-room', (userId) => {
    if (userId) {
      socket.userId = userId;
      socket.join(userId);
      console.log(`🔔 User ${userId} joined their notification room`);
    }
  });

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`🏠 User ${socket.id} joined room ${roomId}`);
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`🚪 User ${socket.id} left room ${roomId}`);
  });
  
  socket.on('send-message', (data) => {
    console.log('📤 Message received:', data);
    
    // Broadcast to the room
    socket.to(data.roomId).emit('receive-message', data);
    
    // Also emit to sender for confirmation
    socket.emit('message-sent', data);
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    socket.to(data.roomId).emit('user-typing', {
      userId: socket.userId,
      roomId: data.roomId
    });
  });

  socket.on('typing-stop', (data) => {
    socket.to(data.roomId).emit('user-stop-typing', {
      userId: socket.userId,
      roomId: data.roomId
    });
  });

  // Handle online/offline status
  socket.on('user-online', (userId) => {
    socket.userId = userId;
    socket.broadcast.emit('user-status-change', {
      userId,
      status: 'online'
    });
  });

  socket.on('user-offline', (userId) => {
    socket.broadcast.emit('user-status-change', {
      userId,
      status: 'offline'
    });
  });
  
  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.id);
    
    // Notify others that user is offline
    if (socket.userId) {
      socket.broadcast.emit('user-status-change', {
        userId: socket.userId,
        status: 'offline'
      });
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/mentors', require('./routes/mentors'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications').router);
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reviews', require('./routes/reviews'));

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
      name: mongoose.connection.name || 'Not connected'
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
    error: err.message
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
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Socket.io server ready for connections`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = { app, io };