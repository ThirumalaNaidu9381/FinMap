import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/:role', async (req, res) => {
  try {
    const { role } = req.params;

    if (!['lender', 'borrower'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const oppositeRole = role === 'lender' ? 'borrower' : 'lender';

    const users = await User.find({ role: oppositeRole }).select('name _id');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

export default router;
