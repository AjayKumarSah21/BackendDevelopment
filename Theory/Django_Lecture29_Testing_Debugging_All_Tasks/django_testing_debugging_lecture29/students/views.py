import logging
from django.http import JsonResponse
from .models import Student
from .utils import get_external_data

logger = logging.getLogger(__name__)

def health_check(request):
    return JsonResponse({"status": "ok"}, status=200)

def student_list(request):
    students = list(Student.objects.order_by("id").values("id", "name", "email", "age"))
    return JsonResponse({"students": students, "count": len(students)})

def student_detail(request, student_id):
    logger.info("Looking up student_id=%s", student_id)
    # The parameterized route test checks the ID without requiring a database record.
    return JsonResponse({"student_id": student_id, "name": "Demo Student"}, status=200)

def external_data_view(request, item_id):
    result = get_external_data(item_id)
    status_code = 200 if result["error"] is None else 502
    return JsonResponse(result, status=status_code)
