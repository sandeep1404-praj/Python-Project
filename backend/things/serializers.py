from rest_framework import serializers
from .models import User, Item, InspectionReport, BorrowRequest

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class ItemSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'owner', 'name', 'category', 'description', 'ownership_type', 'condition_score', 'status', 'created_at']

class InspectionReportSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    staff = UserSerializer(read_only=True)

    class Meta:
        model = InspectionReport
        fields = ['id', 'item', 'staff', 'condition_rating', 'notes', 'inspected_at']

class BorrowRequestSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    borrower = UserSerializer(read_only=True)

    class Meta:
        model = BorrowRequest
        fields = ['id', 'item', 'borrower', 'status', 'due_date', 'created_at']
