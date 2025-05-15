import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';

import Message from './models/Message.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// Socket.IO logic using conversationId
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('leave-conversation', (conversationId) => {
    socket.leave(conversationId);
  });

  socket.on('send-message', async ({ conversationId, senderId, text }) => {
    try {
      const message = await Message.create({ conversationId, senderId, text });
      io.to(conversationId).emit('new-message', message);
    } catch (err) {
      console.error('❌ Error saving message:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
