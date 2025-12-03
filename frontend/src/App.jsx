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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
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
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-16">
        {/* Emergency Contacts Section - Matches your design */}
        <div className="bg-red-600 text-white py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center mb-6">
              <svg
                className="w-7 h-7 mr-3 animate-pulse"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <div>
                <h3 className="text-3xl font-bold">🚨 Emergency Hotlines</h3>
              </div>
            </div>
            <p className="text-center text-base mb-8 text-white/90">
              For immediate life-threatening emergencies, contact these services
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 117 - DMC */}
              <a
                href="tel:117"
                className="bg-red-700 hover:bg-red-800 active:bg-red-900 rounded-xl p-5 transition-all border-2 border-white/20 hover:border-white/40 hover:scale-105 group shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-black">117</span>
                  <span className="px-3 py-1.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full uppercase">
                    24/7
                  </span>
                </div>
                <h4 className="text-lg font-bold mb-1">
                  Disaster Management Centre (DMC)
                </h4>
                <p className="text-sm text-white/80">Primary disaster response</p>
              </a>

              {/* 1990 - Ambulance */}
              <a
                href="tel:1990"
                className="bg-red-700 hover:bg-red-800 active:bg-red-900 rounded-xl p-5 transition-all border-2 border-white/20 hover:border-white/40 hover:scale-105 group shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-black">1990</span>
                  <span className="px-3 py-1.5 bg-red-900 text-white text-xs font-bold rounded-full uppercase">
                    URGENT
                  </span>
                </div>
                <h4 className="text-lg font-bold mb-1">Suwasariya Ambulance</h4>
                <p className="text-sm text-white/80">Medical emergencies</p>
              </a>

              {/* 118/119 - Police */}
              <a
                href="tel:118"
                className="bg-red-700 hover:bg-red-800 active:bg-red-900 rounded-xl p-5 transition-all border-2 border-white/20 hover:border-white/40 hover:scale-105 group shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-black">118 / 119</span>
                  <span className="px-3 py-1.5 bg-blue-700 text-white text-xs font-bold rounded-full uppercase">
                    POLICE
                  </span>
                </div>
                <h4 className="text-lg font-bold mb-1">Police Emergency</h4>
                <p className="text-sm text-white/80">General emergencies</p>
              </a>

              {/* 110 - Fire */}
              <a
                href="tel:110"
                className="bg-red-700 hover:bg-red-800 active:bg-red-900 rounded-xl p-5 transition-all border-2 border-white/20 hover:border-white/40 hover:scale-105 group shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-black">110</span>
                  <span className="px-3 py-1.5 bg-orange-600 text-white text-xs font-bold rounded-full uppercase">
                    FIRE
                  </span>
                </div>
                <h4 className="text-lg font-bold mb-1">Fire & Rescue Services</h4>
                <p className="text-sm text-white/80">Fire emergencies</p>
              </a>

              {/* DMC Alternate */}
              <a
                href="tel:+94112136222"
                className="bg-red-700 hover:bg-red-800 active:bg-red-900 rounded-xl p-5 transition-all border-2 border-white/20 hover:border-white/40 hover:scale-105 group shadow-lg"
              >
                <div className="mb-3">
                  <span className="text-xl font-bold">+94 11 213 6222</span>
                </div>
                <h4 className="text-lg font-bold mb-1">DMC Alternate Line</h4>
                <p className="text-sm text-white/80">
                  Also: +94 11 267 0002
                </p>
              </a>

              {/* Police Disaster Support */}
              <a
                href="tel:+94112421820"
                className="bg-red-700 hover:bg-red-800 active:bg-red-900 rounded-xl p-5 transition-all border-2 border-white/20 hover:border-white/40 hover:scale-105 group shadow-lg"
              >
                <div className="mb-3">
                  <span className="text-xl font-bold">011-242 1820</span>
                </div>
                <h4 className="text-lg font-bold mb-1">Police Disaster Support</h4>
                <p className="text-sm text-white/80">
                  Alternate: 011-201 3036
                </p>
              </a>
            </div>

            {/* Quick Tip */}
            <div className="mt-8 p-5 bg-red-700 rounded-xl border-2 border-white/20 max-w-4xl mx-auto">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-bold text-lg mb-1">Quick Tip:</p>
                  <p className="text-white/90">
                    Save{" "}
                    <span className="font-black">117</span> (DMC) and{" "}
                    <span className="font-black">1990</span> (Ambulance) on speed
                    dial for fastest response during emergencies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer - Dark Section */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
              {/* About Section */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xl">Sahana Sewa</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Sri Lanka Relief
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  A community-powered platform connecting those in need with those
                  who can help during floods and disasters in Sri Lanka.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-bold text-white mb-5 text-xl">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => setActiveTab("view")}
                      className="text-gray-400 hover:text-white flex items-center group transition-colors text-base"
                    >
                      <svg
                        className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      View Relief Needs
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("post")}
                      className="text-gray-400 hover:text-white flex items-center group transition-colors text-base"
                    >
                      <svg
                        className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Report Your Need
                    </button>
                  </li>
                  <li>
                    <a
                      href="http://117.dmc.gov.lk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white flex items-center group transition-colors text-base"
                    >
                      <svg
                        className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      DMC Official Website
                    </a>
                  </li>
                </ul>
              </div>

              {/* Important Info */}
              <div>
                <h3 className="font-bold text-white mb-5 text-xl">
                  Important Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-blue-400 mr-3 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      This platform is for community coordination. Always contact
                      official emergency services first.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-green-400 mr-3 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      All posted needs are publicly visible. Help is on its way.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 pt-8 text-center">
              <p className="text-base text-gray-400 mb-3">
                Built with{" "}
                <span className="text-red-500 text-xl">❤️</span> to help
                communities in need
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Sahana Sewa © {new Date().getFullYear()} • Sri Lanka Flood Relief
                Platform
              </p>
              <p className="text-sm text-gray-600">
                Stay safe, stay connected, stay strong 🇱🇰
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
