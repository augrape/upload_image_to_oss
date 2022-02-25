from django.urls import path

from backend.vimage import views

urlpatterns = [
    path(r'', views.index, name='index'),
    path(r'check_token/', views.check_sts_token, name='check_token'),
]
