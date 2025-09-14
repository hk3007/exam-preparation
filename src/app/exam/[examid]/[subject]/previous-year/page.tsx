import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getPreviousYearQuestions(examid: string, subject: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/previousyears/${examid}/${subject}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch previous year questions");
  return res.json();
}

export default async function PreviousYearPage({
  params,
}: {
  params: Promise<{ examid: string; subject: string }>;
}) {
  // Await params before destructuring
  const { examid, subject } = await params;

  let data: any[] = [];
  try {
    const res = await getPreviousYearQuestions(examid, subject);
    data = res.data || [];
  } catch (err) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg font-semibold text-center">
          ❌ Failed to fetch previous year questions.
        </p>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Previous Year Questions
      </h1>

      {data.length === 0 && <p className="text-center">No questions found.</p>}

      {data.map((paper: any) => (
        <Card key={paper._id} className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>{paper.year} Question Paper</CardTitle>
          </CardHeader>
          <CardContent>
            {paper.questions.map((q: any, idx: number) => (
              <div key={idx} className="mb-4">
                <p className="font-medium">{idx + 1}. {q.question}</p>
                <div className="pl-4 mt-2">
                  {q.options.map((opt: string, i: number) => (
                    <p key={i} className="text-gray-700">• {opt}</p>
                  ))}
                  <p className="mt-1 text-green-600">
                    Correct Answer: {q.answer}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
