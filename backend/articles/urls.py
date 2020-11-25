from django.urls import path
from . import views

app_name = "articles"

urlpatterns = [
    path('create/', views.create, name='create_article'),
    path('readAll/', views.articlesAll, name='readAll_article'),
    path('read/<username>/', views.userArticles, name="userArticles_article"),
    path('<int:article_id>/', views.details, name='article_details'),
    path('<int:article_id>/update/', views.update, name='update_article'),
    path('<int:article_id>/delete/', views.delete, name='delete_article'),
    path('<int:article_id>/comments/',
         views.commentsAll, name='article_comments'),
    path('<int:article_id>/create_comment/',
         views.create_comment, name='create_comment'),
    path('<int:article_id>/<int:comment_id>/update_comment/',
         views.update_comment, name='update_comment'),
    path('<int:comment_id>/del_comment/',
         views.del_comment, name='del_comment'),
    path('<int:comment_id>/replys/', views.replysAll, name='comment_replys'),
    path('<int:comment_id>/create_reply/',
         views.create_reply, name='create_reply'),
    path('<int:comment_id>/<int:reply_id>/update_reply/',
         views.update_reply, name='update_reply'),
    path('<int:reply_id>/del_reply/', views.del_reply, name='del_reply'),
    path('articleLikeBtn/', views.articleLikeBtn, name='articleLikeBtn'),
    path('<int:article_id>/bookmarkbtn/',
         views.bookmarkbtn, name='bookmarkbtn'),
    path('bookmarkAll/', views.bookmarkAll, name='bookmarkAll'),
    path('getbest/', views.getBestArticles, name='getBestArticles'),
]
