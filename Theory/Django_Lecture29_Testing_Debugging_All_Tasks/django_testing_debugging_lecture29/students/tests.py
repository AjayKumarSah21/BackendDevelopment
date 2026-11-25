from unittest.mock import Mock, patch

import requests
from django.test import TestCase, SimpleTestCase
from django.urls import reverse

from .models import Student
from .utils import get_external_data


class StudentAPITest(TestCase):
    def test_health_endpoint(self):
        response = self.client.get(reverse("health-check"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    def test_student_list_endpoint_returns_json(self):
        Student.objects.create(name="Asha", email="asha@example.com", age=20)
        response = self.client.get(reverse("student-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["count"], 1)
        self.assertEqual(response.json()["students"][0]["name"], "Asha")

    def test_student_list_empty(self):
        response = self.client.get(reverse("student-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"students": [], "count": 0})


class StudentRouteTest(TestCase):
    def test_student_detail_returns_id(self):
        response = self.client.get(
            reverse("student-detail", kwargs={"student_id": 42})
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["student_id"], 42)


class StudentModelTest(TestCase):
    def test_student_record_is_saved(self):
        student = Student.objects.create(
            name="Ravi", email="ravi@example.com", age=21
        )
        self.assertIsNotNone(student.pk)
        self.assertEqual(Student.objects.get(pk=student.pk).name, "Ravi")


class ExternalServiceTest(SimpleTestCase):
    @patch("students.utils.requests.get")
    def test_success_returns_data(self, mock_get):
        mock_response = Mock()
        mock_response.json.return_value = {"id": 1, "title": "Demo"}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        result = get_external_data(1)

        self.assertEqual(result["data"]["title"], "Demo")
        self.assertIsNone(result["error"])
        mock_get.assert_called_once_with(
            "https://jsonplaceholder.typicode.com/posts/1", timeout=3
        )

    @patch("students.utils.requests.get")
    def test_timeout_returns_safe_error(self, mock_get):
        mock_get.side_effect = requests.Timeout

        result = get_external_data(1)

        self.assertIsNone(result["data"])
        self.assertEqual(result["error"], "External service timed out")

    @patch("students.utils.requests.get")
    def test_other_request_error_returns_safe_error(self, mock_get):
        mock_get.side_effect = requests.ConnectionError

        result = get_external_data(1)

        self.assertIsNone(result["data"])
        self.assertEqual(result["error"], "External service request failed")
