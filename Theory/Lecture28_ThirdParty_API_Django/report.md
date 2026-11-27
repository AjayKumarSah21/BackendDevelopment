# Integrating Third-Party APIs and Services

## Lecture Information

- **Lecture:** 28
- **Unit:** Unit 3 — Frameworks and Performance Optimization
- **Topic:** Integrating Third-Party APIs and Services
- **Course Outcome:** CO3 — Utilize frameworks and APIs to build backend applications.
- **Bloom's Knowledge Level:** Apply and Analyze
- **Skills Developed:** HTTP client usage, service-layer design, JSON handling, timeout and exception handling, and API testing with mocks
- **Applications:** Payment gateways, social login, weather and mapping services, notifications, and data-provider integrations
- **PBL Activity:** Add an external data service to the Student Management API
- **Assessment Method:** Coding, error-handling, and mocked testing exercise

---

# Part A — Theory

## 1. Learning Objectives

By the end of this lecture, students should be able to:

1. Explain why backend applications consume third-party APIs.
2. Make HTTP requests from Django using the `requests` library.
3. Separate external-service code from Django view code.
4. Handle timeouts, HTTP errors, network failures, and invalid JSON safely.
5. Test an external-service integration without making a real internet request.

---

# 2. Why Integrate Third-Party APIs?

Modern applications rarely operate completely independently.

Instead of implementing every capability internally, backend applications can integrate specialized external services.

Common examples include:

- Stripe or PayPal for payments
- Google or GitHub OAuth for authentication
- Weather services
- Mapping services
- Stock-data providers
- Email services
- SMS services
- Notification providers
- Institutional data services
- Government data services

The basic idea is:

```text
Application
    +
External Service
    =
Extended Application Capability
```

Third-party integrations allow developers to reuse existing specialized services instead of building and maintaining those systems themselves.

---

## 2.1 External APIs Are Dependencies

An external API should be treated as an external dependency.

It may:

- Respond slowly
- Become unavailable
- Return an HTTP error
- Return invalid data
- Change its behavior
- Require authentication
- Apply rate limits

A reliable backend must therefore handle failures explicitly.

---

# 3. Third-Party API Integration Architecture

The browser does not necessarily need to communicate directly with an external provider.

Instead, Django can act as an intermediary.

```text
Client
  |
  | GET /api/external/1/
  v
Django View
  |
  | validates input
  | builds application response
  v
Service / Utility Layer
  |
  | requests.get(...)
  | timeout
  | exception handling
  v
Third-Party API
  |
  | JSON response / failure
  v
Service / Utility Layer
  |
  | normalize result
  v
Django View
  |
  v
Controlled JSON Response
  |
  v
Client
```

This creates a clear **external network boundary**.

---

# 4. Why Use a Service Layer?

External HTTP-client logic should not be mixed directly into every Django view.

A better structure is:

```text
View
 ↓
Service / Utility
 ↓
External API
```

The service layer is responsible for:

- Building external URLs
- Sending HTTP requests
- Applying timeouts
- Decoding JSON
- Handling network exceptions
- Handling HTTP failures
- Returning a controlled result

The view is responsible for:

- Receiving the client request
- Calling the service
- Choosing the application's HTTP response
- Returning JSON to the client

---

## 4.1 Separation of Concerns

Without separation:

```text
View
├── Validate request
├── Build external URL
├── Call API
├── Handle timeout
├── Handle HTTP error
├── Parse JSON
└── Build response
```

With a service layer:

```text
View
├── Receive request
├── Call service
└── Return response

Service
├── Build URL
├── Call external API
├── Apply timeout
├── Handle exceptions
└── Parse response
```

This makes the application easier to:

- Read
- Maintain
- Test
- Debug
- Extend

---

# 5. Integration Request Flow

For:

```text
GET /api/external/1/
```

the flow is:

1. Django receives the client request.
2. The View calls a service utility.
3. The utility builds the external URL.
4. The utility sends an HTTP request with a timeout.
5. The external service returns JSON or fails.
6. The utility checks the response.
7. The utility returns either data or a safe error result.
8. The View returns a controlled JSON response.
9. If the dependency is unavailable, the View returns an appropriate error status.

---

# 6. Failure Protection

