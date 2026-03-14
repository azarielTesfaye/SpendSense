from django.urls import path

from . import views

app_name = 'market'

urlpatterns = [
    path('items/', views.ItemsView.as_view(), name='items'),
    path('prices/submit/', views.SubmitPriceView.as_view(), name='price-submit'),
    path('prices/averages/', views.PriceAveragesView.as_view(), name='price-averages'),
]
