const express = require('express');
const fs = require('fs');
const path = require('path') ;
const app = express();
const PORT = 3000;

const STUDENT_FILE = path.resolve(__dirname, 'students.json');

// Read Data
const readStudents = () => {
  const data = fs.readFileSync(STUDENT_FILE);
  return JSON.parse(data);
};

// Write Data
const writeStudents = (students) => {
  fs.writeFileSync(STUDENT_FILE, JSON.stringify(students, null, 2));
};

// Get All Students
app.get('/students', (req, res) => {
  const students = readStudents();
  res.json(students);
});

// Filter Students by Branch
app.get('/students/filter', (req, res) => {
  const { branch } = req.query;
  const students = readStudents();
  if (!branch) return res.json(students);

  const filteredStudents = students.filter(student => student.branch.toLowerCase() === branch.toLowerCase());
  res.json(filteredStudents);
});

// Delete Student
app.delete('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id);
  let students = readStudents();
  
  const studentIndex = students.findIndex(student => student.id === studentId);
  if (studentIndex === -1) {
    return res.status(404).json({ message: "Student not found" });
  }
  
  students.splice(studentIndex, 1);
  writeStudents(students);
  res.json({ message: "Student deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});