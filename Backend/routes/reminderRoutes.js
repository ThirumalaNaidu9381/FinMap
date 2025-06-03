import express from 'express';
import { sendSmsReminder } from '../controllers/reminderController.js';

const router = express.Router();

router.post('/send/:id', sendSmsReminder);

export default router;
