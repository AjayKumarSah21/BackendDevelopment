# Data Modeling: Designing Models for Applications

## Lecture Information

- **Lecture:** 15
- **Unit:** Unit 2 — Database Management
- **Topic:** Data Modeling: Designing Models for Applications
- **Course Outcome:** CO2 — Design data models that translate business requirements into database structures.
- **Bloom's Knowledge Level:** Create
- **Skills Developed:** Conceptual, logical, and physical modeling; ORM/ODM implementation; data validation
- **Applications:** Application data structures, database interaction, and schema mapping
- **PBL Activity:** Modeling an E-Commerce system and implementing SQLAlchemy/Mongoose models
- **Assessment:** Coding project and data-model design demonstration

---

## 1. Introduction

A database schema defines how information is stored, but backend applications also need a structured way to interact with that information programmatically.

**Data modeling** bridges business requirements and database implementation by defining:

- How data is structured
- How data is stored
- How entities relate to one another
- What rules apply to the data
- How application code accesses the data

A **data model** is a conceptual representation of data structures, relationships, and rules. It acts as a blueprint for both database design and application code.

### Learning Objectives

By the end of this topic, you should understand:

- Conceptual, logical, and physical data models
- How to translate business requirements into data models
- Object-Relational Mapping (ORM)
- Object Document Modeling (ODM)
- SQLAlchemy for Python applications
- Mongoose for Node.js applications
- Data validation using Pydantic and Mongoose

---

# 2. Levels of Data Modeling

Data modeling occurs at three major levels:

```text
Conceptual Model
      ↓
Logical Model
      ↓
Physical Model
```

Each level adds more implementation detail.

---

## 2.1 Conceptual Data Model

The **conceptual data model** gives a high-level view of the system.

It identifies major entities and relationships without focusing on database implementation details.

### Purpose

- Understand business requirements
- Communicate with stakeholders
- Identify important entities
- Identify relationships between entities

### Components

Examples of entities:

- Student
- Course
- Faculty
- Department

Examples of relationships:

- Enrolls
- Teaches
- BelongsTo

Examples of attributes:

- Name
- Email
- Branch

### Example

```text
Student ──Enrolls──> Course

Faculty ──Teaches──> Course

Student ──BelongsTo──> Department
```

At this stage, implementation-specific details such as SQL column types are not required.

---

## 2.2 Logical Data Model

The **logical data model** adds details to the conceptual model while remaining independent of a specific database system.

### Purpose

Create a detailed database design before implementation.

### Components

- Entities
- Attributes
- Data types
- Primary keys
- Foreign keys
- Constraints

### Example

```text
Student (
    id: INTEGER PRIMARY KEY,
    name: VARCHAR(100) NOT NULL,
    email: VARCHAR(100) UNIQUE NOT NULL,
    branch: VARCHAR(50),
    enrollment_date: DATE
)
```

This model defines what the data should look like but does not yet depend on a specific DBMS.

---

## 2.3 Physical Data Model

The **physical data model** converts the logical design into actual database structures for a particular DBMS.

### Purpose

Implement the design in a specific database system.

### Components

- Actual table definitions
- Database-specific data types
- Indexes
- Constraints
- Storage details
- Partitioning strategies
- Performance optimizations

### PostgreSQL Example

```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    branch VARCHAR(50),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_branch
ON students(branch);
```

---

## 2.4 Comparison of Data Modeling Levels

| Level | Main Purpose | Typical Details |
|---|---|---|
| Conceptual | Understand the business domain | Entities and relationships |
| Logical | Design the data structure | Attributes, types, PKs, FKs, constraints |
| Physical | Implement in a DBMS | Tables, indexes, DB-specific optimizations |

---

# 3. Translating Business Requirements into Data Models

## 3.1 General Process

A useful modeling process is:

1. **Identify entities** — What objects does the system manage?
2. **Identify attributes** — What properties belong to each entity?
3. **Identify relationships** — How do the entities interact?
4. **Define constraints** — What rules must the data follow?
5. **Choose data types** — What format should each value use?
6. **Create the model** — Document the design using diagrams or code.

---

## 3.2 Student Management System Example

### Business Requirements

Suppose the application must support these requirements:

