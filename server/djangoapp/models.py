# Uncomment the following imports before adding the Model code

from django.db import models
from django.utils.timezone import now
from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.
class CarMake(models.Model):
    name = models.CharField(max_length = 100)
    description = models.TextField()
    country = models.CharField(max_length = 100) 

    def ___str___(self):
        return self.name

class CarModel(models.Model):
    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
    ]
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    # dealer_id = models.IntegerField(null=True) 
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=CAR_TYPES, default='SUV')
    year = models.IntegerField(default=2024,
        validators=[
            MaxValueValidator(2024),
            MinValueValidator(2015)
        ])
    #env_rating = models.CharField(max_length=50, null=True) 
        
    def ___str___(self):
        return self.name

#class Test(models.Model):
#    name = models.CharField(max_length = 100)
#    def ___str___(self):
#        return self.name
