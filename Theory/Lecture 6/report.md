# Report: Managing Server-Side Sessions, Cookies, and State Management

## Lecture Information

- **Lecture:** 06
- **Unit:** Unit 1 — Foundations of Backend Development
- **Topic:** Managing Server-Side Session, Cookie, and State Management
- **Course Outcome:** CO1 — Understand state management techniques (sessions, cookies) for backend applications.
- **Bloom's Level:** Apply
- **Skills:** Backend state management, session handling, cookie management, and security practices (`httpOnly`, `secure`)
- **Applications:** Authentication systems, user preferences, shopping carts, and session tracking

---

## 1. Introduction to Session Control

HTTP is a **stateless protocol**, meaning that each request is independent and the server does not automatically remember information from previous requests.

Session control mechanisms solve this problem by allowing web applications to maintain continuity across multiple requests.

### Why Session Control Is Needed

- Remember authenticated users.
- Store temporary information such as login state and shopping-cart contents.
- Maintain interaction state and improve user experience.

---

## 2. Session Tracking

**Session tracking** is the process of maintaining information across multiple HTTP requests made by the same client during a website visit.

Common techniques include:

| Technique | Description |
|---|---|
| Cookies | Small pieces of data stored in the user's browser. |
| Hidden form fields | Data stored in hidden HTML fields and submitted with forms. |
| URL rewriting / Query strings | Data appended to the URL. |
| Server-side sessions | User data stored on the server while only a session ID is sent to the client. |

Server-side session management is presented in the lecture as the most secure and widely used method.

---

## 3. Session Management vs. State Management

| Feature | Session Management | State Management |
|---|---|---|
| Purpose | Maintain user-specific data between requests | Maintain data across the application |
| Scope | Per-user session | Application-wide |
| Storage | Typically temporary server storage | Server or client; may be persistent |
| Lifetime | Usually until logout or session/browser end | May persist longer |
| Example | User login session | Application configuration |

---

## 4. Sessions in Express

A session in Express stores user-related information on the **server side** across multiple requests.

Each session has a unique **session ID**. The ID is sent to the browser through a cookie. On later requests, the browser sends the session ID back so the server can retrieve the associated session data.

### Session Flow

1. The server creates a session and assigns a session ID.
2. Session data such as username or preferences is stored on the server.
3. The session ID is sent to the browser in a cookie.
4. The browser sends the ID with later requests.
5. The server uses the ID to retrieve the correct session data.

### Advantages

- User data is not directly stored on the client.
- Complex values such as objects and arrays can be stored.
- Middleware such as `express-session` manages session handling.

### Limitations

- Sessions consume server resources.
- In-memory session data may be lost when the server restarts unless persistent storage is used.

### Express Session Example

Install the required packages:

```bash
npm install express express-session
```

```js
const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

app.get('/login', (req, res) => {
  req.session.username = 'JohnDoe';
  res.send('Session started for ' + req.session.username);
});

app.get('/profile', (req, res) => {
  if (req.session.username) {
    res.send('Welcome ' + req.session.username);
  } else {
    res.send('Please log in first.');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error destroying session');
    }

    res.send('Session destroyed successfully');
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

`express-session` creates a session ID cookie automatically. The actual session data is stored on the server, while the client returns the session ID on subsequent requests.

---

## 5. Cookies

A **cookie** is a small piece of text stored in the user's browser. Cookies can contain information such as preferences, session identifiers, or tokens.

### Types of Cookies

- **Session cookies:** Deleted when the browser closes.
- **Persistent cookies:** Stored until their configured expiration time.
- **Secure cookies:** Sent only over HTTPS.
- **HttpOnly cookies:** Cannot be accessed through client-side JavaScript.

### Cookie Flow

1. The server sends a cookie in an HTTP response.
2. The browser stores it.
3. The browser sends the cookie with subsequent requests.
4. The server reads the cookie to identify or remember the user.

### Advantages

- Simple to implement.
- Useful for preferences, tokens, and "remember me" functionality.

### Limitations

- Storage is limited to approximately 4 KB.
- Cookie values can be visible to or modified by users.
- Improper configuration can create security risks.

### Cookies in Express

Install `cookie-parser`:

```bash
npm install cookie-parser
```

```js
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

