// backend/server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import nodemailer from 'nodemailer';

import { connectDB } from './db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import interestRoutes from './routes/interestRoutes.js';

import Message from './models/Message.js';
import Loan from './models/Loan.js';
import { scheduleReminders } from './utils/reminderScheduler.js';

// Load environment variables first
dotenv.config();

// Connect to MongoDB
connectDB();

// Schedule loan reminders
scheduleReminders();

const app = express();
const server = http.createServer(app);

// Socket.io with dynamic CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/interests', interestRoutes);

// Socket.IO Events
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

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

// Cron job: Send interest repayment reminders daily at 9 AM
cron.schedule('0 9 * * *', async () => {
  try {
    const dueLoans = await Loan.find({
      status: 'approved',
      nextInterestDueDate: { $lte: new Date() },
    }).populate('borrowerId');

    for (const loan of dueLoans) {
      const borrower = loan.borrowerId;
      if (borrower?.email) {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: borrower.email,
          subject: 'Interest Payment Reminder - FinMap',
          text: `Hi ${borrower.name}, your interest payment of ${loan.interestRate}% on your loan of ₹${loan.amount} is due. Please make the payment soon.`,
        });
      }

      // Update due date to next month
      loan.nextInterestDueDate.setMonth(loan.nextInterestDueDate.getMonth() + 1);
      await loan.save();
    }

    console.log(`📩 Interest reminders sent for ${dueLoans.length} loans.`);
  } catch (err) {
    console.error('❌ Failed to send interest reminders:', err.message);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
