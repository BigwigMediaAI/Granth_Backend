const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  bedrooms: String,
  size: String,
  message: String,
  titleDeed: Boolean,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Property", PropertySchema);
