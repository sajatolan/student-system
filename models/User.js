const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

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

// الحصول على جميع المستخدمين
const getAllUsers = () => {
    const data = fs.readFileSync(usersPath, 'utf8');
    return JSON.parse(data);
};

// التحقق من المستخدم
const findUserByUsername = (username) => {
    const users = getAllUsers();
    return users.find(u => u.username === username);
};

// التحقق من كلمة المرور
const verifyUser = async (username, password) => {
    const user = findUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    
    return { id: user.id, username: user.username, role: user.role };
};

// إضافة مستخدم جديد
const createUser = async (username, password, role = 'user') => {
    const users = getAllUsers();
    const newUser = {
        id: Date.now(),
        username,
        password: bcrypt.hashSync(password, 10),
        role
    };
    users.push(newUser);
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    return newUser;
};

module.exports = { verifyUser, createUser, findUserByUsername };