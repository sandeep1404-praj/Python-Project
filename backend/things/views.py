from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView as TokenObtainPairViewBase
from django.utils import timezone
from django.contrib.auth import authenticate
from .models import User, Item, InspectionReport, BorrowRequest
from .serializers import UserSerializer, ItemSerializer, InspectionReportSerializer, BorrowRequestSerializer

class IsCustomer(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == 'CUSTOMER'

class IsStaff(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == 'STAFF'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom serializer that authenticates against custom User model and returns user role"""
    
    def validate(self, attrs):
        # Call parent validate to get standard validation
        try:
            data = super().validate(attrs)
        except Exception as e:
            # If parent validation fails, try our custom authentication
            from rest_framework_simplejwt.exceptions import AuthenticationFailed
            username = attrs.get('username')
            password = attrs.get('password')
            
            # Authenticate using custom User model
            user = authenticate(username=username, password=password)
            
            if user is None:
                raise AuthenticationFailed('Invalid credentials')
            
            if not user.is_active:
                raise AuthenticationFailed('User account is inactive')
            
            # Generate tokens
            refresh = self.get_token(user)
            data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        
        # Extract user from request or regenerate if needed
        username = attrs.get('username')
        password = attrs.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            # Include user role and details in response for role-based access control on frontend
            data.update({
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
            })
        
        return data

class CustomTokenObtainPairView(TokenObtainPairViewBase):
    """Custom token view using our custom serializer"""
    serializer_class = CustomTokenObtainPairSerializer

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
        print("Registration request data:", request.data)
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        # New users are ALWAYS created as CUSTOMER by default - no role parameter accepted
        role = 'CUSTOMER'

        # Validation
        if not username or not email or not password:
            print("Missing required fields")
            return Response({'error': 'Username, email, and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            print(f"Username {username} already exists")
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            print(f"Email {email} already exists")
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(username=username, email=email, password=password, role=role)
            serializer = UserSerializer(user)
            print(f"User {username} created successfully with role: CUSTOMER")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error creating user: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
