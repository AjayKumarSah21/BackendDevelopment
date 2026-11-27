# Server-Side Rendering and Templating Engines

{% raw %}

## Lecture Information

- **Lecture:** 08
- **Unit:** Unit 1 — Foundations of Backend Development
- **Topic:** Server-Side Rendering and Templating Engines
- **Course Outcome:** CO2 — Understand server-side rendering concepts and build dynamic web pages using templating engines.
- **Bloom's Knowledge Level:** Create
- **Skills Developed:** Server-side rendering, templating engine usage, static file serving, dynamic content generation, and web layout design
- **Applications:** Content management systems, dashboards, blogs, and e-commerce websites
- **PBL Activity:** Building a dynamic student dashboard with SSR and static assets
- **Assessment:** Coding project and SSR implementation demonstration

---

# Part A — Theory

## 1. Introduction

Earlier backend applications may return static strings or JSON responses. Real web applications often need **dynamic HTML pages** that change according to data, user identity, or other application state.

**Server-Side Rendering (SSR)** is a technique in which the server generates the complete HTML page before sending it to the browser.

The basic idea is:

```text
Template + Data → Complete HTML Page
```

Instead of manually rewriting HTML whenever data changes, the backend combines a reusable HTML template with current data.

### Learning Objectives

By the end of this topic, you should understand:

- Why Server-Side Rendering is useful.
- How SSR works.
- How to create dynamic pages with Express and EJS.
- How to create dynamic pages with FastAPI and Jinja2.
- How to serve static assets such as CSS and images from backend applications.

---

## 2. Why Server-Side Rendering?

Consider a student dashboard that displays a changing list of students.

With static HTML, every change to the student list would require manually changing the HTML file.

With SSR, the server generates the page using the latest data:

```text
HTML Template + Student Data → Rendered Student Page
```

The browser receives complete HTML and can display the content immediately.

---

## 3. SSR vs Client-Side Rendering

| Aspect | SSR — Server-Side Rendering | CSR — Client-Side Rendering |
|---|---|---|
| Where HTML is built | Server | Browser using JavaScript |
| Initial load | Fast because HTML is already generated | Must load JavaScript before rendering |
| SEO | Strong because crawlers receive HTML | Can be weaker if crawlers do not execute JavaScript |
| Server load | Higher because pages are rendered per request | Lower because server may mainly provide data |
| Navigation | Often full-page reloads | Smooth SPA-style transitions |
| Best suited for | Blogs, dashboards, content-heavy sites | Highly interactive applications |

---

## 4. Benefits of SSR

### Faster First Paint

The browser receives complete HTML, allowing content to appear immediately.

### Better SEO

Search engines can inspect the fully rendered page content.

### Simpler Client Code

A JavaScript framework is not required simply to display server-generated content.

### Server-Side Logic

Sensitive application logic can remain on the server while the client receives only the generated output.

### Works Without Client-Side JavaScript

Basic server-rendered content remains readable even when JavaScript is disabled.

---

## 5. Tradeoffs of SSR

SSR also introduces several disadvantages:

- **Higher server load:** HTML is generated for each request.
- **Full-page navigation:** Traditional SSR may reload the entire page.
- **Scaling costs:** Increased traffic requires more server resources.
- **Less dynamic UI:** Smooth client-side updates require additional JavaScript.
- **Template complexity:** Large template files can become difficult to maintain.

---

## 6. Templating Engines

A **templating engine** combines HTML templates with application data to generate final HTML.

| Engine | Language | Example Syntax | Common Framework |
|---|---|---|---|
| EJS | JavaScript | `<%= variable %>` | Express.js |
| Pug | JavaScript | `h1= variable` | Express.js |
| Handlebars | JavaScript | `{{variable}}` | Express.js |
| Jinja2 | Python | `{{ variable }}` | FastAPI / Flask |
| Mako | Python | `${variable}` | Pyramid |

This lecture focuses on:

- **EJS with Express**
- **Jinja2 with FastAPI**

---

## 7. How Server-Side Rendering Works

A typical SSR request follows this flow:

```text
Browser
   |
   | GET /students
   v
Express / FastAPI
   |
   | Receive Request
   v
Fetch Data
(Database / Array / API)
   |
   v
Render Template
(Template + Data)
   |
   v
Complete HTML
   |
   | HTTP 200
   v
Browser Displays Page
```

The important point is that the **server builds the HTML**. The browser receives the finished page and displays it.