app.get('/setcookie', (req, res) => {
  res.cookie('username', 'JohnDoe', {
    maxAge: 3600000,
    httpOnly: true,
    secure: false
  });

  res.send('Cookie has been set!');
});

app.get('/getcookie', (req, res) => {
  const user = req.cookies.username;

  if (user) {
    res.send('Welcome back, ' + user);
  } else {
    res.send('No cookie found.');
  }
});

app.get('/deletecookie', (req, res) => {
  res.clearCookie('username');
  res.send('Cookie deleted.');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

Useful Express APIs:

- `res.cookie(name, value, options)` — creates a cookie.
- `req.cookies` — reads parsed cookies.
- `res.clearCookie(name)` — deletes a cookie.

---

## 6. Cookie Security Attributes

| Attribute | Purpose |
|---|---|
| `maxAge` / `expires` | Defines how long the cookie remains valid. |
| `secure` | Sends the cookie only over HTTPS. |
| `httpOnly` | Prevents JavaScript access and helps protect against XSS-based cookie theft. |
| `sameSite` | Restricts cross-site cookie behavior. |

Example:

```js
res.cookie('token', 'abc123', {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});
```

---

## 7. Query Strings

A **query string** is part of a URL and can transfer small amounts of data between pages or requests.

Example:

```text
http://localhost:3000/welcome?user=Alice&role=admin
```

Here:

- `user` and `role` are parameters.
- `Alice` and `admin` are their values.

### Common Uses

- Search filters
- Pagination, such as `?page=2`
- Non-sensitive configuration or request parameters

### Advantages

- Easy to use.
- Does not require sessions or cookies.
- URLs can be visible, copied, shared, and bookmarked.

### Limitations

- Values are visible in the URL.
- Not appropriate for passwords or other sensitive information.
- Suitable only for relatively small and simple values.

### Express Query String Example

```js
const express = require('express');

const app = express();

app.get('/welcome', (req, res) => {
  const user = req.query.user;
  const role = req.query.role;

  res.send(`Welcome ${user}, your role is ${role}`);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

Express exposes query-string key-value pairs through `req.query`.

---

## 8. Comparison

| Feature | Session | Cookie | Query String |
|---|---|---|---|
| Storage | Server | Browser | URL |
| Security | Higher | Medium / depends on configuration | Low for sensitive data |
| Data capacity | Large compared with cookies | ~4 KB | Small |
| Lifetime | Until logout, timeout, or session end | Until expiration | Associated with the request/URL |
| Visibility | Session data hidden from user | Cookie can be inspected by user | Visible in URL |
| Best use | Login state, cart, temporary user data | Preferences, identifiers, tokens | Search, filters, pagination |

---

## 9. Key Takeaways

- **Sessions** are best suited to temporary or sensitive user-specific data stored on the server.
- **Cookies** store small pieces of client-side data and can persist across sessions.
- **Query strings** are useful for visible, shareable, non-sensitive parameters.
- Secure web applications should configure cookies carefully, use HTTPS where appropriate, and avoid placing private information in URLs.
- Sessions, cookies, and query strings can be combined to provide effective state management in Express applications.

---

## 10. Practical Activity

A useful implementation exercise is to build a small Express application that supports:

1. User login and session creation.
2. A protected profile route that reads session data.
3. Logout and session destruction.
4. Setting, reading, and deleting cookies.
5. Query-string parameters for filters or user-facing options.
6. Secure cookie settings such as `httpOnly`, `secure`, and `sameSite`.

---

## Conclusion

Because HTTP does not retain state between requests, backend applications need mechanisms for remembering users and transferring state. Express applications can use server-side sessions for user-specific state, cookies for small browser-stored values, and query strings for visible non-sensitive parameters. Choosing the appropriate mechanism and applying suitable security attributes are essential parts of backend state management.
