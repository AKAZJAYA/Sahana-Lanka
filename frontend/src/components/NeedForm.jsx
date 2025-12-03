import React, { useState } from 'react';
import axios from 'axios';

const NeedForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    items: [{ name: '', quantity: '' }],
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: '' }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  };

  const validateForm = () => {
    // Check if at least one item has a name
    const hasValidItem = formData.items.some(item => item.name.trim() !== '');
    
    if (!hasValidItem) {
      setErrorMessage('Please add at least one item with a name');
      return false;
    }

    // Filter out empty items
    const validItems = formData.items.filter(item => item.name.trim() !== '');
    
    if (validItems.length === 0) {
      setErrorMessage('Please add at least one item with a name');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

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

      await axios.post('http://localhost:5000/api/needs', submitData);

      setSuccessMessage('✅ Your need has been posted successfully!');
      
      // Clear form
      setFormData({
        name: '',
        phone: '',
        location: '',
        items: [{ name: '', quantity: '' }],
        description: ''
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(
        error.response?.data?.message || 
        'Failed to submit. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Post Your Need
        </h2>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
            Your Name (Optional)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your name"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-lg font-medium text-gray-700 mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+94771234567"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-lg font-medium text-gray-700 mb-2">
            Location (Optional)
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your location"
          />
        </div>

        {/* Items */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Items Needed <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Item name (e.g., Rice)"
                />
                <input
                  type="text"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className="w-32 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Qty"
                />
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-3 w-full px-4 py-3 text-lg bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 active:bg-gray-400 font-medium"
          >
            + Add Item
          </button>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
            Additional Details (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Provide any additional information about your situation..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-4 text-lg font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Need'}
        </button>
      </form>
    </div>
  );
};

export default NeedForm;