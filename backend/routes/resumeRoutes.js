import express from 'express';
import multer from 'multer';
import { uploadAndAnalyzeResume, getResumeHistory } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/analyze', protect, upload.single('resume'), uploadAndAnalyzeResume);
router.get('/history', protect, getResumeHistory);

export default router;
