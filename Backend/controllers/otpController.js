import User from '../models/User.js';
import twilio from 'twilio';
import nodemailer from 'nodemailer';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

export const sendOtp = async (req, res) => {
  const { phone, email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  try {
    const user = await User.findOneAndUpdate(
      { phone, email },
      { otp, otpExpires },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: phone
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP',
      text: `Your OTP is ${otp}`
    });

    res.json({ message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending OTP', error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const user = await User.findOne({ phone, otp, otpExpires: { $gt: new Date() } });

    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.isPhoneVerified = true;
    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();
    res.json({ message: 'OTP verified', user });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP', error: err.message });
  }
};