External services should never be allowed to make a Django request wait indefinitely.

Important failure cases include:

```text
Timeout
   ↓
Connection / Network Failure
   ↓
HTTP Error
   ↓
Invalid JSON
   ↓
Safe Application Response
```

The service boundary should protect the rest of the application from these failures.

---

# 7. The `requests` Library

Python's `requests` library provides a readable interface for HTTP communication.

Install it with:

```bash
python -m pip install requests
```

Important functionality includes:

| Feature | Purpose |
|---|---|
| `requests.get()` | Send an HTTP GET request |
| `requests.post()` | Send an HTTP POST request |
| `response.json()` | Decode JSON into Python data |
| `response.raise_for_status()` | Raise an exception for HTTP 4xx/5xx responses |
| `timeout` | Limit how long the request may wait |
| `requests.Timeout` | Represents timeout failures |
| `requests.RequestException` | Base exception for request/network failures |

---

## 7.1 Basic GET Request

```python
import requests

response = requests.get(
    "https://example.com/api/data",
    timeout=2,
)

response.raise_for_status()

data = response.json()
```

---

## 7.2 Why `timeout` Matters

Without a timeout:

```python
requests.get(url)
```

an external service may cause the application request to wait too long.

With a timeout:

```python
requests.get(
    url,
    timeout=2,
)
```

the application limits how long it waits for the dependency.

In this lecture, the timeout is:

```text
2 seconds
```

---

## 7.3 Why `raise_for_status()` Matters

An HTTP response does not automatically mean the request succeeded.

The external API could return:

```text
400 Bad Request
404 Not Found
429 Too Many Requests
500 Internal Server Error
503 Service Unavailable
```

Calling:

```python
response.raise_for_status()
```

converts HTTP failure responses into exceptions that can be handled.

---

## 7.4 JSON Handling

External APIs commonly return JSON.

```python
data = response.json()
```

This converts JSON into Python data.

For example:

```json
{
  "id": 1,
  "title": "Example"
}
```

becomes a Python dictionary.

However, invalid JSON can cause:

```python
response.json()
```

to raise `ValueError`.

That failure should also be handled.

---

# Part B — Hands-On

# 8. Task 1 — Install the HTTP Client

Install `requests`:

```bash
python -m pip install requests
```

---

# 9. Task 2 — Create the Service Utility

Create:

```text
students/utils.py
```

Add:

```python
import requests


EXTERNAL_API_URL = (
    "https://jsonplaceholder.typicode.com/"
    "posts/{post_id}"
)


def get_external_data(post_id):
    url = EXTERNAL_API_URL.format(
        post_id=post_id
    )

    try:
        response = requests.get(
            url,
            timeout=2,
        )

        response.raise_for_status()

        return {
            "data": response.json(),
            "error": None,
        }

    except requests.Timeout:
        return {
            "data": None,
            "error": (
                "External service timed out"
            ),
        }

    except requests.RequestException:
        return {
            "data": None,
            "error": (
                "External service is unavailable"
            ),
        }

    except ValueError:
        return {
            "data": None,
            "error": (
                "External service returned "
                "invalid JSON"
            ),
        }
```

---

# 10. Understanding the Service Utility

The service uses this URL pattern:

```text
https://jsonplaceholder.typicode.com/posts/{post_id}
```

For:

```python
get_external_data(1)
```

the URL becomes:

```text
https://jsonplaceholder.typicode.com/posts/1
```

---

## 10.1 Success Result

If the request succeeds:

```python
{
    "data": response.json(),
    "error": None,
}
```

The View receives the decoded external data.

---

## 10.2 Timeout Result

If the external API takes too long:

```python
except requests.Timeout:
```

the function returns:

```python
{
    "data": None,
    "error": "External service timed out",
}
```

---

## 10.3 Network or HTTP Failure

The following handler covers request-related failures:

```python
except requests.RequestException:
```

and returns:

```python
{
    "data": None,
    "error": "External service is unavailable",
}
```

---

## 10.4 Invalid JSON

If the response cannot be decoded as JSON:

```python
except ValueError:
```

the service returns:

```python
{
    "data": None,
    "error": (
        "External service returned invalid JSON"
    ),
}
```

---

# 11. Configuration Consideration

The lecture uses:

