from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, InspectionReportViewSet, BorrowRequestViewSet, MessageViewSet, RegisterView, UserView, RatingViewSet, UserPointsViewSet, PointTransactionViewSet, ItemApprovalViewSet

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'inspection-reports', InspectionReportViewSet)
router.register(r'borrow-requests', BorrowRequestViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'ratings', RatingViewSet)
router.register(r'user-points', UserPointsViewSet)
router.register(r'point-transactions', PointTransactionViewSet)
router.register(r'item-approval', ItemApprovalViewSet, basename='item-approval')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', UserView.as_view(), name='user'),
]
