import MCQHistory from '../models/MCQHistory.js';
import { generateMCQs } from '../utils/gemini.js';

export const startMCQTest = async (req, res) => {
  try {
    const { topic, difficulty, numQuestions = 20 } = req.body;
    
    if (!topic || !difficulty) {
      return res.status(400).json({ message: 'Topic and difficulty are required' });
    }

    const requestedQuestions = Math.min(Math.max(parseInt(numQuestions) || 20, 5), 30);
    const questions = await generateMCQs(topic, difficulty, requestedQuestions);
    
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate MCQs' });
  }
};

export const submitMCQTest = async (req, res) => {
  try {
    const { topic, difficulty, questionsAndAnswers } = req.body;
    
    if (!topic || !difficulty || !questionsAndAnswers) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let correctCount = 0;
    const evaluatedAnswers = questionsAndAnswers.map(qa => {
      const isCorrect = qa.userAnswer === qa.correctAnswer;
      if (isCorrect) correctCount++;
      return { ...qa, isCorrect };
    });

    const totalQuestions = questionsAndAnswers.length;
    const percentage = (correctCount / totalQuestions) * 100;
    
    // Evaluate weak topics/suggestions based on wrong answers
    let weakTopics = [];
    let suggestions = [];
    
    if (percentage < 100) {
      suggestions.push(`Focus more on the detailed concepts of ${topic}.`);
      weakTopics.push(topic);
    }

    const mcqHistory = await MCQHistory.create({
      user: req.user._id,
      topic,
      difficulty,
      score: correctCount,
      percentage,
      correctAnswersCount: correctCount,
      wrongAnswersCount: totalQuestions - correctCount,
      weakTopics,
      suggestions,
      questionsAndAnswers: evaluatedAnswers
    });

    res.status(201).json(mcqHistory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit test' });
  }
};

export const getMCQHistory = async (req, res) => {
  try {
    const history = await MCQHistory.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch MCQ history' });
  }
};
