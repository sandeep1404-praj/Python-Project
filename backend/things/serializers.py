from rest_framework import serializers
from .models import User, Item, InspectionReport, BorrowRequest, Message, Rating, UserPoints, PointTransaction

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'location']

class ItemSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    owner_id = serializers.IntegerField(read_only=True)
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    owner_email = serializers.CharField(source='owner.email', read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'owner', 'owner_id', 'owner_username', 'owner_email', 'name', 'category', 'description', 'image', 'ownership_type', 'condition_score', 'status', 'created_at']

class InspectionReportSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    staff = UserSerializer(read_only=True)

    class Meta:
        model = InspectionReport
        fields = ['id', 'item', 'staff', 'condition_rating', 'notes', 'inspected_at']

class BorrowRequestSerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())
    item_name = serializers.CharField(source='item.name', read_only=True)
    item_status = serializers.CharField(source='item.status', read_only=True)
    item_owner = serializers.IntegerField(source='item.owner.id', read_only=True)
    borrower_username = serializers.CharField(source='borrower.username', read_only=True)
    request_date = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = BorrowRequest
        fields = ['id', 'item', 'borrower', 'item_name', 'item_status', 'item_owner', 'borrower_username', 'status', 'due_date', 'return_date', 'request_date', 'created_at']
        extra_kwargs = {
            'borrower': {'read_only': True},
            'created_at': {'read_only': True}
        }

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    item = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'item', 'subject', 'body', 'is_read', 'created_at']
    
    def to_representation(self, instance):
        """Return nested representations for reads"""
        representation = super().to_representation(instance)
        representation['sender'] = UserSerializer(instance.sender).data if instance.sender else None
        representation['recipient'] = UserSerializer(instance.recipient).data if instance.recipient else None
        representation['item'] = ItemSerializer(instance.item).data if instance.item else None
        return representation

class RatingSerializer(serializers.ModelSerializer):
    staff = UserSerializer(read_only=True)

    class Meta:
        model = Rating
        fields = ['id', 'item', 'staff', 'stars', 'comment', 'created_at']

class PointTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PointTransaction
        fields = ['id', 'user', 'points', 'action', 'item', 'description', 'created_at']

class UserPointsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPoints
        fields = ['id', 'user', 'total_points', 'updated_at']

