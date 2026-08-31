const express = require("express");
const app = express();

app.set("view engine", "ejs");

// Middleware to read form data
app.use(express.urlencoded({ extended: true }));

// Display the registration form
app.get("/register", (req, res) => {
    res.render("form");
});

// Handle submitted form data
app.post("/register", (req, res) => {
    const student = {
        name: req.body.name,
        email: req.body.email,
        course: req.body.course,
        semester: req.body.semester
    };

    res.render("result", { student });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});