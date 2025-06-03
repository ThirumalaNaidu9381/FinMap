import express from 'express';
import Loan from '../models/Loan.js';

const router = express.Router();

// Create loan request
router.post('/', async (req, res) => {
  try {
    const { amount, borrowerId, interestRate, phone } = req.body;
    if (!amount || !borrowerId || !interestRate || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const loan = await Loan.create({
      amount,
      borrowerId,
      interestRate,
      phone,
      status: 'pending'
    });

    res.status(201).json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to request loan' });
  }
});

// Get all pending or rejected-but-not-by-current-lender loans
router.get('/pending', async (req, res) => {
  try {
    const lenderId = req.query.lenderId;
    const loans = await Loan.find({
      $or: [
        { status: 'pending' },
        { status: 'rejected', rejectedBy: { $ne: lenderId } }
      ]
    }).populate('borrowerId', 'name email');

    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending loans' });
  }
});

// Get all approved loans
router.get('/approved', async (req, res) => {
  try {
    const loans = await Loan.find({ status: 'approved' }).populate('borrowerId', 'name email');
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch approved loans' });
  }
});

// Get accepted loans for a lender
router.get('/lender/accepted/:lenderId', async (req, res) => {
  try {
    const loans = await Loan.find({
      status: 'approved',
      rejectedBy: { $ne: req.params.lenderId }
    }).populate('borrowerId', 'name email');
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch lender accepted loans' });
  }
});

// Get approved loans for a specific borrower
router.get('/approved/:borrowerId', async (req, res) => {
  try {
    const loans = await Loan.find({
      borrowerId: req.params.borrowerId,
      status: 'approved'
    });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch borrower approved loans' });
  }
});

// Get all loans of a borrower
router.get('/borrower/:id', async (req, res) => {
  try {
    const loans = await Loan.find({ borrowerId: req.params.id }).populate('rejectedBy', 'name _id');
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch borrower loans' });
  }
});

// Approve a loan
router.put('/:id/approve', async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    loan.status = 'approved';
    await loan.save();
    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve loan' });
  }
});

// Reject a loan
router.put('/:id/reject', async (req, res) => {
  try {
    const { reason, lenderId } = req.body;
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    loan.status = 'rejected';
    loan.rejectionReason = reason;
    loan.rejectedBy = lenderId;
    await loan.save();

    const populatedLoan = await Loan.findById(loan._id).populate('rejectedBy', 'name _id');
    res.json(populatedLoan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject loan' });
  }
});

// Update reminder
router.patch('/:id/reminder', async (req, res) => {
  try {
    const { nextReminderDate } = req.body;

    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { nextReminderDate, reminderSent: false },
      { new: true }
    );

    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update reminder' });
  }
});

export default router;
