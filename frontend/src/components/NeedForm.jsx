import React, { useState } from 'react';
import axios from 'axios';
import MapSelector from './MapSelector';

const NeedForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    lat: null,
    lng: null,
    items: [{ name: '', quantity: '' }],
    description: ''
  });
  
  const [showMap, setShowMap] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: '' }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  const handleLocationSelect = ({ lat, lng, address }) => {
    setFormData(prev => ({
      ...prev,
      lat,
      lng,
      location: address || prev.location
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Filter out items with empty names
      const validItems = formData.items.filter(item => item.name.trim() !== '');
      
      const submitData = {
        ...formData,
        items: validItems.map(item => ({
          name: item.name.trim(),
          quantity: item.quantity.trim() || 'N/A'
        }))
      };

      // Remove empty optional fields
      if (!submitData.name.trim()) delete submitData.name;
      if (!submitData.phone.trim()) delete submitData.phone;
      if (!submitData.location.trim()) delete submitData.location;
      if (!submitData.description.trim()) delete submitData.description;

      const response = await fetch('http://localhost:5000/api/needs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({ type: 'success', message: '✅ Your need has been posted successfully!' });
        
        // Clear form
        setFormData({
          name: '',
          phone: '',
          location: '',
          lat: null,
          lng: null,
          items: [{ name: '', quantity: '' }],
          description: ''
        });
        setShowMap(false);

        // Clear success message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus({ type: 'error', message: data.message || 'Failed to submit need' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Submit Your Needs
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name (Optional)
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+94771234567"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (Optional)
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              placeholder="Enter location or select on map"
            />
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {showMap ? '✕ Hide Map' : '📍 Select Location on Map'}
            </button>
          </div>

          {/* Map Selector */}
          {showMap && (
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">
                Click on the map to select your location
              </p>
              <MapSelector
                onLocationSelect={handleLocationSelect}
                initialLocation={
                  formData.lat && formData.lng
                    ? { lat: formData.lat, lng: formData.lng }
                    : null
                }
              />
              {formData.lat && formData.lng && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ Location selected: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                </p>
              )}
            </div>
          )}

          {/* Items */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Items Needed <span className="text-red-500">*</span>
            </label>
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Item name (e.g., Rice)"
                  required
                />
                <input
                  type="text"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Quantity"
                  required
                />
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              + Add Another Item
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional details about your situation..."
            />
          </div>

          {/* Submit Status */}
          {submitStatus && (
            <div
              className={`p-4 rounded-md ${
                submitStatus.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-md font-medium text-white ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Need'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NeedForm;