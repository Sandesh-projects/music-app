import express from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'; // 1. Import cors

import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import musicRoutes from './routes/music.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// 2. Use cors middleware - This MUST be before your routes
// This will allow your frontend to make requests to this backend
app.use(cors());

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/music', musicRoutes);

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected successfully.");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};
connectDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});