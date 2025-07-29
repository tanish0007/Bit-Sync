import { useCallback, useEffect, useRef, useState } from 'react';
import socket from '../services/socket';

const useWebRTC = (roomId, userId) => {
  const [clients, setClients] = useState([]);
  const mediaStream = useRef(null);
  const peerConnections = useRef({});
  const videoRefs = useRef({});

  const addNewClient = useCallback((newClient) => {
    setClients(prev => [...new Set([...prev, newClient])]);
  }, []);

  // Handle incoming WebRTC signals
  const handleSignal = useCallback(({ fromId, offer, answer, candidate }) => {
    const pc = peerConnections.current[fromId];
    if (!pc) return;

    if (offer) {
      pc.setRemoteDescription(new RTCSessionDescription(offer))
        .then(() => pc.createAnswer())
        .then(answer => pc.setLocalDescription(answer))
        .then(() => {
          socket.emit('signal', { 
            toId: fromId, 
            answer: pc.localDescription 
          });
        })
        .catch(console.error);
    } 
    else if (answer) {
      pc.setRemoteDescription(new RTCSessionDescription(answer))
        .catch(console.error);
    }
    else if (candidate) {
      pc.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    const socketInstance = socket;
    let isMounted = true;

    const startCapture = async () => {
      try {
        mediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        
        if (isMounted) {
          addNewClient(userId);
          const localVideo = videoRefs.current[userId];
          if (localVideo) {
            localVideo.srcObject = mediaStream.current;
          }
          socketInstance.emit('join-call', roomId);
        }
      } catch (err) {
        console.error('Media capture error:', err);
      }
    };

    const handleNewPeer = async (peerId) => {
      if (peerConnections.current[peerId] || peerId === userId) return;

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      mediaStream.current?.getTracks().forEach(track => 
        pc.addTrack(track, mediaStream.current)
      );

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socketInstance.emit('signal', { 
            toId: peerId, 
            candidate: e.candidate 
          });
        }
      };

      pc.ontrack = ({ streams: [stream] }) => {
        if (isMounted) {
          addNewClient(peerId);
          const remoteVideo = videoRefs.current[peerId];
          if (remoteVideo) remoteVideo.srcObject = stream;
        }
      };

      peerConnections.current[peerId] = pc;

      // Only create offer if we're initiating
      if (userId < peerId) { // Simple way to determine who initiates
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketInstance.emit('signal', { 
          toId: peerId, 
          offer 
        });
      }
    };

    // Initialize
    socketInstance.connect();
    startCapture();

    // Setup listeners
    socketInstance.on('user-joined', handleNewPeer);
    socketInstance.on('signal', handleSignal);

    return () => {
      isMounted = false;
      socketInstance.off('user-joined');
      socketInstance.off('signal');
      
      // Cleanup all peer connections
      Object.entries(peerConnections.current).forEach(([id, pc]) => {
        pc.close();
        delete peerConnections.current[id];
      });
      
      // Stop media tracks
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [roomId, userId, addNewClient, handleSignal]);

  const provideMediaRef = (id, node) => {
    videoRefs.current[id] = node;
  };

  return { clients, provideMediaRef };
};

export default useWebRTC;