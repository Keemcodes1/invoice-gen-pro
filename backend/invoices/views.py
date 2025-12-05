import json
from rest_framework import viewsets, parsers
from rest_framework.response import Response
from .models import Invoice, LineItem
from .serializers import InvoiceSerializer

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by('-date')
    serializer_class = InvoiceSerializer
    parser_classes = (parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        items_json = data.pop('items_json', None)
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        invoice = serializer.save()

        if items_json:
            if isinstance(items_json, list):
                items_data = items_json[0] # Handle if it comes as a list
            else:
                items_data = items_json
            
            try:
                items = json.loads(items_data)
                for item in items:
                    LineItem.objects.create(
                        invoice=invoice,
                        description=item.get('description', ''),
                        quantity=item.get('quantity', 1),
                        price=item.get('price', 0)
                    )
            except Exception as e:
                print(f"Error parsing items: {e}")

        return Response(serializer.data, status=201)
