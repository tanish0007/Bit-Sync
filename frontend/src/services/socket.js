// src/services/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8080';

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  withCredentials: true,
});

// Connection manager
export const connectSocket = (roomId = null, userId = null) => {
  if (!socket.connected) {
    socket.connect();
    if (roomId) {
      socket.emit('join-room', { roomId, userId });
    }
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;