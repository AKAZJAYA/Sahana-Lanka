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
  const [showWhatsAppMenu, setShowWhatsAppMenu] = useState(false);

  const whatsappNumbers = [
    { number: "+94702602985", label: "Contact 1" },
    { number: "+94702903733", label: "Contact 2" },
  ];

  const openWhatsApp = (number) => {
    const message = encodeURIComponent(
      "Hello, I need assistance regarding Sahana Sewa relief needs."
    );
    const whatsappUrl = `https://wa.me/${number.replace(
      /[^0-9]/g,
      ""
    )}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    setShowWhatsAppMenu(false);
  };

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
        <div className="fixed bottom-6 right-6 z-30">
          {/* WhatsApp Menu */}
          {showWhatsAppMenu && (
            <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-4 mb-2 min-w-[280px] animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Contact us for BUGS and HELP
                </h3>
                <button
                  onClick={() => setShowWhatsAppMenu(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-2">
                {whatsappNumbers.map((contact, index) => (
                  <button
                    key={index}
                    onClick={() => openWhatsApp(contact.number)}
                    className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
                  >
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-900">
                        {contact.label}
                      </p>
                      <p className="text-sm text-gray-600">{contact.number}</p>
                    </div>
                    <svg
                      className="w-5 h-5 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity"
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
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main FAB Button */}
          <button
            onClick={() => setShowWhatsAppMenu(!showWhatsAppMenu)}
            className="bg-green-600 text-white rounded-full p-5 shadow-2xl hover:bg-green-700 active:bg-green-800 transition-all duration-300 hover:scale-110 active:scale-95 animate-fadeIn relative group"
            aria-label="Contact via WhatsApp"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>

            {/* Pulse effect */}
            <span className="absolute inset-0 rounded-full bg-green-600 animate-ping opacity-20"></span>

            {/* Tooltip */}
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Contact us
            </span>
          </button>
        </div>
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
            <p className="text-sm">Built with ❤️ VA Solutions</p>
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
