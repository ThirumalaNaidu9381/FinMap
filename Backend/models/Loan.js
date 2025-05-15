import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interestRate: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Loan', loanSchema);
