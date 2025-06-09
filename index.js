const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { connect } = require("./config/db");
const subscriberRoutes = require("./routes/subscriber.routes");
const promptRoute = require("./routes/promptConsultation");
const enquiryRoute = require("./routes/enquiry.routes");
const propertyRoute = require("./routes/ListProperty.routes");
const blogRoute = require("./routes/blog.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files if needed (optional, not for uploads now)
// app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", subscriberRoutes);
app.use("/api", promptRoute);
app.use("/api", enquiryRoute);
app.use("/api/property", propertyRoute);
app.use("/api/blogs", blogRoute);

// Connect DB and start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await connect();
  } catch (error) {
    console.error("❌ DB connection failed:", error);
  }

  console.log(`🚀 Server running on port ${PORT}`);
});

// Start newsletter scheduler if required
require("./newsletterScheduler");
