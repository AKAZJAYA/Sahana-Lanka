const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: [100, "Item name cannot exceed 100 characters"],
    },
    quantity: {
      type: String,
      required: [true, "Item quantity is required"],
      trim: true,
      maxlength: [50, "Quantity cannot exceed 50 characters"],
    },
  },
  { _id: false }
);

const needSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"],
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, "Phone number cannot exceed 20 characters"],
    match: [/^[0-9+\-\s()]*$/, "Please enter a valid phone number"],
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, "Location cannot exceed 200 characters"],
  },
  lat: {
    type: Number,
    min: [-90, "Latitude must be between -90 and 90"],
    max: [90, "Latitude must be between -90 and 90"],
  },
  lng: {
    type: Number,
    min: [-180, "Longitude must be between -180 and 180"],
    max: [180, "Longitude must be between -180 and 180"],
  },
  items: {
    type: [itemSchema],
    validate: {
      validator: function (items) {
        return items && items.length > 0;
      },
      message: "At least one item is required",
    },
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  supplied: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for geospatial queries if needed in the future
needSchema.index({ lat: 1, lng: 1 });

// Index for sorting by creation date
needSchema.index({ createdAt: -1 });

// Index for supplied status
needSchema.index({ supplied: 1 });

const Need = mongoose.model("Need", needSchema);

module.exports = Need;
