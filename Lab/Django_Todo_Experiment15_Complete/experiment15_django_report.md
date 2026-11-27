# Experiment 15 --- Django To-Do Application

{% raw %}

## Objective

To build a complete To-Do / Task Tracker application using the Django
web framework and SQLite database, then extend it with Django Admin,
reusable templates, and static assets.

The completed application demonstrates:

-   Django's Model--View--Template (MVT) architecture
-   Project and app structure
-   SQLite database persistence
-   Django ORM
-   CRUD operations
-   URL routing
-   Views and templates
-   CSRF-protected POST forms
-   Django Admin
-   Template inheritance and reusable includes
-   Static CSS, JavaScript, and image assets
-   Responsive user-interface design

------------------------------------------------------------------------

# Prerequisites

The experiment requires:

-   Python 3.x
-   Terminal or command prompt
-   VS Code, PyCharm, or another code editor
-   Basic Python knowledge
-   Basic HTML and CSS knowledge

------------------------------------------------------------------------

# Theory --- What is Django?

Django is a high-level Python web framework used to build web
applications quickly using a structured architecture.

Django includes several built-in features:

-   URL routing
-   Object-Relational Mapper (ORM)
-   Authentication
-   Sessions
-   Template engine
-   Form and CSRF protection
-   Administrative interface
-   Static-file support

Django commonly follows the **Model--View--Template (MVT)** pattern.

------------------------------------------------------------------------

# Django MVT Architecture

## Model

The Model defines application data and database fields.

In this project, the `Task` model stores:

-   Task title
-   Completion state
-   Creation time

## View

A View receives an HTTP request, performs application logic, interacts
with models, and returns a response.

Examples in this project include:

-   Listing tasks
-   Adding tasks
-   Marking tasks complete/incomplete
-   Deleting tasks

## Template

Templates define the HTML sent to the browser.

Examples:

-   `task_list.html`
-   `add_task.html`
-   `base.html`
-   `header.html`
-   `footer.html`

## URL Configuration

Django's URL configuration maps URL paths to views.

A typical request follows:

``` text
Browser
   ↓
urls.py
   ↓
View
   ↓
Model / ORM
   ↓
Template
   ↓
HTTP Response
```

------------------------------------------------------------------------

# Installation and Project Setup

## Step 1 --- Create the Project Directory

``` bash
mkdir django_todo_app
cd django_todo_app
```

------------------------------------------------------------------------

## Step 2 --- Create a Virtual Environment

``` bash
python -m venv venv
```

Windows:

``` bash
venv\Scripts\activate
```

macOS/Linux:

``` bash
source venv/bin/activate
```

A virtual environment isolates project packages from the system Python
installation.

------------------------------------------------------------------------

## Step 3 --- Install Django

``` bash
python -m pip install django
```

Verify:

``` bash
python -m django --version
```

------------------------------------------------------------------------

## Step 4 --- Create the Django Project

``` bash
django-admin startproject todo_project .
```

The final dot creates the project in the current directory.

------------------------------------------------------------------------

## Step 5 --- Create the To-Do App

``` bash
python manage.py startapp todo
```

A Django project contains site-wide configuration, while an app
represents a particular feature or domain.

------------------------------------------------------------------------

# Register the App

Open:

``` text
todo_project/settings.py
```

Add the To-Do app:

``` python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'todo',
]
```

Registering the app allows Django to discover its models, migrations,
templates, and configuration.

------------------------------------------------------------------------

# Project Structure

``` text
django_todo_app/
├── manage.py
├── db.sqlite3
│
├── todo_project/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
└── todo/
    ├── migrations/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── tests.py
    ├── urls.py
    ├── views.py
    │
    ├── templates/
    │   └── todo/
    │       ├── base.html
    │       ├── header.html
    │       ├── footer.html
    │       ├── task_list.html
    │       └── add_task.html
    │
    └── static/
        └── todo/
            ├── css/
            │   └── style.css
            ├── js/
            │   └── app.js
            └── images/
                └── logo.png
```

------------------------------------------------------------------------

# Important Django Files

  File            Purpose
  --------------- ----------------------------------------
  `manage.py`     Runs project management commands
  `settings.py`   Project configuration
  `urls.py`       URL routing
  `models.py`     Database-backed data models
  `views.py`      Request-handling logic
  `admin.py`      Admin model registration/configuration
  `apps.py`       App configuration
  `migrations/`   Database schema history
  `templates/`    Dynamic HTML templates
  `static/`       CSS, JavaScript, and images

