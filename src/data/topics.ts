import { Topic } from "@/components/TopicPage";

export const topics: Record<string, Topic> = {
  algebra: {
    id: "algebra",
    name: "Algebra",
    description: "Covers equations, polynomials, and algebraic identities.",
    questions: [
      {
        id: 1,
        type: "objective",
        question: "If x + 2 = 5, what is x?",
        options: ["1", "2", "3", "4"],
        answer: "3",
        isPreviousYear: true,
      },
      {
        id: 2,
        type: "numeric",
        question: "Find the value of 2x when x = 7.",
        answer: 14,
      },
      {
        id: 3,
        type: "subjective",
        question: "Explain the difference between linear and quadratic equations.",
      },
      {
        id: 4,
        type: "paragraph",
        question: "Discuss the importance of polynomials in real life.",
      },
    ],
  },

  mechanics: {
    id: "mechanics",
    name: "Physics - Mechanics",
    description:
      "Covers motion, laws of motion, work, energy, power, gravitation, and rotational dynamics.",
    questions: [
      {
        id: 1,
        type: "objective",
        question: "A car accelerates uniformly from 0 to 20 m/s in 10 seconds. What is its acceleration?",
        options: ["1 m/s²", "2 m/s²", "5 m/s²", "10 m/s²"],
        answer: "2 m/s²",
        isPreviousYear: true,
      },
      {
        id: 2,
        type: "numeric",
        question: "A body of mass 5 kg is lifted to a height of 10 m. Find the potential energy gained. (g = 9.8 m/s²)",
        answer: 490,
      },
      {
        id: 3,
        type: "subjective",
        question: "State and explain Newton’s three laws of motion with examples.",
      },
      {
        id: 4,
        type: "paragraph",
        question: "Discuss the role of mechanics in engineering and everyday life applications.",
      },
      {
        id: 5,
        type: "objective",
        question: "A projectile is launched at 45° with a velocity of 20 m/s. What is its maximum height? (g = 10 m/s²)",
        options: ["5 m", "10 m", "15 m", "20 m"],
        answer: "10 m",
        isPreviousYear: true,
      },
      {
        id: 6,
        type: "numeric",
        question: "A force of 50 N is applied to move a block of 10 kg. Find the acceleration produced. (Assume no friction)",
        answer: 5,
      },
    ],
  },
};
