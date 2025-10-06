// models/Question.ts
import mongoose, { Schema, Document } from "mongoose";

export interface QuestionLean extends Document {
  topicSlug: string;
  topicName: string;
  type: "previous" | "practice";
  question: string;
  options?: string[];
  answer?: string | string[];
  steps?: string[];
  year?: number;
  examIds?: string[];
}

const QuestionSchema = new Schema<QuestionLean>(
  {
    topicSlug: { type: String, required: true },
    topicName: { type: String, required: true },
    type: { type: String, enum: ["previous", "practice"], required: true },
    question: { type: String, required: true },
    options: [{ type: String }],
    answer: { type: Schema.Types.Mixed },
    steps: [{ type: String }],
    year: Number,
    examIds: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Question ||
  mongoose.model<QuestionLean>("Question", QuestionSchema);
