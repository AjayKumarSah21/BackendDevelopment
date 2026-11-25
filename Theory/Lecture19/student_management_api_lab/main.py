from fastapi import FastAPI, HTTPException, Depends, Query, Response
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
import math
from database import engine, get_db, Base
from models import Student, Course, Department, Enrollment
from schemas import (StudentCreate, StudentUpdate, StudentResponse, StudentListResponse,
    CourseCreate, CourseUpdate, CourseResponse, DepartmentCreate, DepartmentResponse,
    EnrollmentCreate, EnrollmentResponse, BranchEnum)

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Student Management API", description="Complete CRUD API for students, departments, courses, and enrollments", version="1.0.0")

def department_or_404(db, department_id):
    if department_id is None: return None
    obj = db.query(Department).filter(Department.id == department_id).first()
    if not obj: raise HTTPException(404, "Department not found")
    return obj

def commit_or_conflict(db, message):
    try: db.commit()
    except IntegrityError:
        db.rollback(); raise HTTPException(409, message)

@app.get("/")
def root(): return {"message": "Student Management API", "docs": "/docs"}

@app.get("/departments", response_model=List[DepartmentResponse])
def list_departments(db: Session = Depends(get_db)): return db.query(Department).all()
@app.post("/departments", response_model=DepartmentResponse, status_code=201)
def create_department(payload: DepartmentCreate, db: Session = Depends(get_db)):
    obj = Department(**payload.model_dump()); db.add(obj); commit_or_conflict(db, "Department already exists"); db.refresh(obj); return obj
@app.get("/departments/{department_id}", response_model=DepartmentResponse)
def get_department(department_id: int, db: Session = Depends(get_db)):
    return department_or_404(db, department_id)
@app.put("/departments/{department_id}", response_model=DepartmentResponse)
def update_department(department_id: int, payload: DepartmentCreate, db: Session = Depends(get_db)):
    obj = department_or_404(db, department_id); obj.name = payload.name; commit_or_conflict(db, "Department already exists"); db.refresh(obj); return obj
@app.delete("/departments/{department_id}", status_code=204)
def delete_department(department_id: int, db: Session = Depends(get_db)):
    obj = department_or_404(db, department_id); db.delete(obj); db.commit(); return Response(status_code=204)

@app.get("/students", response_model=StudentListResponse)
def list_students(branch: Optional[BranchEnum]=Query(None), department_id: Optional[int]=Query(None), search: Optional[str]=Query(None), page:int=Query(1,ge=1), limit:int=Query(10,ge=1,le=100), db:Session=Depends(get_db)):
    query=db.query(Student)
    if branch: query=query.filter(Student.branch==branch.value)
    if department_id is not None: query=query.filter(Student.department_id==department_id)
    if search: query=query.filter((Student.name.ilike(f"%{search}%")) | (Student.email.ilike(f"%{search}%")))
    total=query.count(); total_pages=math.ceil(total/limit) if total else 0
    return {"data":query.offset((page-1)*limit).limit(limit).all(),"total":total,"page":page,"limit":limit,"total_pages":total_pages}
@app.post("/students", response_model=StudentResponse, status_code=201)
def create_student(payload: StudentCreate, db: Session=Depends(get_db)):
    department_or_404(db,payload.department_id)
    obj=Student(**payload.model_dump()); db.add(obj); commit_or_conflict(db,"Email already registered"); db.refresh(obj); return obj
@app.get("/students/{student_id}", response_model=StudentResponse)
def get_student(student_id:int, db:Session=Depends(get_db)):
    obj=db.query(Student).filter(Student.id==student_id).first()
    if not obj: raise HTTPException(404,"Student not found")
    return obj
@app.put("/students/{student_id}", response_model=StudentResponse)
def update_student(student_id:int,payload:StudentUpdate,db:Session=Depends(get_db)):
    obj=get_student(student_id,db); data=payload.model_dump(exclude_unset=True)
    if "department_id" in data: department_or_404(db,data["department_id"])
    for k,v in data.items(): setattr(obj,k,v)
    commit_or_conflict(db,"Email already registered"); db.refresh(obj); return obj
@app.delete("/students/{student_id}", status_code=204)
def delete_student(student_id:int,db:Session=Depends(get_db)):
    obj=get_student(student_id,db); db.delete(obj); db.commit(); return Response(status_code=204)

@app.get("/courses", response_model=List[CourseResponse])
def list_courses(department_id:Optional[int]=Query(None),credits:Optional[int]=Query(None,ge=1,le=6),db:Session=Depends(get_db)):
    q=db.query(Course)
    if department_id is not None:q=q.filter(Course.department_id==department_id)
    if credits is not None:q=q.filter(Course.credits==credits)
    return q.all()
@app.post("/courses", response_model=CourseResponse, status_code=201)
def create_course(payload:CourseCreate,db:Session=Depends(get_db)):
    department_or_404(db,payload.department_id); obj=Course(**payload.model_dump()); db.add(obj); commit_or_conflict(db,"Course already exists"); db.refresh(obj); return obj
@app.get("/courses/{course_id}", response_model=CourseResponse)
def get_course(course_id:str,db:Session=Depends(get_db)):
    obj=db.query(Course).filter(Course.id==course_id).first()
    if not obj: raise HTTPException(404,"Course not found")
    return obj
@app.put("/courses/{course_id}", response_model=CourseResponse)
def update_course(course_id:str,payload:CourseUpdate,db:Session=Depends(get_db)):
    obj=get_course(course_id,db); data=payload.model_dump(exclude_unset=True)
    if "department_id" in data: department_or_404(db,data["department_id"])
    for k,v in data.items(): setattr(obj,k,v)
    db.commit(); db.refresh(obj); return obj
@app.delete("/courses/{course_id}",status_code=204)
def delete_course(course_id:str,db:Session=Depends(get_db)):
    obj=get_course(course_id,db); db.delete(obj); db.commit(); return Response(status_code=204)

@app.get("/students/{student_id}/enrollments", response_model=List[EnrollmentResponse])
def list_enrollments(student_id:int,db:Session=Depends(get_db)):
    get_student(student_id,db); return db.query(Enrollment).filter(Enrollment.student_id==student_id).all()
@app.post("/students/{student_id}/enrollments", response_model=EnrollmentResponse,status_code=201)
def create_enrollment(student_id:int,payload:EnrollmentCreate,db:Session=Depends(get_db)):
    get_student(student_id,db); get_course(payload.course_id,db)
    obj=Enrollment(student_id=student_id,**payload.model_dump()); db.add(obj); commit_or_conflict(db,"Already enrolled in this course"); db.refresh(obj); return obj
@app.delete("/students/{student_id}/enrollments/{course_id}",status_code=204)
def delete_enrollment(student_id:int,course_id:str,db:Session=Depends(get_db)):
    obj=db.query(Enrollment).filter(Enrollment.student_id==student_id,Enrollment.course_id==course_id).first()
    if not obj: raise HTTPException(404,"Enrollment not found")
    db.delete(obj);db.commit();return Response(status_code=204)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app",host="127.0.0.1",port=8000,reload=True)
