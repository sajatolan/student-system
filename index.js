require("dotenv").config();

const express = require("express");
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

// Session middleware
app.use(session({
    secret: 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true if using https
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Auth routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Student routes (protected)
const authMiddleware = require("./middleware/auth");
const studentRoutes = require("./routes/students");
app.use("/students", authMiddleware, studentRoutes);

// Home page redirect
app.get("/", (req, res) => {
    if (req.session.user) {
        res.redirect("/students");
    } else {
        res.redirect("/auth/login");
    }
});

// Health check
app.get("/health", (req, res) => {
    res.json({ 
        status: "ok", 
        timestamp: new Date().toISOString(),
        storage: "JSON file (local)",
        auth: "enabled"
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Data stored in: students.json & users.json`);
    console.log(`🔐 Authentication: ENABLED`);
    console.log(`✅ System ready!`);
});