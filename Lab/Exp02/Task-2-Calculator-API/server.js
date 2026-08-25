const express = require("express");
const app = express();

app.get("/add", (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    res.json({
        operation: "addition",
        result: a + b
    });
});

app.get("/subtract", (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    res.json({
        operation: "subtraction",
        result: a - b
    });
});

app.get("/multiply", (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    res.json({
        operation: "multiplication",
        result: a * b
    });
});

app.get("/divide", (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    if (b === 0) {
        return res.json({ error: "Cannot divide by zero" });
    }

    res.json({
        operation: "division",
        result: a / b
    });
});

app.get("/modulus", (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    res.json({
        operation: "modulus",
        result: a % b
    });
});

app.get("/power", (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    res.json({
        operation: "power",
        result: a ** b
    });
});

app.listen(3000, () => {
    console.log("Calculator API running at http://localhost:3000");
});