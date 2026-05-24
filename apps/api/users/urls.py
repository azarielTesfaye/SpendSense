from django.urls import path

from . import views

app_name = 'users'

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path(
        'password/reset/request/',
        views.PasswordResetRequestView.as_view(),
        name='password-reset-request',
    ),
    path(
        'password/reset/confirm/',
        views.PasswordResetConfirmView.as_view(),
        name='password-reset-confirm',
    ),
    path('me/notifications/', views.NotificationListView.as_view(), name='notification-list'),
    path('me/notifications/bulk/', views.NotificationBulkUpdateView.as_view(), name='notification-bulk'),
    path('me/notifications/<int:pk>/', views.NotificationDetailView.as_view(), name='notification-detail'),
    path('me/dashboard/', views.UserDashboardView.as_view(), name='user-dashboard'),
    path('me/', views.MeView.as_view(), name='me'),
    path('preferences/', views.UserPreferencesView.as_view(), name='user-preferences'),
    path('admin/users/<uuid:pk>/', views.AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('admin/users/', views.AdminUserListView.as_view(), name='admin-user-list'),
]

from .vendor_views import VendorRequestView, VendorUpdateView, VendorVerifyRequestView
urlpatterns.extend([
    path('vendors/request/', VendorRequestView.as_view(), name='vendor-request'),
    path('vendors/me/', VendorUpdateView.as_view(), name='vendor-update'),
    path('vendors/verify/', VendorVerifyRequestView.as_view(), name='vendor-verify-request'),
])
