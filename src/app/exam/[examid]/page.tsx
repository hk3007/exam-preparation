import ExamPage from "@/components/ExamPage";
import { exams, ExamId } from "@/data/exams";

export async function generateStaticParams() {
  return Object.keys(exams).map((examid) => ({
    examid,
  }));
}

export default async function ExamRoute({
  params,
}: {
  params: Promise<{ examid: string }>;
}) {
  // ✅ await params
  const { examid } = await params;

  const upperId = examid.toUpperCase() as ExamId;
  const exam = exams[upperId];

  if (!exam) {
    return <p className="text-center py-10">Exam not found.</p>;
  }

  // ✅ ExamPage fetches exam details from API
  return <ExamPage examId={upperId} />;
}
