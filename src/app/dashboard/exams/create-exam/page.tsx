"use client";

import React, { useState } from "react";

// --- TYPE DEFINITIONS ---
type FormData = {
  name: string;
  upcomingDate: string;
  description: string;
  subjects: string;
  questionPaperPattern: string;
  nationality: string;
  ageMin: string;
  ageMax: string;
  ageRelaxations: string;
  education: string;
  primaryAttemptLimit: string;
  secondaryAttemptLimit: string;
  notificationDate: string;
  applicationStart: string;
  applicationEnd: string;
  primaryExamDate: string;
  secondaryExamDate: string;
  conductingBody: string;
  officialWebsite: string;
  vacancies: string;
  examLevel: string;
  examMode: string;
  applicationFee: string;
  languages: string;
  primaryPapers: string;
  secondaryPapers: string;
  stages: string;
  posts: string;
};

// --- INITIAL FORM STATE ---
const INITIAL_FORM_DATA: FormData = {
  name: "",
  upcomingDate: "",
  description: "",
  subjects: "",
  questionPaperPattern: "",
  nationality: "",
  ageMin: "17",
  ageMax: "25",
  ageRelaxations: "",
  education: "",
  primaryAttemptLimit: "",
  secondaryAttemptLimit: "",
  notificationDate: "",
  applicationStart: "",
  applicationEnd: "",
  primaryExamDate: "",
  secondaryExamDate: "",
  conductingBody: "",
  officialWebsite: "",
  vacancies: "",
  examLevel: "",
  examMode: "",
  applicationFee: "",
  languages: "",
  primaryPapers: "2",
  secondaryPapers: "2",
  stages: "",
  posts: "",
};

// --- REUSABLE INPUT COMPONENT (Moved outside and Memoized) ---
// This prevents unnecessary re-renders of the input field when other state changes.
const InputField: React.FC<{
  name: keyof FormData;
  placeholder: string;
  type?: string;
  required?: boolean;
  formData: FormData; // Pass formData as a prop
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; // Pass handleChange as a prop
}> = React.memo(({ name, placeholder, type = "text", required = false, formData, handleChange }) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 mb-1"
      >
        {placeholder} {required && <span className="text-red-500">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={formData[name] ?? ""}
          placeholder={placeholder}
          onChange={handleChange}
          rows={3}
          required={required}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition duration-150 shadow-sm"
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={formData[name] ?? ""}
          placeholder={placeholder}
          onChange={handleChange}
          required={required}
          min={type === "number" ? 0 : undefined}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition duration-150 shadow-sm"
        />
      )}
    </div>
  );
});

InputField.displayName = 'InputField'; // Recommended for React DevTools