------------------------------------------------------------------------

# Essential `manage.py` Commands

Create an app:

``` bash
python manage.py startapp todo
```

Generate migrations:

``` bash
python manage.py makemigrations
```

Apply migrations:

``` bash
python manage.py migrate
```

Run the development server:

``` bash
python manage.py runserver
```

Create an administrator:

``` bash
python manage.py createsuperuser
```

Open the Django shell:

``` bash
python manage.py shell
```

Check configuration:

``` bash
python manage.py check
```

View migration status:

``` bash
python manage.py showmigrations
```

A key distinction is:

``` text
makemigrations → creates migration files
migrate        → applies migrations to the database
```

------------------------------------------------------------------------

# Building the To-Do Application

## Step 1 --- Create the Task Model

Open:

``` text
todo/models.py
```

``` python
from django.db import models


class Task(models.Model):

    title = models.CharField(
        max_length=200
    )

    completed = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title
```

------------------------------------------------------------------------

# Task Model Fields

  Field          Type              Purpose
  -------------- ----------------- ----------------------
  `title`        `CharField`       Stores task text
  `completed`    `BooleanField`    Tracks task state
  `created_at`   `DateTimeField`   Stores creation time

New tasks are incomplete by default.

The `__str__()` method provides a readable representation of each task,
including in Django Admin.

------------------------------------------------------------------------

# Step 2 --- Create and Apply Migrations

``` bash
python manage.py makemigrations todo
python manage.py migrate
```

Django converts the model definition into a database table.

The default database is SQLite and is normally stored in:

``` text
db.sqlite3
```

This gives the application persistent storage.

------------------------------------------------------------------------

# Step 3 --- Implement Views

Open:

``` text
todo/views.py
```

``` python
from django.shortcuts import (
    get_object_or_404,
    redirect,
    render,
)

from django.views.decorators.http import (
    require_POST,
)

from .models import Task


def task_list(request):

    tasks = (
        Task.objects
        .all()
        .order_by('-created_at')
    )

    return render(
        request,
        'todo/task_list.html',
        {
            'tasks': tasks
        }
    )


def add_task(request):

    if request.method == 'POST':

        title = (
            request.POST
            .get('title', '')
            .strip()
        )

        if title:
            Task.objects.create(
                title=title
            )

        return redirect(
            'task_list'
        )

    return render(
        request,
        'todo/add_task.html'
    )


@require_POST
def toggle_task(
    request,
    task_id
):

    task = get_object_or_404(
        Task,
        pk=task_id
    )

    task.completed = (
        not task.completed
    )

    task.save(
        update_fields=[
            'completed'
        ]
    )

    return redirect(
        'task_list'
    )


@require_POST
def delete_task(
    request,
    task_id
):

    task = get_object_or_404(
        Task,
        pk=task_id
    )

    task.delete()

    return redirect(
        'task_list'
    )
```

------------------------------------------------------------------------

# Understanding the Views

## `task_list()`

``` python
Task.objects.all()
```

reads tasks from the database.

``` python
.order_by('-created_at')
```

sorts them from newest to oldest.

The tasks are passed to the template as context.

------------------------------------------------------------------------

## `add_task()`

The view reads:

``` python
request.POST.get(
    'title',
    ''
)
```

Whitespace is removed using:

``` python
.strip()
```

Only non-empty titles are stored.

A new record is created using:

``` python
Task.objects.create(
    title=title
)
```

After submission, the application redirects to the task list.

------------------------------------------------------------------------

## `toggle_task()`

The requested task is safely loaded using:

``` python
get_object_or_404(
    Task,
    pk=task_id
)
```

The completion state is reversed:

``` python
task.completed = (
    not task.completed
)
```

and saved.

------------------------------------------------------------------------

## `delete_task()`

The requested task is loaded and removed:

``` python
task.delete()
```

------------------------------------------------------------------------

# Why Use POST for State Changes?

Toggle and delete modify stored data.

The improved implementation uses:

``` python
@require_POST
```

This prevents these actions from being performed through ordinary GET
links.

The forms also contain Django CSRF protection.

------------------------------------------------------------------------

# Step 4 --- App URL Routes

Create:

``` text
todo/urls.py
```

