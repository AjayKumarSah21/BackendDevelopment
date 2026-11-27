# Experiment 12 --- Node.js, Express.js, and EJS Templating

## Objective

To understand and implement server-side JavaScript using Node.js, build
web applications and APIs using Express.js, handle HTTP requests and
responses, work with URL parameters and POST data, create dynamic pages
with EJS templating, and use Nodemon to improve the development
workflow.

------------------------------------------------------------------------

# Theory

## What is Node.js?

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.
It allows JavaScript to run outside the browser, making it possible to
use JavaScript for server-side and backend development.

Node.js uses an event-driven and non-blocking I/O model. This makes it
suitable for applications that need to handle many requests or I/O
operations efficiently.

### Key Features

-   Asynchronous and event-driven execution
-   Single-threaded event loop
-   Fast execution using the V8 engine
-   Large NPM ecosystem
-   Cross-platform support

A simple Node.js program can be executed directly from the terminal:

``` javascript
console.log("Hello from Node.js!");

const name = "Student";
const course = "Backend Development";

console.log(`Welcome ${name} to ${course}`);
```

Run it with:

``` bash
node script.js
```

------------------------------------------------------------------------

## What is NPM?

NPM stands for **Node Package Manager**. It is the default package
manager used with Node.js.

NPM is used to:

-   Install third-party packages
-   Manage project dependencies
-   Share and reuse packages
-   Define and execute project scripts

For example:

``` bash
npm install express
```

This installs Express and records it as a dependency of the project.

------------------------------------------------------------------------

## What is Express.js?

Express.js is a minimal and flexible web application framework for
Node.js. It simplifies the process of creating web servers, routes,
APIs, middleware, and HTTP responses.

### Main Features

-   Routing
-   Middleware support
-   Template-engine integration
-   HTTP response utilities
-   Error handling

Common Express response methods include:

  -----------------------------------------------------------------------
  Method                              Purpose
  ----------------------------------- -----------------------------------
  `res.send()`                        Sends text, HTML, objects, buffers,
                                      or other responses

  `res.json()`                        Sends a JSON response

  `res.render()`                      Renders a template

  `res.sendFile()`                    Sends a file

  `res.status()`                      Sets an HTTP status code

  `res.redirect()`                    Redirects the client
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## What is EJS?

EJS stands for **Embedded JavaScript**. It is a templating language that
allows JavaScript values and logic to be embedded inside HTML.

EJS makes it possible for an Express application to generate dynamic
HTML on the server.

For example:

``` ejs
<h1><%= heading %></h1>
<p><%= message %></p>
```

The values can be supplied from an Express route:

``` javascript
res.render('home', {
    heading: 'Welcome to EJS',
    message: 'Dynamic content from Express'
});
```

------------------------------------------------------------------------

## What is Nodemon?

Nodemon is a development utility that automatically restarts a Node.js
application whenever source files change.

Without Nodemon, the developer normally needs to stop and restart the
Node.js server manually after modifying code.

Install it locally with:

``` bash
npm install nodemon -D
```

It can then be used through an NPM script:

``` json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

Run the development server with:

``` bash
npm run dev
```

------------------------------------------------------------------------

# Part A --- Node.js and Express Basics

## Step 1 --- Install Node.js and NPM

Install the LTS version of Node.js.

Verify the installation:

``` bash
node --version
npm --version
```

------------------------------------------------------------------------

## Step 2 --- Create and Initialize the Project

Create the project folder:

``` bash
mkdir nodejs-express-lab
cd nodejs-express-lab
```

Initialize NPM interactively:

``` bash
npm init
```

Or use the quick initialization command:

``` bash
npm init -y
```

The second command automatically creates a `package.json` file using
default values.

------------------------------------------------------------------------

## Step 3 --- Basic Node.js Script

Create `script.js`:

``` javascript
console.log("Hello from Node.js!");

const name = "Student";
const course = "Backend Development";

console.log(`Welcome ${name} to ${course}`);

const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce((acc, num) => acc + num, 0);

