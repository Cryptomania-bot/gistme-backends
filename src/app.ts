import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import { errorHandler } from './errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Recreate __dirname (Necessary for ES Modules in Node/Bun)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(clerkMiddleware());

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is healthy' });
});

import groupRoutes from './routes/groupRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import socialRoutes from './routes/socialRoutes.js';

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/social', socialRoutes);

// Error Handler (Keep this AFTER your API routes)
app.use(errorHandler);

// --- Static File Serving (Production) ---
if (process.env.NODE_ENV === 'production') {
    // This points to /app/web/dist based on your Docker structure
    // We go up two levels: out of src/ and out of backend/
    const distPath = path.join(__dirname, '../../web/dist');

    // Serve the static assets (js, css, images)
    app.use(express.static(distPath));

    // Handle React/Vite routing: serve index.html for any non-API request
    app.get('*any', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
    });
}

export default app;