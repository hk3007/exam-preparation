import mongoose, { Schema, model, models } from "mongoose";

const TopicSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  exam: { type: String, required: true }, // e.g., "NEET", "JEE"
  link: String,
});

export default models.Topic || model("Topic", TopicSchema);
