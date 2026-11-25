Django Experiment 26 — Student Management API
================================================

Requirements:
- Python 3.10+ recommended
- Internet connection for installing Django

SETUP (Windows / VS Code)
1. Extract this ZIP.
2. Open the extracted DjangoExperiment26 folder in VS Code.
3. Open Terminal > New Terminal.
4. Create and activate a virtual environment:

   python -m venv venv
   .\venv\Scripts\activate

   If PowerShell blocks activation, use Command Prompt:
   venv\Scripts\activate.bat

5. Install Django:
   python -m pip install django

6. Enter the project folder:
   cd student_system

7. Create the database tables:
   python manage.py migrate

8. Check the project:
   python manage.py check

9. Start the server:
   python manage.py runserver

10. Open http://127.0.0.1:8000/ in your browser.

Expected JSON response:
{
  "message": "Welcome to the Student Management API",
  "version": "1.0",
  "status": "running"
}

IMPORTANT:
- Keep the terminal open while using the local server.
- Stop the server with Ctrl+C.
- The virtual environment and installed Django package are not included in this ZIP;
  install Django using the commands above.
