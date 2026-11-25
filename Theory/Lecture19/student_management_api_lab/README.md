# Student Management API - Lab Exercise

Complete FastAPI implementation of the Lecture 19 lab.

## Included
- Full CRUD for Students, Courses, and Departments
- Student filters: branch, department, search
- Pagination: page, limit, total, total_pages
- Nested student enrollment endpoints
- 404, 409, and automatic FastAPI/Pydantic 422 handling
- Swagger UI at `/docs`
- Automated pytest coverage of the complete lab flow

## Run
```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python main.py
```
Open http://127.0.0.1:8000/docs

## Test
```bash
pytest -q
```

## Important fix from the lecture sample
The lecture's `POST /courses` implementation queries `course.id`, but its shown `CourseCreate` schema does not define `id`. This project adds the required course `id` field so course creation actually works.
