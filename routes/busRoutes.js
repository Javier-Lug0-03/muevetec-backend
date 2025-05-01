const express = require("express");
const BusRoute = require("../models/routes");

const router = express.Router();

// 🔹 Create a new bus route
router.post("/", async (req, res) => {
  try {
    const { name, stops } = req.body;
    const newRoute = new BusRoute({
      name,
      stops: stops.map(stop => ({
        name: stop.name,
        location: {
          type: "Point",
          coordinates: stop.location, // Expecting [longitude, latitude]
        },
        minutes:stop.minutes,
        minutes2:stop.minutes2,
        minutes3:stop.minutes3,
        minutes4:stop.minutes4
      }))
    });
    await newRoute.save();
    res.status(201).json(newRoute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Find stops near a location
router.get("/near", async (req, res) => {
  const { lat, lon, maxDistance = 5000 } = req.query; // Default 5km radius

  if (!lat || !lon) {
    return res.status(400).json({ error: "lat and lon query parameters are required" });
  }

  try {
    const routes = await BusRoute.find({
      "stops.location": {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance),
        },
      },
    });

    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Increment "interestedCount"
router.patch("/:id/interested", async (req, res) => {
  try {
    const route = await BusRoute.findByIdAndUpdate(
      req.params.id,
      { $inc: { interestedCount: 1 } },
      { new: true }
    );
    if (!route) return res.status(404).json({ message: "Route not found" });
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Get all bus routes
router.get("/", async (req, res) => {
    try {
      const routes = await BusRoute.find(); // Fetch all routes
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const route = await BusRoute.findOne({ name: name }); // Use findOne instead of where
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
