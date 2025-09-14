import ExamPage from "@/components/ExamPage";

export async function generateStaticParams() {
  return []; // dynamic rendering
}

export default async function ExamRoute({
  params,
}: {
  params: Promise<{ examid: string }>;
}) {
  const { examid } = await params; // ✅ await the params object

  return <ExamPage examId={examid} />;
}
