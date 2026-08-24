const express = require("express");
const app = express();

app.set("view engine", "ejs");

const timetable = [
    {
        day: "Monday",
        time: "9:00 AM - 10:00 AM",
        subject: "Web Development",
        faculty: "Mr. Sharma"
    },
    {
        day: "Tuesday",
        time: "10:00 AM - 11:00 AM",
        subject: "Data Structures",
        faculty: "Ms. Verma"
    },
    {
        day: "Wednesday",
        time: "11:00 AM - 12:00 PM",
        subject: "Database Management",
        faculty: "Mr. Gupta"
    },
    {
        day: "Thursday",
        time: "1:00 PM - 2:00 PM",
        subject: "Computer Networks",
        faculty: "Ms. Singh"
    },
    {
        day: "Friday",
        time: "2:00 PM - 3:00 PM",
        subject: "Operating Systems",
        faculty: "Mr. Kumar"
    }
];

app.get("/timetable", (req, res) => {
    res.render("timetable", { timetable });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});