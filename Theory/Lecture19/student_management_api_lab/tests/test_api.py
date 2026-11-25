import os
os.environ["DATABASE_URL"]="sqlite:///./test_students.db"
from fastapi.testclient import TestClient
from main import app
from database import Base, engine
import pytest

client=TestClient(app)
@pytest.fixture(autouse=True)
def clean_db():
    Base.metadata.drop_all(bind=engine); Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def seed():
    d=client.post('/departments',json={'name':'Engineering'}); assert d.status_code==201
    s=client.post('/students',json={'name':'Aarav','email':'aarav@upes.ac.in','branch':'CSE','department_id':1,'enrollment_date':'2024-08-01'}); assert s.status_code==201
    c=client.post('/courses',json={'id':'CS101','title':'Backend Development','credits':4,'department_id':1}); assert c.status_code==201

def test_complete_lab_flow():
    seed()
    r=client.get('/students?branch=CSE&department_id=1&search=aarav&page=1&limit=5'); assert r.status_code==200
    body=r.json(); assert body['total']==1 and body['page']==1 and body['limit']==5 and body['total_pages']==1
    assert client.get('/students/1').status_code==200
    assert client.put('/students/1',json={'branch':'ECE'}).json()['branch']=='ECE'
    assert client.get('/courses').status_code==200
    e=client.post('/students/1/enrollments',json={'course_id':'CS101','semester':'Fall 2026'}); assert e.status_code==201
    assert len(client.get('/students/1/enrollments').json())==1
    assert client.post('/students/1/enrollments',json={'course_id':'CS101','semester':'Fall 2026'}).status_code==409
    assert client.delete('/students/1/enrollments/CS101').status_code==204
    assert client.delete('/students/1').status_code==204
    assert client.get('/students/1').status_code==404

def test_validation_and_conflicts():
    seed()
    assert client.post('/students',json={'name':'Other','email':'aarav@upes.ac.in','branch':'CSE'}).status_code==409
    assert client.post('/students',json={'name':'Bad','email':'not-an-email','branch':'CSE'}).status_code==422
    assert client.post('/courses',json={'id':'CS101','title':'Duplicate','credits':3}).status_code==409
    assert client.get('/students/999').status_code==404

def test_course_and_department_crud():
    seed()
    assert client.get('/departments/1').status_code==200
    assert client.put('/departments/1',json={'name':'School of Engineering'}).status_code==200
    assert client.get('/courses/CS101').status_code==200
    assert client.put('/courses/CS101',json={'credits':5}).json()['credits']==5
    assert client.delete('/courses/CS101').status_code==204
