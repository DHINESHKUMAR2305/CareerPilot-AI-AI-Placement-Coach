import InterviewHistory from '../models/InterviewHistory.js';
import { generateMockInterviewQuestion, evaluateMockInterviewAnswer } from '../utils/gemini.js';

export const startInterview = async (req, res) => {
  try {
    const { role, difficulty } = req.body;
    
    if (!role || !difficulty) {
      return res.status(400).json({ message: 'Role and difficulty are required' });
    }

    const question = await generateMockInterviewQuestion(role, difficulty, []);
    
    const interview = await InterviewHistory.create({
      user: req.user._id,
      role,
      difficulty,
      questionsAndAnswers: [],
      overallScore: 0,
    });

    res.status(201).json({
      interviewId: interview._id,
      question
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start interview' });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, question, answer } = req.body;
    
    if (!interviewId || !question || !answer) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const interview = await InterviewHistory.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const evaluation = await evaluateMockInterviewAnswer(interview.role, question, answer);
    
    interview.questionsAndAnswers.push({
      question,
      userAnswer: answer,
      aiEvaluation: evaluation
    });

    // Recalculate overall score
    const totalScore = interview.questionsAndAnswers.reduce((acc, curr) => acc + curr.aiEvaluation.score, 0);
    interview.overallScore = totalScore / interview.questionsAndAnswers.length;
    
    await interview.save();

    // Generate next question
    const previousQuestions = interview.questionsAndAnswers.map(qa => qa.question);
    const nextQuestion = await generateMockInterviewQuestion(interview.role, interview.difficulty, previousQuestions);

    res.status(200).json({
      evaluation,
      nextQuestion,
      overallScore: interview.overallScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit answer' });
  }
};

export const getInterviewHistory = async (req, res) => {
  try {
    const history = await InterviewHistory.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch interview history' });
  }
};
