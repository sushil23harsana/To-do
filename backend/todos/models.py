from django.db import models
from datetime import date

# Create your models here.

class Todo(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    date = models.DateField(default=date.today)

    def __str__(self):
        return self.title
