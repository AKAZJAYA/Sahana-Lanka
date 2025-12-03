import React, { useState } from "react";
import NeedForm from "./components/NeedForm";
import NeedList from "./components/NeedList";
import axios from "axios";
// Import your header image
import floodReliefImage from "/header.png";

// Configure axios base URL
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

const App = () => {
  const [activeTab, setActiveTab] = useState("view");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sahana Sewa</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                SRI LANKA RELIEF
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("post")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 active:bg-red-800 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Report Need
          </button>
        </div>
      </header>

      {/* Hero Section */}
      {activeTab === "view" && (
        <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src={floodReliefImage}
              alt="Sri Lanka Flood Relief"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-blue-900/70 to-gray-900/80"></div>
          </div>

          {/* Badge */}
          <div className="relative max-w-7xl mx-auto px-4 pt-12">
            <div className="inline-flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Emergency Response: Flood Relief 2025
            </div>
          </div>

          {/* Main content */}
          <div className="relative max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Help Connect Those
              <br />
              In Need
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed">
              A community-powered platform to post and find relief needs during
              the Sri Lanka flood crisis. Your response could save lives and
              bring hope to families.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab("post")}
                className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 active:bg-red-800 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Report Need
              </button>
              <button
                onClick={() => {
                  document
                    .getElementById("needs-list")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/20 active:bg-white/30 transition-all"
              >
                View Needs List
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8" id="needs-list">
        {/* View Needs Tab */}
        {activeTab === "view" && (
          <div className="animate-fadeIn">
            <NeedList />
          </div>
        )}

        {/* Post Need Tab */}
        {activeTab === "post" && (
          <div className="animate-fadeIn">
            <div className="mb-6">
              <button
                onClick={() => setActiveTab("view")}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Needs List
              </button>
            </div>
            <NeedForm onSuccess={() => setActiveTab("view")} />
          </div>
        )}
      </main>

      {/* Floating Action Button - Shows on View tab only */}
      {activeTab === "view" && (
        <button
          onClick={() => setActiveTab("post")}
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-5 shadow-2xl hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 hover:scale-110 active:scale-95 z-30 animate-fadeIn"
          aria-label="Report need"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="font-bold text-white mb-3">Sahana Sewa</h3>
              <p className="text-sm text-gray-400">
                Connecting communities in need with those who can help during
                floods and disasters in Sri Lanka.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => setActiveTab("view")}
                    className="text-gray-400 hover:text-white"
                  >
                    View Needs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("post")}
                    className="text-gray-400 hover:text-white"
                  >
                    Report Need
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-3">Emergency Contact</h3>
              <p className="text-sm text-gray-400">
                For immediate assistance, please contact local authorities or
                emergency services.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-sm">Built with ❤️ to help communities in need</p>
            <p className="text-xs mt-2 text-gray-400">
              Sahana Sewa © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
