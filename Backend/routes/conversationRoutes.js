import express from 'express';
import Conversation from '../models/Conversation.js';

const router = express.Router();

// Get or create a conversation between 2 users
router.post('/', async (req, res) => {
  const { user1, user2 } = req.body;
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [user1, user2] }
    });

    if (!conversation) {
      conversation = await Conversation.create({ participants: [user1, user2] });
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch/create conversation' });
  }
});

export default router;
