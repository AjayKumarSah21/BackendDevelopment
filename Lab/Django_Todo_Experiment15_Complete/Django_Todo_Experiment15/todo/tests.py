from django.test import TestCase
from django.urls import reverse
from .models import Task
class TaskTests(TestCase):
 def test_empty_page(self):
  response=self.client.get(reverse('task_list'))
  self.assertContains(response,'No tasks yet')
 def test_create_read_toggle_delete(self):
  self.client.post(reverse('add_task'),{'title':'Study Django'})
  task=Task.objects.get(title='Study Django')
  self.assertContains(self.client.get(reverse('task_list')),'Study Django')
  self.client.post(reverse('toggle_task',args=[task.pk]))
  task.refresh_from_db();self.assertTrue(task.completed)
  self.client.post(reverse('toggle_task',args=[task.pk]))
  task.refresh_from_db();self.assertFalse(task.completed)
  self.client.post(reverse('delete_task',args=[task.pk]))
  self.assertFalse(Task.objects.filter(pk=task.pk).exists())
 def test_invalid_title(self):
  self.client.post(reverse('add_task'),{'title':'   '})
  self.assertEqual(Task.objects.count(),0)
 def test_get_cannot_change_tasks(self):
  task=Task.objects.create(title='Protected')
  self.assertEqual(self.client.get(reverse('delete_task',args=[task.pk])).status_code,405)
  self.assertEqual(self.client.get(reverse('toggle_task',args=[task.pk])).status_code,405)
 def test_admin_registered(self):
  from django.contrib import admin
  self.assertIn(Task,admin.site._registry)