``` python
from django.urls import path

from . import views


urlpatterns = [

    path(
        '',
        views.task_list,
        name='task_list'
    ),

    path(
        'add/',
        views.add_task,
        name='add_task'
    ),

    path(
        'toggle/<int:task_id>/',
        views.toggle_task,
        name='toggle_task'
    ),

    path(
        'delete/<int:task_id>/',
        views.delete_task,
        name='delete_task'
    ),
]
```

Named routes allow templates to use:

``` django
{% url 'task_list' %}
```

instead of hardcoding internal paths.

------------------------------------------------------------------------

# Step 5 --- Project URL Configuration

Open:

``` text
todo_project/urls.py
```

``` python
from django.contrib import admin

from django.urls import (
    include,
    path,
)


urlpatterns = [

    path(
        'admin/',
        admin.site.urls
    ),

    path(
        '',
        include('todo.urls')
    ),
]
```

`include()` delegates the site's root routes to the To-Do app.

The Django Admin remains available separately under:

``` text
/admin/
```

------------------------------------------------------------------------

# Basic Templates

The initial template directory is:

``` text
todo/templates/todo/
```

The application requires:

``` text
task_list.html
add_task.html
```

------------------------------------------------------------------------

# Reusable Template Architecture

The final application improves the original templates using:

``` text
base.html
header.html
footer.html
task_list.html
add_task.html
```

------------------------------------------------------------------------

# `header.html`

``` django
{% load static %}

<header class="site-header">

    <a
        class="site-title"
        href="{% url 'task_list' %}"
    >

        <img
            src="{% static 'todo/images/logo.png' %}"
            alt="Task Tracker logo"
            width="40"
            height="40"
        >

        <span>
            Task Tracker
        </span>

    </a>

    <nav
        aria-label="Main navigation"
    >

        <a href="{% url 'task_list' %}">
            All tasks
        </a>

        <a href="{% url 'add_task' %}">
            Add task
        </a>

    </nav>

</header>
```

This creates the shared Task Tracker header visible in the submitted
application.

------------------------------------------------------------------------

# `footer.html`

``` django
<footer class="site-footer">

    <p>
        Task Tracker —
        Django Experiment 15
    </p>

</footer>
```

The footer is shared by application pages.

------------------------------------------------------------------------

# `base.html`

``` django
{% load static %}

<!doctype html>

<html lang="en">

<head>

    <meta charset="utf-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    >

    <title>
        {% block title %}
            Task Tracker
        {% endblock %}
    </title>

    <link
        rel="stylesheet"
        href="{% static 'todo/css/style.css' %}"
    >

    {% block extra_css %}
    {% endblock %}

</head>

<body>

    {% include 'todo/header.html' %}

    <main class="container">

        {% block content %}
        {% endblock %}

    </main>

    {% include 'todo/footer.html' %}

    <script
        src="{% static 'todo/js/app.js' %}"
        defer>
    </script>

    {% block extra_js %}
    {% endblock %}

</body>

</html>
```

------------------------------------------------------------------------

# Template Inheritance

Child templates use:

``` django
{% extends 'todo/base.html' %}
```

The parent template provides the overall page layout.

Child templates replace blocks such as:

``` django
{% block title %}
{% endblock %}
```

and:

``` django
{% block content %}
{% endblock %}
```

------------------------------------------------------------------------

# Template Includes

Reusable fragments are inserted using:

``` django
{% include 'todo/header.html' %}
```

and:

``` django
{% include 'todo/footer.html' %}
```

------------------------------------------------------------------------

# `extends` vs `include`

  -----------------------------------------------------------------------------------------------
  Feature                 `extends`                          `include`
  ----------------------- ---------------------------------- ------------------------------------
  Purpose                 Inherit a page layout              Insert reusable markup

  Typical file            `base.html`                        `header.html`, `footer.html`

  Uses blocks             Yes                                Not required

  Example                 `{% extends 'todo/base.html' %}`   `{% include 'todo/header.html' %}`
  -----------------------------------------------------------------------------------------------

A useful rule is:

> Use inheritance for the overall page structure and includes for
> reusable pieces of markup.

------------------------------------------------------------------------

# Final `task_list.html`