```python
EXTERNAL_API_URL = (
    "https://jsonplaceholder.typicode.com/"
    "posts/{post_id}"
)
```

and:

```python
timeout=2
```

directly in the module.

For a production project, values such as:

- External API URL
- Timeout
- API keys
- Authentication credentials

would normally come from application configuration rather than being hard-coded.

---

# 12. Task 3 — Use the Service in a View

Open:

```text
students/views.py
```

Add:

```python
from django.http import JsonResponse

from .utils import get_external_data


def external_data_view(
    request,
    post_id,
):
    result = get_external_data(
        post_id
    )

    if result["error"]:
        return JsonResponse(
            {
                "error":
                    result["error"]
            },
            status=503,
        )

    return JsonResponse(
        result["data"]
    )
```

---

# 13. View Responsibilities

The View does not directly call:

```python
requests.get(...)
```

Instead, it calls:

```python
get_external_data(post_id)
```

This keeps the external integration inside the service/utility layer.

The View then decides how the application should respond.

---

## 13.1 Successful Request

If:

```python
result["error"]
```

is empty, the View returns:

```python
JsonResponse(
    result["data"]
)
```

---

## 13.2 Failed Dependency

If the external service fails:

```python
if result["error"]:
```

the View returns:

```python
JsonResponse(
    {
        "error": result["error"]
    },
    status=503,
)
```

The response status is:

```text
503 Service Unavailable
```

This tells the client that the application could not complete the request because a required service was unavailable.

---

# 14. Task 4 — Add the Route

In:

```text
students/urls.py
```

add:

```python
path(
    "external/<int:post_id>/",
    views.external_data_view,
    name="external-data",
),
```

The route accepts an integer:

```text
post_id
```

Example:

```text
external/1/
```

---

# 15. Test the Endpoint

Test:

```text
GET /api/students/external/1/
```

The application flow becomes:

```text
GET /api/students/external/1/
          ↓
Django URL Routing
          ↓
external_data_view
          ↓
get_external_data(1)
          ↓
requests.get(...)
          ↓
JSONPlaceholder
          ↓
JSON Response
          ↓
Django JsonResponse
          ↓
Client
```

---

# 16. Task 5 — Test Without the Internet

Tests should not depend on the real external service.

The lecture uses:

```python
unittest.mock
```

to replace:

```python
requests.get
```

during testing.

This allows the test to control exactly what the external call returns.

---

# 17. Mocked Success Test

```python
from unittest.mock import (
    Mock,
    patch,
)

from django.test import (
    SimpleTestCase,
)

from .utils import (
    get_external_data,
)


class ExternalDataTests(
    SimpleTestCase
):
    @patch(
        "students.utils.requests.get"
    )
    def test_external_data_success(
        self,
        mock_get,
    ):
        mock_response = Mock()

        mock_response.json.return_value = {
            "id": 1,
            "title": "Example",
        }

        (
            mock_response
            .raise_for_status
            .return_value
        ) = None

        mock_get.return_value = (
            mock_response
        )

        result = get_external_data(1)

        self.assertEqual(
            result["data"]["id"],
            1,
        )

        mock_get.assert_called_once_with(
            (
                "https://jsonplaceholder."
                "typicode.com/posts/1"
            ),
            timeout=2,
        )
```

---

# 18. Understanding `@patch`

The decorator:

```python
@patch(
    "students.utils.requests.get"
)
```

temporarily replaces:

```python
requests.get
```

inside `students.utils`.

Instead of performing a real internet request, the function receives a mock.

---

# 19. Creating the Mock Response

The test creates:

```python
mock_response = Mock()
```

Then configures:

```python
mock_response.json.return_value = {
    "id": 1,
    "title": "Example",
}
```

This means:

```python
response.json()
```

returns the controlled test data.

---

## 19.1 Mocking `raise_for_status()`

```python
mock_response.raise_for_status.return_value = None
```

simulates a successful HTTP response.

---

## 19.2 Returning the Mock from `requests.get()`

```python
mock_get.return_value = mock_response
```

Now:

```python
requests.get(...)
```

returns the fake response instead of accessing the internet.

---

# 20. Verify the Result

The test checks:

```python
self.assertEqual(
    result["data"]["id"],
    1,
)
```

