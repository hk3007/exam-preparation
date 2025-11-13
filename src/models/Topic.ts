import mongoose, { Schema, Document, model, Types } from "mongoose";

// Table node type
export interface TableNode {
  headers: string[];
  rows: string[][];
}

// Example node type
export interface ExampleNode {
  title: string;
  given?: Record<string, any>;
  steps?: Record<string, any>;
  answer?: Record<string, any>;
}

// Description node type for nested content
export interface DescriptionNode {
  // 🐛 FIX: Add 'id' to the interface, which is required by the consumer component.
  // It is optional and string, as the consumer likely wants a string key.
  // Note: We are using 'id?: string' because the Mongoose schema uses {_id: false} 
  // and therefore does not generate a mandatory id field on the POJO.
  id?: string;
  
  point?: string;
  expression?: string;
  example?: string;
  details?: string[]; // ✅ store list of details as strings
  properties?: DescriptionNode[];
  tables?: TableNode[];
  examples?: ExampleNode[];
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
  // _id is included in the lean result, typically as a string or ObjectId
  // The original TopicLean used `_id: string;` which is generally safer for lean().
  _id: string;
};


// Mongoose Schema Definitions (KEPT AS IS)
// Mongoose Schema for TableNode
const TableNodeSchema = new Schema<TableNode>(
  {
    headers: { type: [String], required: true },
    rows: { type: [[String]], required: true },
  },
  { _id: false }
);

// Schema for ExampleNode
const ExampleNodeSchema = new Schema<ExampleNode>(
  {
    title: { type: String, required: true },
    given: { type: Schema.Types.Mixed, default: {} },
    steps: { type: Schema.Types.Mixed, default: {} },
    answer: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

// Mongoose Schema for DescriptionNode
const DescriptionNodeSchema = new Schema<DescriptionNode>(
  {
    point: { type: String },
    expression: { type: String },
    example: { type: String },
    details: { type: [String], default: [] },
    // ⚠️ NOTE: The `properties` schema should reference DescriptionNodeSchema itself
    // We assume the original usage of `[Object]` was correct for Mongoose, 
    // but the TypeScript interface is what we fixed above.
    properties: { type: [Object], default: [] }, 
    tables: { type: [TableNodeSchema], default: [] },
    examples: { type: [ExampleNodeSchema], default: [] },
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
const Topic =
  (mongoose.models && mongoose.models.Topic) ||
  model<TopicDoc>("Topic", TopicSchema);

export default Topic;