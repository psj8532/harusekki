from django.contrib import admin
from .models import Food

# Register your models here.


class FoodAdmin(admin.ModelAdmin):
    #식품이름, 총내용량, 열량, 탄수화물, 단백질, 지방
    list_display = ('DESC_KOR', 'SERVING_SIZE', 'NUTR_CONT1',
                    'NUTR_CONT2', 'NUTR_CONT3', 'NUTR_CONT4')


admin.site.register(Food, FoodAdmin)
