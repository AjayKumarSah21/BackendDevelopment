# Experiment 13 A --- Express + Mongoose User Management

## Objective

To understand the basics of MongoDB, Mongoose, and Express.js by
building a simple user management application that supports user
registration, login, and viewing registered users.

The experiment demonstrates how a Node.js application can connect to
MongoDB, define structured documents with Mongoose schemas, create
models, save and retrieve data asynchronously, and handle common
database errors.

------------------------------------------------------------------------

# Prerequisites

Before performing this experiment, the following are required:

-   Node.js installed
-   MongoDB installed locally **or** a MongoDB Atlas account
-   Basic understanding of JavaScript

------------------------------------------------------------------------

# Project Setup

## Step 1 --- Create the Project Directory

``` bash
mkdir mongoose-demo
cd mongoose-demo
```

## Step 2 --- Initialize Node.js

``` bash
npm init -y
```

This creates a default `package.json`.

## Step 3 --- Install Dependencies

``` bash
npm install express mongoose
```

The project uses:

  -----------------------------------------------------------------------
  Package                             Purpose
  ----------------------------------- -----------------------------------
  `express`                           Creates the web server, routes,
                                      forms, and HTTP responses

  `mongoose`                          Connects Node.js to MongoDB and
                                      provides schemas, models,
                                      validation, and queries
  -----------------------------------------------------------------------

## Step 4 --- Create the Main File

Create:

``` text
server.js
```

------------------------------------------------------------------------

# Understanding the Components

## What is MongoDB?

MongoDB is a document-oriented database. Instead of storing information
in relational tables and rows, it stores documents inside collections.

A user document can look like:

``` json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

------------------------------------------------------------------------

## What is Mongoose?

Mongoose is a Node.js library that simplifies working with MongoDB.

It provides:

-   Schemas
-   Models
-   Validation
-   Query methods
-   Document creation
-   Update and delete operations

Mongoose adds structure to MongoDB data while still using MongoDB as the
underlying database.

------------------------------------------------------------------------

# What is a Mongoose Schema?

A schema is a blueprint that describes the fields expected in a
document.

Example:

``` javascript
const userSchema =
    new mongoose.Schema({
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
        }
    });
```

The schema specifies:

-   Field names
-   Data types
-   Required fields
-   Unique fields
-   Default values

------------------------------------------------------------------------

# What is a Mongoose Model?

A model is the interface used to interact with documents in MongoDB.

``` javascript
const User =
    mongoose.model(
        'User',
        userSchema
    );
```

The `User` model can then be used to:

-   Create users
-   Save users
-   Find users
-   Update users
-   Delete users

With the model name `User`, Mongoose creates/uses a MongoDB collection
named `users`.

------------------------------------------------------------------------

# Complete Application

## `server.js`

``` javascript
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Parse JSON requests
app.use(express.json());

// Parse HTML form data
app.use(
    express.urlencoded({
        extended: true
    })
);

// ==========================================
// STEP 1: CONNECT TO MONGODB
// ==========================================

// Local MongoDB
const DB_URL =
    'mongodb://localhost:27017/userdb';

// MongoDB Atlas example:
// const DB_URL =
// 'mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/userdb?retryWrites=true&w=majority';

mongoose
    .connect(DB_URL)
    .then(() => {
        console.log(
            'Connected to MongoDB successfully'
        );
    })
    .catch(error => {
        console.error(
            'MongoDB connection error:',
            error
        );
    });

// ==========================================
// STEP 2: DEFINE USER SCHEMA
// ==========================================

