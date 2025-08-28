const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { createTrip, listTripsByUser, deleteTrip, updateTrip, getTripById } = require('../db');
const { validateTripData, validateTripOverlap } = require('../lib/validation');

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

    // Basic validation
    const basicValidation = validateTripData({ country, start_date, end_date });
    if (!basicValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: basicValidation.errors[0] || 'Validation failed',
        details: basicValidation.errors
      });
    }

    // Get existing trips for overlap validation
    const existingTrips = await listTripsByUser(userId);
    
    // Check for overlaps
    const overlapValidation = validateTripOverlap(
      { country, start_date, end_date }, 
      existingTrips
    );
    
    if (!overlapValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: overlapValidation.errors[0] || 'Trip overlaps with existing trips',
        details: overlapValidation.errors,
        overlappingTrips: overlapValidation.overlappingTrips
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

    // Prepare updates object with existing values as fallbacks
    const updatedTripData = {
      country: country !== undefined ? country : existingTrip.country,
      start_date: start_date !== undefined ? start_date : existingTrip.start_date,
      end_date: end_date !== undefined ? end_date : existingTrip.end_date
    };

    // Basic validation
    const basicValidation = validateTripData(updatedTripData);
    if (!basicValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: basicValidation.errors[0] || 'Validation failed',
        details: basicValidation.errors
      });
    }

    // Get existing trips for overlap validation (excluding current trip)
    const existingTrips = await listTripsByUser(userId);
    
    // Check for overlaps
    const overlapValidation = validateTripOverlap(
      updatedTripData, 
      existingTrips, 
      tripId
    );
    
    if (!overlapValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: overlapValidation.errors[0] || 'Trip overlaps with existing trips',
        details: overlapValidation.errors,
        overlappingTrips: overlapValidation.overlappingTrips
      });
    }

    // Prepare updates object for database
    const updates = {};
    if (country !== undefined) updates.country = country;
    if (start_date !== undefined) updates.start_date = start_date;
    if (end_date !== undefined) updates.end_date = end_date;

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
