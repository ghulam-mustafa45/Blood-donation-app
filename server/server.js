// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import connectDB from "./utils/db.js";

// Load environment variables
dotenv.config();


// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample Route
app.use("/api/auth", authRoutes);

// Example API Route (Users)
app.use("/api/users", (req, res) => {
  res.json([{ id: 1, name: "John Doe" }]);
});

// Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(()=>{
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
 });

})
