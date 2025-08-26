import ExamPage from "@/components/ExamPage";

export default async function ExamRoute({ params }: { params: Promise<{ examid: string }> }) {
  const { examid } = await params;
  return <ExamPage examId={examid.toUpperCase()} />;
}
