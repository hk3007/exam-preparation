import mongoose, { Schema, Document } from "mongoose";

export interface QuestionLean extends Document {
  topicSlug: string;
  type: "previous" | "practice"; // ✅ Type added
  question: string;
  answer?: string;
  year?: number;
}

const QuestionSchema = new Schema<QuestionLean>({
  topicSlug: { type: String, required: true },
  type: { type: String, enum: ["previous", "practice"], required: true },
  question: { type: String, required: true },
  answer: String,
  year: Number,
});

export default mongoose.models.Question || mongoose.model<QuestionLean>("Question", QuestionSchema);
