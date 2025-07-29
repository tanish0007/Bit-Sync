import { Server } from "socket.io";

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Your frontend URL
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Room state tracking
    const rooms = {
        connections: {}, // { [roomId]: [socketId1, socketId2] }
        messages: {}     // { [roomId]: [message1, message2] }
    };

    io.on("connection", (socket) => {
        console.log("New connection:", socket.id);

        // Video Call Functionality
        socket.on("join-call", (roomId) => {
            // Initialize room if not exists
            if (!rooms.connections[roomId]) {
                rooms.connections[roomId] = [];
                rooms.messages[roomId] = [];
            }

            // Add to room
            rooms.connections[roomId].push(socket.id);

            // Notify others in room
            socket.to(roomId).emit("user-joined", {
                socketId: socket.id,
                participants: rooms.connections[roomId]
            });

            // Send message history if needed
            if (rooms.messages[roomId].length > 0) {
                socket.emit("message-history", rooms.messages[roomId]);
            }
        });

        // WebRTC Signaling
        socket.on("signal", ({ toId, signal }) => {
            io.to(toId).emit("signal", {
                fromId: socket.id,
                signal
            });
        });

        // Chat Functionality
        socket.on("send-message", ({ roomId, sender, text }) => {
            if (!rooms.connections[roomId]?.includes(socket.id)) {
                return socket.emit("error", "Not in this room");
            }

            const message = {
                sender,
                text,
                timestamp: new Date().toISOString()
            };

            // Store message (limit history)
            rooms.messages[roomId] = [
                ...(rooms.messages[roomId] || []).slice(-100), // Keep last 100 messages
                message
            ];

            // Broadcast to room
            io.to(roomId).emit("receive-message", message);
        });

        // Disconnection Handler
        socket.on("disconnect", () => {
            // Find and clean up all rooms this socket was in
            for (const [roomId, participants] of Object.entries(rooms.connections)) {
                const index = participants.indexOf(socket.id);
                if (index !== -1) {
                    // Remove from room
                    const updatedParticipants = participants.filter(id => id !== socket.id);
                    rooms.connections[roomId] = updatedParticipants;

                    // Notify remaining participants
                    socket.to(roomId).emit("user-left", {
                        socketId: socket.id,
                        remainingParticipants: updatedParticipants
                    });

                    // Cleanup empty rooms
                    if (updatedParticipants.length === 0) {
                        delete rooms.connections[roomId];
                        delete rooms.messages[roomId];
                    }
                }
            }
        });
    });

    return io;
};

// import { Server } from "socket.io";

// // Room state management
// const rooms = {
//   connections: {}, // { [roomId]: [socketId1, socketId2] }
//   messages: {},    // { [roomId]: [message1, message2] }
//   participants: {} // { [socketId]: { userId, joinedAt } }
// };

// export const connectToSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: process.env.FRONTEND_URL || "http://localhost:5173",
//       methods: ["GET", "POST"],
//       credentials: true
//     }
//   });

//   io.on("connection", (socket) => {
//     console.log(`New connection: ${socket.id}`);

//     // Video Call Functionality
//     socket.on("join-call", (roomId) => {
//       // Initialize room if not exists
//       if (!rooms.connections[roomId]) {
//         rooms.connections[roomId] = [];
//         rooms.messages[roomId] = [];
//       }

//       // Add to room
//       rooms.connections[roomId].push(socket.id);
//       rooms.participants[socket.id] = {
//         userId: socket.userId, // Assuming you attach userId during auth
//         joinedAt: new Date()
//       };

//       // Notify others in room
//       socket.to(roomId).emit("user-joined", {
//         socketId: socket.id,
//         userId: socket.userId,
//         participants: rooms.connections[roomId].map(id => ({
//           socketId: id,
//           userId: rooms.participants[id]?.userId
//         }))
//       });

//       // Send message history
//       socket.emit("message-history", rooms.messages[roomId]);
//     });

//     // WebRTC Signaling
//     socket.on("signal", ({ toId, signal }) => {
//       io.to(toId).emit("signal", {
//         fromId: socket.id,
//         signal
//       });
//     });

//     // Chat Functionality
//     socket.on("send-message", ({ roomId, text }) => {
//       if (!rooms.connections[roomId]?.includes(socket.id)) {
//         return socket.emit("error", "Not in this room");
//       }

//       const message = {
//         sender: socket.userId,
//         socketId: socket.id,
//         text,
//         timestamp: new Date().toISOString()
//       };

//       // Store message (limit history to 100 messages)
//       rooms.messages[roomId] = [
//         ...(rooms.messages[roomId] || []).slice(-99),
//         message
//       ];

//       // Broadcast to room
//       io.to(roomId).emit("new-message", message);
//     });

//     // Disconnection Handler
//     socket.on("disconnect", () => {
//       const participant = rooms.participants[socket.id];
//       if (!participant) return;

//       delete rooms.participants[socket.id];

//       // Find and clean up all rooms this socket was in
//       for (const [roomId, participants] of Object.entries(rooms.connections)) {
//         const index = participants.indexOf(socket.id);
//         if (index !== -1) {
//           // Remove from room
//           const updatedParticipants = participants.filter(id => id !== socket.id);
//           rooms.connections[roomId] = updatedParticipants;

//           // Notify remaining participants
//           socket.to(roomId).emit("user-left", {
//             socketId: socket.id,
//             userId: participant.userId,
//             remainingParticipants: updatedParticipants.map(id => ({
//               socketId: id,
//               userId: rooms.participants[id]?.userId
//             }))
//           });

//           // Cleanup empty rooms
//           if (updatedParticipants.length === 0) {
//             delete rooms.connections[roomId];
//             delete rooms.messages[roomId];
//           }
//         }
//       }
//     });

//     // Authentication Middleware (optional)
//     socket.use(([event, ...args], next) => {
//       if (["join-call", "send-message"].includes(event)) {
//         // Verify token or session
//         const token = socket.handshake.auth.token;
//         if (!verifyToken(token)) {
//           return next(new Error("Unauthorized"));
//         }
//       }
//       next();
//     });
//   });

//   return io;
// };

// // Helper function (would be your actual token verification)
// function verifyToken(token) {
//   // Implement your JWT verification logic
//   return true;
// }