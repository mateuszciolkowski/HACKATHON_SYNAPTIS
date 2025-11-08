from django.urls import path
from .views import StressClassificationView, WESADDataView

app_name = 'stress_classification'

urlpatterns = [
    path('', StressClassificationView.as_view(), name='classify'),
    path('wesad-data/', WESADDataView.as_view(), name='wesad-data'),
]