``` django
{% extends 'todo/base.html' %}

{% block title %}
    My Tasks | Task Tracker
{% endblock %}


{% block content %}

<section class="panel">

    <div class="page-heading">

        <div>

            <h1>
                My To-Do List
            </h1>

            <p>
                Organize your tasks
                and track your progress.
            </p>

        </div>

        <a
            class="button"
            href="{% url 'add_task' %}"
        >
            + Add a task
        </a>

    </div>


    <ul class="task-list">

        {% for task in tasks %}

            <li class="task-item">

                <span
                    class="
                        {% if task.completed %}
                            completed
                        {% endif %}
                    "
                >
                    {{ task.title }}
                </span>


                <div class="task-actions">

                    <form
                        method="post"
                        action="
                            {% url 'toggle_task' task.id %}
                        "
                    >

                        {% csrf_token %}

                        <button type="submit">

                            {% if task.completed %}
                                Mark incomplete
                            {% else %}
                                Mark complete
                            {% endif %}

                        </button>

                    </form>


                    <form
                        method="post"
                        action="
                            {% url 'delete_task' task.id %}
                        "
                    >

                        {% csrf_token %}

                        <button
                            class="danger"
                            type="submit"
                        >
                            Delete
                        </button>

                    </form>

                </div>

            </li>

        {% empty %}

            <li class="empty-state">

                No tasks yet.
                Add your first task
                to get started!

            </li>

        {% endfor %}

    </ul>

</section>

{% endblock %}
```

------------------------------------------------------------------------

# Empty State

The submitted application demonstrates the empty-list state.

When no records exist, the page displays a useful message similar to:

``` text
No tasks yet. Add your first task to get started!
```

This is produced through Django's template:

``` django
{% empty %}
```

branch.

------------------------------------------------------------------------

# Task State

After adding a task, the application displays:

-   Task title
-   Mark complete button
-   Delete button

The submitted result shows a task named:

``` text
Backend dev
```

with both state-changing controls.

------------------------------------------------------------------------

# `add_task.html`

``` django
{% extends 'todo/base.html' %}


{% block title %}
    Add Task | Task Tracker
{% endblock %}


{% block content %}

<section class="panel">

    <h1>
        Add a task
    </h1>

    <form
        method="post"
        class="task-form"
    >

        {% csrf_token %}

        <label for="title">
            Task title
        </label>

        <input
            id="title"
            type="text"
            name="title"
            maxlength="200"
            required
        >

        <button type="submit">
            Save task
        </button>

    </form>

    <p>

        <a href="{% url 'task_list' %}">
            Back to task list
        </a>

    </p>

</section>

{% endblock %}
```

------------------------------------------------------------------------

# CSRF Protection

Every internal POST form that changes data contains:

``` django
{% csrf_token %}
```

This includes:

-   Adding tasks
-   Toggling task completion
-   Deleting tasks

CSRF protection helps prevent unauthorized cross-site form submissions.

------------------------------------------------------------------------

# Static Files

The application uses:

``` text
todo/static/todo/
├── css/
│   └── style.css
├── js/
│   └── app.js
└── images/
    └── logo.png
```

The extra `todo/` directory namespaces the app's assets and helps
prevent filename conflicts with other Django apps.

------------------------------------------------------------------------

# Static Configuration

Django normally includes:

``` python
STATIC_URL = 'static/'
```

The To-Do app is installed and `django.contrib.staticfiles` is enabled,
allowing app-level static assets to be discovered during development.

------------------------------------------------------------------------

# Loading Static Files

Templates load Django's static library:

``` django
{% load static %}
```

CSS:

``` django
<link
    rel="stylesheet"
    href="{% static 'todo/css/style.css' %}"
>
```

JavaScript:

``` django
<script
    src="{% static 'todo/js/app.js' %}"
    defer>
</script>
```

Image:

``` django
<img
    src="{% static 'todo/images/logo.png' %}"
    alt="Task Tracker logo"
>
```

------------------------------------------------------------------------

# CSS Styling

A representative stylesheet is:

