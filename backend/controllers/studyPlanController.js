import StudyPlan from '../models/StudyPlan.js';
import { generateStudyPlan } from '../utils/gemini.js';
import { sendStudyPlanEmail } from '../utils/emailService.js';

export const createStudyPlan = async (req, res) => {
  try {
    const { topic, numWeeks = 4 } = req.body;
    
    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    const requestedWeeks = Math.min(Math.max(parseInt(numWeeks) || 4, 1), 8);
    const planData = await generateStudyPlan(topic, requestedWeeks);
    
    const studyPlan = await StudyPlan.create({
      user: req.user._id,
      topic,
      planData
    });

    if (req.user && req.user.email) 
    {
      sendStudyPlanEmail(req.user.email, req.user.name || 'Student', planData, topic);
    }

    res.status(201).json(studyPlan);
  } catch (error) {
    console.error('Study Plan Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate study plan' });
  }
};

export const getStudyPlanHistory = async (req, res) => {
  try
  {
    const history = await StudyPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch study plan history' });
  }
};
