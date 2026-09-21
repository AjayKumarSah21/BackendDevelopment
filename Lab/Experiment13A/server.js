const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==========================================
// STEP 1: CONNECT TO LOCAL MONGODB
// ==========================================

const DB_URL = 'mongodb://localhost:27017/userdb';

mongoose.connect(DB_URL)
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });


// ==========================================
// STEP 2: USER SCHEMA
// ==========================================

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});


// ==========================================
// STEP 3: USER MODEL
// ==========================================

const User = mongoose.model('User', userSchema);


// ==========================================
// STEP 4: HOME PAGE
// ==========================================

app.get('/', (req, res) => {

    res.send(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>User Management System</title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 50px auto;
                    padding: 20px;
                }

                .container {
                    background: #f5f5f5;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 8px;
                }

                input {
                    width: 100%;
                    padding: 10px;
                    margin: 5px 0;
                    box-sizing: border-box;
                }

                button {
                    background: #007bff;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    cursor: pointer;
                    margin: 5px;
                }

                .success {
                    color: green;
                }

                .error {
                    color: red;
                }

            </style>

        </head>

        <body>

            <h1>User Management System</h1>


            <!-- Registration -->

            <div class="container">

                <h2>Register New User</h2>

                <form action="/signup" method="POST">

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        required
                    >

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                    >

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                    >

                    <button type="submit">
                        Sign Up
                    </button>

                </form>

            </div>


            <!-- Login -->

            <div class="container">

                <h2>Login</h2>

                <form action="/login" method="POST">

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        required
                    >

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                    >

                    <button type="submit">
                        Login
                    </button>

                </form>

            </div>


            <!-- View Users -->

            <div class="container">

                <h2>View All Users</h2>

                <form action="/users" method="GET">

                    <button type="submit">
                        Show All Registered Users
                    </button>

                </form>

            </div>

        </body>

        </html>

    `);

});


// ==========================================
// STEP 5: SIGNUP ROUTE
// ==========================================

app.post('/signup', async (req, res) => {

    try {

        const { username, email, password } = req.body;

        const newUser = new User({
            username: username,
            email: email,
            password: password
        });

        await newUser.save();

        res.send(`

            <h2 class="success">
                User registered successfully!
            </h2>

            <p>
                Username: ${username}
            </p>

            <p>
                Email: ${email}
            </p>

            <a href="/">
                Go back to home
            </a>

        `);

    } catch (error) {

        if (error.code === 11000) {

            res.send(`

                <h2 class="error">
                    Error: Username or email already exists
                </h2>

                <a href="/">
                    Go back and try again
                </a>

            `);

        } else {

            res.send(`

                <h2 class="error">
                    Error: ${error.message}
                </h2>

                <a href="/">
                    Go back and try again
                </a>

            `);

        }

    }

});


// ==========================================
// STEP 6: LOGIN ROUTE
// ==========================================

app.post('/login', async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await User.findOne({
            username: username
        });


        if (!user) {

            return res.send(`

                <h2 class="error">
                    User not found
                </h2>

                <a href="/">
                    Go back and try again
                </a>

            `);

        }


        if (user.password !== password) {

            return res.send(`

                <h2 class="error">
                    Incorrect password
                </h2>

                <a href="/">
                    Go back and try again
                </a>

            `);

        }


        res.send(`

            <h2 class="success">
                Login successful!
            </h2>

            <p>
                Welcome back, ${user.username}!
            </p>

            <p>
                Email: ${user.email}
            </p>

            <p>
                Account created:
                ${user.createdAt.toDateString()}
            </p>

            <a href="/">
                Go back to home
            </a>

        `);

    } catch (error) {

        res.send(`

            <h2 class="error">
                Error: ${error.message}
            </h2>

            <a href="/">
                Go back to home
            </a>

        `);

    }

});


// ==========================================
// STEP 7: VIEW ALL USERS
// ==========================================

app.get('/users', async (req, res) => {

    try {

        const allUsers = await User.find();


        if (allUsers.length === 0) {

            return res.send(`

                <h2>
                    No users registered yet
                </h2>

                <a href="/">
                    Go back to home
                </a>

            `);

        }


        let userList =
            '<h2>Registered Users</h2><ul>';


        allUsers.forEach(user => {

            userList += `

                <li>

                    <strong>Username:</strong>
                    ${user.username}

                    |

                    <strong>Email:</strong>
                    ${user.email}

                    |

                    <strong>Joined:</strong>
                    ${user.createdAt.toDateString()}

                </li>

            `;

        });


        userList += `
            </ul>

            <a href="/">
                Go back to home
            </a>
        `;


        res.send(userList);

    } catch (error) {

        res.send(`

            <h2 class="error">
                Error: ${error.message}
            </h2>

            <a href="/">
                Go back to home
            </a>

        `);

    }

});


// ==========================================
// STEP 8: START SERVER
// ==========================================

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});