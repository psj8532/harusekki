from rest_framework import serializers
from . import models
from accounts.serializers import UserSerializer


class ArticleSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)
    created_at = serializers.DateTimeField(
        format="%Y-%m-%d %H:%M:%S", required=False)
    updated_at = serializers.DateTimeField(
        format="%Y-%m-%d %H:%M:%S", required=False)
    user_1 = UserSerializer(required=False)
    user_2 = UserSerializer(required=False)
    # bookmark_users = UserSerializer(required=False)

    class Meta:
        model = models.Article
        exclude = ['tag', 'like_users','bookmark_users']
        # fields = '__all__'
        # fields = ['user', 'tag', 'content', 'recipe']
        # read_only_fields = ('id', 'user', 'created_at', 'updated_at')
        example = {
            'tag': '태그',
            'content': '내용',
            'recipe': '레시피',
        }


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)
    article = ArticleSerializer(required=False)
    created_at = serializers.DateTimeField(
        format="%Y-%m-%d %H:%M:%S", required=False)
    updated_at = serializers.DateTimeField(
        format="%Y-%m-%d %H:%M:%S", required=False)

    class Meta:
        model = models.Comment
        fields = '__all__'


class ReplySerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)
    comment = CommentSerializer(required=False)
    created_at = serializers.DateTimeField(
        format="%Y-%m-%d %H:%M:%S", required=False)
    updated_at = serializers.DateTimeField(
        format="%Y-%m-%d %H:%M:%S", required=False)

    class Meta:
        model = models.Reply
        fields = '__all__'