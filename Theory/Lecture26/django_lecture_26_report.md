# Django Framework: Detailed Overview, Architecture, and Setup

## Lecture Information

- **Lecture:** 26
- **Unit:** Unit 3 — Frameworks and Performance Optimization
- **Topic:** Django Framework: Detailed Overview, Architecture, and Setup
- **Course Outcome:** CO3 — Utilize frameworks and APIs to build backend applications.
- **Bloom's Knowledge Level:** Understand
- **Skills Developed:** Django installation, virtual environment management, and project/app structure setup
- **Applications:** Robust, scalable, and secure backend applications
- **PBL Activity:** Setting up the Student Management API project using Django

---

## 1. Introduction to Django

Django is a high-level Python web framework designed for rapid and secure web development. It is commonly described as a **batteries-included** framework because it provides many important capabilities out of the box.

### Major Features

- Object-Relational Mapper (ORM)
- Auto-generated admin panel
- Authentication and authorization
- URL routing
- Template engine
- CSRF, XSS, SQL-injection, and clickjacking protections
- Form handling and validation
- Internationalization and localization
- Caching
- Testing tools

The framework reduces repetitive development work so developers can focus on application logic.

---

## 2. Why Use a Web Framework?

Without a framework, developers would need to manually handle tasks such as:

- Parsing HTTP requests
- Connecting to databases
- Managing sessions and cookies
- Preventing common security vulnerabilities
- Structuring large codebases

Django provides structure, conventions, and reusable components, leading to faster development and more maintainable code.

---

## 3. Django Architecture: MVT

Django follows the **Model-View-Template (MVT)** architectural pattern.

```text
Model    → Data and database interaction
View     → Request handling and business logic
Template → Presentation
```

### Model

The Model represents application data. Django's ORM maps Python classes to database tables and model attributes to database columns.

### View

The View receives an HTTP request, performs business logic, may query a Model, and returns an HTTP response.

Responses can include:

- HTML
- JSON
- Redirects

### Template

The Template defines the presentation layer, usually using HTML and Django template syntax.

For API-only applications, templates can be skipped and the View can return JSON directly.

---

## 4. MVT Request Lifecycle

A typical Django request follows this flow:

```text
Client
  |
  | HTTP Request
  v
URL Dispatcher (urls.py)
  |
  v
View
  |
  | Business Logic
  v
Model
  |
  v
Database
  |
  v
View
  |
  +----> Template (optional)
  |
  v
HTTP Response
  |
  v
Client
```

### Step-by-Step

1. The client sends an HTTP request.
2. `urls.py` matches the requested URL to a View.
3. The View executes application logic.
4. The View may query a Model.
5. The Model interacts with the database through Django's ORM.
6. The View may pass data to a Template.
7. The View returns an HTTP response.

---

## 5. MVT vs MVC

Classic MVC contains:

- **Model** — data and business rules
- **View** — presentation
- **Controller** — handles input and coordinates the application

Django uses different terminology:

| Django MVT | MVC Equivalent | Responsibility |
|---|---|---|
| Model | Model | Data structure and database access |
| View | Controller | Business logic and request handling |
| Template | View | Presentation |
| URL Dispatcher | Router | Maps URLs to views |

A useful rule to remember is:

```text
Django View ≈ MVC Controller
Django Template ≈ MVC View
```

---

## 6. Architectural Pattern Comparison

| Aspect | MVC | MVT | MVP | MVVM |
|---|---|---|---|---|
| Full form | Model-View-Controller | Model-View-Template | Model-View-Presenter | Model-View-ViewModel |
| Example use | Rails, Laravel, Spring | Django | Older Android patterns | Angular, Vue, WPF |
| Handles input | Controller | View | Presenter | ViewModel |
| Presentation | View | Template | View | View with binding |
| Data binding | Manual | Manual | Manual | Two-way / automatic |

