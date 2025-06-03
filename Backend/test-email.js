import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // send to self to test
      subject: 'FinMap Test Email',
      text: 'This is a test email from your FinMap project.'
    });

    console.log('✅ Test email sent successfully:', info.response);
  } catch (err) {
    console.error('❌ Failed to send test email:', err.message);
  }
}

testEmail();
