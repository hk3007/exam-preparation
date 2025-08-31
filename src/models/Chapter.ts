import mongoose, { Schema, model, models } from "mongoose";

const ChapterSchema = new Schema(
  {
    name: { type: String, required: true },
    subjectIds: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    topics: [
      {
        title: String,
        link: String,
      },
    ],
  },
  { timestamps: true }
);

const Chapter = models.Chapter || model("Chapter", ChapterSchema);
export default Chapter;
