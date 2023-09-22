from django.db import models

# Create your models here.
class Client(models.Model):
    dni = models.CharField(max_length=10)
    name = models.CharField(max_length=20)
    lastname = models.CharField(max_length=20)
    birthdate = models.DateField()
    isGBA = models.BooleanField(default=False)

    def __str__(self):
        return self.name