---

# Part B — Node.js + Express + EJS

## 8. Setting Up an Express + EJS Project

### Step 1: Create the Project

```bash
mkdir ssr-demo
cd ssr-demo
npm init -y
npm install express ejs
npm install --save-dev nodemon
```

### Step 2: Add Scripts

In `package.json`:

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

### Step 3: Project Structure

```text
ssr-demo/
├── views/
│   └── home.ejs
├── app.js
└── package.json
```

---

## 9. Minimal EJS Example

### `app.js`

```js
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home', {
    name: 'Aarav'
  });
});

app.listen(3000, () => {
  console.log(
    'Server running on http://localhost:3000'
  );
});
```

### `views/home.ejs`

```html
<!DOCTYPE html>
<html>
<head>
  <title>SSR Demo</title>
</head>
<body>
  <h1>Hello, <%= name %>!</h1>
</body>
</html>
```

### Run the Application

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

The browser receives HTML in which the value of `name` has already been rendered.

### Request Flow

1. The browser requests `GET /`.
2. Express looks for the EJS template.
3. EJS replaces `<%= name %>` with `Aarav`.
4. Express sends the completed HTML.
5. The browser displays the page.

---

## 10. Converting Static HTML to EJS

### Static Version

```html
<!DOCTYPE html>
<html>
<head>
  <title>Student List</title>
</head>
<body>
  <h1>Students</h1>

  <ul>
    <li>Aarav — CSE</li>
    <li>Diya — ECE</li>
    <li>Rohan — IT</li>
  </ul>
</body>
</html>
```

The student information is hardcoded.

### Dynamic EJS Version

```html
<!DOCTYPE html>
<html>
<head>
  <title>Student List</title>
</head>
<body>
  <h1>Students</h1>

  <ul>
    <% students.forEach(student => { %>
      <li>
        <%= student.name %>
        —
        <%= student.branch %>
      </li>
    <% }) %>
  </ul>
</body>
</html>
```

### EJS Syntax

| Syntax | Purpose |
|---|---|
| `<%= expression %>` | Output an escaped value |
| `<% code %>` | Execute JavaScript without output |
| `<%- expression %>` | Output raw/unescaped HTML |

### Express Data

```js
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

const students = [
  {
    name: 'Aarav',
    branch: 'CSE'
  },
  {
    name: 'Diya',
    branch: 'ECE'
  },
  {
    name: 'Rohan',
    branch: 'IT'
  }
];

app.get('/', (req, res) => {
  res.render('students', {
    students
  });
});

app.listen(3000, () => {
  console.log(
    'Server running on http://localhost:3000'
  );
});
```

Adding or removing entries from the `students` array changes the rendered page without manually rewriting each HTML list item.

---

## 11. EJS Conditionals and Loops

EJS supports JavaScript logic inside templates.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Student Dashboard</title>
</head>
<body>

  <h1>Student Dashboard</h1>

  <% if (students.length === 0) { %>

    <p>No students found.</p>

  <% } else { %>

    <p>
      Total students:
      <%= students.length %>
    </p>

    <table border="1">
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Branch</th>
      </tr>

      <% students.forEach(student => { %>
        <tr>
          <td><%= student.id %></td>
          <td><%= student.name %></td>
          <td><%= student.branch %></td>
        </tr>
      <% }) %>

    </table>

  <% } %>

</body>
</html>
```

### Common EJS Patterns

Conditional:

```ejs
<% if (condition) { %>
  ...
<% } else { %>
  ...
<% } %>
```

Loop:

```ejs
<% items.forEach(item => { %>
  <%= item %>
<% }) %>
```

Include another template:

```ejs
<%- include('partials/header') %>
```

---

# Part C — Python + FastAPI + Jinja2

## 12. Setting Up the Project

### Create the Project

```bash
mkdir ssr-python
cd ssr-python
python -m venv venv
```

Activate the environment on macOS/Linux:

```bash
source venv/bin/activate
```

On Windows:

```text
venv\Scripts\activate
```

Install dependencies:

```bash
pip install fastapi uvicorn jinja2
```

### Project Structure

```text
ssr-python/
├── templates/
│   └── students.html
├── main.py
└── requirements.txt
```

---

## 13. Minimal Jinja2 Example

### `main.py`

```python
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
import uvicorn

app = FastAPI()

templates = Jinja2Templates(
    directory="templates"
)


