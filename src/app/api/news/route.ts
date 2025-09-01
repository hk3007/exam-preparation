import { NextResponse } from "next/server";
import { fetchExamNews } from "@/lib/news";

export async function GET() {
  try {
    const queries = ["JEE MAIN", "NEET", "UPSC"];
    const results = await Promise.all(
      queries.map(async q => ({
        exam: q,
        articles: await fetchExamNews(q),
      }))
    );

    return NextResponse.json({ success: true, news: results });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
