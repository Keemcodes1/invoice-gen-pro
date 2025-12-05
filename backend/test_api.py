import requests
import sys

try:
    print("Testing API Root...")
    response = requests.get('http://127.0.0.1:8000/')
    print(f"Root Status: {response.status_code}")
    print(f"Root Content: {response.text}")

    print("\nTesting API Endpoint...")
    response = requests.get('http://127.0.0.1:8000/api/')
    print(f"API Status: {response.status_code}")
    print(f"API Content: {response.text}")
    
    print("\nTesting Invoices Endpoint...")
    response = requests.get('http://127.0.0.1:8000/api/invoices/')
    print(f"Invoices Status: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")
    print("Make sure the Django server is running!")
