import Loan from '../models/Loan.js';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

export const sendSmsReminder = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate('borrowerId', 'name phone');

    if (!loan || loan.status !== 'approved') {
      return res.status(404).json({ message: 'Loan not found or not approved' });
    }

    if (!loan.borrowerId?.phone) {
      return res.status(400).json({ message: 'Borrower phone number missing' });
    }

    const messageBody = `Reminder: Interest payment for your loan of ₹${loan.amount} is due by ${new Date(
      loan.nextInterestDueDate
    ).toLocaleDateString()}.`;

    await twilioClient.messages.create({
      body: messageBody,
      to: loan.borrowerId.phone, // borrower phone number
      from: process.env.TWILIO_PHONE // your Twilio number
    });

    loan.reminderSent = true;
    await loan.save();

    res.json({ message: 'SMS reminder sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send SMS reminder' });
  }
};
