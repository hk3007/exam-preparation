"use client";

type ExamCardProps = {
  title: string;
  date: string;
  description: string;
};

export default function ExamCard({ title, date, description }: ExamCardProps) {
  return (
    <div className="border rounded-lg shadow p-4 hover:shadow-md transition">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-gray-500 text-sm">{date}</p>
      <p className="mt-2">{description}</p>
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Start Practice
      </button>
    </div>
  );
}
