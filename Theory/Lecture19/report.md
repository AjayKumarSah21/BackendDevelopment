# Implementing RESTful APIs: Building API Endpoints

## Lecture Information

- **Lecture:** 19
- **Unit:** Unit 2 — Database Management
- **Topic:** Implementing RESTful APIs: Building API Endpoints
- **Course Outcome:** CO3 — Build complete RESTful API endpoints with proper request handling and response formatting.
- **Bloom's Knowledge Level:** Apply
- **Skills Developed:** API development, request validation, FastAPI/Pydantic implementation, and error handling
- **Applications:** Backend service deployment, API endpoints, and web application integration
- **PBL Activity:** Implementing a complete CRUD API for a Student/Course system in FastAPI
- **Assessment:** Coding project and API implementation demonstration

---

# 1. Introduction

RESTful API design defines resources, endpoints, HTTP methods, request formats, and responses. API implementation turns that design into working backend code.

A complete API typically performs the following flow:

```text
HTTP Request
     ↓
Request Validation
     ↓
Business Logic
     ↓
Database Operation
     ↓
Response Formatting
     ↓
HTTP Response
```

API implementation therefore involves:

- Receiving HTTP requests
- Validating input
- Executing application logic
- Interacting with a database
- Handling errors
- Returning appropriate responses

### Learning Objectives

By the end of this topic, you should be able to:

- Implement CRUD endpoints using FastAPI.
- Validate requests with Pydantic.
- Handle API errors.
- Format API responses.
- Structure API code for maintainability.
- Test endpoints using `curl`, Postman, and Swagger UI.
- Integrate FastAPI endpoints with a database.

---

# 2. Project Setup

## 2.1 Project Structure

A simple Student Management API can use the following structure:

```text
student_api/
├── main.py
├── models.py
├── schemas.py
├── database.py
├── requirements.txt
└── .env
```

### File Responsibilities

| File | Purpose |
|---|---|
| `main.py` | FastAPI application and endpoints |
| `models.py` | SQLAlchemy database models |
| `schemas.py` | Pydantic request/response schemas |
| `database.py` | Database engine and session configuration |
| `requirements.txt` | Python dependencies |
| `.env` | Environment variables such as database configuration |

---

## 2.2 Install Dependencies

```bash
pip install fastapi uvicorn sqlalchemy python-dotenv pydantic[email]
```

The project uses:

- **FastAPI** — API framework
- **Uvicorn** — ASGI server
- **SQLAlchemy** — ORM/database interaction
- **Pydantic** — request and response validation
- **python-dotenv** — environment variable loading

---

# 3. Database Configuration

Create `database.py`.

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./students.db"
)

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False
    } if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()
```

---

## Database Dependency

```python
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
```

This dependency creates a database session for a request and closes it when the request has finished.

FastAPI endpoints can receive the session through dependency injection:

```python
db: Session = Depends(get_db)
```

---

# 4. Implementing Database Models

Create `models.py`.

## Imports

```python
from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    ForeignKey,
    DateTime
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base
```

---

## 4.1 Department Model

```python
class Department(Base):
    __tablename__ = "departments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        unique=True,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    students = relationship(
        "Student",
        back_populates="department"
    )

    courses = relationship(
        "Course",
        back_populates="department"
    )
```

---

## 4.2 Student Model

```python
class Student(Base):
    __tablename__ = "students"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    branch = Column(
        String(50),
        nullable=False
    )

    enrollment_date = Column(Date)

    department_id = Column(
        Integer,
        ForeignKey("departments.id")
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now()
    )

    department = relationship(
        "Department",
        back_populates="students"
    )

    enrollments = relationship(
        "Enrollment",
        back_populates="student",
        cascade="all, delete-orphan"
    )
