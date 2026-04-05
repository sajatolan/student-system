const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const path = require("path");

// Serve CSS file
router.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "style.css"));
});

// GET جميع الطلاب (واجهة المستخدم الجديدة)
router.get("/", async (req, res) => {
    const students = Student.getAllStudents();
    const count = students.length;

    const listItems = students
        .map((s, i) => `
            <li class="student-item">
                <div>
                    <div class="student-name">${escapeHtml(s.name)}</div>
                    <div class="student-id">ID: ${s.id}</div>
                </div>
                <div>#${i + 1}</div>
            </li>
        `)
        .join("");

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Student Management System</title>
            <link rel="stylesheet" href="/students/style.css">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <h1>📚 Student Management System</h1>
                    <div class="subtitle">Cloud-based Student Records</div>
                    
                    <div class="stats">
                        <div class="stat-card">
                            <div class="stat-number">${count}</div>
                            <div>Total Students</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${students.filter(s => s.name).length}</div>
                            <div>Active Records</div>
                        </div>
                    </div>

                    <form method="POST" action="/students/add" id="addForm">
                        <div class="input-group">
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Enter student name..." 
                                required 
                                minlength="2"
                                autocomplete="off"
                            />
                            <button type="submit" class="btn-add">➕ Add Student</button>
                        </div>
                    </form>

                    <form method="POST" action="/students/clear" id="clearForm" onsubmit="return confirmClear()">
                        <button type="submit" class="btn-clear">🗑️ Clear All Students</button>
                    </form>

                    <h3 style="margin-top: 30px; color: #667eea;">📋 Student List</h3>
                    
                    ${count === 0 ? `
                        <div class="empty-state">
                            <div style="font-size: 50px;">👨‍🎓</div>
                            <p>No students yet. Add your first student above!</p>
                        </div>
                    ` : `
                        <ul class="student-list">
                            ${listItems}
                        </ul>
                    `}
                </div>
            </div>

            <script>
                function confirmClear() {
                    const count = ${count};
                    if (count === 0) {
                        alert('No students to clear!');
                        return false;
                    }
                    return confirm('⚠️ Are you sure? This will delete all ${count} students permanently.');
                }

                // Add animation on form submit
                document.getElementById('addForm')?.addEventListener('submit', function(e) {
                    const btn = this.querySelector('button[type="submit"]');
                    btn.innerHTML = '⏳ Adding...';
                    btn.disabled = true;
                });
            </script>
        </body>
        </html>
    `);
});

// ADD student
router.post("/add", async (req, res) => {
    const name = req.body.name?.trim();

    if (!name || name.length < 2) {
        return res.send(`
            <html>
            <head><link rel="stylesheet" href="/students/style.css"></head>
            <body>
                <div class="container">
                    <div class="card" style="text-align: center;">
                        <h3 style="color: #f56565;">❌ Invalid name (minimum 2 characters)</h3>
                        <a href="/students" style="color: #667eea;">← Go Back</a>
                    </div>
                </div>
            </body>
            </html>
        `);
    }

    await Student.createStudent({ name });
    res.redirect("/students");
});

// CLEAR all students
router.post("/clear", async (req, res) => {
    await Student.deleteAllStudents();
    res.redirect("/students");
});

// API endpoint
router.get("/api", (req, res) => {
    const students = Student.getAllStudents();
    res.json({
        success: true,
        count: students.length,
        students: students,
        timestamp: new Date().toISOString()
    });
});

// Helper function to escape HTML
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

module.exports = router;