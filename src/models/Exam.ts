import mongoose, { Schema, model, models } from "mongoose";

const ExamSchema = new Schema({
  name: { type: String, required: true },
  upcomingDate: String,
  description: String,
  subjects: [String],
});

export default models.Exam || model("Exam", ExamSchema);
