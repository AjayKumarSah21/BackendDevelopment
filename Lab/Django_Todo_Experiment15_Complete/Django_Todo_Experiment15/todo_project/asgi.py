import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE','todo_project.settings')
from django.core.asgi import get_asgi_application
application=get_asgi_application()
