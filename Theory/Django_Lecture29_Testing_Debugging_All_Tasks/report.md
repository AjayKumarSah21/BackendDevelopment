# Testing and Debugging Django Applications

## Lecture Information

- **Lecture:** 29
- **Unit:** Unit 3 — Frameworks and Performance Optimization
- **Topic:** Testing and Debugging Django Applications
- **Course Outcome:** CO4 — Apply security best practices and conduct testing.
- **Bloom's Knowledge Level:** Analyze
- **Skills Developed:** Writing unit and integration tests, using the Django test client, isolating database tests, interpreting failures, and using logging
- **Applications:** Regression prevention, production stability, API quality, and systematic defect diagnosis
- **PBL Activity:** Build tests for the Student API and diagnose an intentionally introduced defect
- **Assessment Method:** Coding exercise and debugging task

---

# Part A — Theory

## 1. Learning Objectives

By the end of this lecture, students should be able to:

1. Explain why automated tests are important in backend development.
2. Distinguish between unit, integration, endpoint, and model tests.
3. Write Django tests for JSON API responses.
4. Test database behavior using Django's isolated test database.
5. Use the Django test client.
6. Use named URLs with `reverse()`.
7. Run tests and interpret assertion failures.
8. Mock external dependencies.
9. Use logging and debugging tools to locate defects.

---

# 2. Why Test Django Applications?

Testing checks whether application code behaves as expected.

A test is an executable statement of required behavior.

Examples:

```text
A valid health endpoint returns HTTP 200.
```

```text
Requesting an unknown student returns HTTP 404.
```

Tests are especially important when an application changes over time.

---

## 2.1 Benefits of Automated Testing

Tests help developers:

- Detect regressions after changes
- Verify successful behavior
- Verify failure behavior
- Document expected behavior
- Refactor with confidence
- Diagnose defects before deployment

---

# 3. Regression Testing

A **regression** occurs when previously working behavior breaks after a code change.

Example:

```text
Before Change
GET /health/ → 200 OK

New Feature Added
       ↓

After Change
GET /health/ → 500 Error
```

A test for the health endpoint can detect the regression immediately.

---

# 4. Types of Tests

| Test Type | What It Checks | Example |
|---|---|---|
| Unit test | Small function or class in isolation | Service utility handles a timeout |
| Integration test | Several components working together | View calls a mocked external service |
| Endpoint test | Application HTTP behavior | `GET /api/health/` returns JSON and HTTP 200 |
| Model test | Model validation and database behavior | A `Student` record is saved correctly |

---

# 5. Unit Tests

A unit test focuses on a small piece of application logic.

For example:

```text
get_external_data()
```

can be tested independently from:

- A browser
- A live Django server
- The real external service

A mocked dependency can provide controlled input.

---

# 6. Integration Tests

Integration tests verify that multiple parts of the application work together.

For example:

```text
Django View
    ↓
Service Utility
    ↓
Mocked External Service
```

The goal is to test the interaction between components.

---

# 7. Endpoint Tests

Endpoint tests verify HTTP behavior.

Examples include:

```text
GET /health/
```

```text
GET /students/42/
```

An endpoint test may verify:

- HTTP status
- JSON content
- Error response
- Database changes

---

# 8. Model Tests

Model tests verify database-related behavior.

Examples include:

- Creating a Student
- Saving field values
- Querying records
- Validating relationships
- Testing model methods

Django's `TestCase` provides an isolated database environment for these tests.

---

# 9. Django's Temporary Test Database

When database tests use:

```python
from django.test import TestCase
```

Django creates a separate temporary test database.

Tests can create, update, and delete records without modifying the normal development database.

Conceptually:

```text
Development Database
        X
        |
        | isolated
        |
Temporary Test Database
        |
        +-- Create records
        +-- Modify records
        +-- Delete records
```

This keeps test data independent from development data.

---

# 10. Django Test Client

Tests do not normally require a developer to manually open a browser and click through the application.

Django provides a test client:

```python
self.client
```

It behaves like a small HTTP client.

It can send requests such as:

