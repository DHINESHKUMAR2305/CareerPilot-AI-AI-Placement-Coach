import express from 'express';
import { startInterview, submitAnswer, getInterviewHistory } from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', protect, startInterview);
router.post('/submit', protect, submitAnswer);
router.get('/history', protect, getInterviewHistory);

export default router;
