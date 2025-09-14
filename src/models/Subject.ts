import { Schema, model, models } from "mongoose";

const SubjectSchema = new Schema(
  {
    name: { type: String, required: true },
    examIds: [{ type: Schema.Types.ObjectId, ref: "Exam" }],
  },
  { timestamps: true }
);

const Subject = models.Subject || model("Subject", SubjectSchema);
export default Subject;
