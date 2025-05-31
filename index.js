const express = require("express");
const cors = require("cors");
const { connect } = require("./config/db");
const subscriberRoutes = require("./routes/subscriber.routes");
const promptRoute = require("./routes/promptConsultation");
const EnquiryRoute = require("./routes/enquiry.routes");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/", subscriberRoutes);
app.use("/api", promptRoute);
app.use("/api", EnquiryRoute);

// Start server
app.listen(process.env.PORT, async () => {
  try {
    await connect();
  } catch (error) {
    console.error("❌ DB connection failed:", error);
  }

  console.log(`🚀 Server is listening on port ${process.env.PORT}`);
});

require("./newsletterScheduler");