export default function CreateExamPage() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // When you type, this update causes the parent to re-render.
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("Creating exam...");

    try {
      const payload = {
        name: formData.name,
        upcomingDate: formData.upcomingDate,
        description: formData.description,
        subjects: formData.subjects.split(",").map((s) => s.trim()).filter(Boolean),
        questionPaperPattern: formData.questionPaperPattern,
        eligibility: {
          nationality: formData.nationality,
          age: {
            min: Number(formData.ageMin) || 0,
            max: Number(formData.ageMax) || 0,
            relaxations: formData.ageRelaxations,
          },
          education: formData.education,
          attemptLimit: {
            primaryExam: formData.primaryAttemptLimit,
            secondaryExam: formData.secondaryAttemptLimit,
          },
        },
        examDates: {
          notificationDate: formData.notificationDate,
          applicationStart: formData.applicationStart,
          applicationEnd: formData.applicationEnd,
          primaryExam: formData.primaryExamDate,
          secondaryExam: formData.secondaryExamDate,
        },
        examOverview: {
          conductingBody: formData.conductingBody,
          officialWebsite: formData.officialWebsite.split(",").map((w) => w.trim()).filter(Boolean),
          vacancies: formData.vacancies,
          examLevel: formData.examLevel,
          examMode: formData.examMode,
          applicationFee: formData.applicationFee,
          languages: formData.languages.split(",").map((l) => l.trim()).filter(Boolean),
          numberOfPapers: {
            primaryExam: Number(formData.primaryPapers) || 0,
            secondaryExam: Number(formData.secondaryPapers) || 0,
          },
          stages: formData.stages.split(",").map((s) => s.trim()).filter(Boolean),
        },
        posts: formData.posts.split(",").map((p) => p.trim()).filter(Boolean),
      };

      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create exam");

      setStatus("success");
      setMessage("Exam created successfully!");
      setFormData(INITIAL_FORM_DATA);

    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("An error occurred while creating the exam.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b-4 border-sky-500 inline-block pb-1">
          Create New Exam
        </h1>

        {status !== "idle" && (
          <div
            className={`p-4 mb-6 rounded-lg font-medium ${
              status === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pass state and handler as props to the memoized component */}
            <InputField name="name" placeholder="Exam Name" required formData={formData} handleChange={handleChange} />
            <InputField name="upcomingDate" placeholder="Upcoming Date" type="date" formData={formData} handleChange={handleChange} />
            <InputField name="description" placeholder="Description" type="textarea" formData={formData} handleChange={handleChange} />
            <InputField name="subjects" placeholder="Subjects (comma-separated)" formData={formData} handleChange={handleChange} />
            <InputField name="questionPaperPattern" placeholder="Question Paper Pattern" type="textarea" formData={formData} handleChange={handleChange} />
            <InputField name="posts" placeholder="Posts/Degrees (comma-separated)" formData={formData} handleChange={handleChange} />
            <InputField name="nationality" placeholder="Nationality" formData={formData} handleChange={handleChange} />
            <InputField name="education" placeholder="Education Requirement" formData={formData} handleChange={handleChange} />
            <InputField name="ageMin" placeholder="Age Min" type="number" formData={formData} handleChange={handleChange} />
            <InputField name="ageMax" placeholder="Age Max" type="number" formData={formData} handleChange={handleChange} />
            <InputField name="ageRelaxations" placeholder="Age Relaxations" formData={formData} handleChange={handleChange} />
            <InputField name="primaryAttemptLimit" placeholder="Primary Exam Attempt Limit" formData={formData} handleChange={handleChange} />
            <InputField name="secondaryAttemptLimit" placeholder="Secondary Exam Attempt Limit" formData={formData} handleChange={handleChange} />
            <InputField name="notificationDate" placeholder="Notification Date" type="date" formData={formData} handleChange={handleChange} />
            <InputField name="applicationStart" placeholder="Application Start Date" type="date" formData={formData} handleChange={handleChange} />
            <InputField name="applicationEnd" placeholder="Application End Date" type="date" formData={formData} handleChange={handleChange} />
            <InputField name="primaryExamDate" placeholder="Primary Exam Date" type="date" formData={formData} handleChange={handleChange} />
            <InputField name="secondaryExamDate" placeholder="Secondary Exam Date" type="date" formData={formData} handleChange={handleChange} />
            <InputField name="conductingBody" placeholder="Conducting Body" formData={formData} handleChange={handleChange} />
            <InputField name="officialWebsite" placeholder="Official Website(s, comma-separated)" formData={formData} handleChange={handleChange} />
            <InputField name="vacancies" placeholder="Vacancies" formData={formData} handleChange={handleChange} />
            <InputField name="examLevel" placeholder="Exam Level" formData={formData} handleChange={handleChange} />
            <InputField name="examMode" placeholder="Exam Mode" formData={formData} handleChange={handleChange} />
            <InputField name="applicationFee" placeholder="Application Fee" formData={formData} handleChange={handleChange} />
            <InputField name="languages" placeholder="Languages (comma-separated)" formData={formData} handleChange={handleChange} />
            <InputField name="primaryPapers" placeholder="Primary Exam Papers" type="number" formData={formData} handleChange={handleChange} />
            <InputField name="secondaryPapers" placeholder="Secondary Exam Papers" type="number" formData={formData} handleChange={handleChange} />
            <InputField name="stages" placeholder="Stages (comma-separated)" formData={formData} handleChange={handleChange} />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className={`w-full py-3 px-4 text-white font-bold rounded-lg shadow-lg transition duration-200 focus:outline-none focus:ring-4 focus:ring-sky-300 ${
              status === "loading"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-sky-600 hover:bg-sky-700 active:bg-sky-800"
            }`}
          >
            {status === "loading" ? "Submitting..." : "Create Exam Record"}
          </button>
        </form>
      </div>
    </div>
  );
}