console.log(`Sum of numbers: ${sum}`);
```

Run:

``` bash
node script.js
```

This demonstrates that JavaScript can run directly through Node.js
without a browser.

------------------------------------------------------------------------

## Step 4 --- Install Express.js

``` bash
npm install express
```

Installing Express:

-   Adds Express to `package.json`
-   Creates the `node_modules` directory
-   Creates or updates `package-lock.json`

------------------------------------------------------------------------

## Step 5 --- Create a Basic Express Server

Create `app.js`:

``` javascript
const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
```

Start the server:

``` bash
node app.js
```

Open:

``` text
http://localhost:3000
```

The browser should display:

``` text
Hello from Express!
```

------------------------------------------------------------------------

## Step 6 --- Add NPM Scripts

A useful `package.json` configuration is:

``` json
{
  "name": "nodejs-express-lab",
  "version": "1.0.0",
  "description": "Node.js and Express Lab",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "node app.js"
  },
  "keywords": ["nodejs", "express"],
  "author": "Your Name",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

Run:

``` bash
npm run dev
```

------------------------------------------------------------------------

## Step 7 --- Express Response Methods

Express can return different types of HTTP responses.

``` javascript
app.get('/', (req, res) => {
    res.send('Welcome to Express!');
});
```

### Plain Text

``` javascript
app.get('/text', (req, res) => {
    res.send('This is plain text response');
});
```

### HTML

``` javascript
app.get('/html', (req, res) => {
    res.send('<h1>HTML Response</h1><p>This is HTML content</p>');
});
```

### JSON

``` javascript
app.get('/json', (req, res) => {
    res.json({
        message: 'This is JSON response',
        status: 'success',
        data: {
            name: 'Student',
            course: 'Backend Development'
        }
    });
});
```

### Status Code

``` javascript
app.get('/status', (req, res) => {
    res.status(201).json({
        message: 'Created successfully'
    });
});
```

------------------------------------------------------------------------

# Part B --- URL Parameters and POST Data

## Step 8 --- Route Parameters

Route parameters are dynamic values included in the URL path.

``` javascript
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;

    res.json({
        message: 'User details',
        userId: userId
    });
});
```

Test:

``` text
http://localhost:3000/user/123
```

For multiple route parameters:

``` javascript
app.get('/product/:category/:id', (req, res) => {
    const { category, id } = req.params;

    res.json({
        category: category,
        productId: id
    });
});
```

Test:

``` text
http://localhost:3000/product/electronics/456
```

------------------------------------------------------------------------

## Step 9 --- Query Parameters

Query parameters are supplied after `?` in a URL and can be accessed
using `req.query`.

``` javascript
app.get('/search', (req, res) => {
    const { q, page, limit } = req.query;

    res.json({
        searchQuery: q,
        page: page || 1,
        limit: limit || 10
    });
});
```

Example:

``` text
http://localhost:3000/search?q=nodejs&page=2&limit=20
```

### Calculator Using Query Parameters

``` javascript
app.get('/calculate', (req, res) => {
    const { num1, num2, operation } = req.query;

    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    let result;

    switch (operation) {
        case 'add':
            result = n1 + n2;
            break;

        case 'subtract':
            result = n1 - n2;
            break;

        case 'multiply':
            result = n1 * n2;
            break;

        case 'divide':
            result = n2 !== 0
                ? n1 / n2
                : 'Error: Division by zero';
            break;

        default:
            result = 'Invalid operation';
    }

    res.json({
        num1: n1,
        num2: n2,
        operation,
        result
    });
});
```

Example:

``` text
http://localhost:3000/calculate?num1=10&num2=5&operation=add
```

Expected result:

``` json
{
  "num1": 10,
  "num2": 5,
  "operation": "add",
  "result": 15
}
```

------------------------------------------------------------------------

## Step 10 --- Handling POST Data

Express provides middleware for parsing incoming request bodies.

``` javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

`express.json()` parses JSON request bodies.

`express.urlencoded()` parses URL-encoded form data.

### Registration Route

``` javascript
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    res.json({
        message: 'Registration successful',
        user: {
            username,
            email
        }
    });
});
```

Example using `curl`:

``` bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"pass123"}'
```

### Login Route

``` javascript
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (
        email === 'test@example.com' &&
        password === 'password123'
    ) {
        res.json({
            success: true,
            message: 'Login successful',
            token: 'sample-jwt-token'
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});
```

This example demonstrates request-body handling and HTTP status codes.

------------------------------------------------------------------------

# Part C --- EJS Templating

## Step 11 --- Install and Configure EJS

Install EJS:

``` bash
npm install ejs
```

Configure it in `app.js`:

``` javascript
app.set('view engine', 'ejs');
app.set('views', './views');
```

Create the views folder:

``` bash
mkdir views
```

------------------------------------------------------------------------

## Step 12 --- Create EJS Templates

### `views/home.ejs`

``` ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >
    <title><%= title %></title>
</head>

<body>
    <div class="container">
        <h1><%= heading %></h1>

        <p><%= message %></p>

        <p>
            Current Time:
            <%= new Date().toLocaleString() %>
        </p>
    </div>
</body>
</html>
```

### `views/users.ejs`

``` ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Users List</title>
</head>

<body>

<h1>Users List</h1>

<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
        </tr>
    </thead>

    <tbody>
        <% users.forEach(function(user) { %>
            <tr>
                <td><%= user.id %></td>
                <td><%= user.name %></td>
                <td><%= user.email %></td>
            </tr>
        <% }); %>
    </tbody>
</table>

<% if (users.length === 0) { %>
    <p>No users found.</p>
<% } %>

</body>
</html>
```

### `views/profile.ejs`

``` ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>User Profile</title>
</head>

<body>

<div class="profile-card">

    <h1>User Profile</h1>

    <p>
        <strong>Name:</strong>
        <%= user.name %>
    </p>

    <p>
        <strong>Email:</strong>
        <%= user.email %>
    </p>

    <p>
        <strong>Age:</strong>
        <%= user.age %>
    </p>

    <p>
        <strong>City:</strong>
        <%= user.city %>
    </p>

</div>

</body>
</html>
```

------------------------------------------------------------------------

## Step 13 --- Render EJS Templates

### Home Route

``` javascript
app.get('/home', (req, res) => {
    res.render('home', {
        title: 'Home Page',
        heading: 'Welcome to EJS Templating',
        message: 'EJS makes it easy to generate dynamic HTML'
    });
});
```

### Users Route

``` javascript
app.get('/users', (req, res) => {
    const users = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com'
        },
        {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob@example.com'
        }
    ];

    res.render('users', { users });
});
```

### Profile Route

``` javascript
app.get('/profile/:id', (req, res) => {
    const userId = req.params.id;

    const user = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        city: 'New York'
    };

    res.render('profile', { user });
});
```

EJS therefore allows server-side data to be inserted directly into
dynamically generated HTML.

------------------------------------------------------------------------

# Part D --- Nodemon for Auto-Restart

## Step 14 --- Install Nodemon

Recommended local installation:

``` bash
npm install nodemon -D
```

Equivalent:

``` bash
npm install nodemon --save-dev
```

Global installation:

``` bash
npm install nodemon -g
```

------------------------------------------------------------------------

## Step 15 --- Configure Nodemon

Update `package.json`:

``` json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

Run:

``` bash
npm run dev
```

An optional `nodemon.json` configuration is:

``` json
{
  "watch": ["*.js", "views"],
  "ext": "js,json,ejs",
  "ignore": ["node_modules"],
  "delay": "2500"
}
```

This tells Nodemon what files to monitor and what files or directories
to ignore.

------------------------------------------------------------------------

# Complete Working Express Application

## `app.js`

``` javascript
const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.send('Welcome to Express Server!');
});

app.get('/text', (req, res) => {
    res.send('This is plain text response');
});

app.get('/html', (req, res) => {
    res.send(
        '<h1>HTML Response</h1><p>This is HTML content</p>'
    );
});

app.get('/json', (req, res) => {
    res.json({
        message: 'This is JSON response',
        status: 'success',
        data: {
            name: 'Student',
            course: 'Backend Development'
        }
    });
});

app.get('/user/:id', (req, res) => {
    const userId = req.params.id;

    res.json({
        message: 'User details',
        userId: userId
    });
});

app.get('/search', (req, res) => {
    const { q, page, limit } = req.query;

    res.json({
        searchQuery: q,
        page: page || 1,
        limit: limit || 10
    });
});

app.get('/calculate', (req, res) => {
    const { num1, num2, operation } = req.query;

    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    let result;

    switch (operation) {
        case 'add':
            result = n1 + n2;
            break;

        case 'subtract':
            result = n1 - n2;
            break;

        case 'multiply':
            result = n1 * n2;
            break;

        case 'divide':
            result = n2 !== 0 ? n1 / n2 : 'Error';
            break;

        default:
            result = 'Invalid operation';
    }

    res.json({
        num1: n1,
        num2: n2,
        operation,
        result
    });
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    res.json({
        message: 'Registration successful',
        user: {
            username,
            email
        }
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (
        email === 'test@example.com' &&
        password === 'password123'
    ) {
        res.json({
            success: true,
            message: 'Login successful',
            token: 'sample-jwt-token'
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

app.get('/home', (req, res) => {
    res.render('home', {
        title: 'Home Page',
        heading: 'Welcome to EJS Templating',
        message: 'EJS makes it easy to generate dynamic HTML'
    });
});

app.get('/users', (req, res) => {
    const users = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com'
        },
        {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob@example.com'
        }
    ];

    res.render('users', { users });
});

app.get('/profile/:id', (req, res) => {
    const user = {
        id: req.params.id,
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        city: 'New York'
    };

    res.render('profile', { user });
});

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});
```

