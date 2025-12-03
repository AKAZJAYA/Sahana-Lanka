import React, { useState } from "react";
import axios from "axios";

const NeedCard = ({ need, onSupplied }) => {
  const [isMarkingSupplied, setIsMarkingSupplied] = useState(false);

  const openInMaps = () => {
    if (!need.lat || !need.lng) {
      alert("Location coordinates not available");
      return;
    }

    const lat = need.lat;
    const lng = need.lng;
    const locationName = encodeURIComponent(need.location || "Location");
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      window.location.href = `maps://maps.apple.com/?q=${lat},${lng}`;
      setTimeout(() => {
        window.open(
          `https://maps.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=15`,
          "_blank"
        );
      }, 500);
    } else if (/android/i.test(userAgent)) {
      window.location.href = `geo:${lat},${lng}?q=${lat},${lng}(${locationName})`;
      setTimeout(() => {
        window.open(
          `https://maps.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=15`,
          "_blank"
        );
      }, 500);
    } else {
      window.open(
        `https://maps.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=15`,
        "_blank"
      );
    }
  };

  const handleMarkAsSupplied = async () => {
    if (need.supplied) return;

    const confirmed = window.confirm(
      "Are you sure you want to mark this need as supplied? This action cannot be undone."
    );

    if (!confirmed) return;

    setIsMarkingSupplied(true);

    try {
      await axios.patch(`/api/needs/${need._id}/supply`);
      alert("✅ Successfully marked as supplied!");
      if (onSupplied) {
        onSupplied();
      }
    } catch (error) {
      console.error("Error marking as supplied:", error);
      alert(
        error.response?.data?.message ||
          "Failed to mark as supplied. Please try again."
      );
    } finally {
      setIsMarkingSupplied(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div
      className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl border p-6 mb-4 transition-all duration-300 hover:-translate-y-1 ${
        need.supplied ? "border-green-200 bg-green-50/30" : "border-gray-100"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex-1">
          {need.name && (
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {need.name}
            </h3>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{formatDate(need.createdAt)}</span>
          </div>
        </div>

        {need.supplied ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Supplied
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-100">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            Urgent
          </span>
        )}
      </div>

      {/* Items Needed */}
      <div className="mb-5">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600"
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
          Items Needed
        </h4>
        <div className="flex flex-wrap gap-2">
          {need.items && need.items.length > 0 ? (
            need.items.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 rounded-xl text-sm font-medium border border-blue-100/50 hover:border-blue-200 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">{item.name}</span>
                {item.quantity && item.quantity !== "N/A" && (
                  <span className="text-blue-600/70">· {item.quantity}</span>
                )}
              </span>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">No items listed</p>
          )}
        </div>
      </div>

      {/* Description */}
      {need.description && (
        <div className="mb-5">
          <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
            {need.description}
          </p>
        </div>
      )}

      {/* Contact and Location Info */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        {/* Location */}
        {need.location && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-gray-700 text-sm font-medium mb-2">
                {need.location}
              </p>
              {need.lat && need.lng && (
                <button
                  onClick={openInMaps}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  Open in Maps
                </button>
              )}
            </div>
          </div>
        )}

        {/* Phone */}
        {need.phone && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <a
              href={`tel:${need.phone}`}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline transition-colors"
            >
              {need.phone}
            </a>
          </div>
        )}

        {/* Mark as Supplied Button */}
        {!need.supplied && (
          <div className="pt-3 border-t border-gray-100">
            <button
              onClick={handleMarkAsSupplied}
              disabled={isMarkingSupplied}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
            >
              {isMarkingSupplied ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Marking as Supplied...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Mark as Supplied</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeedCard;
