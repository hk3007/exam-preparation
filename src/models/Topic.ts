import mongoose, { Schema, Document, models, model, Types } from "mongoose";

export interface TopicDoc extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  exam: string;
  slug: string;
  link: string;
  views: number;
}

const TopicSchema = new Schema<TopicDoc>(
  {
    title: { type: String, required: true },
    description: { type: String },
    exam: { type: String, required: true }, // UPSC, NEET, etc.
    slug: { type: String, required: true, unique: true },
    link: { type: String },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Topic || model<TopicDoc>("Topic", TopicSchema);
