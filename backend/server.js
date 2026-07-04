import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import mcqRoutes from './routes/mcqRoutes.js';
import studyPlanRoutes from './routes/studyPlanRoutes.js';
import { startCronJobs } from './jobs/cronJobs.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/mcq', mcqRoutes);
app.use('/api/studyplan', studyPlanRoutes);

// Initialize Cron Jobs
startCronJobs();

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