const userSchema =
    new mongoose.Schema({

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
// STEP 3: CREATE MODEL
// ==========================================

const User =
    mongoose.model(
        'User',
        userSchema
    );

// ==========================================
// STEP 4: ROUTES
// ==========================================

// Home page
app.get('/', (req, res) => {

    res.send(`
        <!DOCTYPE html>

        <html>

        <head>

            <title>
                User Management System
            </title>

            <style>

                body {
                    font-family:
                        Arial,
                        sans-serif;

                    max-width: 800px;

                    margin:
                        50px auto;

                    padding: 20px;
                }

                .container {
                    background: #f5f5f5;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 8px;
                }

                h2 {
                    color: #333;
                }

                input {
                    width: 100%;
                    padding: 10px;
                    margin: 5px 0;
                    box-sizing:
                        border-box;
                }

                button {
                    background: #007bff;
                    color: white;
                    padding:
                        10px 20px;
                    border: none;
                    cursor: pointer;
                    margin: 5px;
                }

                button:hover {
                    background: #0056b3;
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

            <h1>
                User Management System
            </h1>

            <div class="container">

                <h2>
                    Register New User
                </h2>

                <form
                    action="/signup"
                    method="POST"
                >

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

            <div class="container">

                <h2>
                    Login
                </h2>

                <form
                    action="/login"
                    method="POST"
                >

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

            <div class="container">

                <h2>
                    View All Users
                </h2>

                <form
                    action="/users"
                    method="GET"
                >

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
// SIGNUP
// ==========================================

app.post(
    '/signup',
    async (req, res) => {

        try {

            const {
                username,
                email,
                password
            } = req.body;

            const newUser =
                new User({
                    username,
                    email,
                    password
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

            if (
                error.code === 11000
            ) {

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
    }
);

// ==========================================
// LOGIN
// ==========================================

app.post(
    '/login',
    async (req, res) => {

        try {

            const {
                username,
                password
            } = req.body;

            const user =
                await User.findOne({
                    username
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

            if (
                user.password !== password
            ) {

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
                    Welcome back,
                    ${user.username}!
                </p>

                <p>
                    Email:
                    ${user.email}
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
                    Error:
                    ${error.message}
                </h2>

                <a href="/">
                    Go back and try again
                </a>
            `);
        }
    }
);

// ==========================================
// VIEW ALL USERS
// ==========================================

app.get(
    '/users',
    async (req, res) => {

        try {

            const allUsers =
                await User.find();

            if (
                allUsers.length === 0
            ) {

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

            allUsers.forEach(
                user => {

                    userList += `
                        <li>

                            <strong>
                                Username:
                            </strong>
                            ${user.username}

                            |

                            <strong>
                                Email:
                            </strong>
                            ${user.email}

                            |

                            <strong>
                                Joined:
                            </strong>
                            ${user.createdAt.toDateString()}

                        </li>
                    `;
                }
            );

            userList +=
                '</ul><a href="/">Go back to home</a>';

            res.send(userList);

        } catch (error) {

            res.send(`
                <h2 class="error">
                    Error:
                    ${error.message}
                </h2>

                <a href="/">
                    Go back and try again
                </a>
            `);
        }
    }
);

// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );
    }
);
```

------------------------------------------------------------------------

# Application Flow

The application contains three main operations:

1.  Register a user
2.  Login with stored credentials
3.  View all registered users

------------------------------------------------------------------------

# User Registration

The registration form sends a POST request to:

``` text
/signup
```

The server reads:

``` javascript
const {
    username,
    email,
    password
} = req.body;
```

A new Mongoose document is created:

``` javascript
const newUser =
    new User({
        username,
        email,
        password
    });
```

The document is saved with:

``` javascript
await newUser.save();
```

MongoDB stores the new user in the `users` collection.

------------------------------------------------------------------------

# Duplicate User Handling

The schema declares `username` and `email` as unique.

``` javascript
username: {
    type: String,
    required: true,
    unique: true
}
```

If a duplicate value violates a unique index, MongoDB/Mongoose can
produce error code:

``` text
11000
```

The example handles it with:

``` javascript
if (
    error.code === 11000
) {
    // Duplicate username/email
}
```

------------------------------------------------------------------------

# Login

The login route receives:

``` javascript
const {
    username,
    password
} = req.body;
```

The application searches for the username:

``` javascript
const user =
    await User.findOne({
        username
    });
