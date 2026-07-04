import fs from 'fs';
import pdfParse from 'pdf-parse-new';
import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { analyzeResume } from '../utils/gemini.js';

export const uploadAndAnalyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);
    const resumeText = data.text;

    const analysis = await analyzeResume(resumeText, role);

    const savedAnalysis = await ResumeAnalysis.create({
      user: req.user._id,
      role,
      ...analysis
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.status(201).json(savedAnalysis);
  } catch (error) {
    console.error('Resume Analysis Error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Failed to analyze resume' });
  }
};

export const getResumeHistory = async (req, res) => {
  try {
    const history = await ResumeAnalysis.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resume history' });
  }
};
