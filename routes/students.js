const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const path = require("path");

// Serve CSS file
router.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "style.css"));
});

// ========== Metrics Section ==========
let metrics = {
    totalRequests: 0,
    startTime: Date.now(),
    requestHistory: []
};

router.use((req, res, next) => {
    metrics.totalRequests++;
    metrics.requestHistory.push({
        time: new Date().toISOString(),
        path: req.path,
        method: req.method
    });
    if (metrics.requestHistory.length > 100) metrics.requestHistory.shift();
    next();
});

router.get("/metrics", (req, res) => {
    const uptime = Math.floor((Date.now() - metrics.startTime) / 1000);
    res.json({
        uptimeSeconds: uptime,
        uptimeHours: (uptime / 3600).toFixed(2),
        totalRequests: metrics.totalRequests,
        recentRequests: metrics.requestHistory.slice(-10),
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});
// ========== نهاية Metrics ==========

// GET جميع الطلاب
router.get("/", async (req, res) => {
    const students = Student.getAllStudents();
    const count = students.length;
    const avgGrade = students.filter(s => s.grade).length > 0 
        ? (students.filter(s => s.grade).reduce((sum, s) => sum + s.grade, 0) / students.filter(s => s.grade).length).toFixed(1)
        : 0;

    const listItems = students
        .map((s, i) => `
            <li class="student-item" data-id="${s.id}">
                <div class="student-info">
                    <div class="student-name">${escapeHtml(s.name)}</div>
                    <div class="student-id">ID: ${s.id}</div>
                    ${s.grade ? `<div class="student-grade">⭐ Grade: ${s.grade}%</div>` : '<div class="student-grade">📝 No grade yet</div>'}
                </div>
                <div class="student-actions">
                    <span class="student-number">#${i + 1}</span>
                    <button class="edit-btn" onclick="showEditForm(${s.id}, ${s.grade || ''})">✏️ Edit</button>
                    <button class="delete-btn" onclick="deleteStudent(${s.id})">🗑️ Delete</button>
                </div>
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
                <!-- Header -->
                <div class="header">
                    <div>
                        <h1>📚 Student Management System</h1>
                        <p class="subtitle">Professional Student Records Management</p>
                    </div>
                    <a href="/auth/logout" class="logout-btn">🚪 Logout</a>
                </div>

                <!-- Stats Cards -->
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-icon">👨‍🎓</div>
                        <div class="stat-number">${count}</div>
                        <div class="stat-label">Total Students</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-number">${students.filter(s => s.grade).length}</div>
                        <div class="stat-label">With Grades</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-number">${avgGrade}</div>
                        <div class="stat-label">Average Grade</div>
                    </div>
                </div>

                <!-- Search Box -->
                <div class="search-box">
                    <div class="search-icon">🔍</div>
                    <input type="text" id="searchInput" placeholder="Search student by name..." onkeyup="searchStudents()">
                    <button class="search-clear" onclick="clearSearch()" id="clearSearchBtn" style="display:none;">✖️</button>
                </div>

                <!-- Add Student Form -->
                <div class="form-card">
                    <h3>➕ Add New Student</h3>
                    <form method="POST" action="/students/add" id="addForm">
                        <div class="form-group">
                            <div class="form-row">
                                <div class="form-field">
                                    <label>Student Name *</label>
                                    <input type="text" name="name" placeholder="Enter full name" required minlength="2" autocomplete="off"/>
                                </div>
                                <div class="form-field">
                                    <label>Grade (0-100)</label>
                                    <input type="number" name="grade" placeholder="Optional" min="0" max="100" step="1"/>
                                </div>
                                <div class="form-field">
                                    <label>&nbsp;</label>
                                    <button type="submit" class="btn-add">➕ Add Student</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Student List Header -->
                <div class="list-header">
                    <h3>📋 Student List</h3>
                    <button class="btn-clear" onclick="confirmClear()">🗑️ Clear All</button>
                </div>

                <!-- Student List -->
                <div class="student-list-container">
                    ${count === 0 ? `
                        <div class="empty-state">
                            <div class="empty-icon">👨‍🎓</div>
                            <p>No students yet. Add your first student above!</p>
                        </div>
                    ` : `
                        <ul class="student-list" id="studentListUl">
                            ${listItems}
                        </ul>
                    `}
                </div>
            </div>

            <!-- Edit Modal -->
            <div id="editModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>✏️ Edit Student Grade</h3>
                        <span class="modal-close" onclick="closeModal()">&times;</span>
                    </div>
                    <form method="POST" id="editForm">
                        <div class="modal-body">
                            <label>Grade (0-100)</label>
                            <input type="number" name="grade" placeholder="Enter grade" min="0" max="100" required>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                            <button type="submit" class="btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Clear All Confirmation Modal -->
            <div id="clearModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>⚠️ Confirm Delete</h3>
                        <span class="modal-close" onclick="closeClearModal()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to delete <strong>all ${count} students</strong>?</p>
                        <p style="color: #f56565; font-size: 14px;">This action cannot be undone!</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-secondary" onclick="closeClearModal()">Cancel</button>
                        <button type="button" class="btn-danger" onclick="clearAllStudents()">Yes, Delete All</button>
                    </div>
                </div>
            </div>

            <script>
                let currentStudentId = null;

                function confirmClear() {
                    document.getElementById('clearModal').style.display = 'flex';
                }

                function closeClearModal() {
                    document.getElementById('clearModal').style.display = 'none';
                }

                function clearAllStudents() {
                    fetch('/students/clear', { method: 'POST' })
                        .then(() => window.location.reload());
                }

                function deleteStudent(id) {
                    if (confirm('Are you sure you want to delete this student?')) {
                        window.location.href = '/students/delete/' + id;
                    }
                }

                function showEditForm(id, currentGrade) {
                    currentStudentId = id;
                    const modal = document.getElementById('editModal');
                    const form = document.getElementById('editForm');
                    form.action = '/students/update/' + id;
                    form.querySelector('input[name="grade"]').value = currentGrade || '';
                    modal.style.display = 'flex';
                }

                function closeModal() {
                    document.getElementById('editModal').style.display = 'none';
                    currentStudentId = null;
                }

                async function searchStudents() {
                    const query = document.getElementById('searchInput').value;
                    const clearBtn = document.getElementById('clearSearchBtn');
                    
                    if (query.length === 0) {
                        clearBtn.style.display = 'none';
                        window.location.reload();
                        return;
                    }
                    
                    clearBtn.style.display = 'flex';
                    
                    const response = await fetch('/students/search?q=' + encodeURIComponent(query));
                    const data = await response.json();
                    
                    const listUl = document.getElementById('studentListUl');
                    if (!listUl) return;
                    
                    if (data.results.length === 0) {
                        listUl.innerHTML = '<div class="empty-state"><p>No students found for "' + escapeHtml(query) + '"</p></div>';
                        return;
                    }
                    
                    listUl.innerHTML = data.results.map((s, i) => \`
                        <li class="student-item" data-id="\${s.id}">
                            <div class="student-info">
                                <div class="student-name">\${escapeHtml(s.name)}</div>
                                <div class="student-id">ID: \${s.id}</div>
                                \${s.grade ? \`<div class="student-grade">⭐ Grade: \${s.grade}%</div>\` : '<div class="student-grade">📝 No grade yet</div>'}
                            </div>
                            <div class="student-actions">
                                <span class="student-number">#\${i + 1}</span>
                                <button class="edit-btn" onclick="showEditForm(\${s.id}, \${s.grade || ''})">✏️ Edit</button>
                                <button class="delete-btn" onclick="deleteStudent(\${s.id})">🗑️ Delete</button>
                            </div>
                        </li>
                    \`).join('');
                }

                function clearSearch() {
                    document.getElementById('searchInput').value = '';
                    document.getElementById('clearSearchBtn').style.display = 'none';
                    window.location.reload();
                }

                function escapeHtml(str) {
                    if (!str) return '';
                    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                }

                document.getElementById('addForm')?.addEventListener('submit', function(e) {
                    const btn = this.querySelector('button[type="submit"]');
                    btn.innerHTML = '⏳ Adding...';
                    btn.disabled = true;
                });

                // Close modal when clicking outside
                window.onclick = function(event) {
                    const editModal = document.getElementById('editModal');
                    const clearModal = document.getElementById('clearModal');
                    if (event.target === editModal) closeModal();
                    if (event.target === clearModal) closeClearModal();
                }
            </script>
        </body>
        </html>
    `);
});

// ADD student
router.post("/add", async (req, res) => {
    const { name, grade } = req.body;
    const trimmedName = name?.trim();

    if (!trimmedName || trimmedName.length < 2) {
        return res.redirect("/students?error=invalid-name");
    }

    const studentData = { name: trimmedName };
    if (grade && grade >= 0 && grade <= 100) {
        studentData.grade = parseInt(grade);
    }

    await Student.createStudent(studentData);
    res.redirect("/students");
});

// DELETE single student
router.get("/delete/:id", async (req, res) => {
    await Student.deleteStudentById(req.params.id);
    res.redirect("/students");
});

// UPDATE student grade
router.post("/update/:id", async (req, res) => {
    const { grade } = req.body;
    await Student.updateStudentGrade(req.params.id, parseInt(grade));
    res.redirect("/students");
});

// CLEAR all students
router.post("/clear", async (req, res) => {
    await Student.deleteAllStudents();
    res.json({ success: true });
});

// SEARCH API
router.get("/search", async (req, res) => {
    const query = req.query.q || '';
    const results = Student.searchStudents(query);
    res.json({
        query: query,
        count: results.length,
        results: results
    });
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

// Helper function
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

module.exports = router;