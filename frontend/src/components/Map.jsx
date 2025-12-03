import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapSelector = ({ onLocationSelect, initialLocation }) => {
  const [selectedPosition, setSelectedPosition] = useState(
    initialLocation || {
      lat: 6.9271, // Default to Colombo, Sri Lanka
      lng: 79.8612
    }
  );

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
  };

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    const position = { lat, lng };
    setSelectedPosition(position);
    
    // Reverse geocode to get address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: position }, (results, status) => {
      if (status === 'OK' && results[0]) {
        onLocationSelect({
          lat,
          lng,
          address: results[0].formatted_address
        });
      } else {
        onLocationSelect({ lat, lng, address: '' });
      }
    });
  }, [onLocationSelect]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={selectedPosition}
        zoom={13}
        onClick={handleMapClick}
      >
        <Marker position={selectedPosition} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapSelector;