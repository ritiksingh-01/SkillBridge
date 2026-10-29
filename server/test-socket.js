const io = require('socket.io-client');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'skillbridge_dev_jwt_secret_key_1234567890';
const testToken = jwt.sign({ id: 'test-user-123', role: 'mentee' }, JWT_SECRET);

// Test socket connection with authenticated handshake (C4)
const testSocketConnection = () => {
  console.log('🧪 Testing Socket.io Connection with JWT Auth...');
  
  const socket = io('http://localhost:5000', {
    auth: { token: testToken },
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('✅ Connected to server with ID:', socket.id);
    
    // Test joining user room
    socket.emit('join-user-room', 'test-user-123');
    
    // Test joining a chat room
    socket.emit('join-room', 'test-room-456');
    
    // Test sending a message
    setTimeout(() => {
      socket.emit('send-message', {
        roomId: 'test-room-456',
        sender: 'test-user-123',
        receiver: 'test-user-456',
        content: 'Hello from authenticated test client!',
        timestamp: new Date()
      });
    }, 1000);
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from server');
  });

  socket.on('connect_error', (error) => {
    console.error('🔌 Connection error:', error.message);
  });

  socket.on('receive-message', (data) => {
    console.log('📨 Received message:', data);
  });

  socket.on('new-notification', (data) => {
    console.log('🔔 Received notification:', data);
  });

  // Cleanup after 5 seconds
  setTimeout(() => {
    console.log('🧹 Cleaning up test connection...');
    socket.disconnect();
    process.exit(0);
  }, 5000);
};

// Test API endpoints
const testAPIEndpoints = async () => {
  console.log('🧪 Testing API Endpoints...');
  
  const baseURL = 'http://localhost:5000/api';
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${baseURL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test database connection
    const dbResponse = await fetch(`${baseURL}/test-db`);
    const dbData = await dbResponse.json();
    console.log('✅ Database test:', dbData);
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
};

// Run tests
const runTests = async () => {
  console.log('🚀 Starting SkillBridge Real-time Tests...\n');
  
  // Test API first
  await testAPIEndpoints();
  console.log('');
  
  // Then test socket connection
  testSocketConnection();
};

// Run if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testSocketConnection, testAPIEndpoints }; 
