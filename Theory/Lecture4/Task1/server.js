const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("<h1>Student Management API</h1><p>Welcome to the backend server.</p>");
});

app.get("/students", (req, res) => {
    const students = [
        { id: 1, name: "Aarav", branch: "CSE" },
        { id: 2, name: "Diya", branch: "ECE" },
        { id: 3, name: "Rohan", branch: "IT" }
    ];

    res.json(students);
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
}); 