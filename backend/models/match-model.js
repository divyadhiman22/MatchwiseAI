import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  resumeText: String,
  jobText: String,
  result: String, 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const MatchModel = mongoose.model('Match', matchSchema);
