# Lecture 15 — Data Modeling: Designing Models for Applications

**Course:** Backend Development  
**Unit:** Unit 2 — Database Management  
**Lecture:** 15  
**Topic:** Data Modeling: Designing Models for Applications  
**Course Outcome:** CO2 — Design data models that translate business requirements into database structures.

---

## 1. Introduction

Data modeling is the process of designing how data will be organized, stored, related, and validated in an application.

A data model acts as a **blueprint** between business requirements, application code, and the database.

In the previous lecture, ER diagrams and normalization were studied. In this lecture, the focus is on converting those database designs into models that can be used directly by backend applications.

### Learning Objectives

After studying this lecture, we understand:

- Different levels of data modeling.
- How business requirements are converted into data models.
- Object-Relational Mapping (ORM).
- Object-Document Modeling (ODM).
- SQLAlchemy in Python.
- Mongoose in Node.js.
- CRUD operations through models.
- Data validation.
- Data modeling best practices.

---

# 2. Levels of Data Modeling

Data modeling is generally divided into three levels:

1. Conceptual Data Model
2. Logical Data Model
3. Physical Data Model

---

## 2.1 Conceptual Data Model

The conceptual model provides a **high-level view** of the system.

It focuses on:

- Main entities.
- Relationships between entities.
- Important business concepts.

It does not focus on database-specific implementation details.

### Example

For a Student Management System:

```text
Student ---- Enrolls ----> Course
Faculty ---- Teaches ----> Course
Student ---- Belongs To --> Department
```

### Purpose

The conceptual model is mainly used to:

- Understand business requirements.
- Communicate with stakeholders.
- Identify entities and relationships.

---

## 2.2 Logical Data Model

The logical model adds more detail to the conceptual model.

It defines:

- Attributes.
- Data types.
- Primary keys.
- Foreign keys.
- Constraints.

It is still independent of a particular database system.

### Example

```text
Student
--------------------------------
id               INTEGER PRIMARY KEY
name             VARCHAR(100) NOT NULL
email            VARCHAR(100) UNIQUE NOT NULL
branch           VARCHAR(50)
enrollment_date  DATE
```

### Purpose

The logical model provides a detailed design before actual implementation.

---

## 2.3 Physical Data Model

The physical model converts the logical design into an actual database implementation.

It contains:

- Actual tables.
- Columns.
- Indexes.
- Constraints.
- Database-specific optimizations.
- Storage-related decisions.

### Example

```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    branch VARCHAR(50),
    enrollment_date DATE DEFAULT CURRENT_DATE
);

CREATE INDEX idx_students_branch
ON students(branch);
```

### Simple Difference

| Model | Main Purpose |
|---|---|
| Conceptual | What data exists? |
| Logical | What are the details of the data? |
| Physical | How will the database actually store it? |

---

# 3. Translating Business Requirements to Data Models

Business requirements describe what the application needs to do.

These requirements must be converted into a structured data model.

## Process

### Step 1 — Identify Entities

Ask:

> What objects does the system manage?

Example:

- Student
- Course
- Faculty
- Department
- Enrollment

### Step 2 — Identify Attributes

Identify properties of each entity.

Example:

```text
Student:
id
name
email
phone
branch
enrollment_date
```

### Step 3 — Identify Relationships

Determine how entities are connected.

Example:

```text
Department 1:M Student
Department 1:M Faculty
Department 1:M Course
Student M:N Course
```

### Step 4 — Define Constraints

Examples:

- Email must be unique.
- Required fields cannot be empty.
- Course credits should be within the allowed range.
- Grade should contain only valid values.

### Step 5 — Choose Data Types

Examples:

```text
id       → INTEGER
name     → VARCHAR
email    → VARCHAR
date     → DATE
```

### Step 6 — Create the Model

The final model can be represented using:

- ER diagrams.
- SQL tables.
- ORM classes.
- ODM schemas.

---

# 4. Object-Relational Mapping (ORM)

ORM stands for **Object-Relational Mapping**.

ORM allows developers to work with database tables using programming-language objects instead of writing raw SQL for every operation.

