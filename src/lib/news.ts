import Parser from "rss-parser";
const parser = new Parser();

export async function fetchExamNews(query: string) {
  const feed = await parser.parseURL(
    `https://news.google.com/rss/search?q=${encodeURIComponent(query)}`
  );

  return feed.items.slice(0, 10).map(item => ({
    title: item.title,
    link: item.link,
    date: item.pubDate,
  }));
}
