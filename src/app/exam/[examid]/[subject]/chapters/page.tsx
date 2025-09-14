import { connectDB } from "@/lib/mongodb";
import Chapter, { ChapterDoc } from "@/models/Chapter";
import Subject from "@/models/Subject";
import Exam from "@/models/Exam";
import mongoose, { Types } from "mongoose";
import Link from "next/link";
import { BookOpen, Bookmark } from "lucide-react";

interface SubjectType {
  _id: Types.ObjectId;
  name: string;
  examIds?: Types.ObjectId[];
}

interface ExamType {
  _id: Types.ObjectId;
  name: string;
}

interface ExamQuery {
  _id?: string;
  name?: string;
}

interface SubjectQuery {
  examIds: Types.ObjectId;
  _id?: string;
  name?: string;
}

export default async function ChaptersPage({
  params,
}: {
  params: Promise<{ examid: string; subject: string }>;
}) {
  const { examid, subject } = await params;

  await connectDB();

  // --- Find exam
  const examQuery: ExamQuery = mongoose.Types.ObjectId.isValid(examid)
    ? { _id: examid }
    : { name: examid };

  const exam = await Exam.findOne(examQuery).lean<ExamType>();
  if (!exam) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg font-semibold">
          ❌ Exam &quot;{examid}&quot; not found.
        </p>
      </div>
    );
  }

  // --- Find subject
  const subjectQuery: SubjectQuery = mongoose.Types.ObjectId.isValid(subject)
    ? { _id: subject, examIds: exam._id }
    : { name: subject, examIds: exam._id };

  const subjectDoc = await Subject.findOne(subjectQuery).lean<SubjectType>();
  if (!subjectDoc) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg font-semibold">
          ❌ Subject &quot;{subject}&quot; not found for exam &quot;{exam.name}&quot;.
        </p>
      </div>
    );
  }

  // --- Fetch chapters
  const chapters = await Chapter.find({
    subjectIds: subjectDoc._id,
  }).lean<ChapterDoc[]>();

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-4">
          {exam.name} – {subjectDoc.name}
        </h1>
        <p className="text-lg text-gray-600">
          📚 Explore interactive chapters and important topics for your exam prep.
        </p>
      </div>

      {/* No chapters */}
      {chapters.length === 0 && (
        <div className="flex justify-center">
          <p className="text-gray-500 text-lg">
            🚀 No chapters found for this subject. Stay tuned!
          </p>
        </div>
      )}

      {/* Chapters grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {chapters.map((chapter, _) => (
          <div
            key={crypto.randomUUID()}
            className="group p-6 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            {/* Chapter Title */}
            <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors">
              <BookOpen className="w-6 h-6 text-indigo-500" />
              {chapter.name}
            </h2>

            {/* Topics */}
            {chapter.topics && chapter.topics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {chapter.topics.map((topic, i) => {
                  if (typeof topic === "string") {
                    const slug = topic.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <Link key={i} href={`/topic/${slug}`}>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:scale-105 transition transform cursor-pointer shadow-sm flex items-center gap-1">
                          <Bookmark className="w-3 h-3" /> {topic}
                        </span>
                      </Link>
                    );
                  } else {
                    return (
                      <Link key={i} href={`/topic/${topic.slug}`}>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-700 hover:bg-pink-200 hover:scale-105 transition transform cursor-pointer shadow-sm flex items-center gap-1">
                          <Bookmark className="w-3 h-3" /> {topic.name}
                        </span>
                      </Link>
                    );
                  }
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No topics added yet.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}