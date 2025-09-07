import mongoose, { Schema, Document, models, model, Types } from "mongoose";

// Description node type for nested content
export interface DescriptionNode {
  point?: string;
  expression?: string;
  example?: string;
  details?: DescriptionNode[];
  properties?: DescriptionNode[];
}

// Topic document type (Mongoose Document)
export interface TopicDoc extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: DescriptionNode[];
  exam: string;
  slug: string;
  link?: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

// Topic plain object type (from .lean())
export type TopicLean = Omit<TopicDoc, keyof Document> & {
  _id: string;
};

const DescriptionNodeSchema = new Schema<DescriptionNode>(
  {
    point: { type: String },
    expression: { type: String },
    example: { type: String },
    details: { type: [Object], default: [] },
    properties: { type: [Object], default: [] },
  },
  { _id: false }
);

const TopicSchema = new Schema<TopicDoc>(
  {
    title: { type: String, required: true },
    description: { type: [DescriptionNodeSchema], default: [] },
    exam: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    link: { type: String },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Topic = models.Topic || model<TopicDoc>("Topic", TopicSchema);
export default Topic;
