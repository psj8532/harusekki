from django.contrib import admin
from .models import Menu, Menu2food

# Register your models here.


class MenuAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'image')


class Menu2foodAdmin(admin.ModelAdmin):
    list_display = ('id', 'image', 'food')


admin.site.register(Menu, MenuAdmin)
admin.site.register(Menu2food, Menu2foodAdmin)
