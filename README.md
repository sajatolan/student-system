# Student Management System

نظام ويب متكامل لإدارة الطلاب مع نظام مصادقة

## Live Demo

https://student-system-7eee.onrender.com

### Login Credentials
- Username: admin
- Password: admin123

## Features

| Feature | Description |
|---------|-------------|
| Authentication | Secure login with session management |
| Add Student | Add students with optional grades |
| View Students | Display all students with their grades |
| Edit Grade | Update student grades |
| Delete Student | Remove individual students |
| Search | Search students by name |
| Clear All | Delete all students at once |
| Metrics | Custom API endpoint for system metrics |

## Technologies

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| express-session | Session management |
| bcryptjs | Password hashing |
| Render | Cloud hosting |
| GitHub | Version control |

## Local Development

git clone https://github.com/sajatolan/student-system.git
cd student-system
npm install
npm start

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /auth/login | GET | Login page |
| /auth/login | POST | Authenticate user |
| /auth/logout | GET | Logout user |
| /students | GET | Main dashboard |
| /students/api | GET | Student data (JSON) |
| /students/metrics | GET | System metrics |
| /health | GET | Health check |

## Security

- Password hashing (bcrypt)
- Session-based authentication
- Input validation and sanitization
- HTML escaping to prevent XSS
- HTTPS (production)

## System Metrics

Access metrics at: /students/metrics

## Author

sajatolan

## Date

April 2026