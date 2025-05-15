import express from 'express';
import Loan from '../models/Loan.js';

const router = express.Router();

// Create a loan request
router.post('/', async (req, res) => {
  try {
    const { amount, borrowerId, interestRate } = req.body;

    if (!amount || !borrowerId || !interestRate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const loan = await Loan.create({
      amount,
      borrowerId,
      interestRate,
      status: 'pending'
    });

    res.status(201).json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to request loan' });
  }
});

// Get all pending loans (for lenders)
router.get('/pending', async (req, res) => {
  try {
    const loans = await Loan.find({ status: 'pending' }).populate('borrowerId', 'name email');
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending loans' });
  }
});

// Get loans by borrower ID
router.get('/borrower/:id', async (req, res) => {
  try {
    const loans = await Loan.find({ borrowerId: req.params.id });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch borrower loans' });
  }
});

// Approve a loan
router.put('/:id/approve', async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve loan' });
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

export default router;
