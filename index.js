const express = require("express");
const connectDB = require("./config/db");
const busRoute = require("./routes/busRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(express.json()); // Middleware to parse JSON
app.use('/api/busRoutes',busRoute);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
