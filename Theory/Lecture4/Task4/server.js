const express = require("express");
const app = express();

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to the Student Management API");
});

// Get all students
app.get("/students", (req, res) => {
    const students = [
        { id: 1, name: "Aarav", branch: "CSE" },
        { id: 2, name: "Diya", branch: "ECE" },
        { id: 3, name: "Rohan", branch: "IT" }
    ];

    res.json(students);
});

// Get student by ID
app.get("/students/2", (req, res) => {
    res.json({
        id: 2,
        name: "Diya",
        branch: "ECE"
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});