This verifies that the service correctly processed the mocked JSON.

---

# 21. Verify the HTTP Call

The test also checks:

```python
mock_get.assert_called_once_with(
    "https://jsonplaceholder.typicode.com/posts/1",
    timeout=2,
)
```

This confirms that:

- The correct URL was built.
- The timeout was supplied.
- The HTTP function was called once.

---

# 22. Why Mock External APIs?

Mocking makes tests:

- Fast
- Repeatable
- Predictable
- Independent of internet connectivity
- Independent of external-service uptime

Without mocking:

```text
Test
 ↓
Internet
 ↓
External Service
```

The test could fail because of a network problem rather than a bug in the application.

With mocking:

```text
Test
 ↓
Mocked requests.get()
 ↓
Controlled Response
```

The test remains under application control.

---

# 23. Mocked Timeout Test

The PBL activity also requires a timeout test.

A suitable mocked test follows the same service behavior defined in the lecture:

```python
from unittest.mock import patch

import requests

from django.test import SimpleTestCase

from .utils import get_external_data


class ExternalDataTimeoutTests(
    SimpleTestCase
):
    @patch(
        "students.utils.requests.get"
    )
    def test_external_data_timeout(
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

This test does not make a real network request.

It forces:

```python
requests.get(...)
```

to raise:

```python
requests.Timeout
```

and verifies that the service returns the expected safe error result.

---

# 24. Error-Handling Matrix

| Failure | Service Behavior | Application Response |
|---|---|---|
| Successful request | Return decoded JSON | Normal JSON response |
| Timeout | Return timeout error | `503 Service Unavailable` |
| Network/request failure | Return unavailable error | `503 Service Unavailable` |
| HTTP 4xx/5xx | `raise_for_status()` raises request exception | `503 Service Unavailable` |
| Invalid JSON | Return invalid-JSON error | `503 Service Unavailable` |

---

# 25. Suggested Django Structure

The integration can fit into the Student Management API like this:

```text
student_system/
├── manage.py
│
├── student_system/
│   ├── settings.py
│   ├── urls.py
│   └── ...
│
└── students/
    ├── __init__.py
    ├── models.py
    ├── views.py
    ├── urls.py
    ├── utils.py
    ├── tests.py
    └── ...
```

The important separation is:

```text
views.py
   ↓
utils.py
   ↓
Third-Party API
```

---

# Part C — PBL Activity

# 26. Problem Scenario

The Student Management API needs to display information from an external service.

However, the external service may sometimes be:

- Slow
- Unavailable
- Unable to return valid data

The backend must remain predictable when those failures occur.

---

# 27. Student Task

Implement the following:

1. Create the service utility.
2. Call the external API using `requests`.
3. Set a two-second timeout.
4. Handle timeout and request failures.
5. Handle invalid JSON.
6. Use the utility from a Django View.
7. Return HTTP `503 Service Unavailable` when the dependency cannot be reached.
8. Add a mocked successful-response test.
9. Add a mocked timeout test.

---

# 28. Expected Learning

The activity demonstrates:

- Third-party API consumption
- Service-layer design
- Separation of concerns
- Defensive error handling
- JSON processing
- HTTP timeout usage
- Dependency failure handling
- Mock-based testing
- Testing without a live network dependency

---

# 29. Assessment Activity

## Assessment Method

Coding and mocked testing exercise.

| Criterion | Expected Evidence |
|---|---|
| Integration | Correctly calls the external endpoint and decodes JSON |
| Reliability | Uses a timeout and handles network/HTTP failures |
| API design | Keeps external communication in a utility/service module |
| Testing | Uses `unittest.mock` instead of calling the real internet |
| CO Attainment | Explains how the integration extends the backend application |

---

# 30. Complete Integration Flow

The complete architecture can be summarized as:

```text
Client
  |
  | GET /api/students/external/1/
  v
Django URL Router
  |
  v
external_data_view()
  |
  v
get_external_data()
  |
  +----------------------------+
  |                            |
  | requests.get(timeout=2)    |
  v                            |
Third-Party API                |
  |                            |
  | JSON / Error               |
  v                            |
Service Error Handling <-------+
  |
  v
Normalized Result
  |
  v
Django View
  |
  +--> Success → JSON
  |
  +--> Failure → 503
  |
  v
