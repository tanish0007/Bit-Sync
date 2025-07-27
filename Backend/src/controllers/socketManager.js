import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("A new connection from client is established !!");

        socket.on("join-call", (path) => {
            if (connections[path] === undefined) {
                connections[path] = [];
            }

            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            connections[path].forEach((id) => {
                io.to(id).emit("user-joined", socket.id, connections[path]);
            });

            if (messages[path] !== undefined) {
                messages[path].forEach((msg) => {
                    io.to(socket.id).emit("chat-message", msg.data, msg.sender, msg["socket-id-sender"]);
                });
            }
        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender) => {
            const [matchingRoom, found] = Object.entries(connections).reduce(
                ([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [room, isFound];
                },
                ["", false]
            );

            if (found) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = [];
                }

                messages[matchingRoom].push({
                    sender: sender,
                    data: data,
                    "socket-id-sender": socket.id
                });

                console.log("message", matchingRoom, ":", sender, data);

                connections[matchingRoom].forEach((id) => {
                    if (id !== socket.id) {
                        io.to(id).emit("chat-message", data, sender, socket.id);
                    }
                });
            }
        });

        socket.on("disconnect", () => {
            delete timeOnline[socket.id]; // (CLEANUP timeOnline)

            for (const [k, v] of Object.entries(connections)) {
                if (v.includes(socket.id)) {
                    const key = k;

                    connections[key].forEach((id) => {
                        if (id !== socket.id) {
                            io.to(id).emit("user-left", socket.id);
                        }
                    });

                    // Remove the socket from the room
                    connections[key] = connections[key].filter((id) => id !== socket.id);

                    if (connections[key].length === 0) {
                        delete connections[key];       // ✅ (CLEANUP empty room)
                        delete messages[key];          // ✅ (Optional: clean old messages)
                    }

                    break; // ✅ (Avoid unnecessary looping once done)
                }
            }
        });
    });

    return io;
};