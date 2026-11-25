# Lecture 29 — Testing and Debugging Django Applications

This project demonstrates the hands-on tasks from Lecture 29:
- Health endpoint test
- Parameterized student-detail endpoint test
- Running individual tests
- Mocking an external API and testing timeout handling
- Diagnosing an intentionally introduced defect
- Tests for health, list, and detail endpoints
- Optional Student model tests

## Requirements
- Python 3.10+
- Django 4.2+ (or a compatible Django release)
- `requests`

## 1. Set up the project

Open a terminal in this extracted folder.

### Windows (PowerShell / Command Prompt)

```bash
python -m venv venv
venv\Scripts\activate
python -m pip install -r requirements.txt
python manage.py migrate
```

If `python` is not recognized, try `py` instead.

## 2. Run the server

```bash
python manage.py runserver
```

Open:
- Health endpoint: http://127.0.0.1:8000/api/health/
- Student list: http://127.0.0.1:8000/api/students/
- Student detail: http://127.0.0.1:8000/api/students/42/

The detail endpoint returns a sample response for an ID; it does not require a database Student model.

## 3. Run all tests

Stop the development server if desired, then run:

```bash
python manage.py test
```

Run a specific test class or test method:

```bash
python manage.py test students.tests.StudentAPITest
python manage.py test students.tests.StudentAPITest.test_health_endpoint
```

Django creates an isolated temporary test database for `TestCase` tests. The project does not need internet access for the external-service tests because the network request is mocked.

## 4. Task-by-task guide

### Task 1 — Test health endpoint
`students/tests.py`, class `StudentAPITest`, method `test_health_endpoint`.
It expects HTTP 200 and JSON `{"status": "ok"}`.

### Task 2 — Test parameterized endpoint
`StudentRouteTest.test_student_detail_returns_id` checks that `/api/students/42/` returns `student_id: 42`.

### Task 3 — Run tests
Use `python manage.py test`, or one of the specific commands above.

### Task 4 — Mock an external service
`students/utils.py` contains `get_external_data()`. The tests mock `requests.get` so they never make a real network request. Both a successful response and a timeout are covered.

### Task 5 — Diagnose a defect
To reproduce the lecture's defect:
1. Open `students/views.py`.
2. In `health_check`, temporarily change `JsonResponse({"status": "ok"}, status=200)` to `JsonResponse({"status": "ok"}, status=201)`.
3. Run `python manage.py test students.tests.StudentAPITest.test_health_endpoint`.
4. Observe that the test expected 200 but received 201.
5. Restore status 200 and rerun the test.

### PBL — Health, list, detail, model, and dependency tests
The test suite includes health, list, detail, service success, and service timeout tests. A `Student` model is also included with a model test checking that records save correctly.

## Project structure

```text
django_testing_debugging_lecture29/
├── manage.py
├── requirements.txt
├── README.md
├── config/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── students/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── tests.py
    ├── urls.py
    ├── utils.py
    └── views.py
```

## Notes
- This is a learning/demo project, not a production-ready student management system.
- Do not log passwords, tokens, session cookies, or sensitive personal information.
- `DEBUG=True` is for local development only. Configure production settings securely before deployment.
