# Experiment 12 B Optional --- Node.js Sessions and Cookies

## Objective

To understand how sessions and cookies provide state management in
Node.js applications, implement them using Express.js, maintain login
state, destroy sessions during logout, store browser preferences using
cookies, and build simple session-based applications.

------------------------------------------------------------------------

# Theory

## HTTP Is Stateless

HTTP is a **stateless protocol**. Each HTTP request is independent,
which means that a web server does not automatically remember a user
between different requests or page loads.

For example, after a user logs in, the next request does not
automatically tell the server that the same user has already
authenticated.

Applications therefore need state-management mechanisms for features
such as:

-   User login
-   Shopping carts
-   User preferences
-   User-specific data
-   Temporary application state

Two common state-management solutions are:

1.  **Cookies**
2.  **Sessions**

------------------------------------------------------------------------

# 1. Cookies

A cookie is a small piece of data stored in the user's browser. The
browser sends applicable cookies to the server with HTTP requests.

Cookies can be created by the server or by client-side JavaScript.

They remain stored until they expire or are deleted.

Cookies are useful for small, non-sensitive information such as:

-   Theme preferences
-   Language preferences
-   Other simple browser preferences
-   Non-sensitive shopping-cart information

## Important Cookie Properties

### Name and Value

A cookie stores data as a name/value pair.

Example:

``` text
theme=dark
```

### Expiration

Cookies can have an expiration time that determines how long they remain
available.

### `HttpOnly`

An `HttpOnly` cookie cannot be accessed by normal client-side
JavaScript.

This helps reduce exposure to some attacks involving injected
JavaScript.

### `Secure`

A cookie configured with `Secure` is sent only over HTTPS.

------------------------------------------------------------------------

# 2. Sessions

A session is a server-side state-management mechanism.

Instead of storing important user information directly in the browser,
the server stores session data in memory or another session store.

The client normally stores only a **session ID**, usually inside a
cookie.

This approach is suitable for sensitive or user-specific application
state because the actual session information remains on the server.

## Typical Session Flow

1.  The user logs in.
2.  The server creates a session.
3.  User information is stored in the session.
4.  A session ID is generated.
5.  The session ID is sent to the browser in a cookie.
6.  The browser sends the session cookie on later requests.
7.  The server uses the ID to find the corresponding session.
8.  The application recognizes the user.

------------------------------------------------------------------------

# Cookies vs Sessions

  -----------------------------------------------------------------------
  Feature                 Cookies                 Sessions
  ----------------------- ----------------------- -----------------------
  Main storage location   Browser                 Server

  Client normally stores  Actual cookie value     Session ID cookie

  Good for preferences    Yes                     Possible, but often
                                                  unnecessary

  Good for login state    Limited                 Yes

  Sensitive data          Should not be stored    Safer because session
                          directly                data stays server-side

  Expiration              Cookie configuration    Session/cookie
                                                  configuration

  Example                 Theme preference        Logged-in user
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# Part 1 --- Session Management Using Node.js

## Use Case

Maintain a user's session and demonstrate how session data can be
destroyed.

## Requirements

-   `express`
-   `express-session`

Install the dependencies:

``` bash
npm install express express-session
```

------------------------------------------------------------------------

## `session-example.js`

``` javascript
const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    if (req.session.views) {
        req.session.views++;

        res.send(
            `Welcome back! You visited ${req.session.views} times.`
        );
    } else {
        req.session.views = 1;

        res.send(
            'Welcome to the session demo. Refresh to count visits.'
        );
    }
});

app.get('/destroy', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send(
                'Error destroying session'
            );
        }

        res.send('Session destroyed');
    });
});

app.listen(3000, () => {
    console.log(
        'Server started on http://localhost:3000'
    );
});
```

------------------------------------------------------------------------

## How the Session Example Works

On the first request:

``` javascript
req.session.views = 1;
```

The application initializes a session variable.

On later requests:

``` javascript
req.session.views++;
```

The server remembers the previous value because it belongs to the same
session.

The `/destroy` route calls:

