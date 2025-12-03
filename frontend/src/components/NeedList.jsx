import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import NeedCard from "./NeedCard";

const NeedList = () => {
  const [allNeeds, setAllNeeds] = useState([]); // Store all fetched needs
  const [filteredNeeds, setFilteredNeeds] = useState([]); // Display filtered needs
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const searchTimeoutRef = useRef(null);

  // Fetch all needs once
  const fetchNeeds = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError("");

      const response = await axios.get(`/api/needs`);

      if (response.data.success) {
        setAllNeeds(response.data.data);
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

  // Client-side filtering
  useEffect(() => {
    let result = [...allNeeds];

    // Filter by status
    if (filterStatus === 'urgent') {
      result = result.filter(need => !need.supplied);
    } else if (filterStatus === 'supplied') {
      result = result.filter(need => need.supplied);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(need => 
        need.location?.toLowerCase().includes(query) ||
        need.name?.toLowerCase().includes(query) ||
        need.description?.toLowerCase().includes(query) ||
        need.items?.some(item => item.name.toLowerCase().includes(query))
      );
    }

    // Sort: urgent first, then by date
    result.sort((a, b) => {
      if (a.supplied !== b.supplied) {
        return a.supplied ? 1 : -1;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredNeeds(result);
  }, [allNeeds, searchQuery, filterStatus]);

  // Initial fetch
  useEffect(() => {
    fetchNeeds();
  }, []);

  const handleRefresh = () => {
    fetchNeeds(true);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 text-lg font-medium mt-6">Loading needs...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error && allNeeds.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Relief Needs
          </h2>
          {filteredNeeds.length > 0 && (
            <p className="text-gray-500 mt-1">
              <span className="font-semibold text-blue-600">{filteredNeeds.length}</span> {filteredNeeds.length === 1 ? 'request' : 'requests'} found
              {(searchQuery || filterStatus !== 'all') && allNeeds.length !== filteredNeeds.length && (
                <span className="text-gray-400"> (filtered from {allNeeds.length})</span>
              )}
            </p>
          )}
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="group relative p-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-blue-200"
          aria-label="Refresh needs"
        >
          <svg
            className={`w-6 h-6 ${isRefreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
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
          
          {/* Tooltip */}
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Refresh list
          </span>
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by location, name, items..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
          />
          <svg 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              All Needs
            </span>
          </button>
          
          <button
            onClick={() => handleFilterChange('urgent')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              filterStatus === 'urgent'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Urgent Only
            </span>
          </button>
          
          <button
            onClick={() => handleFilterChange('supplied')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              filterStatus === 'supplied'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Supplied
            </span>
          </button>
        </div>
      </div>

      {/* Error Message (if any while data exists) */}
      {error && allNeeds.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-5 py-4 rounded-xl mb-6 flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Needs List */}
      {filteredNeeds.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
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
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {searchQuery || filterStatus !== 'all' ? 'No matching needs found' : 'No needs posted yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Be the first to post a relief need and help your community'}
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{searchQuery || filterStatus !== 'all' ? 'Clear filters to see all needs' : 'Click "Report Need" to get started'}</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNeeds.map((need, index) => (
            <div
              key={need._id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <NeedCard need={need} onSupplied={fetchNeeds} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NeedList;