import ExamPage from "@/components/ExamPage";

export const dynamic = "force-dynamic"; // ✅ Force dynamic rendering

export async function generateStaticParams() {
  return []; // ✅ No static paths
}

export default async function ExamRoute({
  params,
}: {
  params: Promise<{ examid: string }>;
}) {
  const { examid } = await params;
  return <ExamPage examId={examid} />;
}