### Simple Explanation

Without ORM:

```sql
SELECT * FROM students;
```

With ORM:

```python
students = session.query(Student).all()
```

The ORM converts programming-language operations into appropriate database operations.

## Advantages of ORM

- Less raw SQL.
- Easier database interaction.
- Object-oriented programming.
- Automatic SQL generation.
- Relationship handling.
- Reusable models.
- Easier application development.

---

# 5. SQLAlchemy

SQLAlchemy is a popular ORM framework for Python.

It allows Python classes to represent database tables.

### Installation

```bash
pip install sqlalchemy
```

### Basic Structure

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base

engine = create_engine("sqlite:///students.db")

Base = declarative_base()
```

A Python class can then represent a database table.

Example:

```python
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
```

Here:

- `Student` is the Python class.
- `students` is the database table.
- `id` is the primary key.
- `email` is unique and required.

---

# 6. CRUD Operations

CRUD represents the four basic database operations.

| Operation | Meaning |
|---|---|
| C — Create | Add new data |
| R — Read | Retrieve data |
| U — Update | Modify existing data |
| D — Delete | Remove data |

### Create

```python
student = Student(
    name="Aarav",
    email="aarav@example.com"
)

session.add(student)
session.commit()
```

### Read

```python
students = session.query(Student).all()
```

### Update

```python
student.branch = "ECE"
session.commit()
```

### Delete

```python
session.delete(student)
session.commit()
```

CRUD is one of the most important operations in backend database applications.

---

# 7. Object-Document Modeling (ODM)

ODM stands for **Object-Document Modeling**.

ODM is commonly used with document databases such as MongoDB.

Instead of mapping objects to relational tables, ODM maps application objects to documents.

### ORM vs ODM

| ORM | ODM |
|---|---|
| Works mainly with relational databases | Works mainly with document databases |
| Maps objects to tables | Maps objects to documents |
| Example: SQLAlchemy | Example: Mongoose |
| SQL databases | MongoDB |

---

# 8. Mongoose

Mongoose is a popular ODM library for Node.js and MongoDB.

### Installation

```bash
npm install mongoose
```

### MongoDB Connection

```javascript
const mongoose = require("mongoose");

mongoose.connect(
    "mongodb://127.0.0.1:27017/blog_database"
);
```

### Schema Example

```javascript
const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    branch: {
        type: String,
        enum: ["CSE", "ECE", "IT", "ME", "CE"]
    }

});
```

A schema defines:

- Fields.
- Data types.
- Required fields.
- Allowed values.
- Validation rules.

---

# 9. Data Model Validation

Validation checks data before it is stored.

It prevents invalid or incorrect data from entering the database.

### Why Validation Is Important

Without validation, an application could store:

```text
Invalid email
Empty name
Invalid branch
Invalid category
Incorrect age
```

Validation improves:

- Data accuracy.
- Data consistency.
- Database integrity.
- Application reliability.

---

# 10. Pydantic Validation

Pydantic is commonly used with FastAPI for validating incoming request data.

Example:

```python
from pydantic import BaseModel, EmailStr, Field

class StudentCreate(BaseModel):

    name: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    email: EmailStr

    branch: str = Field(
        ...,
        pattern=r"^(CSE|ECE|IT|ME|CE)$"
    )
