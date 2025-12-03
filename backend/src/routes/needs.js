const express = require("express");
const Need = require("../models/Need");

const router = express.Router();

// GET /api/needs - Get 100 most recent needs with search and filter
router.get("/", async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    // Search by location
    if (search && search.trim()) {
      query.location = { $regex: search.trim(), $options: "i" };
    }

    // Filter by status
    if (status === "urgent") {
      query.supplied = false;
    } else if (status === "supplied") {
      query.supplied = true;
    }

    const needs = await Need.find(query)
      .sort({ supplied: 1, createdAt: -1 }) // Urgent (not supplied) first, then by date
      .limit(100);

    res.json({
      success: true,
      count: needs.length,
      data: needs,
    });
  } catch (error) {
    console.error("Error fetching needs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch needs",
      error: error.message,
    });
  }
});

// POST /api/needs - Create a new need
router.post("/", async (req, res) => {
  try {
    const { items } = req.body;

    // Basic validation for required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one item is required",
      });
    }

    // Validate each item has name and quantity
    for (const item of items) {
      if (!item.name || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: "Each item must have a name and quantity",
        });
      }
    }

    const need = new Need(req.body);
    const savedNeed = await need.save();

    res.status(201).json({
      success: true,
      message: "Need created successfully",
      data: savedNeed,
    });
  } catch (error) {
    console.error("Error creating need:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create need",
      error: error.message,
    });
  }
});

// PATCH /api/needs/:id/supply - Mark a need as supplied
router.patch("/:id/supply", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedNeed = await Need.findByIdAndUpdate(
      id,
      { supplied: true },
      { new: true }
    );

    if (!updatedNeed) {
      return res.status(404).json({
        success: false,
        message: "Need not found",
      });
    }

    res.json({
      success: true,
      message: "Need marked as supplied",
      data: updatedNeed,
    });
  } catch (error) {
    console.error("Error marking need as supplied:", error);

    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid need ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to mark need as supplied",
      error: error.message,
    });
  }
});

// DELETE /api/needs/:id - Delete a need by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNeed = await Need.findByIdAndDelete(id);

    if (!deletedNeed) {
      return res.status(404).json({
        success: false,
        message: "Need not found",
      });
    }

    res.json({
      success: true,
      message: "Need deleted successfully",
      data: deletedNeed,
    });
  } catch (error) {
    console.error("Error deleting need:", error);

    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid need ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete need",
      error: error.message,
    });
  }
});

module.exports = router;