``` javascript
req.session.destroy();
```

This removes the session data.

After destroying the session, returning to `/` creates a new session
state.

------------------------------------------------------------------------

# Part 2 --- Cookie Management Using Node.js

## Use Case

Create, read, and delete cookies using Express.

## Requirements

-   `express`
-   `cookie-parser`

Install:

``` bash
npm install express cookie-parser
```

------------------------------------------------------------------------

## `cookie-example.js`

``` javascript
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

app.get('/set-cookie', (req, res) => {
    res.cookie(
        'username',
        'JohnDoe',
        {
            maxAge: 900000
        }
    );

    res.send('Cookie has been set');
});

app.get('/get-cookie', (req, res) => {
    const user = req.cookies['username'];

    res.send(
        `Cookie Retrieved: ${user}`
    );
});

app.get('/delete-cookie', (req, res) => {
    res.clearCookie('username');

    res.send('Cookie deleted');
});

app.listen(3000, () => {
    console.log(
        'Server running on http://localhost:3000'
    );
});
```

------------------------------------------------------------------------

## Cookie Routes

  Route              Purpose
  ------------------ -------------------------------
  `/set-cookie`      Creates the `username` cookie
  `/get-cookie`      Reads the cookie
  `/delete-cookie`   Deletes the cookie

The cookie is created with:

``` javascript
res.cookie('username', 'JohnDoe', {
    maxAge: 900000
});
```

It is read through:

``` javascript
req.cookies['username'];
```

It is deleted through:

``` javascript
res.clearCookie('username');
```

------------------------------------------------------------------------

# Suggested File Structure

``` text
Experiment 12 B/
│
├── Source/
│   ├── session-example.js
│   └── cookie-example.js
│
├── package.json
└── README.md
```

------------------------------------------------------------------------

# Combined Session and Cookie Application

The complete example combines:

-   Express
-   `express-session`
-   `cookie-parser`
-   HTML form data
-   Login state
-   Logout
-   Preference cookies

## Create the Project

``` bash
mkdir session-cookie-demo
cd session-cookie-demo

npm init -y
npm install express express-session cookie-parser
```

Suggested structure:

``` text
session-cookie-demo/
├── server.js
└── package.json
```

------------------------------------------------------------------------

# Step-by-Step Code

## `server.js`

