from django.contrib import admin
from .models import User
# Register your models here.


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'height')


# 어드민 사이트에 등록해줘
admin.site.register(User, UserAdmin)
