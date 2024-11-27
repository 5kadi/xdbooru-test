from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from .jwt_auth import CustomTokenObtainPairView
from .views import *


urlpatterns = [
    #path('user/get/', GetUser, name='user_get'),
    path('user/create/', CreateUser.as_view(), name='user_create'),

    path('token/get/', CustomTokenObtainPairView.as_view(), name='token_get'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('images/get/', GetImages.as_view({'get': 'get_by_search'}), name='images_get'),
    path('images/get/<int:pk>/', GetImages.as_view({'get': 'get_by_pk'}), name='images_get_pk'),
    path('images/create/', CreateImages.as_view(), name='images_create'),
    path('images/edit/<int:pk>', EditImageInfo.as_view(), name='images_edit'),
    #path('images/delete/<int:pk>', DeleteImages.as_view(), name='test_images_delete'), #experimental

    path('tags/create/', CreateTags.as_view(), name='tags_create'),
    path('tags/get/auto/', GetTags.as_view({'get': 'get_autocomplete'}), name='tags_get'),
    path('tags/get/<str:tag>', GetTags.as_view({'get': 'get_by_tag'}), name='tags_get_tag'),

    path('comments/create/', CreateComments.as_view(), name='comments_create'),
    path('comments/get/user/<str:username>', GetComments.as_view(), name='comments_get'),
    path('comments/get/image/<int:image_pk>', GetComments.as_view(), name='comments_get_pk'),

    path('user/profile/', UserProfile.as_view({'get': 'current_user'}), name='current_profile'),
    path('profile/<str:username>/', UserProfile.as_view({'get': 'lookup_user'}), name='user_profile'),
]