``` css
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family:
        Arial,
        sans-serif;
    line-height: 1.5;
    color: #202938;
    background: #f4f6fa;
}

.site-header,
.site-footer {
    padding: 1rem 5%;
    background: #ffffff;
}

.site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-bottom:
        1px solid #d8deea;
}

.site-title {
    font-weight: 700;
    text-decoration: none;
}

.site-header nav {
    display: flex;
    gap: 1rem;
}

.container {
    width:
        min(900px, 92%);
    margin:
        2rem auto;
}

.panel {
    padding: 1.5rem;
    background: #ffffff;
    border:
        1px solid #d8deea;
    border-radius: 0.75rem;
}

.task-list {
    padding: 0;
    list-style: none;
}

.task-item {
    display: flex;
    align-items: center;
    justify-content:
        space-between;
    gap: 1rem;
    padding:
        0.9rem 0;
    border-bottom:
        1px solid #e5e9f1;
}

.task-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.completed {
    color: #687386;
    text-decoration:
        line-through;
}

button,
.button {
    display: inline-block;
    padding:
        0.55rem 0.85rem;
    border: 0;
    border-radius: 0.35rem;
    background: #2457c5;
    color: white;
    font: inherit;
    text-decoration: none;
    cursor: pointer;
}

button.danger {
    background: #a62b37;
}

.task-form {
    display: grid;
    gap: 0.75rem;
    max-width: 30rem;
}

.task-form input {
    padding: 0.65rem;
    border:
        1px solid #aeb8c8;
    border-radius: 0.35rem;
}

.site-footer {
    border-top:
        1px solid #d8deea;
    text-align: center;
}

@media (
    max-width: 600px
) {

    .site-header,
    .task-item {
        align-items:
            flex-start;

        flex-direction:
            column;
    }
}
```

The submitted screenshots show the styled Task Tracker interface with a
white card, blue controls, navigation, and footer.

------------------------------------------------------------------------

# JavaScript Enhancement

Create:

``` text
todo/static/todo/js/app.js
```

``` javascript
document.addEventListener(
    "DOMContentLoaded",
    function () {

        const titleInput =
            document.querySelector(
                "#title"
            );

        if (titleInput) {
            titleInput.focus();
        }

        console.log(
            "Task Tracker JavaScript loaded."
        );
    }
);
```

The JavaScript automatically focuses the task-title input on the Add
Task page.

------------------------------------------------------------------------

# Django Admin

Django provides a built-in administrative interface for managing
database records.

The submitted result demonstrates the Django Admin dashboard with a
separate **TO-DO TASKS** section and the `Tasks` model available for
management.

------------------------------------------------------------------------

# Create an Administrator

Apply migrations first:

``` bash
python manage.py migrate
```

Then create a superuser:

``` bash
python manage.py createsuperuser
```

Open:

``` text
http://127.0.0.1:8000/admin/
```

and log in.

------------------------------------------------------------------------

# Register the Task Model

Open:

``` text
todo/admin.py
```

``` python
from django.contrib import admin

from .models import Task


@admin.register(Task)
class TaskAdmin(
    admin.ModelAdmin
):

    list_display = (
        'title',
        'completed',
        'created_at',
    )

    list_filter = (
        'completed',
    )

    search_fields = (
        'title',
    )

    list_editable = (
        'completed',
    )
```

------------------------------------------------------------------------

# Admin Features

This configuration provides:

-   Task title column
-   Completion column
-   Creation-date column
-   Completion filter
-   Task-title search
-   Inline completion editing

The screenshots confirm that the `Task` model is successfully registered
in Django Admin.

------------------------------------------------------------------------

# `admin.py` vs `apps.py`

## `admin.py`

Responsible for:

-   Registering models with Django Admin
-   Configuring admin lists
-   Search
-   Filters
-   Admin editing behavior

Example:

``` python
@admin.register(Task)
class TaskAdmin(
    admin.ModelAdmin
):
    list_display = (
        'title',
        'completed',
        'created_at',
    )
```

## `apps.py`

Responsible for app configuration.

Example:

``` python
from django.apps import AppConfig


class TodoConfig(AppConfig):

    default_auto_field = (
        'django.db.models.BigAutoField'
    )

    name = 'todo'

    verbose_name = (
        'To-Do Tasks'
    )
```

A key distinction is:

  File            Responsibility
  --------------- ----------------------------
  `models.py`     Defines data
  `admin.py`      Registers/customizes Admin
  `apps.py`       Configures the app
  `settings.py`   Enables installed apps

------------------------------------------------------------------------

# Configure the App Class

Instead of:

``` python
'todo'
```

`INSTALLED_APPS` can explicitly use:

``` python
'todo.apps.TodoConfig'
```

Use one form, not both.

------------------------------------------------------------------------

# CRUD Operations