------------------------------------------------------------------------

# `package.json`

``` json
{
  "name": "nodejs-express-lab",
  "version": "1.0.0",
  "description": "Node.js, Express.js, and EJS Lab",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "keywords": [
    "nodejs",
    "express",
    "ejs"
  ],
  "author": "Your Name",
  "license": "ISC",
  "dependencies": {
    "ejs": "^3.1.9",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

------------------------------------------------------------------------

# Available Endpoints

  Method   Endpoint         Purpose
  -------- ---------------- -------------------------
  GET      `/`              Welcome message
  GET      `/text`          Plain-text response
  GET      `/html`          HTML response
  GET      `/json`          JSON response
  GET      `/user/:id`      Route parameter example
  GET      `/search`        Query parameter example
  GET      `/calculate`     Calculator endpoint
  POST     `/register`      Registration data
  POST     `/login`         Login example
  GET      `/home`          EJS home page
  GET      `/users`         EJS users table
  GET      `/profile/:id`   Dynamic EJS profile

------------------------------------------------------------------------

# Lab Tasks

## Task 1 --- Basic Server

Create an Express server with routes that return your name, roll number,
and branch in different formats.

Example:

``` javascript
app.get('/name', (req, res) => {
    res.send('Your Name');
});

app.get('/student', (req, res) => {
    res.send(`
        <h1>Student Information</h1>
        <p>Roll Number: YOUR_ROLL_NUMBER</p>
        <p>Branch: YOUR_BRANCH</p>
    `);
});

app.get('/student-json', (req, res) => {
    res.json({
        name: 'Your Name',
        rollNumber: 'YOUR_ROLL_NUMBER',
        branch: 'YOUR_BRANCH'
    });
});
```

Replace the placeholders with your own details.

------------------------------------------------------------------------

## Task 2 --- Calculator API

Create an API supporting add, subtract, multiply, divide, modulus, and
power operations.

``` javascript
app.get('/calculator', (req, res) => {
    const { num1, num2, operation } = req.query;

    const a = parseFloat(num1);
    const b = parseFloat(num2);

    let result;

    switch (operation) {
        case 'add':
            result = a + b;
            break;

        case 'subtract':
            result = a - b;
            break;

        case 'multiply':
            result = a * b;
            break;

        case 'divide':
            result = b !== 0
                ? a / b
                : 'Division by zero is not allowed';
            break;

        case 'modulus':
            result = b !== 0
                ? a % b
                : 'Division by zero is not allowed';
            break;

        case 'power':
            result = a ** b;
            break;

        default:
            return res.status(400).json({
                error: 'Invalid operation'
            });
    }

    res.json({
        num1: a,
        num2: b,
        operation,
        result
    });
});
```

Example:

``` text
http://localhost:3000/calculator?num1=10&num2=3&operation=modulus
```

------------------------------------------------------------------------

## Task 3 --- Student Management

A simple in-memory student array can be used:

``` javascript
const students = [
    {
        id: 1,
        name: 'Aman',
        course: 'B.Tech'
    },
    {
        id: 2,
        name: 'Riya',
        course: 'BCA'
    }
];
```

### Get All Students

``` javascript
app.get('/students', (req, res) => {
    res.json(students);
});
```

### Get Student by ID

``` javascript
app.get('/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(
        student => student.id === id
    );

    if (!student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    res.json(student);
});
```

### Add Student

``` javascript
app.post('/students/add', (req, res) => {
    const { name, course } = req.body;

    const student = {
        id: students.length + 1,
        name,
        course
    };

    students.push(student);

    res.status(201).json({
        message: 'Student added successfully',
        student
    });
});
```

------------------------------------------------------------------------

## Task 4 --- Course Timetable Using EJS

Express route:

``` javascript
app.get('/timetable', (req, res) => {
    const timetable = [
        {
            day: 'Monday',
            time: '10:00 AM',
            subject: 'Backend Development',
            faculty: 'Faculty 1'
        },
        {
            day: 'Tuesday',
            time: '11:00 AM',
            subject: 'Database Management',
            faculty: 'Faculty 2'
        },
        {
            day: 'Wednesday',
            time: '12:00 PM',
            subject: 'Web Development',
            faculty: 'Faculty 3'
        }
    ];

    res.render('timetable', { timetable });
});
```

`views/timetable.ejs`:

``` ejs
<!DOCTYPE html>
<html>
<head>
    <title>Course Timetable</title>
