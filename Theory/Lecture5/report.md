# RESTful APIs and FastAPI — Report

## Overview

This report summarizes **Lecture 05: RESTful APIs and FastAPI** from **Unit 1: Foundations of Backend Development**. The lecture covers the evolution of web APIs, REST principles and constraints, resource naming, HTTP methods and status codes, REST best practices, and the implementation of a CRUD API using FastAPI.

**Course Outcome:** CO1 — Understand and design RESTful APIs.

## Learning Objectives

By the end of the lecture, learners should be able to:

- Explain how APIs evolved from SOAP and XML-RPC to REST.
- Describe REST principles, constraints, and best practices.
- Design clean, resource-oriented API endpoints.
- Build a CRUD API using FastAPI.
- Use Pydantic models for validation.
- Test and document APIs using Swagger UI and ReDoc.

---

## 1. Before REST

Before REST became widely adopted, web services commonly used SOAP and XML-RPC.

### SOAP

SOAP (Simple Object Access Protocol) was widely used in enterprise systems.

Key characteristics:

- Uses XML for messages.
- Uses WSDL contracts.
- Supports security and transactions.
- Can operate over HTTP, SMTP, and other transports.
- Has a relatively verbose envelope structure.

Example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetStudent xmlns="http://example.com/api">
      <StudentId>1</StudentId>
    </GetStudent>
  </soap:Body>
</soap:Envelope>
```

Common drawbacks include verbose payloads, complex tooling, tight client-server coupling, and poor browser support.

### XML-RPC

XML-RPC provided a simpler XML-based approach to remote procedure calls.

- Method calls are encoded in XML.
- HTTP is used as the transport.
- It does not require a WSDL-style contract.
- It is simpler than SOAP but offers fewer features.

### Why REST Became Popular

REST simplified API development by using HTTP directly, supporting formats such as JSON, and organizing APIs around resources rather than remote procedure calls.

---

## 2. What Is REST?

**REST (Representational State Transfer)** is an architectural style defined by Roy Fielding. It is a set of design constraints rather than a protocol.

### Core Concepts

| Concept | Description |
| --- | --- |
| Resources | API entities such as students, courses, grades, and users |
| URIs | Unique identifiers for resources |
| Representations | JSON, XML, HTML, or other representations of resource state |
| Statelessness | Each request contains the information needed to process it |
| Uniform Interface | Resources are accessed consistently through HTTP methods |

Example resource URIs:

```text
/students
/students/1
/students/1/courses
/courses
```

---

## 3. The Six REST Constraints

REST defines six architectural constraints:

1. **Client-Server** — frontend and backend remain independent.
2. **Stateless** — the server does not rely on stored client session state between requests.
3. **Cacheable** — responses indicate whether they can be cached.
4. **Uniform Interface** — resources use a consistent interface and HTTP methods.
5. **Layered System** — clients do not need to know whether intermediaries such as proxies or load balancers are involved.
6. **Code on Demand (Optional)** — a server may send executable code to extend client functionality.

The first five constraints are required; Code on Demand is optional.

---

## 4. RESTful Resource Naming

Good REST APIs use predictable, resource-based URLs.

| Rule | Good | Avoid |
| --- | --- | --- |
| Use plural nouns | `/students` | `/student` |
| Use nouns, not verbs | `/students` | `/getAllStudents` |
| Use hyphens for multi-word resources | `/student-profiles` | `/studentProfiles` |
| Nest related resources | `/students/1/courses` | `/getCoursesByStudent/1` |

A versioned endpoint can look like:

```text
/api/v1/students
```

---

## 5. HTTP Methods and CRUD

HTTP methods map naturally to CRUD operations.

| HTTP Method | CRUD Operation | Typical Success Code | Idempotent |
| --- | --- | ---: | --- |
| GET | Read | 200 OK | Yes |
| POST | Create | 201 Created | No |
| PUT | Full Update | 200 OK | Yes |
| PATCH | Partial Update | 200 OK | No* |
| DELETE | Delete | 204 No Content | Yes |

> *The lecture identifies PATCH as non-idempotent. Actual behavior depends on how a PATCH operation is designed.

---

## 6. Common HTTP Status Codes

| Code | Meaning | Typical Use |
| ---: | --- | --- |
| 200 | OK | Successful GET, PUT, or PATCH |
| 201 | Created | Resource successfully created |
| 204 | No Content | Successful deletion with no response body |
| 400 | Bad Request | Invalid client input |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Authenticated but not permitted |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate or conflicting state |
| 422 | Unprocessable Entity | Validation failure |
| 500 | Internal Server Error | Unexpected server failure |

---

## 7. REST API Best Practices

Recommended practices include:

- Use plural nouns for resource names.
- Version APIs when backward compatibility matters.
- Return appropriate HTTP status codes.
- Keep error responses consistent.
- Support filtering, sorting, and pagination for collections.
- Use relationships and links where appropriate.
- Document APIs with OpenAPI/Swagger.

Examples:

```text
GET /students?branch=CSE
GET /students?page=1&limit=20
GET /api/v1/students
```

---

## 8. Introduction to FastAPI

FastAPI is a Python web framework for building APIs. It uses Python type hints and Pydantic for validation and automatically generates OpenAPI documentation.

### Installation

```bash
pip install fastapi uvicorn
```

### Minimal Application

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, REST!"}
```

Run it with:

```bash
uvicorn main:app --reload --port 5000
```

API documentation is then available at:

```text
http://localhost:5000/docs
http://localhost:5000/redoc
```

---

## 9. Student Management CRUD API

The lecture implements a simple in-memory Student Management API.

