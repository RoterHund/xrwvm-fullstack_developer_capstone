from django.contrib import admin
from .models import CarMake, CarModel


class CarModelInline(admin.TabularInline):
    model = CarModel
    extra = 1


class CarMakeAdmin(admin.ModelAdmin):
    fields = ['name', 'description', 'country']
    inlines = [CarModelInline]


class CarModelAdmin(admin.ModelAdmin):
    fields = ['name', 'type', 'year']


admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)