</head>

<body>

<h1>Course Timetable</h1>

<table border="1">
    <tr>
        <th>Day</th>
        <th>Time</th>
        <th>Subject</th>
        <th>Faculty</th>
    </tr>

    <% timetable.forEach(item => { %>
        <tr>
            <td><%= item.day %></td>
            <td><%= item.time %></td>
            <td><%= item.subject %></td>
            <td><%= item.faculty %></td>
        </tr>
    <% }); %>
</table>

</body>
</html>
```

------------------------------------------------------------------------

## Task 5 --- Student Registration Form

### GET Route

``` javascript
app.get('/student-register', (req, res) => {
    res.render('student-register');
});
```

### Registration Form

`views/student-register.ejs`:

``` ejs
<!DOCTYPE html>
<html>
<head>
    <title>Student Registration</title>
</head>

<body>

<h1>Student Registration</h1>

<form method="POST" action="/student-register">

    <input
        type="text"
        name="name"
        placeholder="Name"
        required
    >

    <input
        type="email"
        name="email"
        placeholder="Email"
        required
    >

    <input
        type="text"
        name="course"
        placeholder="Course"
        required
    >

    <input
        type="number"
        name="semester"
        placeholder="Semester"
        required
    >

    <button type="submit">
        Register
    </button>

</form>

</body>
</html>
```

### POST Route

``` javascript
app.post('/student-register', (req, res) => {
    const {
        name,
        email,
        course,
        semester
    } = req.body;

    res.render('student-result', {
        student: {
            name,
            email,
            course,
            semester
        }
    });
});
```

### Result Template

`views/student-result.ejs`:

``` ejs
<!DOCTYPE html>
<html>
<head>
    <title>Registration Result</title>
</head>

<body>

<h1>Submitted Student Data</h1>

<p>Name: <%= student.name %></p>
<p>Email: <%= student.email %></p>
<p>Course: <%= student.course %></p>
<p>Semester: <%= student.semester %></p>

