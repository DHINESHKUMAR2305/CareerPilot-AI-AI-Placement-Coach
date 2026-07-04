import mongoose from "mongoose";

const mcqHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  correctAnswersCount: {
    type: Number,
    required: true,
  },
  wrongAnswersCount: {
    type: Number,
    required: true,
  },
  weakTopics: [String],
  suggestions: [String],
  questionsAndAnswers: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
      userAnswer: String,
      explanation: String,
      isCorrect: Boolean,
    }
  ]
}, { timestamps: true });

const MCQHistory = mongoose.model("MCQHistory", mcqHistorySchema);
export default MCQHistory;
