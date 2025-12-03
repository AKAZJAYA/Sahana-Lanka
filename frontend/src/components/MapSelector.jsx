import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      
      // Reverse geocode using Nominatim (OpenStreetMap)
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          onLocationSelect({
            lat,
            lng,
            address: data.display_name || ''
          });
        })
        .catch(() => {
          onLocationSelect({ lat, lng, address: '' });
        });
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

  const handleLocationSelect = (location) => {
    setPosition({ lat: location.lat, lng: location.lng });
    onLocationSelect(location);
  };

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={position}
          onLocationSelect={handleLocationSelect}
        />
      </MapContainer>
    </div>
  );
};

export default MapSelector;