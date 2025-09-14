import mongoose, { Schema, Document, Types } from "mongoose";

export interface ChapterDoc extends Document {
  _id: Types.ObjectId;
  name: string;
  // allow both string[] (old data) and { name, slug }[] (new format)
  topics?: (string | { name: string; slug: string })[];
  subjectIds?: Types.ObjectId[];
}

const ChapterSchema = new Schema<ChapterDoc>({
  name: { type: String, required: true },
  topics: { type: [Schema.Types.Mixed], default: [] }, // can hold strings or objects
  subjectIds: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
});

const Chapter =
  mongoose.models.Chapter || mongoose.model<ChapterDoc>("Chapter", ChapterSchema);

export default Chapter;
