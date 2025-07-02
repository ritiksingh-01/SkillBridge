import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef();

  useEffect(() => {
    // Use VITE_API_URL or fallback to localhost
    const ENDPOINT = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    socketRef.current = io(ENDPOINT, {
      withCredentials: true,
      transports: ['websocket'],
    });

    // Join user notification room if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user._id) {
      socketRef.current.emit('join-user-room', user._id);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}; 