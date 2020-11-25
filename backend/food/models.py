from django.db import models

# Create your models here.
class Food(models.Model):
    NUM = models.IntegerField(null=True)  # 번호
    FOOD_CD = models.CharField(max_length=20)  # 식품코드
    SAMPLING_REGION_NAME = models.CharField(max_length=20, null=True)  # 지역명
    SAMPLING_MONTH_NAME = models.CharField(max_length=2, null=True)  # 채취월
    SAMPLING_REGION_CD = models.CharField(max_length=20, null=True)  # 지역코드
    SAMPLING_MONTH_CD = models.CharField(max_length=20, null=True)  # 채취월코드
    GROUP_NAME = models.CharField(max_length=20, null=True)  # 식품군
    DESC_KOR = models.CharField(max_length=50, null=True)  # 식품이름
    RESEARCH_YEAR = models.CharField(max_length=4, null=True)  # 조사년도
    MAKER_NAME = models.CharField(max_length=50, null=True)  # 제조사명
    SUB_REF_NAME = models.CharField(max_length=50, null=True)  # 자료출처
    SERVING_SIZE = models.TextField(null=True)  # 총내용량
    NUTR_CONT1 = models.TextField(null=True)  # 열량(kcal)(1회제공량당)
    NUTR_CONT2 = models.TextField(null=True)  # 탄수화물(g)(1회제공량당)
    NUTR_CONT3 = models.TextField(null=True)  # 단백질(g)(1회제공량당)
    NUTR_CONT4 = models.TextField(null=True)  # 지방(g)(1회제공량당)
    NUTR_CONT5 = models.TextField(null=True)  # 당류(g)(1회제공량당)
    NUTR_CONT6 = models.TextField(null=True)  # 나트륨(g)(1회제공량당)
    NUTR_CONT7 = models.TextField(null=True)  # 콜레스테롤(mg)(1회제공량당)
    NUTR_CONT8 = models.TextField(null=True)  # 포화지방산(g)(1회제공량당)
    NUTR_CONT9 = models.TextField(null=True)  # 트랜스지방(g)(1회제공량당)
    ANIMAL_PLANT = models.CharField(max_length=50, null=True)  # 가공업체명
    BGN_YEAR = models.CharField(max_length=50, null=True)  # 구축년도
    FOOD_GROUP = models.CharField(max_length=50, null=True)  # 자료원
