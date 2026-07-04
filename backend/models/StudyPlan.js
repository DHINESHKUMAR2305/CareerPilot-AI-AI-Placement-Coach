import mongoose from 'mongoose';

const studyPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  planData: {
    type: Object,
    required: true
  }
}, { timestamps: true });

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);
export default StudyPlan;
