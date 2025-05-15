import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';

import User from './models/User.js';
import Loan from './models/Loan.js';
import Message from './models/Message.js';
import Interest from './models/UserInterest.js'; // must exist

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('⚠️  Are you sure you want to delete ALL users, loans, messages, and interests? (yes/no): ', async (answer) => {
  if (answer.toLowerCase() !== 'yes') {
    console.log('❌ Aborted. No data was deleted.');
    rl.close();
    process.exit(0);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const userCount = await User.countDocuments();
    const loanCount = await Loan.countDocuments();
    const msgCount = await Message.countDocuments();
    const interestCount = await Interest.countDocuments();

    await User.deleteMany({});
    await Loan.deleteMany({});
    await Message.deleteMany({});
    await Interest.deleteMany({});

    console.log(`🧹 Deleted:
- ${userCount} users
- ${loanCount} loans
- ${msgCount} messages
- ${interestCount} interests`);

  } catch (err) {
    console.error('❌ Error clearing data:', err);
  } finally {
    rl.close();
    process.exit();
  }
});