```

---

## 4.3 Course Model

```python
class Course(Base):
    __tablename__ = "courses"

    id = Column(
        String(10),
        primary_key=True
    )

    title = Column(
        String(100),
        nullable=False
    )

    credits = Column(
        Integer,
        nullable=False
    )

    department_id = Column(
        Integer,
        ForeignKey("departments.id")
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    department = relationship(
        "Department",
        back_populates="courses"
    )

    enrollments = relationship(
        "Enrollment",
        back_populates="course"
    )
```

---

## 4.4 Enrollment Model

```python
class Enrollment(Base):
    __tablename__ = "enrollments"

    student_id = Column(
        Integer,
        ForeignKey(
            "students.id",
            ondelete="CASCADE"
        ),
        primary_key=True
    )

    course_id = Column(
        String(10),
        ForeignKey("courses.id"),
        primary_key=True
    )

    semester = Column(String(20))

    grade = Column(String(2))

    enrolled_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    student = relationship(
        "Student",
        back_populates="enrollments"
    )

    course = relationship(
        "Course",
        back_populates="enrollments"
    )
```

---

# 5. Implementing Pydantic Schemas

Database models describe how information is stored.

Pydantic schemas describe and validate:

- Incoming request data
- Update data
- Outgoing API responses

Create `schemas.py`.

---

## 5.1 Branch Enum

```python
from enum import Enum

class BranchEnum(str, Enum):
    CSE = "CSE"
    ECE = "ECE"
    IT = "IT"
    ME = "ME"
    CE = "CE"
```

Using an enum prevents unsupported branch values.

---

# 6. Department Schemas

```python
from pydantic import BaseModel, Field
from datetime import datetime

class DepartmentBase(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=100
    )


class DepartmentCreate(
    DepartmentBase
):
    pass


class DepartmentResponse(
    DepartmentBase
):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
```

`from_attributes = True` allows response schemas to work with ORM objects.

---

# 7. Student Schemas

## Base Schema

```python
from pydantic import (
    BaseModel,
    EmailStr,
    Field
)

class StudentBase(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    email: EmailStr

    branch: BranchEnum
```

---

## Create Schema

```python
from typing import Optional
from datetime import date

class StudentCreate(StudentBase):
    department_id: Optional[int] = None

    enrollment_date:
        Optional[date] = None
```

---

## Update Schema

Update fields are optional because a request may update only selected fields.

```python
class StudentUpdate(BaseModel):
    name: Optional[str] = Field(
        None,
        min_length=1,
        max_length=100
    )

    email: Optional[EmailStr] = None

    branch:
        Optional[BranchEnum] = None

    department_id:
        Optional[int] = None
```

---

## Response Schema

```python
class StudentResponse(StudentBase):
    id: int

    enrollment_date:
        Optional[date]

    department_id:
        Optional[int]

    created_at: datetime

    updated_at:
        Optional[datetime]

    class Config:
        from_attributes = True
```

---

# 8. Paginated Student Response

For collection endpoints, the lecture uses a structured pagination response.

```python
from typing import List

class StudentListResponse(BaseModel):
    data: List[StudentResponse]
    total: int
    page: int
    limit: int
    total_pages: int
```

Example response:

```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "limit": 10,
  "total_pages": 0
}
```

---

# 9. Course Schemas

```python
class CourseBase(BaseModel):
    title: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    credits: int = Field(
        ...,
        ge=1,
        le=6
    )


class CourseCreate(CourseBase):
    department_id:
        Optional[int] = None


class CourseResponse(CourseBase):
    id: str

    department_id:
        Optional[int]

    created_at: datetime

    class Config:
        from_attributes = True
```

Course credits are restricted to values from 1 through 6.

---

# 10. Enrollment Schemas

```python
class EnrollmentCreate(BaseModel):
    course_id: str
    semester: str
    grade: Optional[str] = None


class EnrollmentResponse(BaseModel):
    student_id: int
    course_id: str
    semester: str
    grade: Optional[str]
    enrolled_at: datetime

    class Config:
        from_attributes = True
```

---

# 11. Error Schema

```python
class ErrorResponse(BaseModel):
    error: dict
```

A consistent error structure can make API failures easier for clients to process.

---

# 12. Creating the FastAPI Application

Create `main.py`.

```python
from fastapi import (
    FastAPI,
    HTTPException,
    Depends,
    Query
)

from sqlalchemy.orm import Session
from typing import List, Optional
import math

from database import (
    engine,
    get_db,
    Base
)

from models import (
    Student,
    Course,
    Department,
    Enrollment
)
```

Create the database tables:

```python
Base.metadata.create_all(
    bind=engine
)
```

Create the application:

```python
app = FastAPI(
    title="Student Management API",
    description=(
        "API for managing students, "
        "courses, and enrollments"
    ),
    version="1.0.0"
)
```

---

# 13. Student API Endpoints

The main student resource uses standard CRUD operations.

| Operation | Method | Endpoint |
|---|---|---|
| List students | GET | `/students` |
| Get student | GET | `/students/{student_id}` |
| Create student | POST | `/students` |
| Update student | PUT | `/students/{student_id}` |
| Delete student | DELETE | `/students/{student_id}` |

---

# 14. List Students

```python
@app.get(
    "/students",
    response_model=StudentListResponse
)
def list_students(
    branch:
        Optional[BranchEnum] = Query(
            None,
            description="Filter by branch"
        ),

    department_id:
        Optional[int] = Query(
            None,
            description=(
                "Filter by department"
            )
        ),

    search:
        Optional[str] = Query(
            None,
            description=(
                "Search by name or email"
            )
        ),

    page: int = Query(
        1,
        ge=1,
        description="Page number"
    ),

    limit: int = Query(
        10,
        ge=1,
        le=100,
        description="Items per page"
    ),

    db: Session = Depends(get_db)
):
    query = db.query(Student)

    if branch:
        query = query.filter(
            Student.branch == branch
        )

    if department_id:
        query = query.filter(
            Student.department_id
            == department_id
        )

    if search:
        query = query.filter(
            Student.name.ilike(
                f"%{search}%"
            )
            |
            Student.email.ilike(
                f"%{search}%"
            )
        )

    total = query.count()

    total_pages = math.ceil(
        total / limit
    )

    offset = (
        page - 1
    ) * limit

    students = (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "data": students,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages
    }
```

---

## Filtering

Examples:

```text
GET /students?branch=CSE
```

```text
GET /students?department_id=1
```

```text
GET /students?search=aarav
```

Filters can also be combined.

---

## Pagination

The endpoint accepts:

```text
page
limit
```

The offset is calculated as:

```text
offset = (page - 1) × limit
```

For example:

```text
page = 3
limit = 10
```

produces:

```text
offset = 20
```

The response also contains:

```text
total
page
limit
total_pages
```

This makes collection endpoints easier to use with large datasets.

---

# 15. Get a Student

```python
@app.get(
    "/students/{student_id}",
    response_model=StudentResponse
)
def get_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = (
        db.query(Student)
        .filter(
            Student.id == student_id
        )
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return student
```

If the student does not exist, the endpoint returns a `404 Not Found` error.

---

# 16. Create a Student

```python
@app.post(
    "/students",
    response_model=StudentResponse,
    status_code=201
)
def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(Student)
        .filter(
            Student.email
            == student.email
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail=(
                "Email already registered"
            )
        )

    db_student = Student(
        **student.model_dump()
    )

    db.add(db_student)
    db.commit()
    db.refresh(db_student)

    return db_student
```

### Important Steps

```text
Validate Request
      ↓
Check Duplicate Email
      ↓
Create ORM Object
      ↓
Add to Session
      ↓
Commit
      ↓
Refresh
      ↓
Return Created Student
```

A successful creation uses:

```text
HTTP 201 Created
```

A duplicate email uses:

```text
HTTP 409 Conflict
```

---

# 17. Update a Student

```python
@app.put(
    "/students/{student_id}",
    response_model=StudentResponse
)
def update_student(
    student_id: int,
    student: StudentUpdate,
    db: Session = Depends(get_db)
):
    db_student = (
        db.query(Student)
        .filter(
            Student.id == student_id
        )
        .first()
    )

    if not db_student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    update_data = (
        student.model_dump(
            exclude_unset=True
        )
    )

    for field, value in (
        update_data.items()
    ):
        setattr(
            db_student,
            field,
            value
        )

    db.commit()
    db.refresh(db_student)

    return db_student
```

`exclude_unset=True` means only fields actually supplied by the client are included in the update dictionary.

---

# 18. Delete a Student

```python
@app.delete(
    "/students/{student_id}",
    status_code=204
)
def delete_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    db_student = (
        db.query(Student)
        .filter(
            Student.id == student_id
        )
        .first()
    )

    if not db_student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    db.delete(db_student)
    db.commit()

    return None
```

A successful deletion returns:

```text
HTTP 204 No Content
```

---

# 19. Course Endpoints

## List Courses

```python
@app.get(
    "/courses",
    response_model=List[
        CourseResponse
    ]
)
def list_courses(
    department_id:
        Optional[int] = Query(None),

    credits:
        Optional[int] = Query(
            None,
            ge=1,
            le=6
        ),

    db: Session = Depends(get_db)
):
    query = db.query(Course)

    if department_id:
        query = query.filter(
            Course.department_id
            == department_id
        )

    if credits:
        query = query.filter(
            Course.credits == credits
        )

    return query.all()
```

Examples:

```text
GET /courses
```

```text
GET /courses?department_id=1
```

```text
GET /courses?credits=4
```

---

# 20. Create a Course

The lecture defines a course creation endpoint that checks whether the course already exists before inserting it.

```python
@app.post(
    "/courses",
    response_model=CourseResponse,
    status_code=201
)
def create_course(
    course: CourseCreate,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(Course)
        .filter(
            Course.id == course.id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail=(
                "Course already exists"
            )
        )

    db_course = Course(
        **course.model_dump()
    )

    db.add(db_course)
    db.commit()
    db.refresh(db_course)

    return db_course
```

> **Source note:** The lecture's `CourseCreate` schema contains `title`, `credits`, and optional `department_id`, while this endpoint checks `course.id`. The report preserves that structure as presented in the lecture.

---

# 21. Nested Enrollment Endpoints

Enrollments belong to students, so nested resource paths are used.

Examples:

```text
GET /students/{student_id}/enrollments
```

```text
POST /students/{student_id}/enrollments
```

```text
DELETE /students/{student_id}/enrollments/{course_id}
```

---

# 22. List Student Enrollments

```python
@app.get(
    "/students/{student_id}/enrollments",
    response_model=List[
        EnrollmentResponse
    ]
)
def list_student_enrollments(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = (
        db.query(Student)
        .filter(
            Student.id == student_id
        )
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return (
        db.query(Enrollment)
        .filter(
            Enrollment.student_id
            == student_id
        )
        .all()
    )
```

The endpoint first confirms that the parent student exists.

---

# 23. Create an Enrollment

```python
@app.post(
    "/students/{student_id}/enrollments",
    response_model=EnrollmentResponse,
    status_code=201
)
def create_enrollment(
    student_id: int,
    enrollment: EnrollmentCreate,
    db: Session = Depends(get_db)
):
    student = (
        db.query(Student)
        .filter(
            Student.id == student_id
        )
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    course = (
        db.query(Course)
        .filter(
            Course.id
            == enrollment.course_id
        )
        .first()
    )

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    existing = (
        db.query(Enrollment)
        .filter(
            Enrollment.student_id
            == student_id,

            Enrollment.course_id
            == enrollment.course_id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail=(
                "Already enrolled "
                "in this course"
            )
        )

    db_enrollment = Enrollment(
        student_id=student_id,
        **enrollment.model_dump()
    )

    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)

    return db_enrollment
```

### Validation Flow

```text
Student Exists?
     ↓
Course Exists?
     ↓
Enrollment Already Exists?
     ↓
Create Enrollment
     ↓
Commit
     ↓
Return 201
```

---

# 24. Delete an Enrollment

```python
@app.delete(
    "/students/{student_id}"
    "/enrollments/{course_id}",
    status_code=204
)
def delete_enrollment(
    student_id: int,
    course_id: str,
    db: Session = Depends(get_db)
):
    enrollment = (
        db.query(Enrollment)
        .filter(
            Enrollment.student_id
            == student_id,

            Enrollment.course_id
            == course_id
        )
        .first()
    )

    if not enrollment:
        raise HTTPException(
            status_code=404,
            detail=(
                "Enrollment not found"
            )
        )

    db.delete(enrollment)
    db.commit()

    return None
```

---

# 25. Running the API

The lecture runs the application with Uvicorn from `main.py`.

```python
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
```

Start it with:

```bash
python main.py
```

The API is then available on:

```text
http://localhost:8000
```

---

# 26. Testing the API

Testing verifies that endpoints behave correctly for successful and unsuccessful requests.

The lecture recommends:

- `curl`
- Postman
- Swagger UI

---

## 26.1 Create a Student with curl

```bash
curl -X POST http://localhost:8000/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aarav",
    "email": "aarav@upes.ac.in",
    "branch": "CSE",
    "enrollment_date": "2024-08-01"
  }'
```

---

## 26.2 List Students

```bash
curl "http://localhost:8000/students?branch=CSE&page=1&limit=5"
```

This tests:

- Filtering
- Pagination

---

## 26.3 Get One Student

```bash
curl http://localhost:8000/students/1
```

---

## 26.4 Update a Student

```bash
curl -X PUT http://localhost:8000/students/1 \
  -H "Content-Type: application/json" \
  -d '{"branch": "ECE"}'
```

---

## 26.5 Delete a Student

```bash
curl -X DELETE http://localhost:8000/students/1
```

---

# 27. Swagger UI

FastAPI automatically provides interactive API documentation.

Open:

```text
http://localhost:8000/docs
```

Swagger UI can be used to:

- Inspect endpoints
- View schemas
- Enter parameters
- Submit requests
- Inspect responses
- Test validation behavior

---

# 28. HTTP Status Codes

Correct status codes make API behavior predictable.

| Status | Meaning | Typical Use |
|---|---|---|
| `200` | OK | Successful GET, PUT, or PATCH |
| `201` | Created | Successful POST |
| `204` | No Content | Successful DELETE |
| `400` | Bad Request | Invalid request/input |
| `404` | Not Found | Resource does not exist |
| `409` | Conflict | Duplicate/conflicting resource |
| `422` | Unprocessable Entity | Validation error |
| `500` | Internal Server Error | Unexpected server failure |

---

# 29. Error Handling Examples

## Resource Not Found

```python
if not student:
    raise HTTPException(
        status_code=404,
        detail="Student not found"
    )
```

---

## Duplicate Resource

```python
if existing:
    raise HTTPException(
        status_code=409,
        detail=(
            "Email already registered"
        )
    )
```

---

## Automatic Validation Errors

FastAPI and Pydantic automatically validate schema fields.

For example, an unsupported branch value can produce:

```text
422 Unprocessable Entity
```

before the endpoint's main logic executes.

---

# 30. API Implementation Flow

The complete architecture can be represented as:

```text
Client
  |
  | HTTP Request
  v
FastAPI Route
  |
  v
Pydantic Validation
  |
  v
Business / Endpoint Logic
  |
  v
SQLAlchemy Session
  |
  v
Database
  |
  v
SQLAlchemy Object
  |
  v
Pydantic Response Model
  |
  v
JSON Response
  |
  v
Client
```

---

# 31. CRUD Mapping

| CRUD | HTTP Method | Example Endpoint |
|---|---|---|
| Create | POST | `/students` |
| Read Collection | GET | `/students` |
| Read One | GET | `/students/{id}` |
| Update | PUT | `/students/{id}` |
| Delete | DELETE | `/students/{id}` |

---

# 32. Important FastAPI Features Used

## Dependency Injection

```python
db: Session = Depends(get_db)
```

Used to provide database sessions to endpoint functions.

## Response Models

```python
response_model=StudentResponse
```

Used to define and validate API output.

## Query Validation

```python
page: int = Query(
    1,
    ge=1
)
```

Used to validate URL query parameters.

## Request Validation

```python
student: StudentCreate
```

Pydantic validates the request body.

## HTTP Exceptions

```python
raise HTTPException(
    status_code=404,
    detail="Student not found"
)
```

Used for explicit API errors.

---

# 33. Best Practices from the Lecture

### Use Pydantic Schemas

Separate database models from request and response structures.

### Use Dependency Injection

Manage database sessions through `Depends(get_db)`.

### Return Appropriate Status Codes

Do not return `200 OK` for every situation.

Use codes that represent the result of the operation.

### Implement Pagination

Large collection endpoints should not return an unlimited number of rows.

### Validate Requests

Use Pydantic fields, enums, and types to reject invalid data.

### Handle Missing Resources

Check whether database objects exist before operating on them.

### Detect Conflicts

Check for duplicate emails, duplicate courses, or duplicate enrollments.

### Test Every Endpoint

Test both:

- Successful requests
- Error conditions

---

# 34. Key Takeaways

1. API implementation converts RESTful API designs into working backend endpoints.
2. FastAPI handles routing, validation, documentation, and response generation.
3. SQLAlchemy provides database models and database interaction.
4. Pydantic schemas validate requests and responses.
5. Database sessions can be supplied through FastAPI dependency injection.
6. CRUD endpoints map naturally to HTTP methods.
7. Collection endpoints can support filtering and search.
8. Pagination helps APIs handle large datasets.
9. Nested endpoints are useful for related resources such as student enrollments.
10. `404` should be used when requested resources do not exist.
11. `409` can represent duplicate-resource conflicts.
12. `422` is used for validation failures generated by FastAPI/Pydantic.
13. Successful resource creation uses `201 Created`.
14. Successful deletion can use `204 No Content`.
15. Swagger UI provides automatically generated interactive documentation.
16. APIs should be tested thoroughly before deployment.

---

# 35. Lab Exercises

## Exercise 1 — Complete Student CRUD API

Implement all student CRUD operations:

```text
POST   /students
GET    /students
GET    /students/{student_id}
PUT    /students/{student_id}
DELETE /students/{student_id}
```

Verify:

- Creation
- Retrieval
- Updating
- Deletion
- Error behavior

---

## Exercise 2 — Student Filtering

Add filtering to:

```text
GET /students
```

Support:

- Branch
- Department
- Name/email search

Example:

```text
/students?branch=CSE
```

Example:

```text
/students?department_id=1
```

Example:

```text
/students?search=aarav
```

---

## Exercise 3 — Pagination

Implement:

```text
page
limit
```

Return:

```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "limit": 10,
  "total_pages": 0
}
```

---

## Exercise 4 — Course Creation

Implement:

```text
POST /courses
```

Test the endpoint using Postman.

Verify:

- Successful creation
- Validation errors
- Duplicate-resource handling

---

## Exercise 5 — Student Enrollment Endpoints

Implement nested routes:

```text
GET /students/{student_id}/enrollments
```

```text
POST /students/{student_id}/enrollments
```

```text
DELETE /students/{student_id}/enrollments/{course_id}
```

Test:

- Missing student
- Missing course
- Duplicate enrollment
- Successful enrollment
- Successful deletion

---

## Exercise 6 — Error Handling

Ensure endpoints correctly handle:

```text
404 Not Found
409 Conflict
422 Unprocessable Entity
```

Test both successful and unsuccessful requests.

---

## Exercise 7 — API Documentation

Run the FastAPI application and open:

```text
http://localhost:8000/docs
```

Use Swagger UI to:

- Inspect endpoint definitions
- Review request schemas
- Test API operations
- Inspect response codes
- Verify validation

---

# 36. Suggested GitHub Project Structure

```text
student_api/
├── main.py
├── database.py
├── models.py
├── schemas.py
├── requirements.txt
├── .env
├── .gitignore
└── README.md
```

A `.gitignore` can exclude files such as:

```gitignore
__pycache__/
*.pyc
.env
venv/
.venv/
students.db
```

---

# 37. Summary

A FastAPI RESTful API combines several layers:

```text
FastAPI
   ↓
Routes / Endpoints
   ↓
Pydantic Schemas
   ↓
Business Logic
   ↓
SQLAlchemy ORM
   ↓
Database
```

The Student Management API demonstrates:

- Database configuration
- SQLAlchemy models
- Pydantic schemas
- CRUD operations
- Filtering
- Search
- Pagination
- Nested resources
- Error handling
- API testing
- Automatic documentation

---

# Conclusion

Implementing a RESTful API requires more than creating routes. A reliable backend must validate requests, perform database operations, handle missing or conflicting resources, format responses, and return meaningful HTTP status codes.

FastAPI provides routing, dependency injection, automatic validation, type checking, and interactive documentation. Pydantic defines clear request and response contracts, while SQLAlchemy manages persistence and relationships.

The overall implementation pattern is:

```text
Request
   ↓
Validate
   ↓
Process
   ↓
Query / Modify Database
   ↓
Handle Errors
   ↓
Format Response
   ↓
Return Correct HTTP Status
```

Following this structure produces APIs that are easier to understand, test, maintain, and integrate with frontend applications.
