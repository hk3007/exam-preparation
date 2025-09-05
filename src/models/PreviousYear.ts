import mongoose, { Schema, Document, Types } from "mongoose";

export interface PreviousYearType extends Document {
  examId: Types.ObjectId;
  subjectIds: Types.ObjectId[];
  year: number;
  question: string;
  options: string[];
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}

const PreviousYearSchema = new Schema<PreviousYearType>(
  {
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    subjectIds: [{ type: Schema.Types.ObjectId, ref: "Subject", required: true }],
    year: { type: Number, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.PreviousYear ||
  mongoose.model<PreviousYearType>("PreviousYear", PreviousYearSchema);