```python
self.client.get(...)
```

```python
self.client.post(...)
```

and can also be used with other HTTP methods.

The response can then be inspected.

---

# 11. `TestCase` vs `SimpleTestCase`

The lecture makes an important distinction.

| Class | Use When |
|---|---|
| `TestCase` | The test needs Django's database |
| `SimpleTestCase` | The test does not need database access |

### Use `TestCase`

Example:

```python
class StudentAPITest(TestCase):
    ...
```

when testing:

- Models
- Database-backed views
- Database records

### Use `SimpleTestCase`

Example:

```python
class ExternalServiceTest(
    SimpleTestCase
):
    ...
```

when testing:

- Utility functions
- Mocked external services
- Logic that does not require the database

Choosing the simpler test class makes the test's purpose clearer.

---

# 12. Testing and Debugging Workflow

The lecture presents the following workflow:

```text
Test Runner
manage.py test
      ↓
Test Client
GET / POST / PUT
      ↓
Django Application
URLconf → View
      ↓
Temporary Test DB
isolated test data
      ↓
Assertions
status / JSON / database state
      ↓
Test Failure?
      |
   +--+--+
   |     |
  No    Yes
   |     |
 Pass    v
       Diagnose
       traceback
       logs
       debugger
         ↓
       Fix Code
         ↓
       Re-run
```

The cycle continues until expected behavior is verified.

---

# 13. Test Execution Process

A typical Django test follows these steps:

1. The test runner discovers the test.
2. Django executes the test.
3. The test client sends a request.
4. URL configuration resolves the request.
5. The View handles the request.
6. Database tests use isolated test data.
7. Assertions compare actual and expected behavior.
8. If the assertion fails, Django reports the failure.
9. The developer reads the failure and traceback.
10. The defect is fixed.
11. The test is run again.

---

# 14. Assertions

Assertions compare actual behavior with expected behavior.

Example:

```python
self.assertEqual(
    response.status_code,
    200,
)
```

The expected result is:

```text
200
```

If the View returns:

```text
404
```

the assertion fails.

---

# 15. Debugging Technique: Read the Failure First

A failure commonly reports:

- Test name
- Source line
- Expected value
- Actual value
- Traceback

A useful process is:

```text
Assertion Failure
       ↓
Expected vs Actual
       ↓
Traceback
       ↓
First Relevant Application Line
       ↓
Root Cause
```

Start with the failed assertion and trace backward to the application code that produced the wrong result.

---

# 16. Logging

Python's logging system can help observe application behavior.

Example:

```python
import logging


logger = logging.getLogger(
    __name__
)


def student_detail(
    request,
    student_id,
):
    logger.info(
        "Looking up student_id=%s",
        student_id,
    )

    # application logic...
```

---

# 17. Log Levels

The lecture mentions several logging methods.

### Informational

```python
logger.info(...)
```

Used for normal informational events.

### Debug

```python
logger.debug(...)
```

Used for more detailed debugging information.

### Error

```python
logger.error(...)
```

Used for failures.

### Exception

```python
logger.exception(...)
```

Useful when logging an exception and traceback.

---

# 18. Logging vs `print()`

During development:

```python
print(...)
```

may display information in the terminal.

However, logging is preferred because messages can later be:

- Filtered
- Formatted
- Written to files
- Sent to monitoring systems
- Classified by severity

---

# 19. Logging Security

Do **not** log:

- Passwords
- Tokens
- Session cookies
- Sensitive personal data

Production logging should use appropriate log levels and a suitable centralized log destination.

---

# 20. Django Debug Toolbar

The **Django Debug Toolbar** can help inspect:

- SQL queries
- Request timing
- Templates
- Cache activity
- Headers

Install it in a development environment with:

```bash
python -m pip install django-debug-toolbar
```

It must then be configured in the Django project according to the installed version.

---

## 20.1 Debug Toolbar Security

The toolbar is intended for development.

Do not expose debugging information publicly.

Debug information may reveal:

- Settings
- SQL queries
- File paths
- Request data

The lecture recommends keeping:

```python
DEBUG = True
```

