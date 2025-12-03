import React, { useState } from "react";
import axios from "axios";
import MapSelector from "./MapSelector";

const NeedForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    lat: null,
    lng: null,
    items: [{ name: "", quantity: "" }],
    description: "",
  });

  const [showMap, setShowMap] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: "" }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        items: updatedItems,
      }));
    }
  };

  const handleLocationSelect = ({ lat, lng, address }) => {
    setFormData((prev) => ({
      ...prev,
      lat,
      lng,
      location: address || prev.location,
    }));
  };

  const validateForm = () => {
    const hasValidItem = formData.items.some((item) => item.name.trim() !== "");

    if (!hasValidItem) {
      setErrorMessage("Please add at least one item with a name");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const validItems = formData.items.filter(
        (item) => item.name.trim() !== ""
      );

      const submitData = {
        ...formData,
        items: validItems.map((item) => ({
          name: item.name.trim(),
          quantity: item.quantity.trim() || "N/A",
        })),
      };

      if (!submitData.name.trim()) delete submitData.name;
      if (!submitData.phone.trim()) delete submitData.phone;
      if (!submitData.location.trim()) delete submitData.location;
      if (!submitData.description.trim()) delete submitData.description;

      await axios.post("/api/needs", submitData);

      setSuccessMessage("✅ Your need has been posted successfully!");

      setFormData({
        name: "",
        phone: "",
        location: "",
        lat: null,
        lng: null,
        items: [{ name: "", quantity: "" }],
        description: "",
      });
      setShowMap(false);

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }

      setTimeout(() => setSuccessMessage(""), 5001);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to submit. Please try again."
      );
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

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
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
            <label
              htmlFor="phone"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
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
            <label
              htmlFor="location"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Location (Optional)
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
              placeholder="Enter your location or select on map"
            />
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {showMap ? "✕ Hide Map" : "📍 Select Location on Map"}
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
                  ✓ Location selected: {formData.lat.toFixed(4)},{" "}
                  {formData.lng.toFixed(4)}
                </p>
              )}
            </div>
          )}

          {/* Items */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Items Needed <span className="text-red-500">*</span>
            </label>
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                  className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Item name (e.g., Rice)"
                  required
                />
                <input
                  type="text"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  className="w-32 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Qty"
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
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
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
            {isSubmitting ? "Submitting..." : "Submit Need"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NeedForm;
