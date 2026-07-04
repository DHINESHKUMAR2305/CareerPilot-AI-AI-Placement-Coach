import express from 'express';
import { createStudyPlan, getStudyPlanHistory } from '../controllers/studyPlanController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, createStudyPlan);
router.get('/history', protect, getStudyPlanHistory);

export default router;
