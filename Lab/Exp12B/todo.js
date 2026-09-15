const express = require("express");
const session = require("express-session");

const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "todoSecret",
        resave: false,
        saveUninitialized: true
    })
);

// Home page
app.get("/", (req, res) => {

    if (!req.session.todos) {
        req.session.todos = [];
    }

    let todoList = "";

    req.session.todos.forEach((item, index) => {
        todoList += `
            <li>
                ${item}
                <a href="/delete/${index}">Delete</a>
            </li>
        `;
    });

    res.send(`
        <h1>Session-Based To-Do List</h1>

        <form action="/add" method="POST">
            <input
                type="text"
                name="todoItem"
                placeholder="Enter a task"
                required
            >

            <button type="submit">Add Task</button>
        </form>

        <h2>My Tasks</h2>

        <ul>
            ${todoList}
        </ul>
    `);
});

// Add todo
app.post("/add", (req, res) => {

    if (!req.session.todos) {
        req.session.todos = [];
    }

    req.session.todos.push(req.body.todoItem);

    res.redirect("/");
});

// Delete todo
app.get("/delete/:id", (req, res) => {

    const id = parseInt(req.params.id);

    req.session.todos = req.session.todos.filter(
        (item, index) => index !== id
    );

    res.redirect("/");
});

// Start server
app.listen(PORT, () => {
    console.log(`To-Do server running at http://localhost:${PORT}`);
});