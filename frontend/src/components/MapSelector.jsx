import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map view updates
const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

// Component to handle map clicks
const LocationMarker = ({ position, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    },
  });

  return position ? <Marker position={position} /> : null;
};

const MapSelector = ({ onLocationSelect, initialLocation }) => {
  const [position, setPosition] = useState(
    initialLocation || {
      lat: 6.9271, // Colombo, Sri Lanka
      lng: 79.8612
    }
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Handle search with debounce
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);

    try {
      // Use Nominatim for geocoding (search)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&q=${encodeURIComponent(query)}&` +
        `countrycodes=lk&limit=5&` +
        `addressdetails=1`
      );
      
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 500);
  };

  // Handle selecting a search result
  const handleSelectResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const address = result.display_name;

    setPosition({ lat, lng });
    setSearchQuery(address);
    setShowResults(false);

    // Call parent callback
    onLocationSelect({
      lat,
      lng,
      address
    });
  };

  // Handle map click
  const handleMapClick = ({ lat, lng }) => {
    setPosition({ lat, lng });
    setShowResults(false); // Close search results when clicking map

    // Try to get address using reverse geocoding
    fetch(
      `https://nominatim.openstreetmap.org/reverse?` +
      `format=json&lat=${lat}&lon=${lng}&` +
      `addressdetails=1`
    )
      .then(response => response.json())
      .then(data => {
        const address = data.display_name || '';
        setSearchQuery(address);
        onLocationSelect({ lat, lng, address });
      })
      .catch(() => {
        // If reverse geocoding fails, just send coordinates
        onLocationSelect({ lat, lng, address: '' });
      });
  };

  // Close results when clicking outside
  const handleBlur = () => {
    // Delay to allow click events on results to fire first
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  return (
    <div className="space-y-4">
      {/* Search Box - Higher z-index */}
      <div className="relative z-[1000]">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            onBlur={handleBlur}
            placeholder="Search for a location (e.g., Colombo Fort, Galle Road)"
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
          />
          {isSearching && !searchQuery.includes('✕') && (
            <div className="absolute right-3 top-3 pointer-events-none">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
          {searchQuery && !isSearching && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setShowResults(false);
              }}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 z-10"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Results Dropdown - Positioned above map */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto z-[1001]">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent blur
                  handleSelectResult(result);
                }}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">
                  {result.display_name.split(',')[0]}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {result.display_name}
                </div>
              </button>
            ))}
          </div>
        )}

        {showResults && searchResults.length === 0 && searchQuery && !isSearching && (
          <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-[1001]">
            <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* Current Location Display */}
      {position && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <span className="font-medium">📍 Coordinates:</span> {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </div>
      )}

      {/* Map Container - Lower z-index */}
      <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-gray-300 shadow-sm relative z-0">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeMapView center={[position.lat, position.lng]} />
          <LocationMarker
            position={position}
            onLocationSelect={handleMapClick}
          />
        </MapContainer>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg space-y-1">
        <p className="font-medium text-blue-900">💡 How to use:</p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>Type a location name in the search box to find it</li>
          <li>Click on a search result to select that location</li>
          <li>Or click anywhere on the map to select a location</li>
          <li>The blue marker shows your selected location</li>
        </ul>
      </div>
    </div>
  );
};

export default MapSelector;