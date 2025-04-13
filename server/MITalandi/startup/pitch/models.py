# pitchapp/models.py
from django.db import models

class PitchEvent(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    startup_mail = models.EmailField(null=True, blank=True)
    investor_mail = models.EmailField(null=True, blank=True)
    date = models.DateTimeField()
    video_url = models.URLField(null=True, blank=True)  # Google Meet link