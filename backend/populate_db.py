import os
import django
from datetime import datetime, timedelta
import random

# Setup PyMySQL before any Django imports
import pymysql
pymysql.install_as_MySQLdb()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_manager.settings')
django.setup()

from things.models import User, Item, InspectionReport, BorrowRequest
from django.utils import timezone

def clear_data():
    """Clear existing fake data"""
    print("Clearing existing data...")
    BorrowRequest.objects.all().delete()
    InspectionReport.objects.all().delete()
    Item.objects.all().delete()
    print("Data cleared.")

def create_fake_items():
    """Create fake items"""
    print("Creating fake items...")
    
    # Get existing users (excluding superuser)
    users = User.objects.filter(role='CUSTOMER').exclude(username='admin')
    
    if not users.exists():
        print("No customer users found. Please create some users first.")
        return []
    
    items_data = [
        {
            'name': 'Mountain Bike',
            'category': 'Sports Equipment',
            'description': 'Professional mountain bike in excellent condition. 21 gears, aluminum frame.',
            'ownership_type': 'SHARE',
        },
        {
            'name': 'Camping Tent',
            'category': 'Outdoor Gear',
            'description': '4-person camping tent with waterproof coating and good ventilation.',
            'ownership_type': 'SHARE',
        },
        {
            'name': 'Coffee Maker',
            'category': 'Kitchen Appliances',
            'description': 'Programmable coffee maker, 12-cup capacity. Like new condition.',
            'ownership_type': 'EXCHANGE',
        },
        {
            'name': 'DSLR Camera',
            'category': 'Electronics',
            'description': 'Canon EOS 70D with 18-55mm lens. Includes camera bag and manual.',
            'ownership_type': 'SELL',
        },
        {
            'name': 'Electric Drill',
            'category': 'Tools',
            'description': 'DeWalt cordless electric drill with multiple bits and charger.',
            'ownership_type': 'SHARE',
        },
        {
            'name': 'Skateboard',
            'category': 'Sports Equipment',
            'description': 'Street skateboard with high-quality bearings. Good for tricks and cruising.',
            'ownership_type': 'SHARE',
        },
        {
            'name': 'Laptop Stand',
            'category': 'Office Equipment',
            'description': 'Adjustable aluminum laptop stand, compatible with all laptops.',
            'ownership_type': 'EXCHANGE',
        },
        {
            'name': 'Yoga Mat',
            'category': 'Sports Equipment',
            'description': 'Non-slip yoga mat with carrying strap. 6mm thick, eco-friendly material.',
            'ownership_type': 'SHARE',
        },
        {
            'name': 'Gaming Console',
            'category': 'Electronics',
            'description': 'PlayStation 5 with 2 controllers and 3 games included.',
            'ownership_type': 'EXCHANGE',
        },
        {
            'name': 'Portable Speaker',
            'category': 'Electronics',
            'description': 'Wireless Bluetooth speaker with 12-hour battery life. Waterproof design.',
            'ownership_type': 'EXCHANGE',
        },
    ]
    
    created_items = []
    for data in items_data:
        owner = random.choice(users)
        item = Item.objects.create(
            owner=owner,
            name=data['name'],
            category=data['category'],
            description=data['description'],
            ownership_type=data['ownership_type'],
            status=random.choice(['PENDING_VERIFICATION', 'APPROVED', 'AVAILABLE']),
            condition_score=random.randint(2, 5) if random.random() > 0.3 else None,
        )
        created_items.append(item)
        print(f"  ✓ Created item: {item.name}")
    
    return created_items

def create_fake_inspection_reports(items):
    """Create fake inspection reports for some items"""
    print("Creating fake inspection reports...")
    
    # Get staff users
    staff_users = User.objects.filter(role='STAFF')
    
    if not staff_users.exists():
        print("No staff users found. Skipping inspection reports.")
        return []
    
    inspection_reports = []
    
    # Create inspection reports for 60% of items
    for item in random.sample(items, max(1, int(len(items) * 0.6))):
        staff = random.choice(staff_users)
        inspection = InspectionReport.objects.create(
            item=item,
            staff=staff,
            condition_rating=random.randint(2, 5),
            notes=random.choice([
                'Item in good condition, minor wear visible.',
                'Excellent condition, like new.',
                'Fair condition with some signs of use.',
                'Good condition, fully functional.',
                'Acceptable condition, minor scratches.',
            ]),
            inspected_at=timezone.now() - timedelta(days=random.randint(1, 30)),
        )
        inspection_reports.append(inspection)
        item.status = 'AVAILABLE'
        item.save()
        print(f"  ✓ Created inspection for: {item.name}")
    
    return inspection_reports

def create_fake_borrow_requests(items):
    """Create fake borrow requests"""
    print("Creating fake borrow requests...")
    
    # Get customer users
    customers = User.objects.filter(role='CUSTOMER')
    
    if not customers.exists():
        print("No customer users found. Skipping borrow requests.")
        return []
    
    borrow_requests = []
    available_items = [item for item in items if item.status == 'AVAILABLE']
    
    if not available_items:
        print("No available items. Creating some items as available...")
        return []
    
    # Create borrow requests for some available items
    for item in random.sample(available_items, min(5, len(available_items))):
        borrower = random.choice([u for u in customers if u != item.owner])
        
        if not borrower:
            continue
            
        status = random.choice(['PENDING', 'APPROVED', 'DENIED', 'RETURNED'])
        due_date = timezone.now() + timedelta(days=random.randint(3, 30)) if status in ['APPROVED', 'PENDING'] else None
        
        request = BorrowRequest.objects.create(
            item=item,
            borrower=borrower,
            status=status,
            due_date=due_date,
            created_at=timezone.now() - timedelta(days=random.randint(0, 15)),
        )
        borrow_requests.append(request)
        
        if status in ['APPROVED', 'PENDING']:
            item.status = 'CHECKED_OUT' if status == 'APPROVED' else 'RESERVED'
            item.save()
        
        print(f"  ✓ Created borrow request: {borrower.username} → {item.name}")
    
    return borrow_requests

def main():
    """Main function to populate the database"""
    print("\n" + "="*50)
    print("POPULATING DATABASE WITH FAKE DATA")
    print("="*50 + "\n")
    
    # Clear existing data
    clear_data()
    
    # Create fake data
    items = create_fake_items()
    print()
    inspection_reports = create_fake_inspection_reports(items)
    print()
    borrow_requests = create_fake_borrow_requests(items)
    
    print("\n" + "="*50)
    print("SUMMARY")
    print("="*50)
    print(f"✓ Created {len(items)} items")
    print(f"✓ Created {len(inspection_reports)} inspection reports")
    print(f"✓ Created {len(borrow_requests)} borrow requests")
    print("="*50 + "\n")

if __name__ == '__main__':
    main()