only in an appropriate development environment and restricting toolbar access to trusted local users.

---

# Part B — Hands-On

# 21. Task 1 — Test the Health Endpoint

Create:

```text
students/tests.py
```

Django automatically discovers conventional test files such as:

```text
tests.py
```

and test files whose names begin with:

```text
test
```

---

# 22. Health Endpoint Test

```python
from django.test import TestCase
from django.urls import reverse


class StudentAPITest(TestCase):

    def test_health_endpoint(self):

        response = self.client.get(
            reverse("health-check")
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            response.json()["status"],
            "ok",
        )
```

---

# 23. Understanding `self.client`

The line:

```python
self.client.get(...)
```

sends a request to Django without starting a real development server.

This makes tests:

- Fast
- Automated
- Repeatable

---

# 24. Understanding `reverse()`

Instead of hard-coding:

```text
/health/
```

the test uses:

```python
reverse("health-check")
```

The URL configuration should contain a matching name:

```python
path(
    "health/",
    views.health_check,
    name="health-check",
)
```

The string:

```text
health-check
```

is the URL **name**.

It is not:

- The path
- The View function name

---

# 25. Why Use Named URLs?

Using:

```python
reverse("health-check")
```

makes tests less dependent on the exact path.

For example, if:

```text
/health/
```

later changes to:

```text
/api/health/
```

the test can continue working as long as the URL name remains:

```text
health-check
```

---

# 26. `NoReverseMatch`

If Django raises:

```text
NoReverseMatch
```

check:

- URL name spelling
- URL namespace
- Required URL parameters

---

# 27. Task 2 — Test a Parameterized Endpoint

Example:

```python
class StudentRouteTest(TestCase):

    def test_student_detail_returns_id(
        self
    ):
        response = self.client.get(
            reverse(
                "student-detail",
                kwargs={
                    "student_id": 42
                },
            )
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            response.json()[
                "student_id"
            ],
            42,
        )
```

---

# 28. Matching URL Pattern

The corresponding route can be:

```python
path(
    "students/<int:student_id>/",
    views.student_detail,
    name="student-detail",
)
```

The parameter name is:

```text
student_id
```

Therefore the `kwargs` dictionary must use exactly:

```python
{
    "student_id": 42
}
```

---

# 29. Common Parameterized URL Mistake

This is incomplete:

```python
reverse("student-detail")
```

because the URL requires:

```text
student_id
```

The correct call supplies the parameter:

```python
reverse(
    "student-detail",
    kwargs={
        "student_id": 42
    },
)
```

---

# 30. Task 3 — Run the Tests

Run the complete test suite:

```bash
python manage.py test
```

Run commands from the directory containing:

```text
manage.py
```

---

# 31. Run One Test Class

```bash
python manage.py test \
  students.tests.StudentAPITest
```

This is useful when debugging a specific group of tests.

---

# 32. Run One Test Method

```bash
python manage.py test \
  students.tests.StudentAPITest.test_health_endpoint
```

Focused execution can speed up the debugging cycle.

---

# 33. Verbose Test Output

```bash
python manage.py test -v 2
```

This shows more detail about test execution.

---

# 34. Stop After First Failure

```bash
python manage.py test --failfast
```

This is useful when the first failure should be investigated before running the remaining tests.

---

# 35. Reading a Failure

Suppose the output contains:

```text
200 != 404
```

This means:

```text
Expected: 200
Actual:   404
```

Possible causes include:

- Wrong URL
- Missing route
- Incorrect View behavior
- Missing database record
- Wrong test expectation

Start with the final exception message and then inspect the failed assertion and traceback.

---

# 36. Successful Test Result

A successful result may end with:

```text
OK
```

This means the executed assertions passed.

It does **not** mean every possible application behavior has been tested.

Test quality depends on the behaviors covered.

---

# 37. Task 4 — Test a Service with a Mock

The external API integration from Lecture 28 should not use the real internet during tests.

Use:

```python
unittest.mock.patch
```

to replace the network dependency.

---

# 38. Mocked Timeout Test

