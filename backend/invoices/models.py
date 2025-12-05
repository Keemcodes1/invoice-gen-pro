from django.db import models

class Invoice(models.Model):
    company_name = models.CharField(max_length=255)
    company_address = models.TextField()
    company_contact = models.CharField(max_length=255, null=True, blank=True)
    company_representative = models.CharField(max_length=255, null=True, blank=True)
    company_logo = models.ImageField(upload_to='logos/', null=True, blank=True)
    
    customer_name = models.CharField(max_length=255)
    customer_address = models.TextField()
    
    date = models.DateField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    company_signature = models.ImageField(upload_to='signatures/', null=True, blank=True)
    customer_signature = models.ImageField(upload_to='signatures/', null=True, blank=True)
    
    is_stamped = models.BooleanField(default=False)
    stamp_text = models.CharField(max_length=100, default="PAID")

    def __str__(self):
        return f"Invoice #{self.id} - {self.customer_name}"

class LineItem(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='items', on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='items/', null=True, blank=True)

    @property
    def total(self):
        return self.quantity * self.price

    def __str__(self):
        return f"{self.description} ({self.quantity})"
