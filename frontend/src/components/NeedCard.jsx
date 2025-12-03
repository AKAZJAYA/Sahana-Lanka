import React from "react";

const NeedCard = ({ need }) => {
  // Function to open location in maps
  const openInMaps = () => {
    if (!need.lat || !need.lng) {
      alert("Location coordinates not available");
      return;
    }

    const lat = need.lat;
    const lng = need.lng;
    const locationName = encodeURIComponent(need.location || "Location");

    // Detect device and open appropriate map app
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Check if iOS
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      // Try Apple Maps first, fallback to Google Maps
      window.location.href = `maps://maps.apple.com/?q=${lat},${lng}`;
      
      // Fallback to Google Maps if Apple Maps doesn't open
      setTimeout(() => {
        window.open(
          `https://maps.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=15`,
          '_blank'
        );
      }, 500);
    }
    // Check if Android
    else if (/android/i.test(userAgent)) {
      // Try to open in Google Maps app
      window.location.href = `geo:${lat},${lng}?q=${lat},${lng}(${locationName})`;
      
      // Fallback to browser Google Maps
      setTimeout(() => {
        window.open(
          `https://maps.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=15`,
          '_blank'
        );
      }, 500);
    }
    // Desktop or other devices - open Google Maps in new tab
    else {
      window.open(
        `https://maps.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=15`,
        '_blank'
      );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {need.name && (
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {need.name}
            </h3>
          )}
          <p className="text-sm text-gray-500">
            Posted {formatDate(need.createdAt)}
          </p>
        </div>
        
        {/* Status Badge */}
        <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
          Urgent
        </span>
      </div>

      {/* Items Needed */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
          <svg 
            className="w-5 h-5 mr-2 text-blue-600" 
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
          Items Needed:
        </h4>
        <div className="flex flex-wrap gap-2">
          {need.items && need.items.length > 0 ? (
            need.items.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
              >
                <span className="font-medium">{item.name}</span>
                {item.quantity && item.quantity !== "N/A" && (
                  <span className="ml-1 text-blue-600">
                    ({item.quantity})
                  </span>
                )}
              </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No items listed</p>
          )}
        </div>
      </div>

      {/* Description */}
      {need.description && (
        <div className="mb-4">
          <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
            {need.description}
          </p>
        </div>
      )}

      {/* Contact and Location Info */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        {/* Location */}
        {need.location && (
          <div className="flex items-start">
            <svg 
              className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" 
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
            <div className="flex-1">
              <p className="text-gray-700 text-sm">{need.location}</p>
              {need.lat && need.lng && (
                <button
                  onClick={openInMaps}
                  className="mt-2 inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <svg 
                    className="w-4 h-4 mr-2" 
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
                  View Location on Map
                </button>
              )}
            </div>
          </div>
        )}

        {/* Phone */}
        {need.phone && (
          <div className="flex items-center">
            <svg 
              className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" 
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
            <a 
              href={`tel:${need.phone}`}
              className="text-blue-600 hover:text-blue-700 hover:underline text-sm font-medium"
            >
              {need.phone}
            </a>
          </div>
        )}

        {/* Coordinates (for reference) */}
        {need.lat && need.lng && (
          <div className="text-xs text-gray-400">
            Coordinates: {need.lat.toFixed(6)}, {need.lng.toFixed(6)}
          </div>
        )}
      </div>
    </div>
  );
};

export default NeedCard;