``` javascript
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

app.use(cookieParser());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}));

app.get('/', (req, res) => {
    if (req.session.username) {
        res.send(`
            Welcome back, ${req.session.username}!
            <a href="/logout">Logout</a>
        `);
    } else {
        res.send(`
            <form action="/login" method="post">
                <input
                    type="text"
                    name="username"
                    placeholder="Enter username"
                />

                <button type="submit">
                    Login
                </button>
            </form>
        `);
    }
});

app.post('/login', (req, res) => {
    const { username } = req.body;

    req.session.username = username;

    res.cookie(
        'theme',
        'dark',
        {
            maxAge: 900000,
            httpOnly: true
        }
    );

    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');

        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(
        `Server running at http://localhost:${PORT}`
    );
});
```

------------------------------------------------------------------------

# How the Combined Application Works

## First Visit

When the user first opens:

``` text
http://localhost:3000
```

no username exists in the session.

Therefore, the application displays the login form.

## Login

After submitting the username:

``` javascript
req.session.username = username;
```

The username is saved in the session.

The application also creates a sample preference cookie:

``` javascript
res.cookie(
    'theme',
    'dark',
    {
        maxAge: 900000,
        httpOnly: true
    }
);
```

The browser also receives the session cookie, normally named:

``` text
connect.sid
```

## Later Requests

The browser sends the session ID cookie back to the server.

Express Session uses the ID to retrieve the session and access:

``` javascript
req.session.username
```

The application can therefore recognize the user.

## Logout

The logout route destroys the session:

``` javascript
req.session.destroy();
```

It also clears the session cookie:

``` javascript
res.clearCookie('connect.sid');
```

Finally, the browser is redirected to the home page.

------------------------------------------------------------------------

# Important Security Notes

## Do Not Store Passwords in Cookies

Passwords and other sensitive information should not be stored directly
in cookies.

## Keep Sensitive State Server-Side

Session data is safer for sensitive application state because the main
data remains on the server and the browser normally stores only the
session identifier.

## Use a Persistent Session Store in Production

The default memory-based session storage should not be treated as the
production solution.

A persistent store such as Redis or MongoDB can be used for session
storage in production.

## Use Secure Cookies with HTTPS

When an application runs over HTTPS, cookies containing sensitive
identifiers should use appropriate security options.

Example:

``` javascript
cookie: {
    secure: true,
    httpOnly: true
}
```

## Protect Secrets

The session secret should not normally be hard-coded in production.

The experiment suggests using environment variables as a next step.

------------------------------------------------------------------------

# When to Use Cookies and Sessions

  Use Case                      Recommended
  ----------------------------- -------------
  Remembering theme             Cookie
  Remembering language          Cookie
  Keeping a user logged in      Session
  Storing shopping-cart items   Session

Cookies work well for small browser preferences.

Sessions work well for user-specific state that should remain on the
server.

------------------------------------------------------------------------

# Next Steps

The experiment suggests extending the project by:

-   Adding authentication using a library such as Passport.js
-   Using environment variables for secrets with `dotenv`
-   Deploying the application on HTTPS
-   Using persistent session storage

------------------------------------------------------------------------

# Lab Assignment

# Exercise 1 --- Simple User Login System

## Goal

Create a small web application where:

-   A user can register using a username and password.
-   A user can log in.
-   The application remembers the logged-in user using a session.
-   A dashboard is accessible only after login.
-   Logout destroys the session and returns the user to the login page.

------------------------------------------------------------------------

## Requirements

The application should contain:

1.  Register page
2.  Login page
3.  Protected dashboard
4.  Logout button

The first version can store users in an in-memory array.

No database is required.

------------------------------------------------------------------------

## Install Packages

``` bash
npm init -y
npm install express express-session
```

------------------------------------------------------------------------

## Example Implementation

``` javascript
const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 3000;

const users = [];

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(session({
    secret: 'login-secret',
    resave: false,
    saveUninitialized: false
}));

function authMiddleware(req, res, next) {
    if (req.session.user) {
        return next();
    }

    res.redirect('/login');
}

app.get('/register', (req, res) => {
    res.send(`
        <h1>Register</h1>

        <form method="POST" action="/register">

            <input
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
                Register
            </button>

        </form>

        <a href="/login">
            Login
        </a>
    `);
});

app.post('/register', (req, res) => {
    const {
        username,
        password
    } = req.body;

    users.push({
        username,
        password
    });

    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.send(`
        <h1>Login</h1>

        <form method="POST" action="/login">

            <input
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
    `);
});

app.post('/login', (req, res) => {
    const {
        username,
        password
    } = req.body;

    const user = users.find(
        item =>
            item.username === username &&
            item.password === password
    );

    if (!user) {
        return res.status(401).send(
            'Invalid username or password'
        );
    }

    req.session.user = {
        username: user.username
    };

    res.redirect('/dashboard');
});