```

This validates:

- Name length.
- Email format.
- Branch value.

Invalid data can be rejected before the application processes it.

---

# 11. Mongoose Validation

Mongoose provides built-in validation.

Example:

```javascript
const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [1, "Name cannot be empty"],
        maxlength: [100, "Name cannot exceed 100 characters"]
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [
            /^\S+@\S+\.\S+$/,
            "Invalid email format"
        ]
    },

    age: {
        type: Number,
        min: [17, "Minimum age is 17"],
        max: [30, "Maximum age is 30"]
    }

});
```

This ensures that invalid values are detected.

---

# 12. Common Validation Rules

### Required

```javascript
required: true
```

The field cannot be missing.

### Minimum Length

```javascript
minlength: 3
```

The value must contain at least 3 characters.

### Maximum Length

```javascript
maxlength: 100
```

The value cannot exceed 100 characters.

### Unique

```javascript
unique: true
```

The value should be unique.

### Enum

```javascript
enum: ["CSE", "ECE", "IT"]
```

Only the specified values are accepted.

### Range

```javascript
min: 17,
max: 30
```

The value must remain within the specified range.

---

# 13. Data Modeling Best Practices

## 13.1 Start With Requirements

Understand the business requirements before designing the database.

## 13.2 Use Meaningful Names

Good:

```text
enrollment_date
```

Poor:

```text
ed
```

## 13.3 Normalize Appropriately

Normalization reduces unnecessary duplication.

However, excessive normalization can sometimes affect performance.

## 13.4 Add Timestamps

Useful fields include:

```text
created_at
updated_at
```

They help track changes.

## 13.5 Use Enums for Fixed Values

Example:

```text
CSE
ECE
IT
ME
CE
```

This prevents unexpected values.

## 13.6 Use Indexes

Frequently searched fields can be indexed to improve query performance.

Example:

```sql
CREATE INDEX idx_students_branch
ON students(branch);
```

## 13.7 Plan for Scale

The model should be able to support future increases in:

- Users.
- Records.
- Transactions.
- Queries.

## 13.8 Document Models

Clear documentation helps developers understand and maintain the application.

---

# 14. Practical Evidence / Screenshots

The following screenshot provides evidence of the validation implementation associated with the Lecture 15 concepts.

### Mongoose Validation Testing

The implementation demonstrates:

- Required-field validation.
- Length validation.
- Enum validation.
- Unique constraint testing.
- Valid data acceptance.
- Comment validation.

![Mongoose Validation Testing](screenshots/task5-validation.png)

---

# 15. ORM and ODM Comparison

| Feature | ORM | ODM |
|---|---|---|
| Full Form | Object-Relational Mapping | Object-Document Modeling |
| Database Type | Relational | Document |
| Structure | Tables and rows | Documents and collections |
| Example | SQLAlchemy | Mongoose |
| Language Example | Python | JavaScript/Node.js |
| Main Database Example | SQLite/PostgreSQL | MongoDB |

---

# 16. Conceptual Flow

```text
Business Requirements
        |
        v
Identify Entities
        |
        v
Identify Attributes
        |
        v
Identify Relationships
        |
        v
Define Constraints
        |
        v
Create Data Model
        |
        +----------------------+
        |                      |
        v                      v
      ORM                    ODM
        |                      |
        v                      v
 SQLAlchemy                Mongoose
        |                      |
        v                      v
Relational DB             MongoDB
```

---

# 17. Key Takeaways

1. Data modeling provides a blueprint for application data.
2. Data modeling has three levels:
   - Conceptual
   - Logical
   - Physical
3. Business requirements must be converted into entities, attributes, relationships, and constraints.
4. ORM maps application objects to relational database tables.
5. SQLAlchemy is a popular Python ORM.
6. ODM maps application objects to document databases.
7. Mongoose is a popular Node.js ODM for MongoDB.
8. CRUD means Create, Read, Update, and Delete.
9. Validation prevents invalid data from being stored.
10. Good data models should be clear, maintainable, scalable, and properly documented.

---

# 18. Conclusion

Data modeling is an important part of backend development because it connects business requirements with actual database implementation.

Conceptual, logical, and physical models help developers progressively move from a high-level idea to a working database design.

ORM frameworks such as SQLAlchemy make relational database interaction easier in Python, while ODM frameworks such as Mongoose provide structured interaction with MongoDB.

Validation further improves data quality by preventing invalid information from entering the database.

Therefore, a well-designed data model helps create backend applications that are reliable, maintainable, and scalable.

---

## References

1. Lecture 15 — Data Modeling: Designing Models for Applications, Backend Development, Unit 2.
2. SQLAlchemy documentation — ORM and database modeling concepts.
3. Mongoose documentation — Schemas, Models, and Validation.
4. Pydantic documentation — Data validation and parsing.
