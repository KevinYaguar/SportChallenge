from rest_framework import viewsets
from .serializer import ClientSerializer
from .models import Client

class ClientView(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    queryset = Client.objects.all()