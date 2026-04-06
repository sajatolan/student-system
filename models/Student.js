const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'students.json');

if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify([]));
}

const getAllStudents = () => {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
};

const saveStudents = (students) => {
    fs.writeFileSync(dataPath, JSON.stringify(students, null, 2));
};

const createStudent = async (studentData) => {
    const students = getAllStudents();
    const newStudent = {
        id: Date.now(),
        name: studentData.name,
        grade: studentData.grade || null,  // جديد: درجة الطالب
        createdAt: new Date().toISOString()
    };
    students.push(newStudent);
    saveStudents(students);
    return newStudent;
};

const deleteAllStudents = async () => {
    saveStudents([]);
};

const deleteStudentById = async (id) => {
    const students = getAllStudents();
    const filtered = students.filter(s => s.id != id);
    saveStudents(filtered);
};

const updateStudentGrade = async (id, grade) => {
    const students = getAllStudents();
    const student = students.find(s => s.id == id);
    if (student) {
        student.grade = grade;
        saveStudents(students);
    }
};

const searchStudents = (query) => {
    const students = getAllStudents();
    if (!query) return students;
    return students.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
};

module.exports = {
    getAllStudents,
    createStudent,
    deleteAllStudents,
    deleteStudentById,
    updateStudentGrade,
    searchStudents
};