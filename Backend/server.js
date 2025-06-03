// backend/server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import nodemailer from 'nodemailer';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';

import Message from './models/Message.js';
import Loan from './models/Loan.js';
import User from './models/User.js';
import { scheduleReminders } from './utils/reminderScheduler.js';
import reminderRoutes from './routes/reminderRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import interestRoutes from './routes/interestRoutes.js';

scheduleReminders();
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
app.use('/api/reminders', reminderRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/interests', interestRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// Socket.IO Logic
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
