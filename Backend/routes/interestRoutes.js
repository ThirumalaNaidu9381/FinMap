import express from 'express';
import Interest from '../models/UserInterest.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, type, itemId } = req.body;
    const interest = await Interest.create({ userId, type, itemId });
    res.status(201).json(interest);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save interest', error: err.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { userId, type, itemId } = req.body;
    await Interest.findOneAndDelete({ userId, type, itemId });
    res.status(200).json({ message: 'Interest removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete interest', error: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const interests = await Interest.find({ userId: req.params.userId });
    res.json(interests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch interests', error: err.message });
  }
});

export default router;
