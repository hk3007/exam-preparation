// src/components/NewsFeed.tsx
"use client";

export interface Article {
  title: string;
  date: string;
  link: string;
}

export interface NewsItem {
  exam: string;
  articles: Article[];
}

interface NewsFeedProps {
  news: NewsItem[];
}

export default function NewsFeed({ news }: NewsFeedProps) {
  return (
    <div className="space-y-6">
      {news.map((n, index) => (
        <div key={index}>
          <h2 className="text-xl font-bold">{n.exam} News</h2>
          <div className="space-y-2 mt-2">
            {n.articles.map((a, articleIndex) => (
              <a
                key={articleIndex}
                href={a.link}
                target="_blank"
                rel="noreferrer"
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
