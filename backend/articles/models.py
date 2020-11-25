from django.db import models
from django.conf import settings
#from food import models
# Create your models here.


class Tag(models.Model):
    tagName = models.CharField(max_length=100)


class Article(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='article_user')
    tag = models.ManyToManyField(Tag, related_name="tag")
    # image = models.ImageField(blank=False, null=False, upload_to="image")
    # 이미지 저장 경로는 추후 변경 예정
    content = models.TextField(default='', blank=True)
    #recipe = models.TextField(default='', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.TextField(null=True)
    canComment = models.BooleanField(default=True)
    canSearch = models.BooleanField(default=True)
    like_users = models.ManyToManyField(settings.AUTH_USER_MODEL,
                                        related_name='like_articles')
    bookmark_users = models.ManyToManyField(settings.AUTH_USER_MODEL,
                                        related_name='bookmark_article', blank=True)                                      
    num_of_like = models.IntegerField(default=0)
    isliked = models.BooleanField(default=False)
    user_1 = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_1', null=True)
    user_2 = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_2', null=True)


class Comment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comment_user')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Reply(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, related_name='reply_user')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Recipe(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    foodname = models.CharField(max_length=50, null=True)  # 식품이름
    content = models.TextField(default='',blank=True)