app.get(
    '/dashboard',
    authMiddleware,
    (req, res) => {
        res.send(`
            <h1>Dashboard</h1>

            <p>
                Welcome,
                ${req.session.user.username}
            </p>

            <a href="/logout">
                Logout
            </a>
        `);
    }
);

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});
```

------------------------------------------------------------------------

## Authentication Middleware

The important route-protection logic is:

``` javascript
function authMiddleware(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}
```

This middleware checks whether a user exists in the session.

If the user is logged in, the request continues.

If not, the user is redirected to the login page.

------------------------------------------------------------------------

## Login Session

After successful authentication:

``` javascript
req.session.user = {
    username: enteredUsername
};
```

The session remembers the logged-in user.

------------------------------------------------------------------------

## Logout

``` javascript
req.session.destroy(() => {
    res.redirect('/login');
});
```

Destroying the session removes the login state.

------------------------------------------------------------------------

## Optional Challenge

The source suggests hashing passwords before storing them using
`bcrypt`.

For a real application, plain-text passwords should not be stored.

------------------------------------------------------------------------

# Exercise 2 --- Session-Based To-Do List Manager

## Goal

Create a simple to-do application where:

-   Users can add tasks.
-   Users can view tasks.
-   Users can delete tasks.
-   The list is stored in the session.
-   Separate sessions receive separate to-do lists.
-   The temporary list disappears when the session ends.

------------------------------------------------------------------------

## Session Initialization

When a user first visits:

``` javascript
if (!req.session.todos) {
    req.session.todos = [];
}
```

This creates an empty list for that session.

------------------------------------------------------------------------

## Add a To-Do

``` javascript
req.session.todos.push(
    req.body.todoItem
);
```

------------------------------------------------------------------------

## Delete a To-Do

``` javascript
req.session.todos =
    req.session.todos.filter(
        (item, index) => index !== id
    );
