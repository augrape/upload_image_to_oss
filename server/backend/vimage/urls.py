from django.urls import path

from backend.vimage import views

urlpatterns = [
    path('', views.index, name='index'),
    path('check_token/', views.check_sts_token, name='check_token'),
]