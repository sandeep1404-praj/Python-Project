from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView as TokenObtainPairViewBase
from django.utils import timezone
from django.contrib.auth import authenticate
from .models import User, Item, InspectionReport, BorrowRequest, Message, Rating, UserPoints, PointTransaction
from .serializers import UserSerializer, ItemSerializer, InspectionReportSerializer, BorrowRequestSerializer, MessageSerializer, RatingSerializer, PointTransactionSerializer, UserPointsSerializer

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
            username = attrs.get('username')
            password = attrs.get('password')
            user = authenticate(username=username, password=password)
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
            
            # Generate tokens using class method
            refresh = self.__class__.get_token(user)
            data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        
        # Add user details to response
        if user:
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
        # Allow public access to list and retrieve (browsing)
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        # Require customer role for create, update, delete
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsCustomer()]
        return [IsAuthenticated()]

    def get_queryset(self):
        # For list/retrieve, show all approved items (public)
        # But also show own items for authenticated users (pending/rejected/approved)
        if self.action in ['list', 'retrieve']:
            queryset = Item.objects.filter(status='APPROVED')
            if self.request.user.is_authenticated:
                my_items = Item.objects.filter(owner=self.request.user)
                queryset = (queryset | my_items).distinct()
            return queryset
            
        # For management actions, authenticated users can only manage their own items
        if self.request.user.is_authenticated:
            return Item.objects.filter(owner=self.request.user)
        return Item.objects.none()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public_list(self, request):
        """Public endpoint for non-authenticated users to browse approved items"""
        items = Item.objects.filter(status='APPROVED')
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)

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

    @action(detail=False, methods=['put'])
    def update_item_status(self, request):
        """Staff endpoint to update item status"""
        item_id = request.data.get('item_id')
        new_status = request.data.get('status')

        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

        # Validate status
        valid_statuses = [choice[0] for choice in Item.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response({'error': f'Invalid status. Must be one of {valid_statuses}'}, status=status.HTTP_400_BAD_REQUEST)

        item.status = new_status
        item.save()

        serializer = ItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)

class BorrowRequestViewSet(viewsets.ModelViewSet):
    queryset = BorrowRequest.objects.all()
    serializer_class = BorrowRequestSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsCustomer()]
        elif self.action in ['approve', 'deny', 'return_item']:
            # Allow authenticated users (owner can approve/deny, borrower can return)
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def get_queryset(self):
        # Show all borrow requests for customers (both sent and received)
        # Staff can see all requests
        if self.request.user.role == 'CUSTOMER':
            # Return requests where user is borrower OR owner of the item
            from django.db.models import Q
            return BorrowRequest.objects.filter(
                Q(borrower=self.request.user) | Q(item__owner=self.request.user)
            )
        return BorrowRequest.objects.all()

    def perform_create(self, serializer):
        # Check if user already has a pending or approved request for this item
        item = serializer.validated_data.get('item')
        existing_request = BorrowRequest.objects.filter(
            borrower=self.request.user,
            item=item,
            status__in=['PENDING', 'APPROVED']
        ).first()
        
        if existing_request:
            raise serializers.ValidationError({
                'error': 'You already have a pending or approved request for this item'
            })
        
        serializer.save(borrower=self.request.user)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        borrow_request = self.get_object()
        
        # Check if user is the item owner
        if borrow_request.item.owner != request.user:
            return Response({'error': 'Only the item owner can approve this request'}, status=status.HTTP_403_FORBIDDEN)
        
        if borrow_request.status != 'PENDING':
            return Response({'error': 'Request already processed'}, status=status.HTTP_400_BAD_REQUEST)

        borrow_request.status = 'APPROVED'
        borrow_request.due_date = timezone.now() + timezone.timedelta(days=7)  # example due date
        borrow_request.save()

        borrow_request.item.status = 'RESERVED'
        borrow_request.item.save()

        serializer = self.get_serializer(borrow_request)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def deny(self, request, pk=None):
        borrow_request = self.get_object()
        
        # Check if user is the item owner
        if borrow_request.item.owner != request.user:
            return Response({'error': 'Only the item owner can deny this request'}, status=status.HTTP_403_FORBIDDEN)
        
        if borrow_request.status != 'PENDING':
            return Response({'error': 'Request already processed'}, status=status.HTTP_400_BAD_REQUEST)

        borrow_request.status = 'DENIED'
        borrow_request.save()

        serializer = self.get_serializer(borrow_request)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def return_item(self, request, pk=None):
        borrow_request = self.get_object()
        
        # Check if user is the borrower
        if borrow_request.borrower != request.user:
            return Response({'error': 'Only the borrower can return this item'}, status=status.HTTP_403_FORBIDDEN)
        
        if borrow_request.status != 'APPROVED':
            return Response({'error': 'Item not borrowed'}, status=status.HTTP_400_BAD_REQUEST)

        borrow_request.status = 'RETURNED'
        borrow_request.return_date = timezone.now()
        borrow_request.save()

        borrow_request.item.status = 'RETURNED'
        borrow_request.item.save()

        serializer = self.get_serializer(borrow_request)
        return Response(serializer.data)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can see messages sent to them or sent by them
        return Message.objects.filter(recipient=self.request.user) | Message.objects.filter(sender=self.request.user)

    def perform_create(self, serializer):
        """Send a message"""
        serializer.save(sender=self.request.user)

    @action(detail=False, methods=['get'])
    def inbox(self, request):
        """Get all messages sent to the current user"""
        messages = Message.objects.filter(recipient=request.user).order_by('-created_at')
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def sent(self, request):
        """Get all messages sent by the current user"""
        messages = Message.objects.filter(sender=request.user).order_by('-created_at')
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark a message as read"""
        message = self.get_object()
        if message.recipient != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        message.is_read = True
        message.save()
        serializer = self.get_serializer(message)
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

    def put(self, request):
        """Update user profile including location"""
        user = request.user
        location = request.data.get('location')
        
        if location is not None:
            user.location = location
            user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data)

class RatingViewSet(viewsets.ModelViewSet):
    """ViewSet for managing product ratings by staff"""
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [IsStaff]

    @action(detail=False, methods=['post'])
    def create_rating(self, request):
        """Create a rating for an item after inspection"""
        item_id = request.data.get('item_id')
        stars = request.data.get('stars')
        comment = request.data.get('comment', '')

        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

        if not (1 <= stars <= 5):
            return Response({'error': 'Stars must be between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)

        rating, created = Rating.objects.update_or_create(
            item=item,
            defaults={
                'staff': request.user,
                'stars': stars,
                'comment': comment
            }
        )

        serializer = self.get_serializer(rating)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class UserPointsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing user points"""
    queryset = UserPoints.objects.all()
    serializer_class = UserPointsSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_points(self, request):
        """Get current user's points"""
        points, created = UserPoints.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(points)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def transactions(self, request):
        """Get current user's point transactions"""
        transactions = PointTransaction.objects.filter(user=request.user)
        serializer = PointTransactionSerializer(transactions, many=True)
        return Response(serializer.data)

class PointTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing point transactions"""
    queryset = PointTransaction.objects.all()
    serializer_class = PointTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Users can only see their own transactions"""
        return PointTransaction.objects.filter(user=self.request.user)

class ItemApprovalViewSet(viewsets.ViewSet):
    """ViewSet for staff to approve/reject items"""
    permission_classes = [IsStaff]

    @action(detail=False, methods=['get'])
    def pending_items(self, request):
        """Get all pending items for verification"""
        items = Item.objects.filter(status='PENDING_VERIFICATION')
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def approve_item(self, request):
        """Approve an item and optionally add a rating"""
        item_id = request.data.get('item_id')
        stars = request.data.get('stars')
        comment = request.data.get('comment', '')

        try:
            item = Item.objects.get(id=item_id, status='PENDING_VERIFICATION')
        except Item.DoesNotExist:
            return Response({'error': 'Item not found or not pending'}, status=status.HTTP_404_NOT_FOUND)

        # Create rating if provided
        if stars:
            if not (1 <= stars <= 5):
                return Response({'error': 'Stars must be between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)
            Rating.objects.update_or_create(
                item=item,
                defaults={
                    'staff': request.user,
                    'stars': stars,
                    'comment': comment
                }
            )

        # Update item status
        item.status = 'APPROVED'
        item.save()

        # Award points to item owner
        points_obj, _ = UserPoints.objects.get_or_create(user=item.owner)
        points_reward = 10  # Base points for item approval
        points_obj.total_points += points_reward
        points_obj.updated_at = timezone.now()
        points_obj.save()

        # Log transaction
        PointTransaction.objects.create(
            user=item.owner,
            points=points_reward,
            action='ITEM_APPROVED',
            item=item,
            description=f'Item "{item.name}" was approved'
        )

        serializer = ItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def reject_item(self, request):
        """Reject an item with a comment"""
        item_id = request.data.get('item_id')
        comment = request.data.get('comment', '')

        try:
            item = Item.objects.get(id=item_id, status='PENDING_VERIFICATION')
        except Item.DoesNotExist:
            return Response({'error': 'Item not found or not pending'}, status=status.HTTP_404_NOT_FOUND)

        item.status = 'REJECTED'
        item.save()

        # Create rating with rejection comment
        Rating.objects.update_or_create(
            item=item,
            defaults={
                'staff': request.user,
                'stars': 0,  # 0 stars for rejected items
                'comment': f'REJECTED: {comment}'
            }
        )

        serializer = ItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)
