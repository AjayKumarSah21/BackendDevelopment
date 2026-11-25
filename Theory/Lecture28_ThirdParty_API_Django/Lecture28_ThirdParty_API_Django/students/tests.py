from unittest.mock import Mock, patch

import requests
from django.test import SimpleTestCase

from .utils import get_external_data


class ExternalDataTests(SimpleTestCase):
    @patch("students.utils.requests.get")
    def test_external_data_success(self, mock_get):
        mock_response = Mock()
        mock_response.json.return_value = {"id": 1, "title": "Example"}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        result = get_external_data(1)

        self.assertEqual(result["data"]["id"], 1)
        self.assertIsNone(result["error"])
        mock_get.assert_called_once_with(
            "https://jsonplaceholder.typicode.com/posts/1",
            timeout=2,
        )

    @patch("students.utils.requests.get", side_effect=requests.Timeout)
    def test_external_data_timeout(self, mock_get):
        result = get_external_data(1)

        self.assertIsNone(result["data"])
        self.assertEqual(result["error"], "External service timed out")
        mock_get.assert_called_once()

    @patch("students.utils.requests.get")
    def test_external_data_http_error(self, mock_get):
        mock_response = Mock()
        mock_response.raise_for_status.side_effect = requests.HTTPError("Server error")
        mock_get.return_value = mock_response

        result = get_external_data(1)

        self.assertIsNone(result["data"])
        self.assertEqual(result["error"], "External service is unavailable")

    @patch("students.utils.requests.get")
    def test_external_data_invalid_json(self, mock_get):
        mock_response = Mock()
        mock_response.raise_for_status.return_value = None
        mock_response.json.side_effect = ValueError("Invalid JSON")
        mock_get.return_value = mock_response

        result = get_external_data(1)

        self.assertIsNone(result["data"])
        self.assertEqual(result["error"], "External service returned invalid JSON")


class ExternalDataViewTests(SimpleTestCase):
    @patch("students.views.get_external_data")
    def test_view_returns_external_json(self, mock_service):
        mock_service.return_value = {
            "data": {"id": 1, "title": "Example"},
            "error": None,
        }

        response = self.client.get("/api/students/external/1/")

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {"id": 1, "title": "Example"})

    @patch("students.views.get_external_data")
    def test_view_returns_503_on_service_failure(self, mock_service):
        mock_service.return_value = {
            "data": None,
            "error": "External service timed out",
        }

        response = self.client.get("/api/students/external/1/")

        self.assertEqual(response.status_code, 503)
        self.assertJSONEqual(
            response.content,
            {"error": "External service timed out"},
        )
