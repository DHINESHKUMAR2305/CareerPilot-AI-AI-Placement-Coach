import mongoose from "mongoose";

const interviewHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  questionsAndAnswers: [
    {
      question: String,
      userAnswer: String,
      aiEvaluation: {
        technicalAccuracy: String,
        communication: String,
        confidence: String,
        grammar: String,
        score: Number,
        correctAnswer: String,
        betterAnswer: String,
        suggestions: String,
      }
    }
  ],
  overallScore: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const InterviewHistory = mongoose.model("InterviewHistory", interviewHistorySchema);
export default InterviewHistory;
