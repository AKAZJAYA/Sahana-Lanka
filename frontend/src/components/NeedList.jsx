// filepath: frontend/src/components/NeedList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import NeedCard from "./NeedCard";

const NeedList = () => {
  const [needs, setNeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchNeeds = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError("");

      const response = await axios.get("/api/needs");

      if (response.data.success) {
        setNeeds(response.data.data);
      } else {
        setError("Failed to load needs");
      }
    } catch (err) {
      console.error("Error fetching needs:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load needs. Please check your connection."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNeeds();
  }, []);

  const handleRefresh = () => {
    fetchNeeds(true);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading needs...</p>
        </div>
      </div>
    );
  }

  if (error && needs.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Relief Needs
          {needs.length > 0 && (
            <span className="ml-2 text-lg text-gray-600 font-normal">
              ({needs.length})
            </span>
          )}
        </h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label="Refresh needs"
        >
          <svg
            className={`w-6 h-6 ${isRefreshing ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Error Message (if any while data exists) */}
      {error && needs.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Needs List */}
      {needs.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No needs posted yet
          </h3>
          <p className="text-gray-600">Be the first to post a relief need</p>
        </div>
      ) : (
        <div>
          {needs.map((need) => (
            <NeedCard key={need._id} need={need} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NeedList;
