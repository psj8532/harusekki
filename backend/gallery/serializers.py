from rest_framework import serializers
from .models import Menu, Menu2food
from food.models import Food
from accounts.serializers import UserSerializer
# from drf_extra_fields.fields import Base64ImageField


class MenuSerializer(serializers.ModelSerializer):
    # user = UserSerializer(required=False)
    # image = serializers.ImageField(required=False)
    # image = Base64ImageField()
    # kindOf = kindOfSerializer(required=False)
    # created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", required=False)

    class Meta:
        model = Menu
        fields = '__all__'

    # def create(self, validated_data):
    #     image=validated_data.pop('image')
    #     data=validated_data.pop('data')
    #     return Menue.objects.create(data=data,image=image)


class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = '__all__'

class Menu2foodSerializer(serializers.ModelSerializer):
    image = MenuSerializer(required=False)
    food = FoodSerializer(required=False)
    
    class Meta:
        model = Menu2food
        fields = '__all__'
