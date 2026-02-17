import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import { errorHandler } from './errorHandler.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Health Check - This is a public route and should come before any auth middleware.
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is healthy' });
});

// --- API Routes ---
// Apply clerkMiddleware specifically to API routes that need protection.
// This prevents it from blocking public routes like /health.
app.use('/api/auth', clerkMiddleware(), authRoutes);
app.use('/api/users', clerkMiddleware(), userRoutes);
app.use('/api/chats', clerkMiddleware(), chatRoutes);
app.use('/api/messages', clerkMiddleware(), messageRoutes);
app.use('/api/groups', clerkMiddleware(), groupRoutes);
app.use('/api/quizzes', clerkMiddleware(), quizRoutes);
app.use('/api/social', clerkMiddleware(), socialRoutes);

// Error Handler (Keep this AFTER your API routes)
app.use(errorHandler);

export default app;