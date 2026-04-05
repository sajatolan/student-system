require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const studentRoutes = require("./routes/students");
app.use("/students", studentRoutes);

// Home page redirect
app.get("/", (req, res) => {
  res.redirect("/students");
});

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    storage: "JSON file (local)"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Data stored in: students.json`);
  console.log(`✅ System ready!`);
});