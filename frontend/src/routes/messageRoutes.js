import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/:conversationId', async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load messages' });
  }
});

router.post('/', async (req, res) => {
  const { conversationId, senderId, text } = req.body;
  try {
    const message = await Message.create({ conversationId, senderId, text });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' });
  }
});

export default router;
