// backend/controllers/messageController.js
import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load messages' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, text } = req.body;
    const message = await Message.create({ conversationId, senderId, text });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' });
  }
};
