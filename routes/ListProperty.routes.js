const express = require("express");
const router = express.Router();
const Property = require("../models/listing.model");

// POST /api/properties/list
router.post("/list", async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    await newProperty.save();
    res.status(201).json({ message: "Property listed successfully" });
  } catch (error) {
    console.error("Error saving property:", error);
    res.status(500).json({ message: "Failed to list property" });
  }
});

router.get("/list", async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 }); // latest first
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Failed to fetch properties." });
  }
});

// DELETE /api/properties/list/:id
router.delete("/list/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Property.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ message: "Failed to delete property" });
  }
});

module.exports = router;
