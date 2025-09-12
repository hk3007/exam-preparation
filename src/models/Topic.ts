import mongoose, { Schema, Document, models, model, Types } from "mongoose";

// Table node type
export interface TableNode {
  headers: string[];
  rows: string[][];
}

// Description node type for nested content
export interface DescriptionNode {
  point?: string;
  expression?: string;
  example?: string;
  details?: DescriptionNode[];
  properties?: DescriptionNode[];
  tables?: TableNode[]; // ✅ Add tables
}

// Topic document type (Mongoose Document)
export interface TopicDoc extends Document {
  _id: Types.ObjectId;
  name: string;
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

// Mongoose Schema for TableNode
const TableNodeSchema = new Schema<TableNode>(
  {
    headers: { type: [String], required: true },
    rows: { type: [[String]], required: true },
  },
  { _id: false }
);

// Mongoose Schema for DescriptionNode
const DescriptionNodeSchema = new Schema<DescriptionNode>(
  {
    point: { type: String },
    expression: { type: String },
    example: { type: String },
    details: { type: [Object], default: [] },
    properties: { type: [Object], default: [] },
    tables: { type: [TableNodeSchema], default: [] }, // ✅ Add tables
  },
  { _id: false }
);

// Mongoose Schema for Topic
const TopicSchema = new Schema<TopicDoc>(
  {
    name: { type: String, required: true },
    description: { type: [DescriptionNodeSchema], default: [] },
    exam: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    link: { type: String },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Export model
const Topic = models.Topic || model<TopicDoc>("Topic", TopicSchema);
export default Topic;
