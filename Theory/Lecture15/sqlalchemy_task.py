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

from datetime import date


# =========================================
# DATABASE CONNECTION
# =========================================

engine = create_engine("sqlite:///students.db")

Base = declarative_base()

Session = sessionmaker(bind=engine)

session = Session()


# =========================================
# DEPARTMENT MODEL
# =========================================

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


# =========================================
# STUDENT MODEL
# =========================================

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


# =========================================
# COURSE MODEL
# =========================================

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


# =========================================
# ENROLLMENT MODEL
# =========================================

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


# =========================================
# CREATE DATABASE TABLES
# =========================================

Base.metadata.create_all(engine)

print("All tables created successfully!")

# =========================================
# CREATE - ADD STUDENT
# =========================================

print("\n===== CREATE =====")

# Create a department
department = Department(
    name="Computer Science"
)

session.add(department)
session.commit()

print("Department created successfully.")


# Create a student
new_student = Student(
    name="Ajay",
    email="ajay@example.com",
    branch="CSE",
    enrollment_date=date.today(),
    department_id=department.id
)

session.add(new_student)
session.commit()

print("Student created successfully!")
print("Student Name:", new_student.name)
print("Student Email:", new_student.email)
print("Student Branch:", new_student.branch)

# =========================================
# READ - GET CSE STUDENTS
# =========================================

print("\n===== READ =====")

students = session.query(Student).filter(
    Student.branch == "CSE"
).all()

print("Students in CSE branch:")

for student in students:
    print(
        student.id,
        student.name,
        student.email,
        student.branch
    )

# =========================================
# UPDATE - CHANGE STUDENT BRANCH
# =========================================

print("\n===== UPDATE =====")

student = session.query(Student).filter_by(
    email="ajay@example.com"
).first()

if student:

    student.branch = "ECE"

    session.commit()

    print("Student updated successfully!")
    print("Student Name:", student.name)
    print("New Branch:", student.branch)

else:

    print("Student not found!")

# =========================================
# DELETE - DELETE STUDENT
# =========================================

print("\n===== DELETE =====")

student_to_delete = session.query(Student).filter_by(
    email="ajay@example.com"
).first()

if student_to_delete:

    session.delete(student_to_delete)

    session.commit()

    print("Student deleted successfully!")

else:

    print("Student not found!")