```

------------------------------------------------------------------------

## Complete Example

``` javascript
const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(session({
    secret: 'todo-secret',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    if (!req.session.todos) {
        req.session.todos = [];
    }

    next();
});

app.get('/', (req, res) => {
    const todoHTML =
        req.session.todos
            .map((todo, index) => `
                <li>
                    ${todo}

                    <a href="/delete/${index}">
                        Delete
                    </a>
                </li>
            `)
            .join('');

    res.send(`
        <h1>Session To-Do List</h1>

        <form
            method="POST"
            action="/add"
        >
            <input
                type="text"
                name="todoItem"
                placeholder="Enter task"
                required
            >

            <button type="submit">
                Add
            </button>
        </form>

        <ul>
            ${todoHTML}
        </ul>
    `);
});

app.post('/add', (req, res) => {
    req.session.todos.push(
        req.body.todoItem
    );

    res.redirect('/');
});

app.get('/delete/:id', (req, res) => {
    const id = Number(req.params.id);

    req.session.todos =
        req.session.todos.filter(
            (item, index) => index !== id
        );

    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});
```

------------------------------------------------------------------------

# Optional Theme Cookie Challenge

The source also suggests using a cookie for a preferred theme.

For example:

``` javascript
res.cookie(
    'theme',
    'dark',
    {
        maxAge: 86400000
    }
);
```

The preference can then be read using `cookie-parser`:

``` javascript
const theme =
    req.cookies.theme || 'light';
```

This demonstrates a useful division of responsibility:

-   Session stores temporary user-specific application data.
-   Cookie stores a small preference.

------------------------------------------------------------------------

# Tools and Packages

The experiment uses:

  Package / Tool           Purpose
  ------------------------ ---------------------------
  `express`                Web application framework
  `express-session`        Session middleware
  `cookie-parser`          Reading cookies
  `express.urlencoded()`   Parsing HTML form data

Install the main packages with:

``` bash
npm install express express-session cookie-parser
```

------------------------------------------------------------------------

# Testing Checklist

## Session Counter

-   Start `session-example.js`.
-   Open `/`.
-   Refresh the page.
-   Confirm the visit count increases.
-   Open `/destroy`.
-   Return to `/`.
-   Confirm a new session starts.

## Cookie Example

-   Open `/set-cookie`.
-   Inspect browser cookies.
-   Open `/get-cookie`.
-   Confirm `JohnDoe` is returned.
-   Open `/delete-cookie`.
-   Verify the cookie is removed.

## Combined Login Example

-   Open `/`.
-   Confirm the login form appears.
-   Submit a username.
-   Confirm the welcome message appears.
-   Inspect cookies for `connect.sid`.
-   Confirm the `theme` cookie is created.
-   Refresh the page.
-   Confirm the application remembers the username.
-   Click logout.
-   Confirm the session ends.

## Login Assignment

-   Register a user.
-   Login using the registered credentials.
-   Open the dashboard.
-   Confirm an unauthenticated user cannot access the protected
    dashboard.
-   Logout.
-   Confirm the dashboard requires authentication again.

## To-Do Assignment

-   Add multiple to-do items.
-   Confirm they remain while the session is active.
-   Delete a task.
-   Open a separate browser/session and compare the list.
-   End or expire the session.
-   Confirm the temporary list disappears.

------------------------------------------------------------------------

# Important Viva Questions

## 1. Why are cookies and sessions required?

HTTP is stateless, so cookies and sessions allow applications to
remember information across multiple requests.

## 2. Where are cookies stored?

Cookies are stored in the user's browser.

## 3. Where is session data stored?

Session data is stored on the server or in a server-side session store.

## 4. What does the browser normally store for a session?

The browser normally stores a session ID inside a cookie.

## 5. What is `express-session`?

`express-session` is Express middleware used to create and manage
sessions.

## 6. What is `cookie-parser`?

`cookie-parser` is middleware that makes cookies easier to read from
incoming requests.

## 7. What is `req.session`?

`req.session` provides access to data belonging to the current session.

Example:

``` javascript
req.session.username = 'John';
```

## 8. How is a session destroyed?

``` javascript
req.session.destroy(() => {
    // session ended
});
```

## 9. How is a cookie created in Express?

``` javascript
res.cookie(
    'theme',
    'dark'
);
```

## 10. How is a cookie read?

With `cookie-parser`:

``` javascript
req.cookies.theme;
```

## 11. How is a cookie deleted?

``` javascript
res.clearCookie('theme');
```

## 12. What is `HttpOnly`?

`HttpOnly` prevents normal client-side JavaScript from accessing the
cookie.

## 13. What is the `Secure` cookie option?

It causes the cookie to be sent only over HTTPS.

## 14. Should passwords be stored in cookies?

No. The experiment explicitly warns against storing passwords or
sensitive information in cookies.

## 15. Why is a session suitable for login state?

The server can keep the user information in the session while the
browser only needs the session identifier.

## 16. What does `resave: false` mean?

It tells the session middleware not to save an unchanged session again.

## 17. What does `saveUninitialized` control?

It controls whether a newly created but unmodified session should be
saved.

## 18. Why should a persistent session store be used in production?

The experiment recommends a persistent session store such as Redis or
MongoDB rather than relying on the default memory storage.

## 19. How can a route be protected?

Use middleware to check for session data before allowing access.

``` javascript
function authMiddleware(
    req,
    res,
    next
) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}
```

## 20. What happens when a session expires?

The server can no longer use that session to retrieve the user's
temporary state. The user may need to log in again, and session-based
temporary data may be lost.

------------------------------------------------------------------------

# Key Learning Outcomes

After completing this experiment, the student should understand:

1.  Why state management is needed with HTTP.
2.  How cookies store small pieces of browser-side data.
3.  How sessions store user-specific data on the server.
4.  How a session ID connects the browser to server-side session data.
5.  How to create and destroy sessions.
6.  How to create, read, and delete cookies.
7.  How to maintain login state.
8.  How to protect routes using session-based middleware.
9.  How to store small per-user values in session variables.
10. How session-based to-do lists can separate temporary user data.
11. How cookies can store preferences such as theme or language.
12. Why sensitive information should not be stored directly in cookies.
13. Why production applications should use secure cookies and persistent
    session storage.

------------------------------------------------------------------------

# Conclusion

Experiment 12 B demonstrates how Node.js and Express can maintain state
in applications even though HTTP itself is stateless.

Cookies store small values in the user's browser and are useful for
preferences such as theme and language. Sessions keep user-specific data
on the server while the browser normally stores only a session
identifier. This makes sessions useful for login state, temporary
shopping carts, and other user-specific information.

Using `express-session`, an application can create session variables,
recognize returning requests, protect routes, and destroy a user's
session during logout. Using `cookie-parser` and Express cookie methods,
the application can create, retrieve, and remove cookies.

The login-system exercise demonstrates session-based authentication flow
and protected routes, while the to-do exercise demonstrates how separate
sessions can maintain separate temporary data.

These concepts provide an important foundation for authentication,
authorization, personalization, and state management in backend web
applications.
