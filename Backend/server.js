import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Message from './models/Message.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import loanRoutes from './routes/loanRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5000',
    credentials: true
  }
});

app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);

mongoose.connect('mongodb://localhost:5000/finmap')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

app.get('/api/messages/:userId/:partnerId', async (req, res) => {
  try {
    const { userId, partnerId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

io.on('connection', (socket) => {
  console.log('🟢 A user connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('send-message', async ({ senderId, receiverId, text }) => {
    try {
      const message = new Message({ senderId, receiverId, text });
      await message.save();
      io.to(receiverId).emit('receive-message', message);
      io.to(senderId).emit('receive-message', message);
    } catch (err) {
      console.error('❌ Failed to send message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});