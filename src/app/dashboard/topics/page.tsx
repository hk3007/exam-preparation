"use client";

import React, { useState, useEffect, useCallback } from 'react';
import CreateEditTopicModal from './create-edit-modal';
import type { TopicLean, DescriptionNode  } from "@/models/Topic";

// Define a simpler type for the list view
type TopicListItem = Omit<TopicLean, 'description'>; 

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];

interface ModalProps {
  // Ensure the DescriptionNode[] type here is the one from your model file
  initialData: TopicLean | null; 
}

export default function TopicsCrudPage() {
  const [topics, setTopics] = useState<TopicListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<TopicLean | null>(null); // Topic being edited/viewed

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]); // Default to 10

  // --------------------
  // Fetch Data Operation (Read)
  // --------------------
  const fetchTopics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: This fetches ALL data for client-side pagination. 
      // For large datasets, server-side pagination in the API is required.
      const res = await fetch('/api/topic'); 
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch topics: ${res.status} ${errorText}`);
      }
      const data = await res.json();
      setTopics(data);
    } catch (err: any) {
      setError(`Could not load topics. Error: ${err.message || 'Check console for details.'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  // Reset page to 1 whenever the itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);


  // --------------------
  // CRUD Operations
  // --------------------
  const handleEdit = async (slug: string) => {
    try {
      // Fetch the full topic data including the nested description
      const res = await fetch(`/api/topic/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch single topic');
      const fullTopic = await res.json();
      
      setCurrentTopic(fullTopic);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      // NOTE: Using a custom modal instead of alert is better practice
      alert('Failed to load topic for editing.'); 
    }
  };

  const handleDelete = async (slug: string) => {
    // NOTE: Using a custom modal instead of window.confirm is better practice
    if (!window.confirm(`Are you sure you want to delete topic: ${slug}?`)) return; 

    try {
      const res = await fetch(`/api/topic/${slug}`, { method: 'DELETE' });
       if (!res.ok) {
      // Attempt to read the error message from the JSON body
      let errorMessage = 'Failed to delete topic';
      try {
        const errorData = await res.json();
        // Check if the API returned a custom message (like "Topic not found" or "Error deleting topic")
        errorMessage = errorData.message || errorMessage; 
      } catch (e) {
        // If the response wasn't JSON, use a generic message with the status
        errorMessage = `Failed to delete topic. Status: ${res.status}`;
      }
      
      throw new Error(errorMessage);
    }

      // Optimistically update UI
      setTopics(prev => prev.filter(t => t.slug !== slug));
      alert('Topic deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to delete topic.');
    }
  };
  
  const handleCreate = () => {
    setCurrentTopic(null); // Set to null for create mode
    setIsModalOpen(true);
  };
  
  const handleCloseModal = (refresh: boolean = false) => {
    setIsModalOpen(false);
    setCurrentTopic(null);
    if (refresh) {
      fetchTopics(); // Refetch data after successful Create/Edit
    }
  };

  // --------------------
  // Pagination Calculations
  // --------------------
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTopics = topics.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(topics.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Only render a manageable number of page buttons (e.g., 5 around the current page)
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-3 py-1 rounded-lg transition ${
            i === currentPage
              ? 'bg-sky-600 text-white font-bold'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }
    // Add dots for far pages
    if (startPage > 1) {
      pageNumbers.unshift(<span key="start-dots" className="px-2">...</span>);
      pageNumbers.unshift(
        <button key={1} onClick={() => paginate(1)} className="px-3 py-1 rounded-lg bg-white text-gray-700 hover:bg-gray-100">1</button>
      );
    }
    if (endPage < totalPages) {
      pageNumbers.push(<span key="end-dots" className="px-2">...</span>);
      pageNumbers.push(
        <button key={totalPages} onClick={() => paginate(totalPages)} className="px-3 py-1 rounded-lg bg-white text-gray-700 hover:bg-gray-100">{totalPages}</button>
      );
    }
    return pageNumbers;
  };


  if (loading && topics.length === 0) return <p className="p-8">Loading topics...</p>;
  if (error) return <p className="p-8 text-red-600 font-medium border border-red-300 bg-red-50 rounded-lg">{error}</p>;


  return (
    <div className="p-4 sm:p-8 font-sans">
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b-4 border-sky-500 inline-block pb-1">
          Manage Topics
        </h1>
        
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <button 
                onClick={handleCreate} 
                className="bg-sky-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-700 transition shadow-md"
            >
                + Create New Topic
            </button>

            {/* Items Per Page Selector */}
            <div className="flex items-center space-x-2">
                <label htmlFor="itemsPerPage" className="text-sm text-gray-700">Items per page:</label>
                <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
                >
                    {ITEMS_PER_PAGE_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>
        </div>

        {/* Mobile View Placeholder */}
        <div className="lg:hidden p-4 bg-yellow-50 border border-yellow-300 rounded-lg mb-4 text-sm text-yellow-800">
            <p className="font-semibold">Table View Disabled on Mobile</p>
            <p>Please use a laptop or desktop screen size (large screen) to view and manage the full topics table.</p>
            {/* Simple list view for mobile (optional) */}
            {topics.length > 0 && (
                <div className="mt-2 space-y-1">
                    <p className="font-bold">Total Topics: {topics.length}</p>
                </div>
            )}
        </div>

        {/* Laptop/Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto shadow-xl rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTopics.map((topic) => (
                <tr key={topic._id.toString()} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{topic.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{topic.exam}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sky-600">{topic.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{topic.views}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(topic.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(topic.slug)} className="text-indigo-600 hover:text-indigo-800 mr-4 transition duration-150">Edit</button>
                    <button onClick={() => handleDelete(topic.slug)} className="text-red-600 hover:text-red-800 transition duration-150">Delete</button>
                  </td>
                </tr>
              ))}
              {currentTopics.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No topics found for this page.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <p className="text-sm text-gray-700">
                    Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to <span className="font-semibold">{Math.min(indexOfLastItem, topics.length)}</span> of <span className="font-semibold">{topics.length}</span> results
                </p>

                <div className="flex space-x-1">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Previous
                    </button>

                    {renderPageNumbers()}
                    
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Next
                    </button>
                </div>
            </div>
        )}

      </div>

    {isModalOpen && (
    <CreateEditTopicModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        initialData={currentTopic} 
    />
    )}
    </div>
  );
}
