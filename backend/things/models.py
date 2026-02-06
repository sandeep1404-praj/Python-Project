from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, role='CUSTOMER', **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'STAFF')
        return self.create_user(username, email, password, **extra_fields)

class User(AbstractUser):
    ROLE_CHOICES = [
        ('CUSTOMER', 'Customer'),
        ('STAFF', 'Staff'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='CUSTOMER')
    location = models.CharField(max_length=255, blank=True, null=True)  # City/Area
    
    objects = UserManager()

    def __str__(self):
        return self.username

class Item(models.Model):
    OWNERSHIP_CHOICES = [
        ('SELL', 'Sell'),
        ('EXCHANGE', 'Exchange'),
        ('SHARE', 'Share'),
    ]
    STATUS_CHOICES = [
        ('PENDING_VERIFICATION', 'Pending Verification'),
        ('APPROVED', 'Approved'),
        ('AVAILABLE', 'Available'),
        ('RESERVED', 'Reserved'),
        ('CHECKED_OUT', 'Checked Out'),
        ('RETURNED', 'Returned'),
        ('REJECTED', 'Rejected'),
    ]
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='item_images/', blank=True, null=True)
    ownership_type = models.CharField(max_length=10, choices=OWNERSHIP_CHOICES)
    condition_score = models.IntegerField(null=True, blank=True)  # 1-5, set after inspection
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING_VERIFICATION')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class InspectionReport(models.Model):
    item = models.OneToOneField(Item, on_delete=models.CASCADE, related_name='inspection_report')
    staff = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inspection_reports')
    condition_rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    notes = models.TextField(blank=True)
    inspected_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Inspection for {self.item.name}"

class BorrowRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('DENIED', 'Denied'),
        ('RETURNED', 'Returned'),
    ]
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='borrow_requests')
    borrower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='borrow_requests')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    due_date = models.DateTimeField(null=True, blank=True)
    return_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.borrower.username} - {self.item.name}"

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='messages', null=True, blank=True)
    subject = models.CharField(max_length=255)
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Message from {self.sender.username} to {self.recipient.username}"

    class Meta:
        ordering = ['-created_at']

class Rating(models.Model):
    """Store product ratings given by staff during inspection"""
    item = models.OneToOneField(Item, on_delete=models.CASCADE, related_name='rating')
    staff = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_ratings')
    stars = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])  # 1-5 stars
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.item.name} - {self.stars} stars"

class UserPoints(models.Model):
    """Track user reward points"""
    POINTS_ACTIONS = [
        ('ITEM_APPROVED', 'Item Approved'),
        ('ITEM_BORROWED', 'Item Borrowed'),
        ('ITEM_RETURNED', 'Item Returned'),
        ('PRODUCT_SOLD', 'Product Sold'),
        ('PRODUCT_EXCHANGED', 'Product Exchanged'),
        ('PRODUCT_SHARED', 'Product Shared'),
        ('REDEEMED', 'Points Redeemed'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='points_account')
    total_points = models.IntegerField(default=0)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} - {self.total_points} points"

class PointTransaction(models.Model):
    """Track individual point transactions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='point_transactions')
    points = models.IntegerField()  # Can be positive or negative
    action = models.CharField(max_length=20, choices=UserPoints.POINTS_ACTIONS)
    item = models.ForeignKey(Item, on_delete=models.SET_NULL, null=True, blank=True, related_name='point_transactions')
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} - {self.points} points ({self.action})"

    class Meta:
        ordering = ['-created_at']
