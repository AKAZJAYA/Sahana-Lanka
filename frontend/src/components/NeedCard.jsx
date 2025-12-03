import React from 'react';

const NeedCard = ({ need }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} min${diffInMins > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  const handlePhoneClick = () => {
    if (need.phone) {
      window.location.href = `tel:${need.phone}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            {need.name || 'Unknown'}
          </h3>
          {need.location && (
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <svg 
                className="w-4 h-4 mr-1 flex-shrink-0" 
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
              {need.location}
            </p>
          )}
        </div>
        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
          {formatDate(need.createdAt)}
        </span>
      </div>

      {/* Items */}
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Items Needed:</h4>
        <ul className="space-y-1">
          {need.items.map((item, index) => (
            <li 
              key={index} 
              className="text-sm text-gray-800 flex items-start"
            >
              <span className="text-blue-600 mr-2">•</span>
              <span>
                <strong>{item.name}</strong> - {item.quantity}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Description */}
      {need.description && (
        <div className="mb-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            {need.description}
          </p>
        </div>
      )}

      {/* Phone */}
      {need.phone && (
        <div className="pt-3 border-t border-gray-200">
          <button
            onClick={handlePhoneClick}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 font-medium"
          >
            <svg 
              className="w-5 h-5 mr-2" 
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
            Call {need.phone}
          </button>
        </div>
      )}
    </div>
  );
};

export default NeedCard;