// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import donorRoutes from "./routes/donor.js";
import requestsRoutes from "./routes/requests.js";
import connectDB from "./utils/db.js";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";


// Load environment variables
dotenv.config();


// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Sample Route
app.use("/api/auth", authRoutes);
app.use("/api", donorRoutes);
app.use("/api/requests", requestsRoutes);


// Create HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  },
});

// Auth middleware for sockets (reads token from frontend handshake)
io.use((socket, next) => {
  const token = socket.handshake?.auth?.token;
  if (!token) return next(); // allow anonymous chat if you want
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.user = payload; // store on socket
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});


// In-memory history per room (replace with Mongo for persistence)
const roomHistory = new Map(); // room -> ChatMessage[]
const getHistory = (room) => roomHistory.get(room) || [];
const pushHistory = (room, msg) => {
  const list = getHistory(room);
  list.push(msg);
  if (list.length > 50) list.shift(); // cap history
  roomHistory.set(room, list);
};

io.on("connection", (socket) => {
  const user = socket.data.user || {};
  // Default rooms
  socket.join("global");
  if (user.city) socket.join(`city:${user.city}`);
  if (user.bloodType) socket.join(`blood:${user.bloodType}`);

  // Client selects/changes room
  socket.on("chat:join", ({ room }) => {
    if (!room) return;
    socket.join(room);
    socket.emit("chat:history", getHistory(room));
  });

  // Incoming message
  socket.on("chat:message", ({ room, text }) => {
    const targetRoom = room || "global";
    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      userName: user?.name || "Anonymous",
      text: String(text || "").slice(0, 500),
      createdAt: new Date().toISOString(),
    };
    pushHistory(targetRoom, message);
    io.to(targetRoom).emit("chat:message", message);
  });
});



// Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(()=>{
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
 });

})
