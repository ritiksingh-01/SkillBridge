import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const ENDPOINT = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    const socket = io(ENDPOINT, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      auth: {
        token: token || undefined
      }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionError(null);

      // Join user notification room using normalized id (F5)
      try {
        const rawUser = localStorage.getItem('user');
        if (rawUser) {
          const user = JSON.parse(rawUser);
          if (user?.id === 'temp_user' || user?.email === 'test@example.com') {
            return;
          }
          const userId = user._id || user.id;
          if (userId) {
            socket.emit('join-user-room', userId);
          }
        }
      } catch {
        // Ignore parse error
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      setConnectionError(error.message);
      setIsConnected(false);
    });

    socket.on('reconnect', () => {
      setIsConnected(true);
      setConnectionError(null);

      try {
        const rawUser = localStorage.getItem('user');
        if (rawUser) {
          const user = JSON.parse(rawUser);
          if (user?.id === 'temp_user' || user?.email === 'test@example.com') {
            return;
          }
          const userId = user._id || user.id;
          if (userId) {
            socket.emit('join-user-room', userId);
          }
        }
      } catch {
        // Ignore
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const joinUserRoom = useCallback((userId) => {
    if (socketRef.current && userId) {
      socketRef.current.emit('join-user-room', userId);
    }
  }, []);

  const joinRoom = useCallback((roomId) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('join-room', roomId);
    }
  }, []);

  const leaveRoom = useCallback((roomId) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('leave-room', roomId);
    }
  }, []);

  const sendMessage = useCallback((messageData) => {
    if (socketRef.current && messageData) {
      socketRef.current.emit('send-message', messageData);
    }
  }, []);

  const contextValue = {
    socket: socketRef.current,
    isConnected,
    connectionError,
    joinUserRoom,
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
