import cron from 'node-cron';
import Loan from '../models/Loan.js';
import nodemailer from 'nodemailer';

// Setup transporter (configure for your provider)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS
  }
});

export const scheduleReminders = () => {
  cron.schedule('0 9 * * *', async () => {
    const today = new Date();
    const loans = await Loan.find({
      status: 'approved',
      nextReminderDate: { $lte: today },
      reminderSent: false
    }).populate('borrowerId', 'email name');

    for (const loan of loans) {
      if (!loan.borrowerId?.email) continue;

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: loan.borrowerId.email,
        subject: 'Loan Interest Reminder',
        text: `Dear ${loan.borrowerId.name},\n\nThis is a reminder that your loan interest of ${loan.interestRate}% is due on ${loan.nextInterestDueDate.toDateString()}.\n\n- FinMap`
      };

      try {
        await transporter.sendMail(mailOptions);
        loan.reminderSent = true;
        await loan.save();
        console.log(`Reminder sent to ${loan.borrowerId.email}`);
      } catch (err) {
        console.error('Error sending reminder:', err.message);
      }
    }
  });
};
