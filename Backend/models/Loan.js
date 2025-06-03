import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    borrowerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    interestRate: { type: Number, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: String,
    nextReminderDate: Date,
    reminderSent: {
      type: Boolean,
      default: false
    },
    nextInterestDueDate: Date
  },
  { timestamps: true }
);

// Set due and reminder dates on approval
loanSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'approved') {
    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setMonth(dueDate.getMonth() + 1);

    const reminderDate = new Date(dueDate);
    reminderDate.setDate(dueDate.getDate() - 5);

    this.nextInterestDueDate = dueDate;
    this.nextReminderDate = reminderDate;
  }
  next();
});

export default mongoose.model('Loan', loanSchema);
