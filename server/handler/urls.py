from django.urls import path
from . import views

urlpatterns = [
    path('process/', views.process_data, name='process_data'),
    path('store/', views.store_data, name='store_data'),
]
