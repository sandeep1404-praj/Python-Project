from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    ROLE_CHOICES = [
        ('CUSTOMER', 'Customer'),
        ('STAFF', 'Staff'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='CUSTOMER')

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
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.borrower.username} - {self.item.name}"
