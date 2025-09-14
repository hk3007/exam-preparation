import ExamPage from "@/components/ExamPage";

export async function generateStaticParams() {
  // Optional: leave empty to fetch dynamically at runtime
  return [];
}

export default function ExamRoute({
  params,
}: {
  params: { examid: string };
}) {
  const { examid } = params;

  // ✅ Pass MongoDB examId directly to the component
  return <ExamPage examId={examid} />;
}
