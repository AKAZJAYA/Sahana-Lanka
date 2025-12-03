const express = require('express');
const Need = require('../models/Need');

const router = express.Router();

// GET /api/needs - Get 100 most recent needs
router.get('/', async (req, res) => {
  try {
    const needs = await Need.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      count: needs.length,
      data: needs
    });
  } catch (error) {
    console.error('Error fetching needs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch needs',
      error: error.message
    });
  }
});

// POST /api/needs - Create a new need
router.post('/', async (req, res) => {
  try {
    const { items } = req.body;

    // Basic validation for required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required'
      });
    }

    // Validate each item has name and quantity
    for (const item of items) {
      if (!item.name || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a name and quantity'
        });
      }
    }

    const need = new Need(req.body);
    const savedNeed = await need.save();

    res.status(201).json({
      success: true,
      message: 'Need created successfully',
      data: savedNeed
    });
  } catch (error) {
    console.error('Error creating need:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create need',
      error: error.message
    });
  }
});

// DELETE /api/needs/:id - Delete a need by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNeed = await Need.findByIdAndDelete(id);

    if (!deletedNeed) {
      return res.status(404).json({
        success: false,
        message: 'Need not found'
      });
    }

    res.json({
      success: true,
      message: 'Need deleted successfully',
      data: deletedNeed
    });
  } catch (error) {
    console.error('Error deleting need:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid need ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete need',
      error: error.message
    });
  }
});

module.exports = router;