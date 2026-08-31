const express = require("express");
const app = express();

const students = [
    { id: 1, name: "Aarav", branch: "CSE" },
    { id: 2, name: "Diya", branch: "ECE" },
    { id: 3, name: "Rohan", branch: "IT" }
];

// Get all students
app.get("/students", (req, res) => {
    res.json(students);
});

// Get one student
app.get("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});