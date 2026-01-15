const { Server } = require("socket.io");
const { createServer } = require("node:http");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.BASE_URL,
    methods: ["GET", "POST"],
  },
});

// Object to store multiple socket IDs per user
const userSocketId = {};

const getReceiverSocketId = (receiverId) => {
  return userSocketId[receiverId] || [];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  // Ensure the userId is not undefined and then store the socket.id in the userSocketId object
  if (userId && userId !== "undefined") {
    if (!userSocketId[userId]) {
      userSocketId[userId] = []; // Initialize the array if it doesn't exist
    }
    userSocketId[userId].push(socket.id); // Store the new socket id for the user
  }

  // Emit the updated list of online users (userIds)
  io.emit("getOnlineUser", Object.keys(userSocketId));

  socket.on("newMessage", (message) => {
    const receiverId = message.senderId;

    if (userSocketId[receiverId]) {
      // Send the message to all connected sockets of the receiver
      userSocketId[receiverId].forEach((socketId) => {
        io.to(socketId).emit("newMessageReceived", message); // Emitting the message to the receiver's sockets
      });
    }
  });

  // Listen for disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);

    // Remove the socket from the user's list of socket IDs
    if (userId && userSocketId[userId]) {
      userSocketId[userId] = userSocketId[userId].filter(
        (id) => id !== socket.id
      );

      // If no sockets are left for the user, remove them from the userSocketId object
      if (userSocketId[userId].length === 0) {
        delete userSocketId[userId];
      }
    }

    // Emit the updated list of online users after a disconnection
    io.emit("getOnlineUser", Object.keys(userSocketId));
  });
});

// Function to send a message to all sockets of a user
const sendNewMessageToUser = (receiverId, message) => {
  const socketIds = getReceiverSocketId(receiverId);
  console.log("ids", socketIds);

  socketIds.forEach((socketId) => {
    io.to(socketId).emit("newMessage", message); // Emit the message to each socket
  });
};

const sendNewChatToUser = (receiverId, message) => {
  const socketIds = getReceiverSocketId(receiverId);

  socketIds.forEach((socketId) => {
    io.to(socketId).emit("newChat", message); // Emit the message to each socket
  });
};

module.exports = {
  app,
  io,
  server,
  getReceiverSocketId,
  sendNewMessageToUser,
  sendNewChatToUser,
};