</body>
</html>
```

------------------------------------------------------------------------

# Important Viva Questions

## 1. What is Node.js?

Node.js is a JavaScript runtime that uses the V8 engine to execute
JavaScript outside the browser. It is commonly used for backend and
server-side development.

## 2. What is the difference between JavaScript and Node.js?

JavaScript is a programming language. Node.js is a runtime environment
that executes JavaScript outside a web browser.

## 3. What is NPM?

NPM is the Node Package Manager. It manages dependencies, packages, and
project scripts.

## 4. What is the difference between `npm init` and `npm init -y`?

`npm init` asks interactive questions before creating `package.json`,
while `npm init -y` automatically accepts default values.

## 5. What is `package.json`?

`package.json` contains project metadata, scripts, dependencies,
development dependencies, and other configuration information.

## 6. What is Express.js?

Express.js is a minimal web framework for Node.js that simplifies
routing, middleware, HTTP responses, and web application development.

## 7. What does `app.listen()` do?

It starts the Express server and makes it listen for incoming requests
on the specified port.

## 8. Difference between `res.send()` and `res.json()`?

`res.send()` can send different response types. `res.json()` is
specifically intended for JSON responses.

## 9. What are route parameters?

Route parameters are dynamic values contained in a URL path.

Example:

``` text
/user/:id
```

They are accessed using:

``` javascript
req.params.id
```

## 10. Difference between `req.params` and `req.query`?

`req.params` reads values from the URL path, while `req.query` reads
values from the query string.

``` text
/user/10
```

uses a route parameter.

``` text
/search?page=2
```

uses a query parameter.

## 11. What is middleware?

Middleware consists of functions that have access to the request,
response, and next middleware function. Middleware can process requests
before the final route handler.

## 12. What does `express.json()` do?

It parses incoming JSON request bodies and makes the parsed data
available through `req.body`.

## 13. What does `express.urlencoded()` do?

It parses URL-encoded form data.

## 14. Difference between GET and POST?

GET is normally used to retrieve data, while POST is used to submit data
to the server.

## 15. What are HTTP status codes?

HTTP status codes indicate the result of a request.

Examples:

  Code   Meaning
  ------ --------------
  200    OK
  201    Created
  400    Bad Request
  401    Unauthorized
  404    Not Found
  500    Server Error

## 16. What is EJS?

EJS is an Embedded JavaScript templating engine used to generate dynamic
HTML.

## 17. How is an EJS template rendered?

``` javascript
res.render('template', {
    data: value
});
```

## 18. What is the EJS syntax for output and logic?

Output:

``` ejs
<%= value %>
```

Logic:

``` ejs
<% if (condition) { %>
    ...
<% } %>
```

## 19. Difference between `<%=` and `<%-`?

`<%=` escapes HTML before output, while `<%-` renders raw, unescaped
HTML.

## 20. What is Nodemon?

Nodemon monitors project files and automatically restarts the Node.js
server after changes.

## 21. Difference between local and global Nodemon installation?

Local development installation:

``` bash
npm install nodemon -D
```

Global installation:

``` bash
npm install nodemon -g
```

A local installation belongs to the project and is recorded in
`devDependencies`, while a global installation is available system-wide.

## 22. What is the Node.js event loop?

The event loop allows Node.js to coordinate asynchronous operations
without blocking the main execution flow.

## 23. What is callback hell?

Callback hell occurs when many callbacks are deeply nested, making code
difficult to read and maintain. Promises and `async/await` can help
avoid it.

## 24. What are environment variables?

Environment variables store configuration values outside the application
source code and can be accessed through:

``` javascript
process.env
```

## 25. What is CORS?

CORS stands for Cross-Origin Resource Sharing. It controls whether
resources can be requested from a different origin.

## 26. How are Express errors handled?

Express can use error-handling middleware containing four parameters:

``` javascript
app.use((err, req, res, next) => {
    res.status(500).json({
        message: 'Internal Server Error'
    });
});
```

------------------------------------------------------------------------

# Testing Checklist

The application can be tested using a browser, Postman, or `curl`.

-   Verify the Node.js and NPM versions.
-   Start the Express server successfully.
-   Test `/`, `/text`, `/html`, and `/json`.
-   Test a route parameter using `/user/123`.
-   Test query parameters using `/search`.
-   Test calculator operations.
-   Submit registration data using POST.
-   Test successful and unsuccessful login requests.
-   Open `/home` and verify EJS rendering.
-   Open `/users` and verify the dynamic table.
-   Open `/profile/1` and verify profile data.
-   Modify a source file and confirm Nodemon restarts the server.
-   Complete the five lab tasks.

------------------------------------------------------------------------

# Key Learning Outcomes

This experiment demonstrates:

1.  How JavaScript runs on the server through Node.js.
2.  How NPM initializes projects and manages packages.
3.  How Express creates routes and HTTP servers.
4.  How different response formats are returned.
5.  How route parameters differ from query parameters.
6.  How JSON and form POST bodies are parsed.
7.  How HTTP status codes can represent request results.
8.  How EJS produces dynamic server-rendered HTML.
9.  How arrays and objects can be passed from Express to templates.
10. How Nodemon improves development by automatically restarting the
    server.

------------------------------------------------------------------------

# Conclusion

Experiment 12 provides a practical introduction to backend development
with Node.js, Express.js, and EJS. Node.js allows JavaScript to execute
on the server, while Express simplifies routing, request processing,
response generation, and API development.

The experiment demonstrates how Express can return plain text, HTML, and
JSON, and how route parameters, query strings, and POST request bodies
can be processed. EJS extends the application by allowing dynamic
server-side data to be inserted into HTML templates. This makes it
possible to build pages such as user lists, profiles, timetables, forms,
and result pages.

NPM provides dependency and script management, while Nodemon makes
development more convenient by automatically restarting the application
after file changes.

Together, Node.js, Express.js, EJS, NPM, and Nodemon provide a strong
foundation for building modern server-side web applications and APIs.
