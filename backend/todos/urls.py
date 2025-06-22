from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet, todo_analytics

router = DefaultRouter()
router.register(r'todos', TodoViewSet)

urlpatterns = [
    path('', include(router.urls)),         # /api/todos/ endpoints
    path('analytics/', todo_analytics),     # /api/analytics/ endpoint
]