```python
from unittest.mock import patch

from django.test import (
    SimpleTestCase,
)

import requests

from .utils import (
    get_external_data,
)


class ExternalServiceTest(
    SimpleTestCase
):

    @patch(
        "students.utils.requests.get"
    )
    def test_timeout_returns_safe_error(
        self,
        mock_get,
    ):
        mock_get.side_effect = (
            requests.Timeout
        )

        result = get_external_data(1)

        self.assertIsNone(
            result["data"]
        )

        self.assertEqual(
            result["error"],
            "External service timed out",
        )
```

---

# 39. Why Use `SimpleTestCase` Here?

The test:

- Does not access Django models
- Does not require a database
- Tests a utility
- Mocks the external service

Therefore:

```python
SimpleTestCase
```

is appropriate.

---

# 40. Mocking the Timeout

The line:

```python
mock_get.side_effect = (
    requests.Timeout
)
```

makes the fake:

```python
requests.get(...)
```

raise a timeout.

No internet request is made.

---

# 41. Patch the Correct Import Location

The patch target is:

```python
@patch(
    "students.utils.requests.get"
)
```

because `utils.py` contains:

```python
requests.get(...)
```

The dependency must be patched where the application code looks it up.

Patching the wrong path may allow the real network request to execute.

---

# 42. Mocked Success Test

External-service tests should normally cover both:

- Success
- Failure

Example success test:

```python
@patch(
    "students.utils.requests.get"
)
def test_success_returns_data(
    self,
    mock_get,
):
    (
        mock_get
        .return_value
        .json
        .return_value
    ) = {
        "name": "Aarav"
    }

    (
        mock_get
        .return_value
        .raise_for_status
        .return_value
    ) = None

    result = get_external_data(1)

    self.assertEqual(
        result["data"]["name"],
        "Aarav",
    )

    self.assertIsNone(
        result["error"]
    )
```

---

# 43. Why Test Both Paths?

Error-handling code is easy to overlook.

A useful minimum is:

```text
Success Path
    +
Failure Path
```

For the external service:

```text
Successful JSON Response
        +
Timeout
```

This verifies both normal and defensive behavior.

---

# 44. Task 5 — Introduce and Diagnose a Defect

The lecture intentionally introduces a defect.

Temporarily change the health View so that it returns:

```text
201
```

instead of:

```text
200
```

Then run the test.

---

# 45. Expected Failure

The test expects:

```python
self.assertEqual(
    response.status_code,
    200,
)
```

but the application returns:

```text
201
```

The test should fail.

This gives evidence of the defect.

---

# 46. Debugging Cycle

The lecture recommends this process:

```text
1. Write down expected behavior
              ↓
2. Reproduce the problem with a test
              ↓
3. Read failure and traceback
              ↓
4. Inspect relevant application code
              ↓
5. Fix the code
              ↓
6. Run the focused test again
              ↓
7. Run the complete test suite
```

---

# 47. Do Not Weaken the Test

If the requirement is:

```text
Health endpoint returns HTTP 200
```

and the application returns:

```text
201
```

do not simply change the test to expect `201`.

The test describes the required behavior.

Fix the View or configuration that caused the incorrect result.

---

# Part C — PBL Activity

# 48. Problem Scenario

A new feature has been added to the Student Management API.

During the change, an existing endpoint may have been broken.

The team needs automated tests to detect the regression and evidence to diagnose the problem.

---

# 49. Student Tasks

Students should:

1. Inspect the existing URL patterns.
2. Inspect the existing View functions.
3. Inspect model fields where relevant.
4. Write a health endpoint test.
5. Write a student list endpoint test.
6. Write a student detail endpoint test.
7. Add model tests if a `Student` model exists.
8. Mock the external service.
9. Test the external service success case.
10. Test the external service timeout case.
11. Diagnose an intentionally introduced defect.
12. Use test output and logs as debugging evidence.

---

# 50. Tests Must Match the Real Application

Before writing a test, inspect the application's actual:

- Route names
- URL parameters
- JSON response format
- Model fields

Tests should not assume behavior that the application does not define.

