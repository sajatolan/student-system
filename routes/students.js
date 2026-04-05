const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// GET جميع الطلاب (واجهة المستخدم)
router.get("/", async (req, res) => {
  const students = Student.getAllStudents();

  const list = students
    .map((s, i) => `<li>${i + 1}. ${s.name} (ID: ${s.id})</li>`)
    .join("");

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Student System</title>
        <style>
            body { font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px; }
            h1 { color: #333; }
            form { margin: 20px 0; }
            input { padding: 8px; width: 200px; }
            button { padding: 8px 15px; background: #007bff; color: white; border: none; cursor: pointer; }
            button:hover { background: #0056b3; }
            ul { margin-top: 20px; }
            li { margin: 5px 0; }
            .clear-btn { background: #dc3545; }
            .clear-btn:hover { background: #c82333; }
            .stats { background: #f0f0f0; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <h1>📚 Student Management System</h1>
        
        <div class="stats">
            <strong>📊 Total Students:</strong> ${students.length}
        </div>

        <form method="POST" action="/students/add">
            <input name="name" placeholder="Enter student name" required />
            <button type="submit">➕ Add Student</button>
        </form>

        <form method="POST" action="/students/clear" style="margin-top:10px;">
            <button type="submit" class="clear-btn">🗑️ Clear All Students</button>
        </form>

        <h3>📋 Student List:</h3>
        <ul>${list || "<li>No students yet. Add one above!</li>"}</ul>
    </body>
    </html>
  `);
});

// ADD طالب جديد
router.post("/add", async (req, res) => {
  const name = req.body.name?.trim();

  if (!name || name.length < 2) {
    return res.send(`
      <h3>❌ Invalid name (min 2 characters)</h3>
      <a href="/students">← Back</a>
    `);
  }

  await Student.createStudent({ name });
  res.redirect("/students");
});

// CLEAR جميع الطلاب
router.post("/clear", async (req, res) => {
  await Student.deleteAllStudents();
  res.redirect("/students");
});

// API endpoint للـ JSON (للمطورين)
router.get("/api", async (req, res) => {
  const students = Student.getAllStudents();
  res.json({
    count: students.length,
    students: students
  });
});

module.exports = router;