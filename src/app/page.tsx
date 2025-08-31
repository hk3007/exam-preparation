import { connectDB } from "@/lib/mongodb";
import Exam from "@/models/Exam";
import Topic from "@/models/Topic";
import Paper from "@/models/Paper";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, GraduationCap } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  await connectDB();

  const exams = await Exam.find().lean();
  const topics = await Topic.find().limit(3).lean();
  const papers = await Paper.find().limit(2).lean();

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section
  className="text-center py-20 rounded-b-[50%] shadow-md container mx-auto px-6"
  style={{
    background: 'linear-gradient(to right, #F5F5DC, #F5F5DC)'
  }}
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
          {exams.map((exam: any) => (
            <Card key={exam._id} className="hover:shadow-lg transition rounded-xl items-center justify-center" >
              <CardHeader className="items-center justify-center">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5  text-blue-500" /> {exam.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 " >
                <p className="text-sm text-gray-600 ">
                  {exam.subjects.join(", ")}
                </p>
                <Link href={`/exam/${exam.name}`}>
                  <Button variant="outline" className="w-full">
                    Explore {exam.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Topics */}
      <section className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Popular Topics & Chapters
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {topics.map((topic: any) => (
            <Card key={topic._id} className="rounded-xl">
              <CardHeader>
                <CardTitle>{topic.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{topic.description}</p>
                <Link href={topic.link || "#"}>
                  <Button variant="ghost" className="mt-4">
                    View Topic →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Previous Year Papers */}
      <section className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Previous Year Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {papers.map((paper: any) => (
            <Card key={paper._id} className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" /> {paper.exam} {paper.year}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{paper.description}</p>
                <Link href={paper.link || "#"}>
                  <Button variant="outline" className="mt-4">
                    View Paper
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* footer */}
      <section className="text-center py-16 rounded-2xl shadow-md container mx-auto px-6">
       footer
      </section>
    </div>
  );
}