@app.get(
    "/",
    response_class=HTMLResponse
)
def home(request: Request):
    return templates.TemplateResponse(
        request,
        "home.html",
        {
            "request": request,
            "name": "test"
        }
    )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        port=5001,
        reload=True
    )
```

### `templates/home.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>SSR Demo</title>
</head>
<body>
  <h1>Hello, {{ name }}!</h1>
</body>
</html>
```

### Run with Uvicorn

```bash
uvicorn main:app --reload
```

Alternatively:

```bash
python main.py
```

The template receives values from the backend and Jinja2 inserts them into the generated HTML.

---

## 14. Student List with Jinja2

### `templates/students.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Student List</title>
</head>
<body>

  <h1>Students</h1>

  {% if students|length == 0 %}

    <p>No students found.</p>

  {% else %}

    <p>
      Total students:
      {{ students|length }}
    </p>

    <table border="1">

      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Branch</th>
      </tr>

      {% for student in students %}

        <tr>
          <td>{{ student.id }}</td>
          <td>{{ student.name }}</td>
          <td>{{ student.branch }}</td>
        </tr>

      {% endfor %}

    </table>

  {% endif %}

</body>
</html>
```

### `main.py`

```python
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
import uvicorn

app = FastAPI()

templates = Jinja2Templates(
    directory="templates"
)

students = [
    {
        "id": 1,
        "name": "Aarav",
        "branch": "CSE"
    },
    {
        "id": 2,
        "name": "Diya",
        "branch": "ECE"
    },
    {
        "id": 3,
        "name": "Rohan",
        "branch": "IT"
    }
]


@app.get(
    "/",
    response_class=HTMLResponse
)
def home(request: Request):
    return templates.TemplateResponse(
        "students.html",
        {
            "request": request,
            "students": students
        }
    )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
```

---

## 15. EJS vs Jinja2

{% raw %}

| Feature | EJS — Express | Jinja2 — FastAPI |
|---|---|---|
| Output variable | `<%= name %>` | `{{ name }}` |
| Conditional | `<% if (x) { %>` | `{% if x %}` |
| Loop | `<% items.forEach(...) %>` | `{% for i in items %}` |
| End block | `<% } %>` | `{% endif %}` / `{% endfor %}` |
| Include | `<%- include('header') %>` | `{% include 'header.html' %}` |
| Filters / transformations | JavaScript functions | `{{ name\|upper }}`, `{{ list\|length }}` |

{% endraw %}

Both follow the same basic principle:

```text
Template + Data = Generated HTML
```

---

# Part D — Serving Static Content

## 16. What Are Static Files?

Static files are assets that the server sends without template processing.

Examples include:

- CSS stylesheets
- Client-side JavaScript
- Images
- Icons
- Fonts
- PDFs
- Downloadable documents

Unlike templates, these files are sent directly to the browser.

---

## 17. Serving Static Files with Express

Express provides built-in middleware for static files.

### `app.js`

```js
const express = require('express');
const path = require('path');

const app = express();

app.use(
  express.static(
    path.join(__dirname, 'public')
  )
);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home', {
    name: 'Aarav'
  });
});

app.listen(3000, () => {
  console.log(
    'Server running on http://localhost:3000'
  );
});
```

### Project Structure

```text
ssr-demo/
├── public/
│   ├── css/
│   │   └── style.css
│   └── images/
│       └── logo.png
├── views/
│   └── home.ejs
├── app.js
└── package.json
```

### Referencing Static Files

```html
<!DOCTYPE html>
<html>
<head>
  <link
    rel="stylesheet"
    href="/css/style.css"
  >
</head>
<body>

  <img
    src="/images/logo.png"
    alt="Logo"
  >

  <h1>Hello, <%= name %>!</h1>

</body>
</html>
```

When the browser requests:

```text
/css/style.css
```

Express maps it to:

```text
public/css/style.css
```

---

## 18. Serving Static Files with FastAPI

FastAPI uses `StaticFiles` from Starlette.

### `main.py`

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
import uvicorn

app = FastAPI()

templates = Jinja2Templates(
    directory="templates"
)

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)


@app.get(
    "/",
    response_class=HTMLResponse
)
def home(request: Request):
    return templates.TemplateResponse(
        "home.html",
        {
            "request": request,
            "name": "Aarav"
        }
    )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
```

### Project Structure

