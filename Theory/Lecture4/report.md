# Experiment 04: HTTP Requests, DevTools, CURL, Postman, and fetch

## Aim
To understand HTTP request and response structures and inspect HTTP communication using Browser DevTools, curl, Postman, and JavaScript `fetch()`.

## Objectives
- Understand the anatomy of HTTP requests and responses.
- Inspect HTTP traffic with Browser DevTools, curl, and Postman.
- Make HTTP requests from JavaScript using `fetch()`.
- Compare tools that inspect and send HTTP requests.

## Software / Tools Required
- Node.js and Express server from Lecture 03
- Python and Flask server from Lecture 03
- Google Chrome (Browser DevTools)
- curl
- Postman
- VS Code

## Theory

### 1. HTTP Request Structure
An HTTP request is sent by a client to ask a server for a resource or to perform an action. It includes:
- **Request line:** method, path, and HTTP version (e.g., `GET /students HTTP/1.1`).
- **Headers:** metadata such as `Host`, `Accept`, `User-Agent`, and `Content-Type`.
- **Body (optional):** data sent to the server, commonly with POST, PUT, and PATCH.

Example:
```http
GET /students/5 HTTP/1.1
Host: localhost:3000
Accept: application/json
```

### 2. HTTP Response Structure
A response is returned by the server and contains:
- **Status line:** HTTP version, status code, and reason (e.g., `HTTP/1.1 200 OK`).
- **Headers:** response metadata, such as `Content-Type`, `Content-Length`, and `Cache-Control`.
- **Body:** returned data, which may be JSON, HTML, text, a file, or an error message.

### 3. HTTP Methods
| Method | Purpose | Typical response |
|---|---|---|
| GET | Retrieve data | 200 OK with data |
| POST | Create new data | 201 Created |
| PUT | Update existing data | 200 OK with updated resource |
| DELETE | Remove data | 204 No Content |

### 4. Tools for Inspecting HTTP
- **Browser DevTools:** Inspect requests from a browser using the Network tab; shows headers, response, preview, and timing.
- **curl:** Command-line tool for sending requests. Options include `-v` (verbose), `-X` (method), `-H` (header), `-d` (body), and `-i` (include response headers).
- **Postman:** GUI tool to build, send, inspect, save, and organize API requests in collections.
- **JavaScript fetch():** Built-in browser API for sending requests from client-side code. It returns a Promise; use `.json()` or `.text()` to read the response body.

## Procedure / Hands-On Tasks

### Task 1: Inspect a Request Using Browser DevTools
1. Start the Express server:
   ```bash
   cd express-demo
   node server.js
   ```
2. Open Chrome and press **F12**.
3. Select the **Network** tab.
4. Visit `http://localhost:3000/students`.
5. Select the request named `students` and inspect its Headers, Preview/Response, and Timing.

**Expected observations:**
- Request Method: `GET`
- Status Code: `200 OK`
- Request URL: `http://localhost:3000/students`
- Response Content-Type: `application/json`
- Response: list of students in JSON format

### Task 2: Send Requests Using curl
Run the following commands in a separate terminal while the Express server is running.

**Get all students:**
```bash
curl http://localhost:3000/students
```

**Verbose request and headers:**
```bash
curl -v http://localhost:3000/students
```

**Get one student:**
```bash
curl http://localhost:3000/students/1
```

**Request a non-existent student:**
```bash
curl http://localhost:3000/students/99
```

**Include response headers:**
```bash
curl -i http://localhost:3000/students
```

Expected responses include the students JSON array, the record for student ID 1, and a not-found error for ID 99 (if the server's not-found route is configured as in Lecture 03).

### Task 3: Send Requests Using Postman
1. Open Postman and create a new request.
2. Select **GET** and enter `http://localhost:3000/students`.
3. Click **Send** and check the status, JSON body, and headers.
4. In the Headers tab, add `Accept: application/json` and send again.
5. Try a POST request to `http://localhost:3000/students`.
6. Choose **Body → raw → JSON** and enter:
   ```json
   {
     "id": 4,
     "name": "Priya",
     "branch": "CSE"
   }
   ```
7. Send the request. The Express server from Lecture 03 does not implement POST handling yet, so an error response may be expected.
8. Save the GET request as **Get All Students** in a collection named **Student Management API**.

### Task 4: Send the Same Request Using Three Tools
Send this request using Browser DevTools, curl, and Postman:

```http
GET http://localhost:3000/students/2
```

**curl command:**
```bash
curl -i http://localhost:3000/students/2
```

Compare the response body and headers. All three tools send the same HTTP request; they only present the information differently.

### Task 5: Inspect the Flask Server
1. Open a terminal in the Flask project folder.
2. Activate the virtual environment:
   ```bash
   venv\Scripts\activate
   ```
   On macOS/Linux:
   ```bash
   source venv/bin/activate
   ```
3. Start Flask:
   ```bash
   python app.py
   ```
4. Inspect the endpoint using curl:
   ```bash
   curl -v http://localhost:5000/students
   ```
5. In Postman, send a GET request to `http://localhost:5000/students` and inspect the response.

The same HTTP request structure is used by Express and Flask, even though they are different server frameworks.


## Lab Exercise

### 1. Inspect GET /students in DevTools
- Start the Express server from Lecture 03.
- Open `http://localhost:3000/students` with Chrome DevTools Network tab open.
- Capture a screenshot showing the request and response details.

### 2. Get Student ID 3 with curl
```bash
curl http://localhost:3000/students/3
```
Verify the returned data for student ID 3.

### 3. Send GET Request in Postman to Flask
- Start the Flask server.
- Send `GET http://localhost:5000/students` in Postman.
- Save the request in a new collection.

### 4. Fetch Students and Filter by CSE (Client-Side)
Use this JavaScript code to fetch the student list and filter students whose branch is CSE:

```javascript
fetch("http://localhost:3000/students")
  .then(response => response.json())
  .then(students => {
    const cseStudents = students.filter(student => student.branch === "CSE");
    console.log("CSE Students:", cseStudents);
  })
  .catch(error => console.error("Error:", error));
```

### 5. Identify Response Headers with curl
```bash
curl -v http://localhost:3000/students
```
Inspect the response headers printed by curl.

## Screenshot Checklist
- [ ] Chrome DevTools Network tab showing GET `/students` and its request/response details.
- [ ] curl output for GET `/students/3`.
- [ ] Postman GET request to Flask `/students` with response.
- [ ] curl verbose output showing response headers.

## Result
HTTP requests and responses were inspected using Browser DevTools, curl, and Postman. Requests were compared across tools, and JavaScript `fetch()` was used to retrieve and filter student data by branch.

## Conclusion
This experiment demonstrates the structure of HTTP requests and responses and how different tools can inspect and send HTTP requests. Browser DevTools, curl, Postman, and JavaScript `fetch()` are useful for testing, debugging, and understanding client-server communication.
