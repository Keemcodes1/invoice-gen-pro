from rest_framework import serializers
from .models import Invoice, LineItem

class LineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LineItem
        fields = ['id', 'description', 'quantity', 'price', 'total', 'image']

class InvoiceSerializer(serializers.ModelSerializer):
    items = LineItemSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = ['id', 'company_name', 'company_address', 'company_contact', 'company_representative', 'company_logo', 
                  'customer_name', 'customer_address', 'date', 'due_date', 
                  'total_amount', 'company_signature', 'customer_signature', 
                  'is_stamped', 'stamp_text', 'items']


