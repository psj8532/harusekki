from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # path('superuser/', views.superuser, name='superuser'),
    path('profile/<str:username>/', views.profile, name='profile'),
    path('update/',
         views.update_info, name='update_info'),
    path('profile/<str:username>/follow/', views.follow, name='follow'),
    path('profile/<str:username>/isfollow/', views.isfollow, name='isfollow'),
    path('need/', views.need, name='need'),
    path('need/info/', views.need_info, name='need_info'),
    # path('config/', views.config, name='config'),
    path('delete/<str:username>/', views.userdelete, name='userdelete'),
    path('pimg/update/', views.update_profileImage, name='profileImage'),
    path('pimg/delete/', views.del_profile, name='delProfile'),
    # path('recommend/<str:username>/', views.recommend, name='recommend'),
    path('getbasal/', views.get_basal, name='getbasal'),
    path('bestusers/', views.getBestUsers, name='getBestUsers'),
    path('recommendusers/', views.getRecommendUsers, name='getRecommendUsers'),
    # path('plususers/', views.getPlusUsers, name='getPlusUsers')
]
