export async function getPreviousYearQuestions(examId: string, subjectId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/previousyears/${examId}/${subjectId}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch previous year questions");

  return res.json();
}
