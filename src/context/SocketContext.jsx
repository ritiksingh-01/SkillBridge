import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    // Use VITE_API_URL or fallback to localhost
    const ENDPOINT = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    
    console.log('🔌 Connecting to socket server:', ENDPOINT);
    
    socketRef.current = io(ENDPOINT, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    // Connection event handlers
    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected:', socketRef.current.id);
      setIsConnected(true);
      setConnectionError(null);
      
      // Join user notification room if user is logged in
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user._id) {
        console.log('🔔 Joining user room:', user._id);
        socketRef.current.emit('join-user-room', user._id);
      }
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    socketRef.current.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      setConnectionError(null);
      
      // Re-join user room after reconnection
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user._id) {
        socketRef.current.emit('join-user-room', user._id);
      }
    });

    socketRef.current.on('reconnect_error', (error) => {
      console.error('🔄 Socket reconnection error:', error);
      setConnectionError(error.message);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        console.log('🧹 Cleaning up socket connection');
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Function to manually join a room
  const joinRoom = (roomId) => {
    if (socketRef.current && isConnected) {
      console.log('🏠 Joining room:', roomId);
      socketRef.current.emit('join-room', roomId);
    }
  };

  // Function to leave a room
  const leaveRoom = (roomId) => {
    if (socketRef.current && isConnected) {
      console.log('🚪 Leaving room:', roomId);
      socketRef.current.emit('leave-room', roomId);
    }
  };

  // Function to send a message
  const sendMessage = (messageData) => {
    if (socketRef.current && isConnected) {
      console.log('📤 Sending message:', messageData);
      socketRef.current.emit('send-message', messageData);
    } else {
      console.error('❌ Cannot send message: socket not connected');
    }
  };

  const contextValue = {
    socket: socketRef.current,
    isConnected,
    connectionError,
    joinRoom,
    leaveRoom,
    sendMessage,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}; 