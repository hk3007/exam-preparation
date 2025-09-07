export default async function NewsPage() {
  // Get absolute URL dynamically
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/news`, { cache: "no-store" });
  const data = await res.json();

  if (!data.success) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          Latest Exam News
        </h1>
        <p className="text-red-500 text-center mt-10">
          Failed to load news.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center">
        Latest Exam News
      </h1>

      {data.news.map((examItem: any) => (
        <section key={examItem.exam} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
            {examItem.exam}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {examItem.articles
              .sort(
                (a: any, b: any) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((article: any, index: number) => (
                <div
                  key={article.id ?? index}
                  className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5 flex flex-col justify-between hover:scale-105 transition-transform duration-300"
                >
                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                    <a
                      href={article.link}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}
    </main>
  );
}
