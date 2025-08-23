import SearchBar from "@/ui/SearchBar";
import Calendar from "@/ui/Calendar";
import ExamCard from "@/ui/ExamCard";
import Timer from "@/ui/Timer";
import QuestionCard from "@/ui/QuestionCard";

export default function Dashboard() {
  return (
    <div>
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-10">
        {/* Search Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Find Exams & Courses</h2>
          <SearchBar />
        </section>

        {/* Calendar Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Upcoming Exams</h2>
          <Calendar />
        </section>

        {/* Exam Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ExamCard
              title="Math Mock Test"
              date="12 Oct 2025"
              description="Practice algebra, geometry, and calculus with timed questions."
            />
            <ExamCard
              title="Science Quiz"
              date="15 Oct 2025"
              description="Covers physics, chemistry, and biology MCQs."
            />
            <ExamCard
              title="English Grammar"
              date="18 Oct 2025"
              description="Improve grammar and comprehension skills."
            />
          </div>
        </section>

        {/* Timer + Question Example */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Practice Mode</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Timer */}
            <div className="p-4 border rounded-lg w-fit">
              <h3 className="font-semibold mb-2">Time Left</h3>
              <Timer initialMinutes={10} />
            </div>

            {/* Question Card */}
            <QuestionCard
              question="Which of the following is a prime number?"
              options={["21", "29", "35", "49"]}
              answer="29"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
