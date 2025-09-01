import { connectDB } from "@/lib/mongodb";
import Chapter from "@/models/Chapter";
import Subject from "@/models/Subject";
import Exam from "@/models/Exam";
import mongoose, { Types } from "mongoose";

// ✅ Types
interface ChapterType {
  _id: Types.ObjectId;
  name: string;
  topics?: string[];
  subjectIds?: Types.ObjectId[];
}

interface SubjectType {
  _id: Types.ObjectId;
  name: string;
  examIds?: Types.ObjectId[];
}

interface ExamType {
  _id: Types.ObjectId;
  name: string;
  upcomingDate?: string;
  description?: string;
  subjects?: string[];
  questionPaperPattern?: string;
  eligibility?: object;
  examDates?: object;
  examOverview?: object;
  posts?: object[];
}

export default async function ChaptersPage({
  params,
}: {
  params: Promise<{ examid: string; subject: string }>;
}) {
  const { examid, subject } = await params;

  await connectDB();

  // --- 1. Find exam (by ID if valid, else by name)
  let examQuery: any = {};
  if (mongoose.Types.ObjectId.isValid(examid)) {
    examQuery._id = examid;
  } else {
    examQuery.name = examid;
  }

  const exam = await Exam.findOne(examQuery).lean<ExamType>();
  if (!exam) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg font-semibold">
          ❌ Exam "{examid}" not found.
        </p>
      </div>
    );
  }

  // --- 2. Find subject (by ID if valid, else by name)
  let subjectQuery: any = { examIds: exam._id };
  if (mongoose.Types.ObjectId.isValid(subject)) {
    subjectQuery._id = subject;
  } else {
    subjectQuery.name = subject;
  }

  const subjectDoc = await Subject.findOne(subjectQuery).lean<SubjectType>();
  if (!subjectDoc) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg font-semibold">
          ❌ Subject "{subject}" not found for exam "{exam.name}".
        </p>
      </div>
    );
  }

  // --- 3. Fetch chapters
  const chapters = await Chapter.find({
    subjectIds: subjectDoc._id,
  }).lean<ChapterType[]>();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          {exam.name} – <span className="text-indigo-600">{subjectDoc.name}</span>
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
                {chapter.topics.map((topic, i) => (
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
