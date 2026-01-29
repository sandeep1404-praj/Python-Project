from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.utils import timezone
from .models import User, Item, InspectionReport, BorrowRequest
from .serializers import UserSerializer, ItemSerializer, InspectionReportSerializer, BorrowRequestSerializer

class IsCustomer(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == 'CUSTOMER'

class IsStaff(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == 'STAFF'

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsCustomer()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.role == 'CUSTOMER':
            return Item.objects.filter(owner=self.request.user)
        return Item.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class InspectionReportViewSet(viewsets.ModelViewSet):
    queryset = InspectionReport.objects.all()
    serializer_class = InspectionReportSerializer
    permission_classes = [IsStaff]

    @action(detail=False, methods=['post'])
    def submit_report(self, request):
        item_id = request.data.get('item_id')
        condition_rating = request.data.get('condition_rating')
        notes = request.data.get('notes', '')

        try:
            item = Item.objects.get(id=item_id, status='PENDING_VERIFICATION')
        except Item.DoesNotExist:
            return Response({'error': 'Item not found or not pending verification'}, status=status.HTTP_404_NOT_FOUND)

        report = InspectionReport.objects.create(
            item=item,
            staff=request.user,
            condition_rating=condition_rating,
            notes=notes
        )

        if condition_rating >= 3:
            item.status = 'APPROVED'
            item.condition_score = condition_rating
        else:
            item.status = 'REJECTED'
        item.save()

        serializer = self.get_serializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class BorrowRequestViewSet(viewsets.ModelViewSet):
    queryset = BorrowRequest.objects.all()
    serializer_class = BorrowRequestSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsCustomer()]
        elif self.action in ['approve', 'deny']:
            return [IsStaff()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.role == 'CUSTOMER':
            return BorrowRequest.objects.filter(borrower=self.request.user)
        return BorrowRequest.objects.all()

    def perform_create(self, serializer):
        serializer.save(borrower=self.request.user)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        borrow_request = self.get_object()
        if borrow_request.status != 'PENDING':
            return Response({'error': 'Request already processed'}, status=status.HTTP_400_BAD_REQUEST)

        borrow_request.status = 'APPROVED'
        borrow_request.due_date = timezone.now() + timezone.timedelta(days=7)  # example due date
        borrow_request.save()

        borrow_request.item.status = 'RESERVED'
        borrow_request.item.save()

        serializer = self.get_serializer(borrow_request)
        return Response(serializer.data)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role', 'CUSTOMER')

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password, role=role)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def deny(self, request, pk=None):
        borrow_request = self.get_object()
        if borrow_request.status != 'PENDING':
            return Response({'error': 'Request already processed'}, status=status.HTTP_400_BAD_REQUEST)

        borrow_request.status = 'DENIED'
        borrow_request.save()

        serializer = self.get_serializer(borrow_request)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def return_item(self, request, pk=None):
        borrow_request = self.get_object()
        if borrow_request.status != 'APPROVED':
            return Response({'error': 'Item not borrowed'}, status=status.HTTP_400_BAD_REQUEST)

        borrow_request.status = 'RETURNED'
        borrow_request.save()

        borrow_request.item.status = 'RETURNED'
        borrow_request.item.save()

        serializer = self.get_serializer(borrow_request)
        return Response(serializer.data)