```text
ssr-python/
├── static/
│   ├── css/
│   │   └── style.css
│   └── images/
│       └── logo.png
├── templates/
│   └── home.html
├── main.py
└── requirements.txt
```

### Jinja2 Template

```html
<!DOCTYPE html>
<html>
<head>
  <link
    rel="stylesheet"
    href="/static/css/style.css"
  >
</head>
<body>

  <img
    src="/static/images/logo.png"
    alt="Logo"
  >

  <h1>Hello, {{ name }}!</h1>

</body>
</html>
```

FastAPI explicitly mounts the static directory at a URL prefix such as `/static`.

---

## 19. Express vs FastAPI Static Files

| Aspect | Express | FastAPI |
|---|---|---|
| Setup | `app.use(express.static('public'))` | `app.mount("/static", StaticFiles(...))` |
| Typical URL prefix | Root `/` | `/static` |
| Common folder | `public/` | Any selected directory, commonly `static/` |
| Mechanism | Express built-in middleware | Starlette `StaticFiles` |

---

# Summary

Server-Side Rendering generates complete HTML on the backend before sending it to the browser.

Important concepts from this lecture include:

- SSR generates HTML on the server.
- SSR can provide fast initial rendering and good SEO.
- SSR increases server-side rendering work.
- Templating engines combine HTML structure with dynamic data.
- EJS integrates with Express using `res.render()`.
- Jinja2 integrates with FastAPI using `TemplateResponse()`.
- Templates can contain variables, conditionals, loops, and includes.
- Static assets are served separately from dynamic templates.
- Express commonly serves assets from `public/`.
- FastAPI can mount a static directory under `/static`.

---

# Key Takeaways

1. **SSR is useful for content-heavy pages** such as dashboards, blogs, and e-commerce pages.
2. **Static HTML becomes dynamic** by replacing hardcoded values with template variables.
3. **EJS** provides JavaScript-based templating for Express.
4. **Jinja2** provides Python-oriented templating for FastAPI.
5. Both EJS and Jinja2 support loops, conditions, and reusable templates.
6. Keep EJS templates in a dedicated `views/` directory.
7. Keep Jinja2 templates in a dedicated `templates/` directory.
8. Keep static assets separate from templates.
9. Express and FastAPI use different mechanisms for exposing static assets.
10. SSR and CSR serve different needs: SSR is suited to server-generated content, while CSR is useful for highly interactive applications.

---

# Lab Exercises

## Exercise 1 — Student Table

Convert the Express student-list example into an HTML table.

Requirements:

- Display student ID.
- Display student name.
- Display branch.
- Add alternating row colors using CSS.

---

## Exercise 2 — EJS About Page

Create a new route:

```text
GET /about
```

Pass the following values from Express to an EJS template:

- Course name
- Lecturer name

Render those values dynamically on the page.

---

## Exercise 3 — Current Date and Time with FastAPI

Build a FastAPI route that passes the current date and time to Jinja2.

Example template variable:

```jinja2
{{ now }}
```

---

## Exercise 4 — Express CSS

Create a custom CSS file and serve it through Express.

Use it to change:

- Page background
- Font
- Student-list styling

---

## Exercise 5 — FastAPI Static Image

Create a FastAPI application that:

1. Stores an image in:

```text
static/images/
```

2. Mounts the `static` directory.
3. Displays the image inside a Jinja2 template.

---

# Suggested Repository Structure

For the Express examples:

```text
express-ejs-demo/
├── public/
│   ├── css/
│   │   └── style.css
│   └── images/
├── views/
│   ├── home.ejs
│   ├── students.ejs
│   └── about.ejs
├── app.js
├── package.json
└── README.md
```

For the FastAPI examples:

```text
fastapi-jinja-demo/
├── static/
│   ├── css/
│   │   └── style.css
│   └── images/
├── templates/
│   ├── home.html
│   └── students.html
├── main.py
├── requirements.txt
└── README.md
```

---

# Conclusion

Server-Side Rendering allows backend applications to create dynamic HTML by combining templates with application data. Instead of sending only static strings or JSON, a server can render a complete page before responding to the browser.

Express with EJS and FastAPI with Jinja2 demonstrate the same fundamental pattern using different languages and syntax:

```text
Request → Fetch Data → Render Template → Send HTML → Display Page
```

Understanding templating, dynamic rendering, and static-file serving provides a foundation for building server-rendered dashboards, blogs, content-management systems, and e-commerce websites.

{% endraw %}
