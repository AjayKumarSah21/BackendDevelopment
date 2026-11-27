# Lab Report – Lecture 03: Setting Up the Backend Environment

**Course:** Backend Development  
**Unit:** Unit 1 – Foundations of Backend Development  
**Lecture:** 03  
**Course Outcome:** CO1 – Understand HTTP fundamentals and set up a working backend development environment.

## Aim
To understand HTTP and the request–response cycle, install the backend development tools, and build basic backend servers using Express.js and Flask.

## Objectives
- Understand HTTP requests, responses, methods, status codes, and URL structure.
- Install Node.js, npm, Python, and pip.
- Create and run an Express.js server with multiple routes.
- Return plain text, JSON, and HTML responses and use EJS templates.
- Create and run a Flask server with multiple routes and JSON responses.
- Observe requests and responses using browser DevTools.
- Add a branch-based student route and a POST route to add students.

## Requirements
- Visual Studio Code
- Node.js (LTS) and npm
- Python 3.11+ and pip
- Browser (Chrome recommended)
- Express.js, EJS, and Flask

## Theory
HTTP (HyperText Transfer Protocol) is the protocol used for communication between clients and servers. HTTP is stateless, meaning each request is independent by default. A request contains a method, URL, headers, and optionally a body. A response contains a status code, headers, and a response body.


### Common HTTP Methods
| Method | Purpose |
|---|---|
| GET | Retrieve data |
| POST | Create data |
| PUT | Update existing data |
| PATCH | Partially update data |
| DELETE | Remove data |

### Common Status Codes
| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 301 | Moved Permanently |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

### URL Structure
Example: `https://www.example.com:443/students/5?format=json#results`

- Protocol: `https://`
- Hostname: `www.example.com`
- Port: `443`
- Path: `/students/5`
- Query: `?format=json`
- Fragment: `#results`

`localhost` refers to the local computer (127.0.0.1). Ports identify services running on the same machine. Express commonly uses port 3000 and Flask commonly uses port 5000.

## Procedure and Implementation

### Task 1 – Hello World Express Server
1. Create a project folder and initialize it.
   ```bash
   mkdir express-demo
   cd express-demo
   npm init -y
   npm install express
   ```
2. Create `server.js`:
   ```js
   const express = require("express");
   const app = express();

   app.get("/", (req, res) => {
       res.send("Backend Server Running");
   });

   app.listen(3000, () => {
       console.log("Server started at http://localhost:3000");
   });
   ```
3. Run `node server.js` and open `http://localhost:3000`.

**Expected output:** `Backend Server Running`

### Task 2 – Create Multiple Express Routes
Add routes for the home page, student list, and a sample student:

```js
app.get("/", (req, res) => {
    res.send("Welcome to the Student Management API");
});

app.get("/students", (req, res) => {
    res.send("List of all students");
});

app.get("/students/1", (req, res) => {
    res.send("Student: Aarav, Roll No: 1");
});
```

**Expected outputs:**
- `/` – Welcome to the Student Management API
- `/students` – List of all students
- `/students/1` – Student: Aarav, Roll No: 1

### Task 3 – Return JSON Data and Add Branch Filter Route
Create a student array and routes to return all students or one student by ID. Add a route to filter students by branch.

```js
const students = [
    { id: 1, name: "Aarav", branch: "CSE" },
    { id: 2, name: "Diya", branch: "ECE" },
    { id: 3, name: "Rohan", branch: "IT" }
];

app.get("/students", (req, res) => {
    res.json(students);
});

app.get("/students/:id", (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ error: "Student not found" });
    }
});

app.get("/students/branch/:branch", (req, res) => {
    const branch = req.params.branch.toUpperCase();
    const filteredStudents = students.filter(s => s.branch.toUpperCase() === branch);
    res.json(filteredStudents);
});
```

**Expected output:** `/students` returns the complete array, `/students/1` returns Aarav's record, `/students/5` returns a 404 error, and `/students/branch/CSE` returns students belonging to CSE.

### Task 4 – Send HTML Responses
Use `res.send()` to send HTML content. The `/` route can return a heading and paragraph, while `/students` can return an HTML list and `/students/:id` can return a student detail card. If the requested student does not exist, send a 404 response.

**Expected output:** HTML heading and welcome text, a list of students, or an individual student detail page.

### Task 5 – Templating with EJS
1. Install EJS:
   ```bash
   npm install ejs
   ```