---

# 51. Testing List Responses

If an endpoint returns a list, useful assertions include:

- Status code
- List length
- Important fields
- Expected values

Conceptually:

```python
response = self.client.get(...)

self.assertEqual(
    response.status_code,
    200,
)

data = response.json()

self.assertEqual(
    len(data),
    2,
)
```

The exact assertion should match the application's real response structure.

---

# 52. Testing Error Responses

If an endpoint returns an error, test both:

- HTTP status
- Error message

Conceptually:

```python
self.assertEqual(
    response.status_code,
    404,
)

self.assertEqual(
    response.json()["error"],
    "Student not found",
)
```

Again, the exact keys and messages must match the application being tested.

---

# 53. Isolated Database Test Data

Database tests should create their own records.

Example from the lecture:

```python
student = Student.objects.create(
    name="Aarav",
    email="aarav@example.com",
)

response = self.client.get(
    reverse(
        "student-detail",
        kwargs={
            "student_id":
                student.id
        },
    )
)

self.assertEqual(
    response.status_code,
    200,
)

self.assertEqual(
    response.json()["name"],
    "Aarav",
)
```

---

# 54. Why Create Data Inside the Test?

Do not depend on records manually inserted into the development database.

Instead:

```text
Test Starts
    ↓
Create Required Record
    ↓
Execute Behavior
    ↓
Assert Result
    ↓
Django Cleans Test Database
```

This keeps tests independent and repeatable.

---

# 55. Test Independence

One test should not rely on:

- Another test running first
- Data created by another test
- Development database records
- Manual setup outside the test suite

Each test should create the state it requires.

---

# 56. PBL Expected Learning

Students demonstrate:

- Regression testing
- API behavior verification
- Isolated database usage
- Mock-based dependency testing
- Systematic debugging

---

# 57. Assessment Activity

## Assessment Method

Coding exercise and debugging task.

| Criterion | Expected Evidence |
|---|---|
| Test coverage | Health, list, detail, and relevant failure paths are tested |
| Test quality | Uses named URLs, meaningful assertions, and isolated test data |
| Debugging | Interprets the traceback and identifies faulty code |
| Dependency testing | Mocks external API calls rather than using the internet |
| CO Attainment | Explains how testing supports reliable and secure backend development |

---

# 58. Suggested Test File Structure

A possible organization is:

```text
students/
├── models.py
├── views.py
├── urls.py
├── utils.py
└── tests.py
```

Inside `tests.py`, tests can be grouped by purpose:

```python
class StudentAPITest(TestCase):
    # endpoint tests
    pass


class StudentModelTest(TestCase):
    # model/database tests
    pass


class ExternalServiceTest(
    SimpleTestCase
):
    # mocked service tests
    pass
```

---

# 59. Test Command Cheat Sheet

## Run All Tests

```bash
python manage.py test
```

## Verbose Output

```bash
python manage.py test -v 2
```

## Stop on First Failure

```bash
python manage.py test --failfast
```

## Run a Test Class

```bash
python manage.py test \
  students.tests.StudentAPITest
```

## Run One Method

```bash
python manage.py test \
  students.tests.StudentAPITest.test_health_endpoint
```

---

# 60. Debugging Checklist

When a test fails:

- [ ] Read the final failure message.
- [ ] Identify the failed test.
- [ ] Find the failed assertion.
- [ ] Compare expected and actual values.
- [ ] Read the traceback.
- [ ] Inspect the first relevant application line.
- [ ] Check route names and URL parameters.
- [ ] Check JSON response keys and values.
- [ ] Check required database records.
- [ ] Inspect logs.
- [ ] Fix the application behavior.
- [ ] Re-run the focused test.
- [ ] Run the complete suite.

---

# 61. Testing Checklist

## Health Endpoint

- [ ] Resolve the named URL with `reverse()`.
- [ ] Send a GET request.
- [ ] Assert HTTP `200`.
- [ ] Assert expected JSON status.

## Student Detail

- [ ] Provide `student_id`.
- [ ] Use matching `kwargs`.
- [ ] Assert status.
- [ ] Assert returned student information.

