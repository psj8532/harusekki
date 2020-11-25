from django.db import models
from django.conf import settings
from food.models import Food

# Create your models here.
class Menu(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    image = models.FileField(upload_to="image", null=True)
    mealTime = models.CharField(max_length=2, blank=True)  # 아침/점심/저녁/간식/야식
    created_at = models.CharField(max_length=10, blank=True)


class Menu2food(models.Model):
    image = models.ForeignKey(Menu,
                              on_delete=models.CASCADE)  # Menuid가 들어가는거
    food = models.ForeignKey(Food,
                             on_delete=models.CASCADE)  # food id가 들어가는거
    location = models.TextField(null=True)  # 좌상우하, 좌표값
    value = models.IntegerField(default=1)  # 음식의 양