```

If no document is found:

``` javascript
if (!user) {
    // User not found
}
```

The example then compares the submitted password with the stored value:

``` javascript
if (
    user.password !== password
) {
    // Incorrect password
}
```

If both values match, the application displays a successful login
response.

------------------------------------------------------------------------

# View All Users

The route:

``` text
GET /users
```

uses:

``` javascript
const allUsers =
    await User.find();
```

This returns all user documents.

The application loops through the result and creates an HTML list
containing:

-   Username
-   Email
-   Account creation date

------------------------------------------------------------------------

# Testing the Application

## Step 1 --- Start MongoDB

For local MongoDB:

``` bash
mongod
```

If MongoDB Atlas is being used:

1.  Create an Atlas cluster.
2.  Obtain the connection string.
3.  Replace `DB_URL` in `server.js`.

------------------------------------------------------------------------

## Step 2 --- Run the Server

``` bash
node server.js
```

Expected terminal messages include:

``` text
Server running on http://localhost:3000
Connected to MongoDB successfully
```

------------------------------------------------------------------------

## Step 3 --- Open the Application

Navigate to:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

## Step 4 --- Test Registration

Enter:

-   Username
-   Email
-   Password

Click:

``` text
Sign Up
```

Expected result:

``` text
User registered successfully!
```

------------------------------------------------------------------------

## Step 5 --- Test Login

Use the username and password that were registered.

Expected result:

``` text
Login successful!
```

The response should display the username, email, and account creation
date.

------------------------------------------------------------------------

## Step 6 --- View All Users

Click:

``` text
Show All Registered Users
```

The `/users` route should display all stored users.

------------------------------------------------------------------------

## Step 7 --- Test Duplicate Values

Attempt to register another user with an existing username or email.

Expected response:

``` text
Error: Username or email already exists
```

------------------------------------------------------------------------

# Key Mongoose Concepts

## 1. Connecting to MongoDB

``` javascript
mongoose
    .connect(DB_URL)
    .then(() =>
        console.log(
            'Connected'
        )
    )
    .catch(error =>
        console.error(
            'Error:',
            error
        )
    );
```

This establishes the connection between the Node.js application and
MongoDB.

------------------------------------------------------------------------

## 2. Schema Definition

``` javascript
const userSchema =
    new mongoose.Schema({

        username: {
            type: String,
            required: true,
            unique: true
        }
    });
```

The schema defines the expected structure and rules for documents.

------------------------------------------------------------------------

## 3. Creating a Model

``` javascript
const User =
    mongoose.model(
        'User',
        userSchema
    );
```

The model provides methods for interacting with the MongoDB collection.

------------------------------------------------------------------------

## 4. Creating and Saving Documents

``` javascript
const newUser =
    new User({
        username: 'john',
        email: 'john@email.com'
    });

await newUser.save();
```

This creates and stores a new document.

------------------------------------------------------------------------

## 5. Finding One Document

``` javascript
const user =
    await User.findOne({
        username: 'john'
    });
```

This returns one matching document.

------------------------------------------------------------------------

## 6. Finding All Documents

``` javascript
const allUsers =
    await User.find();
```

This returns all documents in the collection.

------------------------------------------------------------------------

## 7. Conditional Search

``` javascript
const admins =
    await User.find({
        role: 'admin'
    });
```

This returns documents matching the condition.

------------------------------------------------------------------------

## 8. Error Handling

``` javascript
try {

    await newUser.save();

} catch (error) {

    if (
        error.code === 11000
    ) {

        console.log(
            'Duplicate key error'
        );
    }
}
```

------------------------------------------------------------------------

# Common Mongoose Methods

  --------------------------------------------------------------------------------------------
  Method                  Purpose                 Example
  ----------------------- ----------------------- --------------------------------------------
  `.save()`               Save a document         `await user.save()`

  `.find()`               Find multiple/all       `await User.find()`
                          documents               

  `.findOne()`            Find one matching       `await User.findOne({ username: 'john' })`
                          document                

  `.findById()`           Find a document by ID   `await User.findById(id)`

  `.updateOne()`          Update one document     `await User.updateOne(filter, update)`

  `.deleteOne()`          Delete one document     `await User.deleteOne(filter)`
  --------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# Additional CRUD Examples

The source introduces update and delete methods in the Mongoose methods
table.

## Find by ID

``` javascript
const user =
    await User.findById(
        userId
    );
