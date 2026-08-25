const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

// Temporary in-memory user storage
const users = [];

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000
    }
}));

// Home route
app.get('/', (req, res) => {
    if (req.session.user) {
        res.send(`
            <h1>Welcome, ${req.session.user.username}!</h1>
            <p>You are logged in.</p>
            <a href="/dashboard">Dashboard</a><br>
            <a href="/logout">Logout</a>
        `);
    } else {
        res.send(`
            <h1>Simple User Login System</h1>
            <a href="/register">Register</a><br>
            <a href="/login">Login</a>
        `);
    }
});

// Register page
app.get('/register', (req, res) => {
    res.send(`
        <h1>Register</h1>

        <form action="/register" method="POST">
            <input
                type="text"
                name="username"
                placeholder="Enter username"
                required
            >
            <br><br>

            <input
                type="password"
                name="password"
                placeholder="Enter password"
                required
            >
            <br><br>

            <button type="submit">Register</button>
        </form>

        <br>
        <a href="/login">Already have an account? Login</a>
    `);
});

// Register user
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
        return res.send(`
            <h1>Registration Failed</h1>
            <p>Username already exists.</p>
            <a href="/register">Try Again</a>
        `);
    }

    users.push({
        username,
        password
    });

    res.redirect('/login');
});

// Login page
app.get('/login', (req, res) => {
    res.send(`
        <h1>Login</h1>

        <form action="/login" method="POST">
            <input
                type="text"
                name="username"
                placeholder="Enter username"
                required
            >
            <br><br>

            <input
                type="password"
                name="password"
                placeholder="Enter password"
                required
            >
            <br><br>

            <button type="submit">Login</button>
        </form>

        <br>
        <a href="/register">Create an account</a>
    `);
});

// Login user
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        user => user.username === username && user.password === password
    );

    if (!user) {
        return res.send(`
            <h1>Login Failed</h1>
            <p>Invalid username or password.</p>
            <a href="/login">Try Again</a>
        `);
    }

    req.session.user = {
        username: user.username
    };

    res.redirect('/dashboard');
});

// Authentication middleware
function authMiddleware(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Protected dashboard
app.get('/dashboard', authMiddleware, (req, res) => {
    res.send(`
        <h1>Dashboard</h1>

        <p>Welcome, ${req.session.user.username}!</p>
        <p>This page is protected by session authentication.</p>

        <a href="/logout">Logout</a>
    `);
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});