# Experiment 15 — Django To-Do Application

## Windows VS Code: step-by-step
1. Extract this ZIP and open the `Django_Todo_Experiment15` folder in VS Code.
2. Open **Terminal > New Terminal**. Make sure you are in the folder containing `manage.py`.
3. Run `python -m venv venv`.
4. In **Command Prompt**, run `venv\Scripts\activate`. In PowerShell use `venv\Scripts\Activate.ps1` (if blocked, use Command Prompt). On macOS/Linux run `source venv/bin/activate`.
5. Run `python -m pip install -r requirements.txt` (internet needed to install Django).
6. Run `python manage.py check`.
7. Run `python manage.py migrate` (creates `db.sqlite3`). The Task migration is already included.
8. Run `python manage.py test` to run automated CRUD tests.
9. Run `python manage.py createsuperuser` and choose your own username and password.
10. Run `python manage.py runserver`.
11. Open http://127.0.0.1:8000/ to use the To-Do application.
12. Open http://127.0.0.1:8000/admin/ to sign in and manage tasks.
13. Test: add task, mark complete, mark incomplete, delete; restart server and confirm remaining tasks persist.
14. Inspect browser DevTools > Network for CSS, JS, PNG status 200; test mobile width in device toolbar.
15. Capture **your own screenshots** of the task list, add-task page and admin task list after running locally. Screenshots are not included because the server cannot be run in your browser here.

## Project notes
- `models.py`: Task data model; `views.py`: CRUD logic; `urls.py`: URL mappings.
- `admin.py` registers and configures the Task model in Django Admin. `apps.py` configures the Django application and its display name.
<div>
- `{% extends %}` inherits a full shared layout (`base.html`); `{% include %}` inserts reusable fragments (`header.html` and `footer.html`).
</div>
- All state-changing forms use POST and CSRF tokens. JavaScript adds a character counter, input focus and delete confirmation.
- The database file and virtual environment are intentionally excluded from the submission ZIP. `migrate` creates the database locally.
- Development configuration only: set a private SECRET_KEY, DEBUG=False, correct ALLOWED_HOSTS, and production static hosting before deploying.

## Troubleshooting
- `No module named django`: activate venv and install requirements.
- `no such table`: run `python manage.py migrate`.
- Port in use: `python manage.py runserver 8080`.
- Missing static files: verify `todo/static/todo/` paths and restart server.
- Stop server with Ctrl+C.
