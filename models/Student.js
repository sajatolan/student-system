// models/Student.js
const fs = require('fs');
const path = require('path');

// ملف تخزين البيانات
const dataPath = path.join(__dirname, '..', 'students.json');

// تأكد من وجود الملف
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify([]));
}

// قراءة جميع الطلاب
const getAllStudents = () => {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

// حفظ جميع الطلاب
const saveStudents = (students) => {
  fs.writeFileSync(dataPath, JSON.stringify(students, null, 2));
};

// إنشاء طالب جديد
const createStudent = async (studentData) => {
  const students = getAllStudents();
  const newStudent = {
    id: Date.now(), // ID فريد
    name: studentData.name,
    createdAt: new Date().toISOString()
  };
  students.push(newStudent);
  saveStudents(students);
  return newStudent;
};

// حذف جميع الطلاب
const deleteAllStudents = async () => {
  saveStudents([]);
};

// الحصول على عدد الطلاب
const getStudentCount = () => {
  return getAllStudents().length;
};

module.exports = {
  getAllStudents,
  createStudent,
  deleteAllStudents,
  getStudentCount
};