Client
```

---

# 31. Service-Layer Pattern

A reusable principle from the lecture is:

```text
Views should coordinate.
Services should integrate.
```

The View should know:

- What application operation is being performed
- What response should be returned

The service should know:

- Which external endpoint to call
- How to call it
- How long to wait
- How to decode the result
- How to handle failures

---

# 32. Reliability Checklist

When integrating an external API:

- [ ] Keep HTTP-client logic outside the View.
- [ ] Use an explicit timeout.
- [ ] Check HTTP status codes.
- [ ] Handle timeout exceptions.
- [ ] Handle request/network exceptions.
- [ ] Handle invalid JSON.
- [ ] Return controlled errors to clients.
- [ ] Avoid exposing unnecessary external-service details.
- [ ] Test success without using the internet.
- [ ] Test timeout behavior with a mock.
- [ ] Keep configurable values out of hard-coded production logic where appropriate.

---

# 33. Testing Checklist

## Success Case

- [ ] Mock `requests.get`.
- [ ] Return a fake response.
- [ ] Configure fake JSON.
- [ ] Make `raise_for_status()` succeed.
- [ ] Verify returned data.
- [ ] Verify the exact external URL.
- [ ] Verify `timeout=2`.

## Timeout Case

- [ ] Mock `requests.get`.
- [ ] Raise `requests.Timeout`.
- [ ] Verify `data` is `None`.
- [ ] Verify the timeout error message.

## Additional Failure Cases

The service implementation also supports tests for:

- [ ] `requests.RequestException`
- [ ] Invalid JSON / `ValueError`

---

# 34. Key Takeaways

1. Third-party APIs extend backend applications without requiring every specialized capability to be built internally.
2. External APIs should be treated as unreliable dependencies.
3. Django can call external APIs on the server and return only the information required by the client.
4. External HTTP calls should be placed in a service or utility module.
5. The `requests` library can send HTTP requests and decode JSON.
6. `response.raise_for_status()` detects HTTP failure responses.
7. Every external HTTP request should use a timeout.
8. The lecture uses a two-second timeout.
9. `requests.Timeout` handles timeout failures.
10. `requests.RequestException` handles request/network failures.
11. Invalid JSON should be handled safely.
12. The View should convert dependency failures into controlled application responses.
13. The lecture uses HTTP `503 Service Unavailable` for external-service failures.
14. Tests should not depend on a live external service.
15. `unittest.mock.patch` can replace `requests.get`.
16. Mocking makes integration tests fast, predictable, and repeatable.

---

# 35. Summary

Third-party services allow applications to reuse capabilities such as:

```text
Payments
Authentication
Weather
Maps
Email
SMS
Notifications
External Data
```

A reliable integration should follow this pattern:

```text
Django View
     ↓
Service / Utility
     ↓
requests.get(..., timeout=2)
     ↓
Third-Party API
     ↓
Validate Response
     ↓
Normalize Result
     ↓
Django Response
```

The service layer protects the application from:

- Timeouts
- Network failures
- HTTP failures
- Invalid JSON

Testing should replace real network calls with mocks:

```text
Test
  ↓
Mock requests.get
  ↓
Controlled Response / Exception
  ↓
Verify Application Behavior
```

---

# 36. Next Lecture

**Lecture 29 — Testing and Debugging Django Applications**

This follows naturally from the mocked testing introduced in this lecture.

---

# Conclusion

Integrating third-party APIs is a common backend-development requirement. External services can provide payments, authentication, notifications, maps, weather information, and other capabilities, but they also introduce dependencies outside the application's control.

The Django integration in this lecture uses a dedicated utility function:

```text
get_external_data(post_id)
```

to isolate HTTP communication from the View. The utility uses:

```python
requests.get(
    url,
    timeout=2,
)
```

and handles timeouts, request failures, HTTP errors, and invalid JSON.

The Django View then converts the normalized service result into either a successful JSON response or:

```text
503 Service Unavailable
```

when the external dependency fails.

Finally, `unittest.mock` allows the integration to be tested without accessing the internet. This combination of **service-layer separation, defensive error handling, explicit timeouts, and mocked testing** provides a reliable foundation for integrating external APIs into Django backend applications.
