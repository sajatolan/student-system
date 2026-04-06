const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '..', 'users.json');

// إنشاء ملف المستخدمين إذا ما موجود
if (!fs.existsSync(usersPath)) {
    const defaultUsers = [
        {
            id: 1,
            username: 'admin',
            password: bcrypt.hashSync('admin123', 10),
            role: 'admin'
        }
    ];
    fs.writeFileSync(usersPath, JSON.stringify(defaultUsers, null, 2));
}

const getUsers = () => {
    const data = fs.readFileSync(usersPath, 'utf8');
    return JSON.parse(data);
};

// صفحة تسجيل الدخول
router.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Login</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; }
                .login-card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); width: 350px; text-align: center; }
                h2 { color: #667eea; margin-bottom: 20px; }
                input { width: 100%; padding: 12px; margin: 10px 0; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 16px; }
                input:focus { outline: none; border-color: #667eea; }
                button { width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 10px; font-size: 16px; cursor: pointer; }
                button:hover { transform: scale(1.02); }
                .info { margin-top: 20px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="login-card">
                <h2>🔐 Admin Login</h2>
                <form method="POST" action="/auth/login">
                    <input type="text" name="username" placeholder="Username" required>
                    <input type="password" name="password" placeholder="Password" required>
                    <button type="submit">Login</button>
                </form>
                <div class="info">Demo: admin / admin123</div>
            </div>
        </body>
        </html>
    `);
});

// معالجة تسجيل الدخول
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    const users = getUsers();
    const user = users.find(u => u.username === username);
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.send(`
            <html>
            <head><style>body{font-family:Arial;display:flex;justify-content:center;align-items:center;height:100vh;background:linear-gradient(135deg,#667eea,#764ba2);}</style></head>
            <body>
                <div style="background:white;padding:40px;border-radius:20px;text-align:center">
                    <h3 style="color:#f56565;">❌ Invalid username or password</h3>
                    <a href="/auth/login" style="color:#667eea;">← Try again</a>
                </div>
            </body>
            </html>
        `);
    }
    
    req.session.user = { id: user.id, username: user.username, role: user.role };
    res.redirect('/students');
});

// تسجيل الخروج
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;