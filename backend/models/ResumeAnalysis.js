import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  matchPercentage: {
    type: Number,
    required: true,
  },
  strongSkills: [String],
  missingSkills: [String],
  missingSections: [String],
  positivePoints: [String],
  areasToImprove: [String],
  aiSuggestions: [String],
  learningRecommendations: [String],
}, { timestamps: true });

const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
export default ResumeAnalysis;
