import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:8080'; // Update if needed

const useWebRTC = (roomId, userId) => {
  const [clients, setClients] = useState([]);
  const mediaStream = useRef(null);
  const socketRef = useRef(null);
  const peerConnections = useRef({});
  const videoRefs = useRef({});

  const addNewClient = useCallback((newClient) => {
    setClients((prev) => {
      if (!prev.includes(newClient)) {
        return [...prev, newClient];
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    socketRef.current = io(SERVER_URL);

    const startCapture = async () => {
      try {
        mediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        addNewClient(userId);
        const localVideo = videoRefs.current[userId];
        if (localVideo) {
          localVideo.srcObject = mediaStream.current;
        }
        socketRef.current.emit('join', { roomId, userId });
      } catch (err) {
        console.error('Failed to get media stream:', err);
      }
    };

    startCapture();

    socketRef.current.on('new-peer', async ({ peerId }) => {
      if (peerConnections.current[peerId]) return; // avoid duplicate connections

      const connection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => {
          connection.addTrack(track, mediaStream.current);
        });
      }

      connection.ontrack = ({ streams: [remoteStream] }) => {
        addNewClient(peerId);
        const remoteVideo = videoRefs.current[peerId];
        if (remoteVideo) {
          remoteVideo.srcObject = remoteStream;
        }
      };

      connection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit('ice-candidate', {
            peerId,
            candidate: event.candidate,
          });
        }
      };

      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      socketRef.current.emit('offer', { peerId, offer });

      peerConnections.current[peerId] = connection;
    });

    socketRef.current.on('offer', async ({ peerId, offer }) => {
      if (peerConnections.current[peerId]) return; // avoid duplicate

      const connection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => {
          connection.addTrack(track, mediaStream.current);
        });
      }

      connection.ontrack = ({ streams: [remoteStream] }) => {
        addNewClient(peerId);
        const remoteVideo = videoRefs.current[peerId];
        if (remoteVideo) {
          remoteVideo.srcObject = remoteStream;
        }
      };

      connection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit('ice-candidate', {
            peerId,
            candidate: event.candidate,
          });
        }
      };

      await connection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);
      socketRef.current.emit('answer', { peerId, answer });

      peerConnections.current[peerId] = connection;
    });

    socketRef.current.on('answer', async ({ peerId, answer }) => {
      const connection = peerConnections.current[peerId];
      if (!connection) return;
      await connection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socketRef.current.on('ice-candidate', ({ peerId, candidate }) => {
      const connection = peerConnections.current[peerId];
      if (connection) {
        connection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socketRef.current.on('peer-left', ({ peerId }) => {
      if (peerConnections.current[peerId]) {
        peerConnections.current[peerId].close();
        delete peerConnections.current[peerId];
      }
      setClients((prev) => prev.filter((id) => id !== peerId));
      delete videoRefs.current[peerId];
    });

    return () => {
      // Notify server we are leaving the room (optional)
      if (socketRef.current) {
        socketRef.current.emit('leave', { roomId, userId });
      }

      // Remove all socket listeners
      socketRef.current.off('new-peer');
      socketRef.current.off('offer');
      socketRef.current.off('answer');
      socketRef.current.off('ice-candidate');
      socketRef.current.off('peer-left');

      // Close all peer connections
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      peerConnections.current = {};

      // Stop all media tracks
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => track.stop());
        mediaStream.current = null;
      }

      setClients([]);
      videoRefs.current = {};

      // Disconnect socket
      socketRef.current.disconnect();
    };
  }, [roomId, userId, addNewClient]);

  const provideMediaRef = (id, node) => {
    videoRefs.current[id] = node;
  };

  return { clients, provideMediaRef };
};

export default useWebRTC;