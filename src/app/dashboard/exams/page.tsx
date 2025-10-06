"use client";

import React, { useEffect, useState, useCallback } from "react";
// Assuming you have 'react-hot-toast' installed for notifications
import { toast, Toaster } from "react-hot-toast"; 
import { Trash2, Edit, Calendar, Plus, Loader2 } from 'lucide-react'; // Using Lucide React icons

// --- TYPE DEFINITIONS ---
type ExamData = {
  _id: string;
  name: string;
  upcomingDate?: string;
  description?: string;
};

// --- Custom Delete Confirmation Modal Component ---
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  examName: string;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, examName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4" aria-modal="true">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100">
        <div className="flex flex-col items-center">
          <Trash2 className="w-12 h-12 text-red-500 mb-4 bg-red-100 p-2 rounded-full" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Deletion</h3>
          <p className="text-center text-gray-600 mb-6">
            Are you sure you want to permanently delete the exam: 
            <span className="font-semibold text-red-600 block mt-1">"{examName}"</span>?
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-md font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Exams Dashboard Component ---
export default function ExamsDashboard() {
  const [exams, setExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<ExamData | null>(null);

  // Function to fetch data
  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      
      // REAL API FETCH: Fetching exam data from the backend
      const res = await fetch("/api/exams");
      if (!res.ok) throw new Error("Failed to fetch exams");
      const data = await res.json();
      setExams(data.exams || []);

    } catch (err) {
      toast.error("Error fetching exams.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  // Handle delete click to open modal
  const handleDeleteClick = (exam: ExamData) => {
    setExamToDelete(exam);
    setIsModalOpen(true);
  };

  // Execute delete action
  const confirmDelete = async () => {
    if (!examToDelete) return;

    const id = examToDelete._id;
    setIsModalOpen(false); // Close modal immediately
    toast.loading(`Deleting ${examToDelete.name}...`, { id: 'deleteToast' });

    try {
      // REAL API DELETE: Deleting the exam record
      const res = await fetch(`/api/exam/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete exam");
      
      toast.success("Exam deleted successfully!", { id: 'deleteToast' });
      setExams(prev => prev.filter(exam => exam._id !== id));
    } catch (err) {
      toast.error("Error deleting exam.", { id: 'deleteToast' });
    } finally {
      setExamToDelete(null);
    }
  };

  const EmptyState = () => (
    <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-200 mt-8">
      <Calendar className="w-16 h-16 text-sky-400 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800">No Exams Defined</h2>
      <p className="text-gray-500 mt-2">Start by creating your first competitive examination record.</p>
      <a
        href="/dashboard/admin/create-exam"
        className="mt-6 inline-flex items-center bg-sky-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-sky-700 transition transform hover:scale-[1.02]"
      >
        <Plus className="w-5 h-5 mr-2" />
        Create New Exam
      </a>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="animate-pulse bg-white rounded-xl shadow-lg p-6 h-48 border border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="flex gap-3 mt-6">
            <div className="h-10 bg-gray-200 rounded-lg w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10 font-sans">
      <Toaster position="top-right" />
      
      {/* Header and Call to Action */}
      <header className="mb-8 flex justify-between items-center border-b pb-4 border-gray-200">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-1">Exams Manager</h1>
          <p className="text-gray-600">Quickly view, update, and delete competitive examination records.</p>
        </div>
        <a
          href="/dashboard/admin/create-exam"
          className="inline-flex items-center bg-sky-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-sky-700 transition transform hover:scale-[1.05] font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Exam
        </a>
      </header>

      {/* Main Content Area */}
      {loading ? (
        <LoadingSkeleton />
      ) : exams.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {exams.map(exam => (
            <div 
              key={exam._id} 
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border-t-4 border-sky-500 transition duration-300 hover:shadow-xl hover:border-sky-600"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{exam.name}</h2>
                
                {/* Date Badge */}
                {exam.upcomingDate && (
                  <div className="flex items-center text-sm text-sky-600 font-medium my-3 bg-sky-50 py-1 px-3 rounded-full w-fit">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(exam.upcomingDate).toLocaleDateString()}
                  </div>
                )}
                
                {/* Description */}
                <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                  {exam.description || 'No detailed description available.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <a
                  href={`/dashboard/admin/edit-exam/${exam._id}`}
                  className="flex-1 flex items-center justify-center text-center bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition shadow-md font-medium"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update
                </a>
                <button
                  onClick={() => handleDeleteClick(exam)}
                  className="flex-1 flex items-center justify-center text-center bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition shadow-md font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal Render */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        examName={examToDelete?.name || ''}
      />
    </div>
  );
}