2. Create a `views` directory and add `home.ejs` and `students.ejs`.
3. In `students.ejs`, loop through the students:
   ```ejs
   <% students.forEach(student => { %>
       <li><strong><%= student.name %></strong> — <%= student.branch %></li>
   <% }); %>
   ```
4. Configure and render templates in Express:
   ```js
   app.set("view engine", "ejs");

   app.get("/", (req, res) => {
       res.render("home");
   });

   app.get("/students", (req, res) => {
       res.render("students", { students: students });
   });
   ```

**Expected output:** The home and students pages are rendered from EJS templates, keeping HTML separate from server-side code.

### Task 6 – Hello World Flask Server
1. Create a Python project and virtual environment:
   ```bash
   mkdir backend-project
   cd backend-project
   python -m venv venv
   ```
2. Activate it on Windows:
   ```bash
   venv\Scripts\activate
   ```
   On macOS/Linux:
   ```bash
   source venv/bin/activate
   ```
3. Install Flask:
   ```bash
   pip install flask
   ```
4. Create `app.py`:
   ```python
   from flask import Flask

   app = Flask(__name__)

   @app.route("/")
   def home():
       return "Backend Server Running"

   if __name__ == "__main__":
       app.run(debug=True)
   ```
5. Run `python app.py` and visit `http://localhost:5000`.

**Expected output:** `Backend Server Running`

### Task 7 – Flask Routes, JSON, and POST to Add a Student
Create routes to display the student list and retrieve a student by ID. Add a POST endpoint to append a student to the in-memory list.

```python
from flask import Flask, jsonify, request

app = Flask(__name__)

students = [
    {"id": 1, "name": "Aarav", "branch": "CSE"},
    {"id": 2, "name": "Diya", "branch": "ECE"},
    {"id": 3, "name": "Rohan", "branch": "IT"}
]


@app.route("/")
def home():
    return "Student Management API"


@app.route("/students", methods=["GET"])
def get_students():
    return jsonify(students)


@app.route("/students/<int:student_id>")
def get_student(student_id):
    student = next((s for s in students if s["id"] == student_id), None)
    if student:
        return jsonify(student)
    return jsonify({"error": "Student not found"}), 404


@app.route("/students", methods=["POST"])
def add_student():
    data = request.get_json()
    if not data or not data.get("name") or not data.get("branch"):
        return jsonify({"error": "name and branch are required"}), 400

    new_student = {
        "id": max((s["id"] for s in students), default=0) + 1,
        "name": data["name"],
        "branch": data["branch"]
    }
    students.append(new_student)
    return jsonify(new_student), 201


if __name__ == "__main__":
    app.run(debug=True)
```

**Testing the POST route:** Send a POST request to `http://localhost:5000/students` with JSON body, for example:
```json
{
  "name": "Meera",
  "branch": "CSE"
}
```
Expected response: a new student object with an assigned ID and status code `201 Created`. Sending incomplete data should return `400 Bad Request`.

### Task 8 – Observe Request–Response Cycle in DevTools
1. Run Express on port 3000 or Flask on port 5000.
2. Open Chrome and press `F12`.
3. Select the **Network** tab.
4. Visit the students endpoint, such as `http://localhost:3000/students` or `http://localhost:5000/students`.
5. Select the request and inspect its method, status code, response headers, and response body.

**Expected observations:**
| Field | Expected value |
|---|---|
| Request Method | GET |
| Status Code | 200 OK |
| Response Headers | Content-Type and other metadata |
| Response Body | Student JSON data |

## Results
HTTP fundamentals and the request–response cycle were studied. The backend development environment was configured, and basic servers were created using Express.js and Flask. Routes were tested for plain-text, HTML, and JSON responses. EJS templates were used to render pages. The additional branch filter and POST student route were implemented, and the request–response cycle was inspected using browser DevTools.


## Conclusion
The lab demonstrated how HTTP enables client–server communication and how backend servers can be set up using Express.js and Flask. It also provided practical experience with routing, response formats, EJS templating, handling POST requests, and inspecting network requests using DevTools.


## Screenshots to Attach
- Express Hello World server running in the browser.
- Express student routes and JSON output.
- Branch-filter endpoint output.
- HTML student page and EJS-rendered page.
- Flask Hello World server running.
- Flask student JSON endpoint.
- POST `/students` request and response showing a newly added student.
- DevTools Network tab showing a request and response.
