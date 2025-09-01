import NewsFeed from "@/components/NewsFeed";

export default async function NewsPage() {
  const res = await fetch("http://localhost:3000/api/news", {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Latest Exam News</h1>
      {data.success ? (
        <NewsFeed news={data.news} />
      ) : (
        <p className="text-red-500">Failed to load news.</p>
      )}
    </main>
  );
}
