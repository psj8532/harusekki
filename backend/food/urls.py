from django.urls import path
from . import views

app_name = 'food'

urlpatterns = [
    path('search/', views.searchFood, name='searchFood'),
]