Other approaches discussed in the lecture include REST, layered architecture, microservices, and serverless architectures.

### Why Django Uses MVT

- Separation of concerns
- Reusability
- Testability
- DRY (**Don't Repeat Yourself**) development

---

## 7. Django Project Structure

Create a project with:

```bash
django-admin startproject student_system
```

Generated structure:

```text
student_system/
├── manage.py
└── student_system/
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    ├── asgi.py
    └── wsgi.py
```

### Important Files

| File | Purpose |
|---|---|
| `manage.py` | Command-line utility for Django tasks |
| `__init__.py` | Marks the directory as a Python package |
| `settings.py` | Project-wide configuration |
| `urls.py` | Root URL routing |
| `asgi.py` | ASGI deployment entry point |
| `wsgi.py` | WSGI deployment entry point |

---

## 8. WSGI vs ASGI

| Feature | WSGI | ASGI |
|---|---|---|
| Full form | Web Server Gateway Interface | Asynchronous Server Gateway Interface |
| Protocol style | Synchronous | Asynchronous |
| WebSockets | No | Yes |
| Async views | No | Yes |
| Typical servers | Gunicorn, uWSGI | Daphne, Uvicorn |
| Use case | Traditional web apps | Real-time, chat, streaming apps |

---

## 9. Django Apps

Create an app with:

```bash
python manage.py startapp students
```

Generated structure:

```text
students/
├── migrations/
│   └── __init__.py
├── __init__.py
├── admin.py
├── apps.py
├── models.py
├── tests.py
└── views.py
```

### Project vs App

| Concept | Project | App |
|---|---|---|
| Meaning | Complete Django application | Reusable module |
| Created by | `django-admin startproject` | `python manage.py startapp` |
| Contains | Settings, root URLs, WSGI/ASGI | Models, views, tests, templates |
| Typical count | One | Many |
| Reusability | Project-specific | Can be reused |

A project can be thought of as the entire university website, while apps can represent `students`, `courses`, `faculty`, and `fees`.

---

# Part B — Installation and Setup

## 10. Create a Virtual Environment

```bash
python -m venv venv
```

Windows:

```text
venv\Scripts\activate
```

macOS/Linux:

```bash
source venv/bin/activate
```

A virtual environment isolates project dependencies.

---

## 11. Install Django

```bash
pip install django
```

Verify the installation:

```bash
python -m django --version
```

---

## 12. Create the Project and App

```bash
django-admin startproject student_system
cd student_system
python manage.py startapp students
```

---

## 13. Register the App

Open:

```text
student_system/settings.py
```

Add `students` to `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'students',
]
```

---

## 14. Run the Development Server

```bash
python manage.py runserver
```

Open:

```text
http://127.0.0.1:8000/
```

---

## 15. Important `manage.py` Commands

| Command | Purpose |
|---|---|
| `runserver` | Start the development server |
| `startapp` | Create a new app |
| `makemigrations` | Create migrations from model changes |
| `migrate` | Apply migrations |
| `createsuperuser` | Create a Django admin user |
| `shell` | Open an interactive Django Python shell |
| `check` | Check the project for common problems |
| `collectstatic` | Collect static files for deployment |
| `test` | Run tests |
| `dbshell` | Open the database command-line client |

---

# Part C — Hands-On

## 16. Create a Basic View

In `students/views.py`:

```python
from django.http import HttpResponse


def index(request):
    return HttpResponse(
        "Welcome to the Student Management API (Django)"
    )
```

---

## 17. Map the View to a URL

In `student_system/urls.py`:

```python
from django.urls import path
from students import views

urlpatterns = [
    path('', views.index),
]
```

Request flow:

```text
GET /
  ↓
student_system/urls.py
  ↓
students.views.index
  ↓
HttpResponse
```

---

## 18. Return JSON for an API

For the Student Management API, return JSON instead of HTML.

```python
from django.http import JsonResponse


def index(request):
    return JsonResponse({
        "message": "Welcome to the Student Management API",
        "version": "1.0",
        "status": "running"
    })
```

Run:

```bash
python manage.py runserver
```

Visit:

```text
http://127.0.0.1:8000/
```

Example response:

```json
{
  "message": "Welcome to the Student Management API",
  "version": "1.0",
  "status": "running"
}
```

---

## 19. Suggested Repository Structure

```text
student_system/
├── manage.py
├── student_system/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
└── students/
    ├── migrations/
    │   └── __init__.py
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── tests.py
    └── views.py
```

---

## 20. Setup Checklist

- [ ] Create a virtual environment.
- [ ] Activate the environment.
- [ ] Install Django.
- [ ] Verify the Django version.
- [ ] Create the `student_system` project.
- [ ] Create the `students` app.
- [ ] Register `students` in `INSTALLED_APPS`.
- [ ] Create a basic View.
- [ ] Configure the URL.
- [ ] Start the development server.
- [ ] Verify the response.
- [ ] Return JSON using `JsonResponse`.

---

## 21. Command Cheat Sheet

```bash
# Create virtual environment
python -m venv venv

# Install Django
pip install django

# Check Django version
python -m django --version

# Create project
django-admin startproject student_system

# Enter project
cd student_system

# Create app
python manage.py startapp students

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Run server
python manage.py runserver

# Create admin user
python manage.py createsuperuser

# Validate project
python manage.py check

# Run tests
python manage.py test
```

---

## 22. Key Takeaways

1. Django is a high-level, batteries-included Python web framework.
2. It provides ORM, admin, authentication, routing, templates, security, caching, and testing features.
3. Django follows the **Model-View-Template (MVT)** architecture.
4. Model handles data and database interaction.
5. View handles requests and business logic.
6. Template handles presentation.
7. Django's View is comparable to the Controller in MVC.
8. Django's Template is comparable to the View in MVC.
9. `urls.py` maps incoming URLs to Views.
10. A Django project is the complete application, while apps are focused reusable modules.
11. `settings.py` stores project-wide configuration.
12. `manage.py` is the main Django command-line utility.
13. WSGI is synchronous, while ASGI supports asynchronous workloads and WebSockets.
14. Virtual environments isolate dependencies.
15. Apps must be registered in `INSTALLED_APPS`.
16. Django Views can return HTML or JSON.
17. API-oriented projects can use `JsonResponse` directly.

---

## 23. Summary

Django provides a structured foundation for Python backend development.

Its MVT architecture separates responsibilities:

```text
Model    → Data
View     → Logic
Template → Presentation
```

The basic setup workflow is:

```text
Virtual Environment
        ↓
Install Django
        ↓
Create Project
        ↓
Create App
        ↓
Register App
        ↓
Create View
        ↓
Configure URL
        ↓
Run Server
```

For API applications, the View can return JSON directly instead of rendering a Template.

---

## 24. Important Follow-Up

The lecture recommends completing **Experiment 15** for better understanding.

The next topic is:

**Lecture 27 — Working with Middleware in Django**

Middleware sits between requests and Views and can process requests and responses globally.

Common uses include:

- Authentication
- Logging
- CORS
- Security

```text
Client Request
      ↓
Middleware
      ↓
View
      ↓
Middleware
      ↓
Client Response
```

---

# Conclusion

Django reduces repetitive backend work by providing a complete set of web-development tools and conventions. Understanding its MVT architecture, project/app organization, URL routing, deployment interfaces, virtual environments, and `manage.py` commands provides the foundation for building larger Django applications.

For the Student Management API introduced in this lecture, the initial implementation is straightforward:

```text
Client Request
      ↓
urls.py
      ↓
Django View
      ↓
JsonResponse
      ↓
Client
```

With the `student_system` project created, the `students` app registered, and a basic JSON View connected to a URL, the project is ready for subsequent Django backend topics.
