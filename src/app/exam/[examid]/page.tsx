import ExamPage from "@/components/ExamPage";

export async function generateStaticParams() {
  // leave empty, we’ll fetch dynamically at runtime
  return [];
}

export default async function ExamRoute({
  params,
}: {
  params: Promise<{ examid: string }>;
}) {
  const { examid } = await params;

  // ✅ pass MongoDB examId directly
  return <ExamPage examId={examid} />;
}