### Data Models

```python
from pydantic import BaseModel

class Student(BaseModel):
    id: int
    name: str
    branch: str

class StudentCreate(BaseModel):
    name: str
    branch: str
```

`StudentCreate` represents incoming creation/update data, while `Student` includes the server-assigned `id`.

### Complete Example

```python
from fastapi import FastAPI, HTTPException, Query
import uvicorn
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(title="Student Management API", version="1.0.0")


class Student(BaseModel):
    id: int
    name: str
    branch: str


class StudentCreate(BaseModel):
    name: str
    branch: str


students: List[Student] = [
    Student(id=1, name="Aarav", branch="CSE"),
    Student(id=2, name="Diya", branch="ECE"),
    Student(id=3, name="Rohan", branch="IT"),
]

next_id = 4


@app.get("/students", response_model=List[Student])
def list_students(branch: Optional[str] = Query(None)):
    if branch:
        return [s for s in students if s.branch.upper() == branch.upper()]
    return students


@app.get("/students/{student_id}", response_model=Student)
def get_student(student_id: int):
    for student in students:
        if student.id == student_id:
            return student
    raise HTTPException(status_code=404, detail="Student not found")


@app.post("/students", response_model=Student, status_code=201)
def create_student(student: StudentCreate):
    global next_id
    new_student = Student(id=next_id, **student.model_dump())
    students.append(new_student)
    next_id += 1
    return new_student


@app.put("/students/{student_id}", response_model=Student)
def update_student(student_id: int, student: StudentCreate):
    for i, existing in enumerate(students):
        if existing.id == student_id:
            updated = Student(id=student_id, **student.model_dump())
            students[i] = updated
            return updated
    raise HTTPException(status_code=404, detail="Student not found")


@app.delete("/students/{student_id}", status_code=204)
def delete_student(student_id: int):
    for i, student in enumerate(students):
        if student.id == student_id:
            students.pop(i)
            return
    raise HTTPException(status_code=404, detail="Student not found")


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)
```

### API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/students` | List all students |
| GET | `/students?branch=CSE` | Filter students by branch |
| GET | `/students/{student_id}` | Get one student |
| POST | `/students` | Create a student |
| PUT | `/students/{student_id}` | Update a student |
| DELETE | `/students/{student_id}` | Delete a student |

---

## 10. Important FastAPI Concepts

### Pydantic and `BaseModel`

Pydantic models define the expected structure and types of API data. FastAPI uses them for validation and documentation.

In Pydantic v2:

```python
student.model_dump()
```

converts a model instance to a Python dictionary.

### Type Hints

FastAPI uses Python type hints to understand request and response structures.

```python
List[Student]
Optional[str]
```

`List[Student]` represents a collection of `Student` objects, while `Optional[str]` allows a string value or `None`.

### `Query`

A query parameter can be declared explicitly with:

```python
branch: Optional[str] = Query(None)
```

This supports requests such as:

```text
/students?branch=CSE
```

### `HTTPException`

Use `HTTPException` to return meaningful HTTP errors:

```python
raise HTTPException(
    status_code=404,
    detail="Student not found"
)
```

### `response_model`

`response_model` tells FastAPI how to validate and serialize the outgoing response:

```python
@app.get("/students", response_model=List[Student])
```

### `status_code`

A route can declare its successful response code:

```python
@app.post("/students", status_code=201)
```

---

## 11. Running and Testing the API

### Start the Server

```bash
uvicorn main:app --reload --port 5000
```

Or run `main.py` directly if the `uvicorn.run(...)` block is included:

```bash
python main.py
```

### Swagger UI

Open:

```text
http://localhost:5000/docs
```

Swagger UI provides interactive API documentation and allows endpoints to be tested in the browser.

### ReDoc

Open:

```text
http://localhost:5000/redoc
```

ReDoc provides readable generated API documentation.

### curl Examples

List all students:

```bash
curl http://localhost:5000/students
```

Get one student:

```bash
curl http://localhost:5000/students/1
```

Create a student:

```bash
curl -X POST http://localhost:5000/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Priya", "branch": "CSE"}'
```

Filter students:

```bash
curl "http://localhost:5000/students?branch=CSE"
```

Delete a student:

```bash
curl -X DELETE http://localhost:5000/students/2
```

---

## 12. Lab Exercise

Build a FastAPI application for a `Course` resource with:

```text
id
title
credits
department
```

Requirements:

- Implement GET all courses.
- Implement GET course by ID.
- Implement POST to create a course.
- Implement PUT to update a course.
- Implement DELETE to remove a course.
- Add `GET /courses?department=CSE` filtering.
- Test every endpoint using Swagger UI.
- Verify generated documentation in ReDoc.
- Capture a screenshot of the Swagger UI.

---

## Key Takeaways

- REST is an architectural style rather than a protocol.
- REST APIs model application data as resources identified by URIs.
- REST emphasizes stateless communication and a uniform interface.
- Resource URLs should generally use plural nouns rather than action verbs.
- HTTP methods should communicate the intended CRUD operation.
- Appropriate status codes make API behavior clearer to clients.
- FastAPI uses Python type hints and Pydantic to provide validation and serialization.
- FastAPI automatically generates Swagger UI and ReDoc documentation.
- A complete CRUD API can be implemented with relatively little FastAPI code.

---

## Conclusion

REST provides a simple, resource-oriented approach to designing web APIs using standard HTTP semantics. FastAPI complements this approach with concise Python syntax, automatic validation, type-driven development, and generated API documentation. Together, REST and FastAPI provide a practical foundation for developing backend APIs and microservices.