The project implements all four CRUD operations.

  Operation   Django Implementation
  ----------- --------------------------------
  Create      `Task.objects.create()`
  Read        `Task.objects.all()`
  Update      Change `completed` + `.save()`
  Delete      `.delete()`

------------------------------------------------------------------------

# Create

``` python
Task.objects.create(
    title=title
)
```

------------------------------------------------------------------------

# Read

``` python
Task.objects
    .all()
    .order_by('-created_at')
```

------------------------------------------------------------------------

# Update

``` python
task.completed = (
    not task.completed
)

task.save(
    update_fields=[
        'completed'
    ]
)
```

------------------------------------------------------------------------

# Delete

``` python
task.delete()
```

------------------------------------------------------------------------

# Database Persistence

The tasks are stored in SQLite:

``` text
db.sqlite3
```

Therefore, restarting the Django development server does not remove
existing tasks.

This demonstrates the difference between database-backed state and
temporary in-memory state.

------------------------------------------------------------------------

# Application Results

## Result 1 --- Empty Task List

The initial page shows:

-   Task Tracker branding
-   All tasks navigation
-   Add task navigation
-   My To-Do List heading
-   Add a task button
-   Helpful empty-state message

The application correctly handles the case where the database contains
no tasks.

------------------------------------------------------------------------

## Result 2 --- Task Added

After adding a task, the page displays:

``` text
Backend dev
```

along with:

``` text
Mark complete
Delete
```

This demonstrates successful **Create** and **Read** operations.

The Mark Complete control demonstrates the available **Update**
operation, while Delete provides the **Delete** operation.

------------------------------------------------------------------------

## Result 3 --- Django Admin

The submitted Django Admin screen shows:

-   Authentication and Authorization
-   Groups
-   Users
-   To-Do Tasks
-   Tasks

This confirms that the Task model has been registered with the Django
administrative interface.

------------------------------------------------------------------------

# Testing the Application

Run:

``` bash
python manage.py check
```

Then:

``` bash
python manage.py runserver
```

Open:

``` text
http://127.0.0.1:8000/
```

------------------------------------------------------------------------

# CRUD Testing

## Create

Select:

``` text
+ Add a task
```

Enter a task title and save it.

Expected result:

-   A database record is created.
-   The task appears on the home page.

## Read

Open the home page.

Expected result:

-   All tasks are displayed.

## Update

Select:

``` text
Mark complete
```

Expected result:

-   `completed` changes to `True`.
-   The task is displayed as completed.

Select:

``` text
Mark incomplete
```

to reverse the state.

## Delete

Select:

``` text
Delete
```

Expected result:

-   The task record is removed.
-   The task disappears from the list.

## Persistence

Stop the server and restart:

``` bash
python manage.py runserver
```

Expected result:

-   Existing SQLite records remain.

------------------------------------------------------------------------

# Full Testing Checklist

-   Home page loads successfully.
-   Empty task list displays a useful message.
-   Add Task page loads.
-   Adding a task creates a database record.
-   Task appears on the home page.
-   Complete/incomplete state can be changed.
-   Deleting a task removes the record.
-   POST forms contain `{% csrf_token %}`.
-   State-changing actions use POST.
-   Tasks remain after server restart.
-   `task_list.html` extends `base.html`.
-   `add_task.html` extends `base.html`.
-   Header is loaded from a separate template.
-   Footer is loaded from a separate template.
-   Named URL routes work.
-   CSS loads correctly.
-   JavaScript loads without errors.
-   Logo/image loads correctly.
-   Image contains meaningful alternative text.
-   Responsive layout works on narrow screens.
-   Admin login works.
-   Task model appears in Admin.
-   Admin list display works.
-   Admin filter works.
-   Admin search works.

------------------------------------------------------------------------

# Common Errors and Troubleshooting

## `No module named django`

Activate the virtual environment and install Django:

``` bash
python -m pip install django
```

------------------------------------------------------------------------

## Database/Table Error in `/admin/`

Run:

``` bash
python manage.py migrate
```

Django's admin, authentication, and session tables are created through
migrations.

------------------------------------------------------------------------

## `no such table: todo_task`

Check that the app is installed.

Then run:

``` bash
python manage.py makemigrations todo
python manage.py migrate
```

------------------------------------------------------------------------

## Admin Login Fails

Create an administrator:

``` bash
python manage.py createsuperuser
```

Verify that the account has staff/superuser permissions.

