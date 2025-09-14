import { connectDB } from "@/lib/mongodb";
import Exam from "@/models/Exam";
import Topic from "@/models/Topic";
import Paper from "@/models/Paper";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, GraduationCap } from "lucide-react";
import Link from "next/link";

// Define interfaces for the data models (plain objects, not Mongoose Documents)
interface ExamType {
  _id: string;
  name: string;
  subjects: string[];
}

interface TopicType {
  _id: string;
  name: string;
  views: number;
}

interface PaperType {
  _id: string;
  exam: string;
  year: number;
  description: string;
  link: string;
}

// Helper to slugify topic name into URL
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // spaces → dashes
    .replace(/&/g, "-and-") // & → 'and'
    .replace(/[^\w\-]+/g, "") // remove non-word chars
    .replace(/\-\-+/g, "-"); // collapse dashes
}

export default async function HomePage() {
  await connectDB();

  const exams = await Exam.find().lean<ExamType[]>();
  const topics = await Topic.find().limit(3).lean<TopicType[]>();
  const papers = await Paper.find().limit(2).lean<PaperType[]>();

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section
        className="text-center py-20 rounded-b-[50%] shadow-md container mx-auto px-6"
        style={{ background: "linear-gradient(to right, #F5F5DC, #F5F5DC)" }}
      >
        <h1 className="text-4xl text-black md:text-5xl font-bold mb-6">
          Welcome to ExamPrep Knowledge Hub
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Access detailed study material, topics, and previous year questions with
          solutions for UPSC, JEE, NEET, and School level exams.
        </p>
        <Link href="#exams-section">
          <Button className="mt-8 bg-black text-white hover:bg-white hover:text-black">
            Start Exploring
          </Button>
        </Link>
      </section>

      {/* Browse by Exam */}
      <section id="exams-section" className="container mx-auto scroll-mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Browse by Exam
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-5">
          {exams.map((exam) => (
            <Card
              key={exam._id}
              className="rounded-2xl border border-indigo-100 shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 bg-gradient-to-b from-indigo-50 to-white flex flex-col justify-between"
            >
              <CardHeader className="flex flex-col items-center gap-3 text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center shadow-inner">
                  <GraduationCap className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-xl font-bold text-indigo-800">
                  {exam.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center gap-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {exam.subjects?.map((sub, _) => (
                    <span
                      key={crypto.randomUUID()}
                      className="px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full"
                    >
                      {sub}
                    </span>
                  ))}
                </div>

                {exam.name ? (
                  <Link href={`/exam/${exam.name}`} className="w-full">
                    <Button className="w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                      Explore {exam.name} →
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full rounded-xl cursor-not-allowed opacity-50"
                  >
                    Exam Link Not Available
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Topics & Chapters */}
      <section className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Popular Topics & Chapters
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {topics.map((topic) => {
            const topicLink = `/topic/${slugify(topic.name)}`;
            return (
              <Card
                key={topic._id}
                className="rounded-2xl border border-indigo-100 shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 bg-gradient-to-b from-indigo-50 to-white"
              >
                <CardHeader className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold text-indigo-800 leading-snug">
                    {topic.name}
                  </CardTitle>
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    👁 {topic.views ?? 0}
                  </span>
                </CardHeader>

                <CardContent className="mt-6 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-bold shadow-inner">
                    {topic.name.charAt(0)}
                  </div>

                  <Link href={topicLink} className="w-full">
                    <Button
                      variant="default"
                      className="w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                      Explore Topic →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Previous Year Papers */}
      <section className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Previous Year Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {papers.map((paper) => (
            <Card key={paper._id} className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" /> {paper.exam}{" "}
                  {paper.year}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{paper.description}</p>
                {paper.link ? (
                  <Link href={paper.link}>
                    <Button variant="outline" className="mt-4">
                      View Paper
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    className="mt-4 cursor-not-allowed opacity-50"
                  >
                    Paper Link Not Available
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <section className="text-center py-16 bg-gray-100 rounded-t-3xl shadow-inner">
        <p className="text-gray-600">
          © {new Date().getFullYear()} ExamPrep. All rights reserved.
        </p>
      </section>
    </div>
  );
}