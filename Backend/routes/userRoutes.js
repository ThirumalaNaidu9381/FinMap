import express from 'express';
import User from '../models/User.js';
const router = express.Router();

router.get('/users/:role', async (req, res) => {
  const { role } = req.params;
  const oppositeRole = role === 'lender' ? 'borrower' : 'lender';
  const users = await User.find({ role: oppositeRole }).select('name _id');
  res.json(users);
});

export default router;