------------------------------------------------------------------------

## `TemplateDoesNotExist`

Verify:

``` text
todo/templates/todo/
```

and ensure the `todo` app is installed.

------------------------------------------------------------------------

## `NoReverseMatch`

Check route names in:

``` text
todo/urls.py
```

and verify the names passed to:

``` django
{% url %}
```

------------------------------------------------------------------------

## CSRF Verification Error

Ensure every internal POST form contains:

``` django
{% csrf_token %}
```

------------------------------------------------------------------------

## Static File 404

Check:

-   `django.contrib.staticfiles` is installed.
-   `todo` is in `INSTALLED_APPS`.
-   Files exist under `todo/static/todo/...`.
-   The template uses `{% load static %}`.
-   The static path matches the actual filename.

------------------------------------------------------------------------

## JavaScript Not Running

Use browser developer tools and check:

-   Console errors
-   Network requests
-   Script path
-   JavaScript syntax

------------------------------------------------------------------------

## Port Already in Use

Use another port:

``` bash
python manage.py runserver 8080
```

Then open:

``` text
http://127.0.0.1:8080/
```

------------------------------------------------------------------------

# Summary of Commands

``` bash
# Create project directory
mkdir django_todo_app
cd django_todo_app

# Virtual environment
python -m venv venv

# Install Django
python -m pip install django

# Create project
django-admin startproject todo_project .

# Create app
python manage.py startapp todo

# Create migrations
python manage.py makemigrations todo

# Apply migrations
python manage.py migrate

# Check project
python manage.py check

# Create admin account
python manage.py createsuperuser

# Run server
python manage.py runserver
```

------------------------------------------------------------------------

# Key Learning Outcomes

After completing Experiment 15, the student should understand:

1.  Django project and app structure.
2.  Django's MVT architecture.
3.  The purpose of `manage.py`.
4.  How apps are registered.
5.  How Django models define database data.
6.  How migrations create/update database tables.
7.  How SQLite provides persistent storage.
8.  How Django ORM performs CRUD operations.
9.  How views process HTTP requests.
10. How URL patterns connect requests to views.
11. How templates display dynamic data.
12. How named URL routes avoid hardcoded paths.
13. How CSRF protection secures POST forms.
14. Why state-changing actions should use POST.
15. How Django Admin manages models.
16. The difference between `admin.py` and `apps.py`.
17. How template inheritance reduces duplicate HTML.
18. The difference between `extends` and `include`.
19. How CSS, JavaScript, and images are organized as static assets.
20. How to test and troubleshoot a Django application.

------------------------------------------------------------------------

# Final Assignment Requirements Demonstrated

The completed Task Tracker satisfies the major experiment requirements:

-   Displays tasks on the home page.
-   Adds tasks.
-   Marks tasks complete/incomplete.
-   Deletes tasks.
-   Handles an empty task list.
-   Persists tasks in SQLite.
-   Uses POST and CSRF protection for state changes.
-   Registers the Task model in Django Admin.
-   Uses a shared `base.html`.
-   Uses separate header and footer templates.
-   Uses template inheritance.
-   Uses template includes.
-   Uses named URL routes.
-   Loads CSS through Django static files.
-   Loads JavaScript through Django static files.
-   Supports an application image/logo.
-   Uses responsive styling.

------------------------------------------------------------------------

# Conclusion

Experiment 15 demonstrates the complete workflow for building a
database-backed web application with Django.

The Task Tracker begins with a `Task` model containing a title,
completion state, and creation timestamp. Django migrations translate
this model into an SQLite database table. Views use the Django ORM to
create, retrieve, update, and delete records, while URL configurations
connect browser requests to the correct view functions.

The application uses Django templates to display task data and POST
forms with CSRF protection for state-changing operations. The final
interface improves maintainability through `base.html`, `header.html`,
and `footer.html`, demonstrating the difference between template
inheritance and reusable includes.

Static CSS, JavaScript, and image assets provide the branded Task
Tracker interface shown in the submitted results. The screenshots
demonstrate both the empty task state and a successfully created task
with complete/delete controls.

Finally, the Task model is integrated with Django Admin, providing a
separate staff-facing interface for database management.

Overall, this experiment demonstrates how Django models, ORM queries,
views, URLs, templates, static assets, SQLite persistence, and the
administrative interface work together to create a complete CRUD web
application.

{% endraw %}
