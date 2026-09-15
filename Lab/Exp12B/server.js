const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    session({
        secret: "mysecretkey",
        resave: false,
        saveUninitialized: false
    })
);

// Temporary users
const users = [];

// Home page
app.get("/", (req, res) => {
    res.send(`
        <h1>Simple User Login System</h1>

        <a href="/register">Register</a><br><br>
        <a href="/login">Login</a>
    `);
});

// Register page
app.get("/register", (req, res) => {
    res.send(`
        <h2>Register</h2>

        <form action="/register" method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <br><br>

            <input type="password" name="password" placeholder="Password" required>
            <br><br>

            <button type="submit">Register</button>
        </form>

        <br>
        <a href="/login">Already registered? Login</a>
    `);
});

// Register user
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    users.push({
        username,
        password
    });

    res.send(`
        <h2>Registration Successful!</h2>
        <a href="/login">Go to Login</a>
    `);
});

// Login page
app.get("/login", (req, res) => {
    res.send(`
        <h2>Login</h2>

        <form action="/login" method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <br><br>

            <input type="password" name="password" placeholder="Password" required>
            <br><br>

            <button type="submit">Login</button>
        </form>

        <br>
        <a href="/register">Create new account</a>
    `);
});

// Login user
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (user) {
        req.session.user = {
            username: username
        };

        res.redirect("/dashboard");
    } else {
        res.send(`
            <h2>Invalid username or password</h2>
            <a href="/login">Try Again</a>
        `);
    }
});

// Authentication middleware
function authMiddleware(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

// Dashboard
app.get("/dashboard", authMiddleware, (req, res) => {
    res.send(`
        <h1>Welcome, ${req.session.user.username}!</h1>

        <p>You are successfully logged in.</p>

        <a href="/logout">Logout</a>
    `);
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});