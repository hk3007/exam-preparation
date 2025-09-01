"use client";

export default function NewsFeed({ news }: { news: any[] }) {
  return (
    <div className="space-y-6">
      {news.map((n, i) => (
        <div key={i}>
          <h2 className="text-xl font-bold">{n.exam} News</h2>
          <div className="space-y-2 mt-2">
            {n.articles.map((a: any, j: number) => (
              <a
                key={j}
                href={a.link}
                target="_blank"
                className="block border p-3 rounded-lg hover:bg-gray-100"
              >
                <p className="font-medium">{a.title}</p>
                <p className="text-xs text-gray-500">{a.date}</p>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
