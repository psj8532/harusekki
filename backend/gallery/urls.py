from django.urls import path
from . import views

app_name = "gallery"

urlpatterns = [
    path('saveMenu/', views.saveMenu, name='saveMenue'),
    path('<int:image_id>/delImg/', views.delImg, name='delImg'),
    path('myImgs/', views.myImgs, name='myImgs'),
    path('media/image/<str:uri>/', views.getImage, name='getImage'),
    path('getCalendar/', views.getCalendar, name='getCalendar'),
    path('getChart/<str:date>/', views.getChart, name='getChart'),
    path('plusCnt/', views.plusCnt, name='plusCnt'),
    path('minusCnt/', views.minusCnt, name='minusCnt'),
    path('deleteMenu/', views.deleteMenu, name='deleteMenu'),
    path('getFood/<int:menu_id>/', views.getFood, name='getFood'),
    path('readFood/<int:menu_id>/', views.readFood, name='readFood'),
    path('getMenuInfo/', views.getMenuInfo, name='getMenuInfo'),
    path('updateM2F/<int:menu2food_id>/', views.updateM2F, name='updateM2F'),
]