## Database Tests

- [ ] Use `TestCase`.
- [ ] Create test records inside the test.
- [ ] Do not rely on development data.

## External Service

- [ ] Use `SimpleTestCase` if no database is needed.
- [ ] Patch the correct dependency path.
- [ ] Test success.
- [ ] Test timeout.
- [ ] Make no real internet request.

---

# 62. Security and Testing

Testing supports secure and reliable backend development by verifying that expected behaviors continue to work.

Logging also requires security awareness.

Never expose sensitive information such as:

```text
Passwords
Tokens
Session Cookies
Sensitive Personal Data
```

Debugging tools should not be publicly exposed in production.

---

# 63. Complete Testing Flow

The overall lecture can be summarized as:

```text
Requirement
    ↓
Write Test
    ↓
Run Test
    ↓
Test Client
    ↓
URLconf
    ↓
View / Model / Service
    ↓
Actual Result
    ↓
Assertion
    |
 +--+--+
 |     |
Pass  Fail
       |
       v
   Traceback
       ↓
      Logs
       ↓
    Diagnose
       ↓
      Fix
       ↓
   Re-run Test
       ↓
 Full Test Suite
```

---

# 64. Key Takeaways

1. Automated tests protect application behavior against regressions.
2. Tests describe expected behavior in executable form.
3. Unit tests focus on small pieces of logic.
4. Integration tests verify components working together.
5. Endpoint tests verify HTTP behavior.
6. Model tests verify database behavior.
7. Django's `TestCase` provides an isolated temporary test database.
8. `SimpleTestCase` is suitable when database access is unnecessary.
9. Django's test client can send requests without a live server.
10. `reverse()` avoids hard-coding URL paths.
11. Parameterized routes require matching `args` or `kwargs`.
12. `python manage.py test` runs Django tests.
13. `-v 2` provides more detailed output.
14. `--failfast` stops after the first failure.
15. A failed assertion provides evidence for debugging.
16. Logs and tracebacks help locate defects.
17. Logging is preferable to uncontrolled `print()` statements for structured diagnostics.
18. Sensitive information should never be written to logs.
19. Django Debug Toolbar is useful for local investigation but should not be exposed publicly.
20. External API calls should be mocked in tests.
21. The mock target must match where the dependency is looked up.
22. External integrations should test both success and failure paths.
23. Database tests should create their own data.
24. Tests should remain independent from one another.
25. Do not weaken a correct test merely to make a defect disappear.

---

# 65. Summary

Testing verifies that a Django application behaves according to its requirements.

The central workflow is:

```text
Expected Behavior
       ↓
Automated Test
       ↓
Actual Behavior
       ↓
Assertion
       ↓
Pass or Failure
```

When a failure occurs:

```text
Failure
   ↓
Traceback
   ↓
Logs
   ↓
Application Code
   ↓
Fix
   ↓
Re-run
```

Django provides:

- Test discovery
- A test runner
- A test client
- Temporary database isolation
- Assertion support through Python's testing framework

External dependencies should be mocked so tests remain deterministic.

---

# 66. Next Lecture

**Lecture 30 — Security, Authentication, and Authorization in Django**

---

# Conclusion

Testing and debugging are essential parts of backend development. Django's testing tools allow developers to verify API endpoints, database behavior, URL routing, and application responses without manually running a browser-based workflow.

The lecture emphasizes three important principles:

```text
Test Expected Behavior
        +
Isolate Dependencies
        +
Use Failures as Evidence
```

`TestCase` provides database isolation, while `SimpleTestCase` is appropriate for logic that does not need database access. The Django test client can exercise Views without running a live server, and `reverse()` keeps tests tied to named routes rather than hard-coded paths.

When tests fail, the correct response is to inspect the assertion, traceback, logs, and relevant application code. Tests should not be weakened merely to hide a defect.

Finally, external services should be mocked so tests remain fast, repeatable, and independent of internet availability. Together, automated tests, isolated data, logging, tracebacks, and systematic debugging provide a foundation for reliable Django backend applications.
