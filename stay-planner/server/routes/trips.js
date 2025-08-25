const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { createTrip, listTripsByUser, deleteTrip, updateTrip, getTripById } = require('../db');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// GET /api/trips - Get user's trips
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const trips = await listTripsByUser(userId);
    
    res.json({
      success: true,
      count: trips.length,
      trips: trips.map(trip => ({
        id: trip.id,
        country: trip.country,
        start_date: trip.start_date,
        end_date: trip.end_date,
        created_at: trip.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trips'
    });
  }
});

// POST /api/trips - Create new trip
router.post('/', async (req, res) => {
  try {
    const { country, start_date, end_date } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!country || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: 'Country, start_date, and end_date are required'
      });
    }

    // Validate country format (should be 3-letter ISO code)
    if (!/^[A-Z]{3}$/.test(country)) {
      return res.status(400).json({
        success: false,
        error: 'Country must be a 3-letter ISO code (e.g., FRA, USA, GBR)'
      });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
      return res.status(400).json({
        success: false,
        error: 'Dates must be in YYYY-MM-DD format'
      });
    }

    // Validate dates are valid
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format'
      });
    }

    // Validate start_date < end_date
    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date must be before end date'
      });
    }

    // Validate dates are not in the past (optional business rule)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      return res.status(400).json({
        success: false,
        error: 'Start date cannot be in the past'
      });
    }

    // Create trip
    const result = await createTrip(userId, country, start_date, end_date);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to create trip'
      });
    }

    // Get the created trip
    const newTrip = await getTripById(result.tripId, userId);
    
    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip: {
        id: newTrip.id,
        country: newTrip.country,
        start_date: newTrip.start_date,
        end_date: newTrip.end_date,
        created_at: newTrip.created_at
      }
    });

  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create trip'
    });
  }
});

// DELETE /api/trips/:id - Delete trip
router.delete('/:id', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const userId = req.user.id;

    if (isNaN(tripId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid trip ID'
      });
    }

    // Check if trip exists and belongs to user
    const existingTrip = await getTripById(tripId, userId);
    if (!existingTrip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    // Delete trip
    const result = await deleteTrip(tripId, userId);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete trip'
      });
    }

    res.json({
      success: true,
      message: 'Trip deleted successfully',
      tripId: tripId
    });

  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete trip'
    });
  }
});

// PUT /api/trips/:id - Update trip
router.put('/:id', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const userId = req.user.id;
    const { country, start_date, end_date } = req.body;

    if (isNaN(tripId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid trip ID'
      });
    }

    // Check if trip exists and belongs to user
    const existingTrip = await getTripById(tripId, userId);
    if (!existingTrip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    // Prepare updates object
    const updates = {};
    
    if (country !== undefined) {
      if (!/^[A-Z]{3}$/.test(country)) {
        return res.status(400).json({
          success: false,
          error: 'Country must be a 3-letter ISO code (e.g., FRA, USA, GBR)'
        });
      }
      updates.country = country;
    }

    if (start_date !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
        return res.status(400).json({
          success: false,
          error: 'Start date must be in YYYY-MM-DD format'
        });
      }
      updates.start_date = start_date;
    }

    if (end_date !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(end_date)) {
        return res.status(400).json({
          success: false,
          error: 'End date must be in YYYY-MM-DD format'
        });
      }
      updates.end_date = end_date;
    }

    // Validate date logic if both dates are provided
    if (updates.start_date && updates.end_date) {
      const startDate = new Date(updates.start_date);
      const endDate = new Date(updates.end_date);
      
      if (startDate >= endDate) {
        return res.status(400).json({
          success: false,
          error: 'Start date must be before end date'
        });
      }
    }

    // Update trip
    const result = await updateTrip(tripId, userId, updates);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to update trip'
      });
    }

    // Get the updated trip
    const updatedTrip = await getTripById(tripId, userId);
    
    res.json({
      success: true,
      message: 'Trip updated successfully',
      trip: {
        id: updatedTrip.id,
        country: updatedTrip.country,
        start_date: updatedTrip.start_date,
        end_date: updatedTrip.end_date,
        created_at: updatedTrip.created_at
      }
    });

  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update trip'
    });
  }
});

// GET /api/trips/:id - Get specific trip
router.get('/:id', async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const userId = req.user.id;

    if (isNaN(tripId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid trip ID'
      });
    }

    const trip = await getTripById(tripId, userId);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    res.json({
      success: true,
      trip: {
        id: trip.id,
        country: trip.country,
        start_date: trip.start_date,
        end_date: trip.end_date,
        created_at: trip.created_at
      }
    });

  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trip'
    });
  }
});

module.exports = router;
