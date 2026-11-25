# Lecture 28: Integrating Third-Party APIs and Services (Django)

This mini-project demonstrates how a Django backend can consume a third-party API safely using the `requests` library.

## What is included?

- A Django project (`config`)
- A `students` app
- A service utility in `students/utils.py`
- A view that returns external JSON
- URL routing
- Mocked tests for success and timeout cases
- Error handling for timeouts, HTTP/network failures, and invalid JSON

The external endpoint used in this exercise is JSONPlaceholder:
`https://jsonplaceholder.typicode.com/posts/<post_id>`

## Requirements

- Python 3.10+ recommended
- Internet access for the live API endpoint
- pip

## 1. Extract and open the project

Extract the ZIP file, then open the `Lecture28_ThirdParty_API_Django` folder in VS Code.

## 2. Create and activate a virtual environment

### Windows (PowerShell)
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, use Command Prompt:
```bat
venv\Scripts\activate.bat
```

### macOS/Linux
```bash
python3 -m venv venv
source venv/bin/activate
```

## 3. Install dependencies

```bash
python -m pip install -r requirements.txt
```

## 4. Run database migrations

```bash
python manage.py migrate
```

## 5. Start the Django server

```bash
python manage.py runserver
```

Open this URL in your browser:
`http://127.0.0.1:8000/api/students/external/1/`

Try changing `1` to another post ID, for example:
`http://127.0.0.1:8000/api/students/external/2/`

A successful request returns JSON from JSONPlaceholder. If the external service is unavailable or times out, the endpoint returns HTTP `503 Service Unavailable` with a safe error message.

## 6. Run the tests

Stop the server if needed, then run:

```bash
python manage.py test students
```

The tests mock `requests.get`, so they do not need internet access and do not call the real API.

## Project structure

```text
Lecture28_ThirdParty_API_Django/
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
    ├── apps.py
    ├── tests.py
    ├── urls.py
    ├── utils.py
    └── views.py
```

## Important notes

- The URL and timeout are constants for this classroom exercise. In production, configure them using environment variables or Django settings.
- HTTP 503 is used here for dependency failures, as required by the lecture activity.
- JSONPlaceholder is a public demo API, not a real student database.
