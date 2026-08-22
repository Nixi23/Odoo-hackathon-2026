// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Route Handlers
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import exploreRoutes from './routes/exploreRoutes';
import tripRoutes from './routes/tripRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'GlobeTrotter Backend is optimal.' });
});

// Centralized 404 Route handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Centralized Error-Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