```

## Update User

``` javascript
await User.updateOne(
    {
        username: 'john'
    },
    {
        email:
            'new@email.com'
    }
);
```

## Delete User

``` javascript
await User.deleteOne({
    username: 'john'
});
```

These operations complete the basic CRUD pattern:

  CRUD     Mongoose Operation
  -------- ----------------------------------------
  Create   `new User()` + `.save()`
  Read     `.find()`, `.findOne()`, `.findById()`
  Update   `.updateOne()`
  Delete   `.deleteOne()`

------------------------------------------------------------------------

# Project Structure

``` text
mongoose-demo/
├── node_modules/
├── server.js
├── package.json
└── package-lock.json
```

------------------------------------------------------------------------

# Important Notes

## Password Storage

The tutorial stores passwords as plain text only for learning purposes.

This code:

``` javascript
password: password
```

does **not** provide secure password storage.

The source recommends using a library such as `bcrypt` in production.

------------------------------------------------------------------------

## Error Handling

The application contains basic error handling for:

-   MongoDB connection errors
-   Duplicate username/email
-   Missing users
-   Incorrect passwords
-   General database errors

------------------------------------------------------------------------

## Database Name

The local connection is:

``` javascript
mongodb://localhost:27017/userdb
```

Therefore, the database name is:

``` text
userdb
```

MongoDB creates it when data is first stored if necessary.

------------------------------------------------------------------------

## Collection Name

The model is created with:

``` javascript
mongoose.model(
    'User',
    userSchema
);
```

Mongoose uses the collection:

``` text
users
```

------------------------------------------------------------------------

## Async/Await

Database operations are asynchronous.

Examples include:

``` javascript
await newUser.save();
```

``` javascript
await User.findOne({
    username
});
```

``` javascript
await User.find();
```

`async/await` makes asynchronous database operations easier to read and
manage.

------------------------------------------------------------------------

# Troubleshooting

## MongoDB Connection Error

### Local MongoDB

Ensure MongoDB is running:

``` bash
mongod
```

### MongoDB Atlas

Check:

-   Connection string
-   Username
-   Password
-   Cluster configuration

------------------------------------------------------------------------

## Port Already in Use

If port `3000` is unavailable, change:

``` javascript
const PORT = 3000;
```

to another port:

``` javascript
const PORT = 3001;
```

Then open:

``` text
http://localhost:3001
```

------------------------------------------------------------------------

## Duplicate Key Error

A duplicate-key error can occur when attempting to save an existing
username or email.

The application handles:

``` javascript
error.code === 11000
```

and displays an appropriate message.

------------------------------------------------------------------------

# Optional Next Steps

After understanding the basic application, it can be extended with:

-   Password hashing using `bcrypt`
-   Sessions for logged-in users
-   Additional schema fields such as age and address
-   Update routes
-   Delete routes
-   Better input validation
-   Environment variables for the database URL
-   Separate route files
-   A dedicated frontend framework

------------------------------------------------------------------------

# Suggested Improvement --- Environment Variables

Instead of hard-coding:

``` javascript
const DB_URL =
    'mongodb://localhost:27017/userdb';
```

a future version can read configuration from environment variables.

For example:

``` javascript
const DB_URL =
    process.env.DB_URL;
```

The source identifies environment variables for the database URL as an
optional next step.

------------------------------------------------------------------------

# Suggested Improvement --- Password Hashing

The tutorial explicitly notes that the plain-text password
implementation is for learning only.

A future version should hash passwords before saving them.

The source recommends:

``` text
bcrypt
```

The intended flow would be:

``` text
User enters password
        ↓
Password is hashed
        ↓
Hash is stored in MongoDB
        ↓
