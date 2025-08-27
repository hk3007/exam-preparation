"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-md container mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Welcome to ExamPrep Knowledge Hub
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Access detailed study material, topics, and previous year questions with
          solutions for UPSC, JEE, NEET, and School level exams.
        </p>
        <Button className="mt-8">Start Exploring</Button>
      </section>

      {/* Browse by Exam Category */}
      <section className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Browse by Exam
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-500" /> UPSC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Polity, History, Geography, Current Affairs
              </p>
              <Button variant="outline" className="w-full">
                Explore UPSC
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-green-500" /> NEET
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Biology, Physics, Chemistry
              </p>
              <Link href="/exam/NEET">
              <Button variant="outline" className="w-full">
                Explore NEET
              </Button></Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-orange-500" /> JEE
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Maths, Physics, Chemistry
              </p>
              <Link href="/exam/JEE">
              <Button variant="outline" className="w-full">
                Explore JEE
              </Button></Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Topics Section */}
      <section className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Popular Topics & Chapters
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Physics - Mechanics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Includes concepts, solved examples & PYQs
              </p>
              <Link href='/topic/mechanics' passHref>
                <Button asChild variant="ghost" className="mt-4">
                    <span>View Topic →</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Chemistry - Organic Compounds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Detailed notes with previous year analysis
              </p>
              <Button variant="ghost" className="mt-4">
                View Topic →
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Biology - Human Physiology</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Chapter-wise breakdown & solved MCQs
              </p>
              <Button variant="ghost" className="mt-4">
                View Topic →
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Previous Year Question Papers */}
      <section className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Previous Year Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" /> NEET 2023
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Full question paper with detailed solutions
              </p>
              <Button variant="outline" className="mt-4">
                View Paper
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-500" /> JEE Mains 2023
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Chapter-wise solutions included
              </p>
              <Button variant="outline" className="mt-4">
                View Paper
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-indigo-50 rounded-2xl shadow-md container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Start Your Preparation Today
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          Explore thousands of topics, solved examples, and previous year papers
          at one place.
        </p>
        <Button size="lg">Explore Now</Button>
      </section>
    </div>
  );
}
