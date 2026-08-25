const express = require("express");
const app = express();

app.use(express.json());

const students = [
    { id: 1, name: "Aarav", branch: "CSE" },
    { id: 2, name: "Diya", branch: "ECE" },
    { id: 3, name: "Rohan", branch: "IT" }
];

// GET all students
app.get("/students", (req, res) => {
    res.json(students);
});

// GET a specific student by ID
app.get("/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const student = students.find((s) => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.json(student);
});

// POST: Add a new student
app.post("/students/add", (req, res) => {
    const { id, name, branch } = req.body;

    const newStudent = {
        id,
        name,
        branch
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });
});

app.listen(3000, () => {
    console.log("Student Management API running at http://localhost:3000");
});