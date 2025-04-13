from django.urls import path
from . import views

urlpatterns = [
    path("reco/",views.get_recommendations,name="recommendations"),
]