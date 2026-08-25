const express = require("express");
const app = express();

// Route returning name as plain text
app.get("/name", (req, res) => {
    res.send("Name: Anusmita Jha");
});

// Route returning roll number as HTML
app.get("/roll", (req, res) => {
    res.send("<h1>Roll Number: 590015944</h1>");
});

// Route returning branch as JSON
app.get("/branch", (req, res) => {
    res.json({
        branch: "CSE"
    })