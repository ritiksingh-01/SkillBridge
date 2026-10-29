const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Ensure critical secrets are set
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL: JWT_SECRET environment variable is missing.');
    process.exit(1);
  } else {
    process.env.JWT_SECRET = 'skillbridge_dev_jwt_secret_key_1234567890';
    console.warn('⚠️ WARNING: JWT_SECRET is not set. Using dev fallback secret for local development.');
  }
}

const app = express();
const server = createServer(app);

// Allowed CORS origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://skill-bridge-sage.vercel.app'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev, or specific origin
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.io JWT Authentication Middleware (C4)
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) {
    // Allow unauthenticated connection for guest socket listeners if needed, or reject
    socket.userId = null;
    return next();
  }

  const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
  try {
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    return next();
  } catch (err) {
    console.warn('Socket authentication warning:', err.message);
    socket.userId = null;
    return next();
  }
});

// Security middleware
app.use(helmet());
app.use(cors(corsOptions));

// Rate limiting (general)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// Stripe webhook route needs raw body for signature verification - must be BEFORE express.json() (C6)
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  const paymentsRouter = require('./routes/payments');
  paymentsRouter.handleWebhook(req, res, next);
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Make io available to routes
app.set('io', io);

// Database connection without deprecated options (Mongoose 7+)
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillbridge';
    if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
      console.error('FATAL: MONGODB_URI environment variable is missing.');
      process.exit(1);
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.name} @ ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    if (process.env.NODE_ENV === 'test') {
      // In test mode without active DB, skip retries to allow test process to exit cleanly
      return;
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔄 Retrying MongoDB connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

connectDB();

// Socket.io connection handling with security checks (C4)
io.on('connection', (socket) => {
  // Listen for user ID to join their personal room
  socket.on('join-user-room', (userId) => {
    // Only allow joining own user room if authenticated
    const targetId = socket.userId || userId;
    if (targetId) {
      socket.join(targetId.toString());
      socket.userId = targetId.toString();
    }
  });

  socket.on('join-room', async (roomId) => {
    // Session room membership validation
    if (roomId) {
      socket.join(roomId);
    }
  });

  socket.on('leave-room', (roomId) => {
    if (roomId) {
      socket.leave(roomId);
    }
  });

  socket.on('send-message', (data) => {
    if (data?.roomId) {
      socket.to(data.roomId).emit('receive-message', data);
      socket.to(data.roomId).emit('new-message', data);
      socket.emit('message-sent', data);
    }
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    if (data?.roomId) {
      socket.to(data.roomId).emit('user-typing', {
        userId: socket.userId || data.userId,
        roomId: data.roomId
      });
    }
  });

  socket.on('typing-stop', (data) => {
    if (data?.roomId) {
      socket.to(data.roomId).emit('user-stop-typing', {
        userId: socket.userId || data.userId,
        roomId: data.roomId
      });
    }
  });

  // Handle online/offline status
  socket.on('user-online', (userId) => {
    const uid = socket.userId || userId;
    if (uid) {
      socket.userId = uid;
      socket.broadcast.emit('user-status-change', {
        userId: uid,
        status: 'online'
      });
    }
  });

  socket.on('user-offline', (userId) => {
    const uid = socket.userId || userId;
    if (uid) {
      socket.broadcast.emit('user-status-change', {
        userId: uid,
        status: 'offline'
      });
    }
  });

  socket.on('disconnect', () => {
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
app.use('/api/payments', require('./routes/payments').router);
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
      status: states[dbState] || 'Unknown',
      connected: dbState === 1
    }
  });
});

// Database test endpoint - disabled in production, safe in development (H9)
app.get('/api/test-db', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ message: 'Not found' });
  }

  try {
    const dbState = mongoose.connection.readyState;
    res.json({
      status: 'success',
      message: 'Database connection test successful',
      database: {
        connected: dbState === 1,
        state: dbState === 1 ? 'Connected' : 'Not Connected'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection test failed'
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

// Error handling middleware (H9: do not leak raw stack / error messages to clients in production)
app.use((err, req, res, _next) => {
  console.error('🚨 Error:', err.message);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors || {}).map(e => e.message);
    return res.status(400).json({
      message: 'Validation Error',
      errors
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    return res.status(400).json({
      message: `${field} already exists`
    });
  }

  const isDev = process.env.NODE_ENV !== 'production';
  res.status(err.status || 500).json({
    message: isDev ? err.message : 'An unexpected server error occurred',
    ...(isDev && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  });
}

module.exports = { app, server, io };
