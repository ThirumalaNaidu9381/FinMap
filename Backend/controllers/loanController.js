import Loan from '../models/Loan.js';

export const requestLoan = async (req, res) => {
  try {
    const { borrowerId, amount, interestRate, duration } = req.body;
    const loan = await Loan.create({ borrowerId, amount, interestRate, duration });
    res.status(201).json(loan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to request loan', error: err.message });
  }
};

export const getPendingLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ status: 'pending' });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending loans', error: err.message });
  }
};

export const updateLoanStatus = async (req, res) => {
  try {
    const { id, action } = req.params;
    const status = action === 'approve' ? 'approved' : 'rejected';
    const loan = await Loan.findByIdAndUpdate(id, { status }, { new: true });
    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update loan status', error: err.message });
  }
};

export const getLoansByLender = async (req, res) => {
  try {
    const lenderId = req.query.lenderId;
    const loans = await Loan.find({ lenderId });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch lender loans', error: err.message });
  }
};

export const getLoansByBorrower = async (req, res) => {
  try {
    const borrowerId = req.query.borrowerId;
    const loans = await Loan.find({ borrowerId });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch borrower loans', error: err.message });
  }
};