- Students enroll in courses.
- Courses are taught by faculty.
- Each course belongs to a department.
- Students receive grades for enrolled courses.

### Step 1 — Identify Entities

```text
Student
Course
Faculty
Department
Enrollment
```

### Step 2 — Identify Attributes

**Student**

```text
id
name
email
phone
branch
enrollment_date
```

**Course**

```text
id
title
credits
department_id
```

**Faculty**

```text
id
name
email
department_id
designation
```

**Department**

```text
id
name
building
```

**Enrollment**

```text
student_id
course_id
semester
grade
```

### Step 3 — Identify Relationships

```text
Department 1:M Student

Department 1:M Faculty

Department 1:M Course

Faculty 1:M Course

Student M:N Course
      through
    Enrollment
```

The `Enrollment` entity resolves the many-to-many relationship between students and courses.

### Step 4 — Define Constraints

Examples from the model:

- Student email must be unique.
- Course credits must be between 1 and 6.
- Grade must be one of:
  - A+
  - A
  - B+
  - B
  - C+
  - C
  - D
  - F
  - `NULL`
- Enrollment date cannot be in the future.

---

# 4. Object-Relational Mapping (ORM)

**Object-Relational Mapping (ORM)** maps programming-language objects to relational database tables.

Instead of manually writing SQL for every operation, developers work with objects. The ORM translates those operations into database queries.

### Benefits

- Write database operations in the programming language
- Automatic SQL generation
- Built-in type handling and validation support
- Database abstraction
- Relationship handling
- Lazy and eager loading support

---

# 4.1 SQLAlchemy with Python

SQLAlchemy is a Python ORM used to interact with relational databases.

## Installation

```bash
pip install sqlalchemy
```

---

## Database Setup

```python
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Date,
    ForeignKey
)

from sqlalchemy.orm import (
    declarative_base,
    sessionmaker,
    relationship
)

engine = create_engine(
    "sqlite:///students.db"
)

Base = declarative_base()

Session = sessionmaker(
    bind=engine
)

session = Session()
```

---

## Department Model

```python
class Department(Base):
    __tablename__ = "departments"

    id = Column(
        Integer,
        primary_key=True
    )

    name = Column(
        String(100),
        unique=True,
        nullable=False
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

## Student Model

```python
class Student(Base):
    __tablename__ = "students"

    id = Column(
        Integer,
        primary_key=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(100),
        unique=True,
        nullable=False
    )

    branch = Column(
        String(50)
    )

    enrollment_date = Column(
        Date
    )

    department_id = Column(
        Integer,
        ForeignKey("departments.id")
    )

    department = relationship(
        "Department",
        back_populates="students"
    )

    enrollments = relationship(
        "Enrollment",
        back_populates="student"
    )
