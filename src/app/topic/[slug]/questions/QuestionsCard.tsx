import Link from "next/link";

export default function QuestionsCard({ slug }: { slug: string }) {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 sticky top-24 h-fit">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Questions</h2>

      <div className="flex flex-col gap-4">
        <Link
          href={`/topic/${slug}/questions/previous`}
          className="block py-3 px-4 rounded-lg bg-teal-600 text-white text-center font-medium hover:bg-teal-700 transition"
        >
          Previous Year Questions
        </Link>
        <Link
          href={`/topic/${slug}/questions/practice`}
          className="block py-3 px-4 rounded-lg bg-amber-500 text-white text-center font-medium hover:bg-amber-600 transition"
        >
          Practice Questions
        </Link>
      </div>
    </div>
  );
}
