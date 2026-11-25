from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

class BranchEnum(str, Enum):
    CSE = "CSE"
    ECE = "ECE"
    IT = "IT"
    ME = "ME"
    CE = "CE"

class DepartmentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
class DepartmentCreate(DepartmentBase): pass
class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class StudentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    branch: BranchEnum
class StudentCreate(StudentBase):
    department_id: Optional[int] = None
    enrollment_date: Optional[date] = None
class StudentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    branch: Optional[BranchEnum] = None
    department_id: Optional[int] = None
    enrollment_date: Optional[date] = None
class StudentResponse(StudentBase):
    id: int
    enrollment_date: Optional[date]
    department_id: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]
    model_config = ConfigDict(from_attributes=True)
class StudentListResponse(BaseModel):
    data: List[StudentResponse]
    total: int
    page: int
    limit: int
    total_pages: int

class CourseBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    credits: int = Field(..., ge=1, le=6)
class CourseCreate(CourseBase):
    id: str = Field(..., min_length=1, max_length=10)
    department_id: Optional[int] = None
class CourseUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    credits: Optional[int] = Field(None, ge=1, le=6)
    department_id: Optional[int] = None
class CourseResponse(CourseBase):
    id: str
    department_id: Optional[int]
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class EnrollmentCreate(BaseModel):
    course_id: str
    semester: str = Field(..., min_length=1, max_length=20)
    grade: Optional[str] = Field(None, max_length=2)
class EnrollmentResponse(BaseModel):
    student_id: int
    course_id: str
    semester: str
    grade: Optional[str]
    enrolled_at: datetime
    model_config = ConfigDict(from_attributes=True)