Login password is compared with stored hash
```

------------------------------------------------------------------------

# Testing Checklist

-   Create the Node.js project.
-   Install Express and Mongoose.
-   Start MongoDB.
-   Start `server.js`.
-   Confirm MongoDB connects successfully.
-   Open the home page.
-   Register a new user.
-   Confirm the user is stored.
-   Try registering the same username again.
-   Try registering the same email again.
-   Login with a valid username and password.
-   Try logging in with a nonexistent username.
-   Try logging in with an incorrect password.
-   Open `/users`.
-   Confirm all registered users are displayed.
-   Stop MongoDB and observe the connection error.
-   Test another port if port 3000 is occupied.

------------------------------------------------------------------------

# Important Viva Questions

## 1. What is Mongoose?

Mongoose is a Node.js library that provides schemas, models, validation,
and query methods for working with MongoDB.

## 2. What is a schema?

A schema defines the expected structure and properties of MongoDB
documents.

## 3. What is a model?

A model is the interface used to create, read, update, and delete
documents.

## 4. How is MongoDB connected through Mongoose?

``` javascript
mongoose.connect(DB_URL);
```

## 5. What does `required: true` mean?

It indicates that the field is mandatory according to the Mongoose
schema.

## 6. What does `unique: true` mean?

It indicates that values for that field should be unique through the
corresponding unique index behavior.

In this experiment, it is used for username and email.

## 7. What does `default: Date.now` do?

It automatically assigns the current date/time when the document is
created.

## 8. How do you create a document?

``` javascript
const user =
    new User({
        username: 'john'
    });
```

## 9. How do you save a document?

``` javascript
await user.save();
```

## 10. What does `.find()` do?

It retrieves multiple matching documents. With no condition, it
retrieves all documents.

## 11. What does `.findOne()` do?

It returns one document matching a query.

## 12. What does `.findById()` do?

It retrieves a document using its MongoDB/Mongoose ID.

## 13. What does `.updateOne()` do?

It updates one matching document.

## 14. What does `.deleteOne()` do?

It removes one matching document.

## 15. What does error code `11000` represent in this experiment?

It represents a duplicate-key error, such as attempting to reuse a
unique username or email.

## 16. Why are database operations asynchronous?

Database operations involve I/O and may take time, so the example
handles them asynchronously using `async/await`.

## 17. What database is used?

The local example uses:

``` text
userdb
```

## 18. What collection is created?

The `User` model corresponds to the `users` collection.

## 19. Why should passwords not be stored as plain text?

If database contents are exposed, plain-text passwords are immediately
readable. The tutorial recommends password hashing for production.

## 20. What is MongoDB Atlas?

MongoDB Atlas is a hosted MongoDB service that can be used instead of a
locally installed MongoDB server.

------------------------------------------------------------------------

# Key Learning Outcomes

After completing Experiment 13 A, the student should understand:

1.  How to create a Node.js and Express project.
2.  How to install and use Mongoose.
3.  How to connect an Express application to MongoDB.
4.  How to define Mongoose schemas.
5.  How to create Mongoose models.
6.  How to create and save MongoDB documents.
7.  How to find one or multiple documents.
8.  How to use basic Mongoose CRUD methods.
9.  How to process HTML form data in Express.
10. How to build registration and login routes.
11. How to handle duplicate-key errors.
12. How `async/await` is used with database operations.
13. Why production applications need stronger password handling and
    configuration practices.

------------------------------------------------------------------------

# Conclusion

Experiment 13 A provides a beginner-friendly introduction to integrating
Express.js with MongoDB through Mongoose.

The application connects to a MongoDB database, defines a structured
user schema, creates a Mongoose model, and uses that model to save and
retrieve user documents. The registration route demonstrates document
creation with `.save()`, the login route demonstrates `.findOne()`, and
the users route demonstrates `.find()`.

The experiment also introduces important Mongoose concepts such as
schemas, models, required and unique fields, default values,
asynchronous database operations, and duplicate-key error handling.

The example intentionally keeps authentication simple for learning
purposes. Passwords are stored as plain text in the tutorial, so a
production version should add password hashing, sessions, validation,
environment variables, and stronger application structure.

Overall, this experiment establishes the foundation required to build
larger MongoDB-backed Node.js applications using Express and Mongoose.
