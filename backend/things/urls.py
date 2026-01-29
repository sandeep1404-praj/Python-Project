from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, InspectionReportViewSet, BorrowRequestViewSet, RegisterView, UserView

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'inspection-reports', InspectionReportViewSet)
router.register(r'borrow-requests', BorrowRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', UserView.as_view(), name='user'),
]
