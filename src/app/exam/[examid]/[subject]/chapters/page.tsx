import { connectDB } from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import Subject from "@/models/Subject";
import Exam from "@/models/Exam";
import mongoose, { Types } from "mongoose";

// Define Chapter type (topics are strings)
interface ChapterType {
  _id: Types.ObjectId;
  name: string;
  topics?: string[];
  subjectIds?: Types.ObjectId[];
}

export default async function ChaptersPage({
  params,
}: {
  params: Promise<{ examid: string; subject: string }>;
}) {
  const { examid, subject } = await params;

  await connectDB();

  // 1. Find exam by name
  const exam = await Exam.findOne({ name: examid }).lean<{ _id: Types.ObjectId }>();
  if (!exam) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg font-semibold">
          ❌ Exam "{examid}" not found.
        </p>
      </div>
    );
  }

  // 2. Find subject by name + examId
  const subjectDoc = await Subject.findOne({
    name: subject,
    examIds: exam._id,
  }).lean<{ _id: Types.ObjectId }>();

  if (!subjectDoc) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg font-semibold">
          ❌ Subject "{subject}" not found for exam "{examid}".
        </p>
      </div>
    );
  }

  // 3. Fetch chapters linked to this subject
  const chapters = await Chapter.find({
    subjectIds: new mongoose.Types.ObjectId(subjectDoc._id),
  }).lean<ChapterType[]>();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          {examid} – <span className="text-indigo-600">{subject}</span>
        </h1>
        <p className="text-gray-600">
          Explore all chapters and topics for this subject.
        </p>
      </div>

      {/* No chapters */}
      {chapters.length === 0 && (
        <div className="flex justify-center">
          <p className="text-gray-500 text-lg">
            📚 No chapters found for this subject.
          </p>
        </div>
      )}

      {/* Chapters grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {chapters.map((chapter) => (
          <div
            key={chapter._id.toString()}
            className="p-6 border rounded-2xl bg-white shadow-sm hover:shadow-md transition duration-300"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {chapter.name}
            </h2>

            {chapter.topics && chapter.topics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {chapter.topics.map((topic: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No topics yet.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
