import express from 'express';
import { startMCQTest, submitMCQTest, getMCQHistory } from '../controllers/mcqController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', protect, startMCQTest);
router.post('/submit', protect, submitMCQTest);
router.get('/history', protect, getMCQHistory);

export default router;
