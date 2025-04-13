# pitchapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('google/auth/', views.google_auth, name='google_auth'),
    path('google/callback/', views.google_callback, name='google_callback'),
    path('create-pitch-event/', views.create_pitch_event, name='create_pitch_event'),

]