```

---

## Course Model

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

## Enrollment Model

```python
class Enrollment(Base):
    __tablename__ = "enrollments"

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        primary_key=True
    )

    course_id = Column(
        String(10),
        ForeignKey("courses.id"),
        primary_key=True
    )

    semester = Column(
        String(20)
    )

    grade = Column(
        String(2)
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

## Creating the Tables

```python
Base.metadata.create_all(engine)
```

---

## Understanding `back_populates`

`back_populates` creates a bidirectional relationship between SQLAlchemy models.

For example:

```python
student.department
```

can access the student's department, while:

```python
department.students
```

can access students associated with that department.

This allows related objects to be navigated naturally from application code.

---

# 4.2 CRUD Operations with SQLAlchemy

CRUD means:

```text
C → Create
R → Read
U → Update
D → Delete
```

---

## Create

```python
from datetime import date

new_student = Student(
    name="Aarav",
    email="Aarav@upes.ac.in",
    branch="CSE",
    enrollment_date=date(
        2024,
        8,
        1
    ),
    department_id=1
)

session.add(new_student)

session.commit()
```

`session.commit()` is important because it persists the changes to the database.

---

## Read

Retrieve all CSE students:

```python
students = (
    session
    .query(Student)
    .filter(
        Student.branch == "CSE"
    )
    .all()
)
```

Retrieve a student by ID:

```python
student = (
    session
    .query(Student)
    .filter_by(id=1)
    .first()
)
```

---

## Update

```python
if student:
    student.branch = "ECE"

    session.commit()
```

The Python object is modified and the transaction is committed to persist the change.

---

## Delete

```python
student_to_delete = (
    session
    .query(Student)
    .filter_by(name="Aarav")
    .first()
)

if student_to_delete:
    session.delete(
        student_to_delete
    )

    session.commit()
```

---

# 5. Object Document Modeling (ODM)

Relational databases organize data into tables. Document databases such as MongoDB store documents.

**Object Document Modeling (ODM)** maps application objects to document structures.

For Node.js and MongoDB, this lecture uses **Mongoose**.

---

# 5.1 Mongoose with Node.js

## Installation

```bash
npm install mongoose
```

## Connect to MongoDB

```js
const mongoose = require('mongoose');

mongoose.connect(
  'mongodb://localhost/student_management'
);
```

---

## Student Schema

```js
const studentSchema =
  new mongoose.Schema({

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    branch: {
      type: String,
      enum: [
        'CSE',
        'ECE',
        'IT',
        'ME',
        'CE'
      ]
    },

    enrollmentDate: {
      type: Date,
      default: Date.now
    },

    courses: [{
      type:
        mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }]
  });
```

Create the model:

```js
const Student =
  mongoose.model(
    'Student',
    studentSchema
  );
```

---

# 5.2 CRUD with Mongoose

## Create

```js
async function createStudent() {

  const student =
    new Student({
      name: 'Aarav',
      email:
        'aarav@upes.ac.in',
      branch: 'CSE',
      courses: [
        'courseId1',
        'courseId2'
      ]
    });

  await student.save();
}
```

---

## Read

```js
async function findStudents() {

  const cseStudents =
    await Student.find({
      branch: 'CSE'
    });

  const student =
    await Student.findById(
      'studentId'
    );
}
```

---

## Update

```js
async function updateStudent() {

  await Student.findByIdAndUpdate(
    'studentId',
    {
      branch: 'ECE'
    }
  );
}
```

---

## Delete

```js
async function deleteStudent() {

  await Student.findByIdAndDelete(
    'studentId'
  );
}
```

---

# 6. ORM vs ODM

| Feature | ORM | ODM |
|---|---|---|
| Meaning | Object-Relational Mapping | Object Document Modeling |
| Database style | Relational | Document |
| Data structure | Tables and rows | Documents |
| Example database | SQLite, PostgreSQL, MySQL | MongoDB |
| Example framework | SQLAlchemy | Mongoose |
| Application mapping | Objects ↔ Tables | Objects ↔ Documents |

---

# 7. Data Model Validation

Data should be validated before it is stored.

Validation helps:

- Prevent invalid data
- Maintain consistency
- Enforce application rules
- Reduce database corruption
- Produce predictable application behavior

The lecture demonstrates validation using:

- **Pydantic** with FastAPI
- **Mongoose schema validation** with Node.js

---

# 7.1 Validation with Pydantic

Pydantic validates incoming request data in FastAPI applications.

## Imports

```python
from fastapi import FastAPI

from pydantic import (
    BaseModel,
    EmailStr,
    Field
)

from typing import Optional
from datetime import date

app = FastAPI()
```

---

## Student Input Model

```python
class StudentCreate(BaseModel):

    name: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    email: EmailStr

    branch: str = Field(
        ...,
        pattern=(
            r"^(CSE|ECE|IT|ME|CE)$"
        )
    )

    enrollment_date:
        Optional[date] = None
```

The rules ensure:

- Name is required.
- Name is between 1 and 100 characters.
- Email follows a valid email format.
- Branch is one of the allowed values.
- Enrollment date is optional.

---

## Student Response Model

```python
class StudentResponse(BaseModel):
    id: int
    name: str
    email: str
    branch: str
    enrollment_date: date
```

---

## Example Student Object

```python
class Student:
    _id = 0

    def __init__(
        self,
        name: str,
        email: EmailStr,
        branch: str,
        enrollment_date:
            Optional[date]
    ):
        Student._id += 1

        self.id = Student._id
        self.name = name
        self.email = email
        self.branch = branch

        self.enrollment_date = (
            enrollment_date
            or date.today()
        )
```

---

## FastAPI Create Endpoint

```python
@app.post(
    "/students",
    response_model=StudentResponse,
    status_code=201
)
def create_student(
    student: StudentCreate
):

    student_data =
        student.model_dump()

    db_student =
        Student(**student_data)

    return db_student
```

Before the endpoint logic runs, Pydantic validates the incoming request.

---

## Testing with JavaScript `fetch()`

```js
fetch(
  "http://127.0.0.1:8000/students",
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json"
    },

    body: JSON.stringify({
      name: "Rahul",
      email:
        "rahul@example.com",
      branch: "CSE",
      enrollment_date:
        "2026-09-29"
    })
  }
)
.then(response =>
  response.json()
)
.then(data =>
  console.log(data)
)
.catch(error =>
  console.error(
    "Error:",
    error
  )
);
```

Example successful response:

```json
{
  "id": 1,
  "name": "Rahul",
  "email": "rahul@example.com",
  "branch": "CSE",
  "enrollment_date": "2026-09-29"
}
```

---

## Testing Invalid Data

```js
fetch(
  "http://127.0.0.1:8000/students",
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json"
    },

    body: JSON.stringify({
      name: "",
      email: "invalid-email",
      branch: "BCA",
      enrollment_date:
        "invalid-date"
    })
  }
)
.then(response =>
  response.json()
)
.then(data =>
  console.log(data)
);
```

This should result in validation errors because the submitted data violates the Pydantic model.

The endpoint can also be tested with tools such as Postman or Insomnia.

---

# 7.2 Validation with Mongoose

Mongoose provides validation rules directly inside schemas.

```js
const studentSchema =
  new mongoose.Schema({

    name: {
      type: String,

      required: [
        true,
        'Name is required'
      ],

      minlength: [
        1,
        'Name cannot be empty'
      ],

      maxlength: [
        100,
        'Name cannot exceed 100 characters'
      ]
    },

    email: {
      type: String,

      required: [
        true,
        'Email is required'
      ],

      unique: true,

      match: [
        /^\S+@\S+\.\S+$/,
        'Invalid email format'
      ]
    },

    age: {
      type: Number,

      min: [
        17,
        'Minimum age is 17'
      ],

      max: [
        30,
        'Maximum age is 30'
      ]
    }
  });
```

This schema demonstrates:

- Required fields
- Minimum length
- Maximum length
- Unique values
- Pattern matching
- Numeric ranges

---

# 8. Data Modeling Best Practices

| Practice | Description |
|---|---|
| Start with requirements | Understand business needs before designing models |
| Use meaningful names | Prefer names such as `enrollment_date` instead of unclear abbreviations |
| Normalize appropriately | Reduce unnecessary duplication without over-normalizing |
| Add timestamps | Use creation/update timestamps for auditing |
| Use enums for fixed values | Useful for branch, status, and grade fields |
| Index frequently queried fields | Improve query performance |
| Plan for scale | Consider future data growth |
| Document models | Improve team collaboration and maintainability |

---

## 8.1 Start with Requirements

Do not begin by immediately creating database tables.

First understand:

- What the application must do
- What data must be stored
- Which entities exist
- How entities relate
- Which business rules apply

---

## 8.2 Use Meaningful Names

Good:

```text
enrollment_date
```

Poor:

```text
ed
```

Names should make the model understandable without requiring unnecessary explanation.

---

## 8.3 Normalize Appropriately

Normalization helps avoid duplicated data and update anomalies.

However, over-normalization can make queries unnecessarily complex and may affect performance.

---

## 8.4 Add Timestamps

Useful fields include:

```text
created_at
updated_at
```

They help with auditing and tracking changes.

---

## 8.5 Use Enums for Fixed Values

Enums are useful when a field has a controlled set of values.

Examples:

```text
branch
status
grade
```

---

## 8.6 Index Frequently Queried Fields

Indexes can improve performance when applications frequently search or filter by particular fields.

Example:

```sql
CREATE INDEX idx_students_branch
ON students(branch);
```

---

## 8.7 Plan for Scale

Consider future growth when designing:

- Relationships
- Indexes
- Data types
- Query patterns
- Storage requirements

---

## 8.8 Document the Models

Clear model documentation helps developers understand:

- Entities
- Attributes
- Relationships
- Constraints
- Validation rules

Good models should be understandable and maintainable by a team.

---

# 9. Complete Modeling Workflow

A practical workflow can be summarized as:

```text
Business Requirements
        ↓
Identify Entities
        ↓
Identify Attributes
        ↓
Define Relationships
        ↓
Define Constraints
        ↓
Conceptual Model
        ↓
Logical Model
        ↓
Physical Model
        ↓
ORM / ODM Models
        ↓
Validation
        ↓
CRUD Operations
        ↓
Application
```

---

# 10. Key Takeaways

1. Data modeling translates business requirements into structured database designs.
2. A data model defines data structures, relationships, and rules.
3. Data modeling has three levels: **conceptual, logical, and physical**.
4. Conceptual models focus on entities and relationships.
5. Logical models add attributes, keys, data types, and constraints.
6. Physical models implement the design in a specific DBMS.
7. ORM maps programming-language objects to relational database tables.
8. ODM maps application objects to document database structures.
9. SQLAlchemy is used in Python for ORM-based database interaction.
10. Mongoose provides ODM functionality for MongoDB and Node.js.
11. CRUD operations are Create, Read, Update, and Delete.
12. Pydantic can validate FastAPI request data.
13. Mongoose schemas can enforce validation rules.
14. Validation prevents invalid data from entering the application/database.
15. Models should be designed before application code is written.
16. Good data models should support future growth and remain understandable.

---

# 11. Lab Exercises

## Exercise 1 — E-Commerce Conceptual Model

Design a conceptual data model for an E-Commerce system containing:

```text
Product
Order
Customer
Cart
```

Identify:

- Important attributes
- Relationships
- Cardinalities

Example starting point:

```text
Customer ──Has──> Cart

Customer ──Places──> Order

Order ──Contains──> Product

Cart ──Contains──> Product
```

---

## Exercise 2 — Student Management with SQLAlchemy

Create SQLAlchemy models for:

```text
Student
Department
Course
Enrollment
```

Add appropriate:

- Primary keys
- Foreign keys
- Relationships
- Constraints

---

## Exercise 3 — SQLAlchemy CRUD

Implement the following operations:

### Create

Create a new student and assign the student to a department.

### Read

Retrieve all students belonging to a specific branch.

### Update

Update a student's branch.

### Delete

Delete a student and verify the intended relationship/cascade behavior.

---

## Exercise 4 — Blog Application with Mongoose

Create Mongoose schemas for:

```text
Post
Comment
```

Possible relationship:

```text
Post
  |
  └── Has Many ──> Comments
```

Add fields suitable for a blog application.

---

## Exercise 5 — Validation

Add validation rules to your models.

Include:

- Required fields
- Unique constraints
- Enum values
- String-length restrictions
- Format validation where required

---

# 12. Summary

Data modeling connects business requirements with database and application design.

The three levels of modeling provide a progression from high-level ideas to implementation:

```text
Conceptual → Logical → Physical
```

ORM and ODM frameworks allow developers to work with application objects instead of directly handling every database operation at a lower level.

The main technologies demonstrated are:

```text
Python + SQLAlchemy → ORM → Relational Database

Node.js + Mongoose → ODM → MongoDB

FastAPI + Pydantic → Request/Data Validation
```

Validation is an essential part of a reliable data model because it prevents invalid values from entering the application.

---

# Conclusion

Effective backend development requires more than simply creating database tables. A well-designed data model begins with business requirements, identifies entities and relationships, defines constraints, and gradually evolves into a physical implementation.

SQLAlchemy demonstrates how relational database structures can be represented as Python objects, while Mongoose demonstrates how MongoDB documents can be modeled in Node.js. Pydantic and Mongoose validation rules help enforce data integrity before values are stored.

A strong data-modeling process therefore follows a clear path:

```text
Understand Requirements
        ↓
Design the Model
        ↓
Define Relationships
        ↓
Apply Constraints
        ↓
Implement with ORM / ODM
        ↓
Validate Data
        ↓
Perform CRUD Operations
```

Designing these models before writing the rest of the application provides a stronger foundation for maintainable and scalable backend systems.
