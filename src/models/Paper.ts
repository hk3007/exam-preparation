import mongoose, { Schema, model, models } from "mongoose";

const PaperSchema = new Schema({
  exam: String,
  year: Number,
  description: String,
  link: String,
});

export default models.Paper || model("Paper", PaperSchema);
