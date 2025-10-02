import mongoose, { Schema, Document } from "mongoose";

export interface QuestionLean extends Document {
  topicSlug: string;
  topicName: string;           // Added topic name
  type: "previous" | "practice";
  question: string;
  options?: string[];          // Array of options (for multiple choice)
  answer?: string | string[];  // Can be a paragraph, word, or array of points
  year?: number;
}

const QuestionSchema = new Schema<QuestionLean>({
  topicSlug: { type: String, required: true },
  topicName: { type: String, required: true },   // Added topic name
  type: { type: String, enum: ["previous", "practice"], required: true },
  question: { type: String, required: true },
  options: [{ type: String }],                  // Optional array of options
  answer: { type: Schema.Types.Mixed },         // Can store string or array
  year: Number,
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model<QuestionLean>("Question", QuestionSchema);
