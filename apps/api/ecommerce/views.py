import math
from decimal import Decimal

from django.conf import settings
from django.db.models import Avg, Q
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated, SAFE_METHODS
from rest_framework.response import Response
from rest_framework.views import APIView
import logging

from core_api.permissions import IsAdminRole
from market.models import VendorPrice
from users.models import AuditLog, Notification, User, Vendor

from django.db import transaction as db_transaction
from django.utils import timezone

from .models import Transaction, VendorReview
from .serializers import (
    PurchaseBulkCreateSerializer,
    PurchaseCreateSerializer,
    PurchaseStatusUpdateSerializer,
    TransactionSerializer,
    VendorPriceSerializer,
    VendorPublicSerializer,
    VendorRegisterSerializer,
    VendorReviewSerializer,
)
from .pagination import StandardResultsSetPagination


def _haversine_km(lat1, lon1, lat2, lon2):
    if None in (lat1, lon1, lat2, lon2):
        return None
    r = 6371.0
    p1, p2 = math.radians(float(lat1)), math.radians(float(lat2))
    dp = math.radians(float(lat2) - float(lat1))
    dl = math.radians(float(lon2) - float(lon1))
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return round(2 * r * math.asin(math.sqrt(a)), 2)


class VendorRegisterView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = VendorRegisterSerializer


class VendorDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = Vendor.objects.all()
    serializer_class = VendorPublicSerializer
    lookup_field = 'pk'


class VendorListingListCreateView(generics.ListCreateAPIView):
    serializer_class = VendorPriceSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_vendor(self):
        if getattr(self, 'swagger_fake_view', False):
            return Vendor.objects.first() or Vendor()
        vendor_id = self.kwargs.get('vendor_id')
        vendor = get_object_or_404(Vendor, pk=vendor_id)

        if self.request.method in SAFE_METHODS:
            return vendor
        
        if not self.request or not self.request.user or not self.request.user.is_authenticated:
            return vendor
            
        is_admin = IsAdminRole().has_permission(self.request, self)
        if vendor.owner_id != self.request.user.id and not is_admin:
            self.permission_denied(self.request)
        return vendor

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return VendorPrice.objects.none()
        v = self.get_vendor()
        return VendorPrice.objects.filter(vendor=v).select_related('item', 'vendor').prefetch_related('images').order_by('-date', '-id')

    def perform_create(self, serializer):
        v = self.get_vendor()
        serializer.save(vendor=v)


class VendorListingUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VendorPriceSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    http_method_names = ['get', 'patch', 'delete', 'head', 'options']

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return VendorPrice.objects.none()

        qs = VendorPrice.objects.select_related('vendor', 'item').prefetch_related('images')

        # Public reads — return all listings so the product page can fetch any listing by pk
        if self.request.method in SAFE_METHODS:
            return qs

        # Mutations — restrict to the authenticated owner (or admin)
        user = getattr(self.request, 'user', None)
        if not user or not user.is_authenticated:
            return VendorPrice.objects.none()
        if IsAdminRole().has_permission(self.request, self):
            return qs
        return qs.filter(vendor__owner=user)


class RecommendationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        item_id = request.query_params.get('item_id')
        if not item_id:
            return Response({'detail': 'item_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        city = request.query_params.get('city')
        lat = request.query_params.get('latitude')
        lon = request.query_params.get('longitude')
        limit = int(request.query_params.get('limit', '20'))

        vps = VendorPrice.objects.filter(
            item_id=item_id,
            vendor__is_verified=True,
        ).select_related('vendor', 'item').order_by('vendor_id', '-date', '-id')

        if city:
            vps = vps.filter(vendor__city__iexact=city)

        seen = set()
        rows = []
        for vp in vps:
            if vp.vendor_id in seen:
                continue
            seen.add(vp.vendor_id)
            rows.append(vp)

        from market.models import PriceSubmission
        avg_rec = PriceSubmission.objects.filter(
            status='approved', item_id=item_id,
        )
        if city:
            avg_rec = avg_rec.filter(city__iexact=city)
        market_avg = avg_rec.aggregate(a=Avg('price_value'))['a']

        out = []
        user_lat = float(lat) if lat else None
        user_lon = float(lon) if lon else None
        for vp in rows:
            v = vp.vendor
            dist = None
            if user_lat is not None and user_lon is not None and v.latitude and v.longitude:
                dist = _haversine_km(user_lat, user_lon, v.latitude, v.longitude)
            vs_market = None
            if market_avg and market_avg > 0:
                vs_market = float((vp.price - market_avg) / market_avg * 100)
            out.append({
                'vendor_id': str(v.id),
                'shop_name': v.shop_name,
                'city': v.city,
                'rating_avg': str(v.rating_avg),
                'rating_count': v.rating_count,
                'listing_id': vp.id,
                'price': str(vp.price),
                'item_id': vp.item_id,
                'item_name': vp.item.name,
                'unit': vp.item.unit,
                'distance_km': dist,
                'percent_vs_market_avg': round(vs_market, 2) if vs_market is not None else None,
            })
        out.sort(key=lambda x: (Decimal(x['price']), x['distance_km'] or 1e9))
        return Response(out[:limit])


class PurchaseListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PurchaseCreateSerializer
        return TransactionSerializer

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False) or not self.request.user.is_authenticated:
            return Transaction.objects.none()
        return Transaction.objects.filter(user=self.request.user).select_related('vendor').order_by('-created_at')

    def create(self, request, *args, **kwargs):
        # If request contains an 'items' list, use the bulk serializer
        if 'items' in request.data:
            ser = PurchaseBulkCreateSerializer(data=request.data, context={'request': request})
            ser.is_valid(raise_exception=True)
            transactions = ser.save()
            data = TransactionSerializer([tx for tx, _ in transactions], many=True).data
            return Response(data, status=status.HTTP_201_CREATED)

        # Fallback: single-item checkout
        ser = PurchaseCreateSerializer(data=request.data, context={'request': request})
        ser.is_valid(raise_exception=True)
        tx = ser.save()
        return Response(TransactionSerializer(tx).data, status=status.HTTP_201_CREATED)


class PurchaseDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False) or not self.request.user.is_authenticated:
            return Transaction.objects.none()
        return Transaction.objects.filter(user=self.request.user)


class PurchaseStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        tx = get_object_or_404(Transaction, pk=pk)
        is_admin = IsAdminRole().has_permission(request, self)
        if tx.vendor.owner_id != request.user.id and not is_admin:
            return Response({'detail': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = PurchaseStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_status = serializer.validated_data['status']
        tx.status = new_status
        tx.save(update_fields=['status', 'updated_at'])
        Notification.objects.create(
            user=tx.user,
            type='delivery_update',
            message=f'Order {tx.reference} status changed to {new_status}.',
        )
        AuditLog.objects.create(
            actor=request.user,
            action='purchase_status_update',
            resource='transaction',
            resource_id=str(tx.id),
            detail={'status': new_status},
        )
        return Response(TransactionSerializer(tx).data)


class PaymentWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logger = logging.getLogger(__name__)
        # Log incoming webhook for diagnostics (trim long bodies)
        try:
            raw_body = request.body.decode('utf-8')
        except Exception:
            raw_body = str(request.body)
        logger.info('Payment webhook received: headers=%s body=%s', dict(request.headers), raw_body[:4000])

        # Accept secret from several possible header names, payload keys, or query param
        header_names = [
            'X-WEBHOOK-SECRET', 'X-WEBHOOK-TOKEN', 'X-CHAPA-SIGNATURE', 'X-CHAPA-SECRET', 'X-SIGNATURE',
            'X-HOOK-SECRET', 'X-HOOK-TOKEN', 'Authorization',
        ]

        secret = ''
        for hn in header_names:
            val = request.headers.get(hn)
            if val:
                # Support 'Authorization: Bearer <token>'
                if hn.lower() == 'authorization' and val.lower().startswith('bearer '):
                    secret = val.split(None, 1)[1].strip()
                else:
                    secret = val.strip()
                break

        # fallback to payload or query param
        if not secret:
            secret = (
                request.data.get('secret', '')
                or request.data.get('webhook_secret', '')
                or request.query_params.get('secret', '')
            )

        expected = getattr(settings, 'PAYMENT_WEBHOOK_SECRET', '')

        # If an expected secret is configured, verify either a direct token match
        # OR an HMAC signature header commonly used by gateway providers (Chapa).
        def _is_hmac_match(expected_key: str, header_val: str, body_bytes: bytes) -> bool:
            try:
                import hmac, hashlib, base64

                # compute raw HMAC digest
                hm = hmac.new(expected_key.encode('utf-8'), body_bytes, hashlib.sha256)
                hex_digest = hm.hexdigest()
                b64_digest = base64.b64encode(hm.digest()).decode('utf-8')

                # common header formats: hex, base64, or prefixed 'sha256='
                candidates = {hex_digest, b64_digest, f"sha256={hex_digest}", f"sha256={b64_digest}"}
                # some gateways URL-encode or wrap values; compare lower-cased trimmed
                hv = header_val.strip()
                if hv in candidates:
                    return True
                if hv.lower().startswith('sha256=') and hv.split('=', 1)[1] in candidates:
                    return True
                return False
            except Exception:
                return False

        signature_headers = [
            'Chapa-Signature', 'X-Chapa-Signature', 'Signature', 'X-Signature',
            'X-Hook-Signature', 'X-Hook-Secret', 'X-Webhook-Signature',
        ]

        verified = False
        # Check if any signature header or secret is present
        signature_header_present = any(request.headers.get(sh) for sh in signature_headers) or bool(secret)
        
        if expected and signature_header_present:
            # direct token match
            if secret and secret == expected:
                verified = True

            # check signature headers
            if not verified:
                body_bytes = request.body if hasattr(request, 'body') else raw_body.encode('utf-8')
                for sh in signature_headers:
                    hv = request.headers.get(sh)
                    if hv:
                        if _is_hmac_match(expected, hv, body_bytes):
                            verified = True
                            break

        if expected and signature_header_present and not verified:
            # Log header names present to help identify how the gateway sends the secret
            try:
                logger.warning(
                    'Invalid webhook signature: expected present but none matched. headers=%s payload_keys=%s',
                    list(request.headers.keys()),
                    list(request.data.keys()) if isinstance(request.data, dict) else [],
                )
            except Exception:
                pass
            return Response({'detail': 'Invalid webhook signature.'}, status=status.HTTP_403_FORBIDDEN)
        elif expected and not signature_header_present:
            # No signature provided, but secret is configured
            logger.warning(
                'Webhook received without signature header, but PAYMENT_WEBHOOK_SECRET is configured. '
                'This is allowed but not recommended for security. headers=%s',
                list(request.headers.keys()),
            )
        data = request.data.get('data', request.data)
        reference = (
            request.data.get('reference')
            or request.data.get('tx_ref')
            or request.data.get('trx_ref')
            or data.get('reference')
            or data.get('tx_ref')
            or data.get('trx_ref')
        )
        result = str(
            request.data.get('status')
            or data.get('status')
            or ''
        ).lower()
        gateway_ref = (
            request.data.get('gateway_reference')
            or request.data.get('chapa_reference')
            or request.data.get('ref_id')
            or data.get('gateway_reference')
            or data.get('chapa_reference')
            or data.get('reference')
            or data.get('ref_id')
            or ''
        )
        if not reference:
            return Response({'detail': 'reference is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Support combined references (e.g. "ref1-ref2-ref3" for bulk checkout)
        individual_refs = [r for r in reference.split('-') if len(r) == 32]  # uuid hex = 32 chars
        if not individual_refs:
            individual_refs = [reference]

        transactions = list(
            Transaction.objects.filter(
                Q(reference__in=individual_refs) | Q(payment_reference=reference)
            )
        )
        try:
            logging.getLogger(__name__).info(
                'Webhook matched transactions: reference=%s individual_refs=%s matched_ids=%s',
                reference,
                individual_refs,
                [str(t.id) for t in transactions],
            )
        except Exception:
            pass
        if not transactions:
            return Response({'detail': 'Transaction not found.'}, status=status.HTTP_404_NOT_FOUND)

        from finance.models import Expense
        import datetime

        with db_transaction.atomic():
            for tx in transactions:
                if result in ('success', 'paid'):
                    tx.status = 'paid'
                    tx.paid_at = timezone.now()

                    # Try to find an existing pending Expense created at checkout
                    try:
                        existing = Expense.objects.filter(
                            user=tx.user,
                            note__contains=str(tx.reference),
                        ).first()
                        if existing:
                            existing.amount = tx.amount
                            existing.vendor = tx.vendor
                            existing.payment_method = tx.payment_method
                            existing.date = datetime.date.today()
                            existing.note = f'Auto-recorded from Chapa payment. Order ref: {tx.reference}'
                            existing.save()
                        else:
                            Expense.objects.create(
                                user=tx.user,
                                category='Shopping',
                                item=tx.vendor_price.item if tx.vendor_price else None,
                                amount=tx.amount,
                                vendor=tx.vendor,
                                payment_method=tx.payment_method,
                                date=datetime.date.today(),
                                note=f'Auto-recorded from Chapa payment. Order ref: {tx.reference}',
                            )
                    except Exception:
                        pass  # Expense recording is best-effort; don't fail the webhook

                elif result in ('failed', 'cancelled'):
                    tx.status = result

                tx.payment_reference = gateway_ref or tx.payment_reference
                try:
                    logging.getLogger(__name__).info(
                        'Updating Transaction from webhook: tx_id=%s ref=%s gateway_ref=%s result=%s',
                        tx.id,
                        tx.reference,
                        gateway_ref,
                        result,
                    )
                except Exception:
                    pass
                tx.webhook_payload = request.data
                tx.save(update_fields=[
                    'status', 'paid_at', 'payment_reference', 'webhook_payload', 'updated_at'
                ])

                Notification.objects.create(
                    user=tx.user,
                    type='payment_confirmation',
                    message=f'Payment update for order {tx.reference}: {tx.status}.',
                )
                AuditLog.objects.create(
                    actor=None,
                    action='payment_webhook',
                    resource='transaction',
                    resource_id=str(tx.id),
                    detail={'status': tx.status, 'reference': tx.reference},
                )

        return Response(
            {'detail': 'Webhook processed.', 'status': transactions[0].status, 'count': len(transactions)},
            status=status.HTTP_200_OK,
        )

    def get(self, request):
        """Support GET requests (some gateways or callbacks use query params).
        This mirrors the POST handling but reads from query params.
        """
        logger = logging.getLogger(__name__)
        logger.info('Payment webhook GET received: headers=%s query=%s', dict(request.headers), dict(request.query_params))

        # Reuse similar signature verification as POST but reading from query params
        header_names = [
            'X-WEBHOOK-SECRET', 'X-WEBHOOK-TOKEN', 'X-CHAPA-SIGNATURE', 'X-CHAPA-SECRET', 'X-SIGNATURE',
            'X-HOOK-SECRET', 'X-HOOK-TOKEN', 'Authorization',
        ]

        secret = ''
        for hn in header_names:
            val = request.headers.get(hn)
            if val:
                if hn.lower() == 'authorization' and val.lower().startswith('bearer '):
                    secret = val.split(None, 1)[1].strip()
                else:
                    secret = val.strip()
                break

        if not secret:
            secret = (request.query_params.get('secret', '') or request.query_params.get('webhook_secret', ''))

        expected = getattr(settings, 'PAYMENT_WEBHOOK_SECRET', '')
        verified = False
        signature_headers = [
            'Chapa-Signature', 'X-Chapa-Signature', 'Signature', 'X-Signature',
            'X-Hook-Signature', 'X-Hook-Secret', 'X-Webhook-Signature',
        ]
        
        # Check if any signature header or secret is present
        signature_header_present = any(request.headers.get(sh) for sh in signature_headers) or bool(secret)
        
        if expected and signature_header_present:
            if secret and secret == expected:
                verified = True
            if not verified:
                # attempt HMAC verify using query string bytes
                import hmac, hashlib, base64
                body_bytes = request.get_raw_uri().encode('utf-8') if hasattr(request, 'get_raw_uri') else str(request.query_params).encode('utf-8')
                for sh in signature_headers:
                    hv = request.headers.get(sh)
                    if not hv:
                        continue
                    try:
                        hm = hmac.new(expected.encode('utf-8'), body_bytes, hashlib.sha256)
                        hex_digest = hm.hexdigest()
                        b64_digest = base64.b64encode(hm.digest()).decode('utf-8')
                        if hv.strip() in {hex_digest, b64_digest, f'sha256={hex_digest}', f'sha256={b64_digest}'}:
                            verified = True
                            break
                    except Exception:
                        continue

        if expected and signature_header_present and not verified:
            logger.warning('Invalid webhook signature on GET. headers=%s query_keys=%s', list(request.headers.keys()), list(request.query_params.keys()))
            return Response({'detail': 'Invalid webhook signature.'}, status=status.HTTP_403_FORBIDDEN)
        elif expected and not signature_header_present:
            logger.warning('Webhook GET received without signature header, but PAYMENT_WEBHOOK_SECRET is configured. headers=%s', list(request.headers.keys()))

        data = dict(request.query_params)
        reference = (
            request.query_params.get('reference')
            or request.query_params.get('tx_ref')
            or request.query_params.get('trx_ref')
            or data.get('reference')
            or data.get('tx_ref')
            or data.get('trx_ref')
        )
        result = str(
            request.query_params.get('status')
            or data.get('status')
            or ''
        ).lower()
        gateway_ref = (
            request.query_params.get('gateway_reference')
            or request.query_params.get('chapa_reference')
            or request.query_params.get('ref_id')
            or data.get('gateway_reference')
            or data.get('chapa_reference')
            or data.get('reference')
            or data.get('ref_id')
            or ''
        )

        if not reference:
            return Response({'detail': 'reference is required.'}, status=status.HTTP_400_BAD_REQUEST)

        individual_refs = [r for r in reference.split('-') if len(r) == 32]
        if not individual_refs:
            individual_refs = [reference]

        transactions = list(
            Transaction.objects.filter(
                Q(reference__in=individual_refs) | Q(payment_reference=reference)
            )
        )
        try:
            logging.getLogger(__name__).info(
                'Webhook(GET) matched transactions: reference=%s individual_refs=%s matched_ids=%s',
                reference,
                individual_refs,
                [str(t.id) for t in transactions],
            )
        except Exception:
            pass

        if not transactions:
            return Response({'detail': 'Transaction not found.'}, status=status.HTTP_404_NOT_FOUND)

        from finance.models import Expense
        import datetime

        with db_transaction.atomic():
            for tx in transactions:
                if result in ('success', 'paid'):
                    tx.status = 'paid'
                    tx.paid_at = timezone.now()
                    try:
                        existing = Expense.objects.filter(
                            user=tx.user,
                            note__contains=str(tx.reference),
                        ).first()
                        if existing:
                            existing.amount = tx.amount
                            existing.vendor = tx.vendor
                            existing.payment_method = tx.payment_method
                            existing.date = datetime.date.today()
                            existing.note = f'Auto-recorded from Chapa payment. Order ref: {tx.reference}'
                            existing.save()
                        else:
                            Expense.objects.create(
                                user=tx.user,
                                category='Shopping',
                                item=tx.vendor_price.item if tx.vendor_price else None,
                                amount=tx.amount,
                                vendor=tx.vendor,
                                payment_method=tx.payment_method,
                                date=datetime.date.today(),
                                note=f'Auto-recorded from Chapa payment. Order ref: {tx.reference}',
                            )
                    except Exception:
                        pass
                elif result in ('failed', 'cancelled'):
                    tx.status = result

                tx.payment_reference = gateway_ref or tx.payment_reference
                try:
                    logging.getLogger(__name__).info(
                        'Updating Transaction from webhook(GET): tx_id=%s ref=%s gateway_ref=%s result=%s',
                        tx.id,
                        tx.reference,
                        gateway_ref,
                        result,
                    )
                except Exception:
                    pass
                tx.webhook_payload = dict(request.query_params)
                tx.save(update_fields=[
                    'status', 'paid_at', 'payment_reference', 'webhook_payload', 'updated_at'
                ])

                Notification.objects.create(
                    user=tx.user,
                    type='payment_confirmation',
                    message=f'Payment update for order {tx.reference}: {tx.status}.',
                )
                AuditLog.objects.create(
                    actor=None,
                    action='payment_webhook_get',
                    resource='transaction',
                    resource_id=str(tx.id),
                    detail={'status': tx.status, 'reference': tx.reference},
                )

        return Response(
            {'detail': 'Webhook processed.', 'status': transactions[0].status, 'count': len(transactions)},
            status=status.HTTP_200_OK,
        )


class VendorReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = VendorReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_vendor(self):
        if getattr(self, 'swagger_fake_view', False):
            return Vendor.objects.first() or Vendor()
        vendor_id = self.kwargs.get('vendor_id')
        return get_object_or_404(Vendor, pk=vendor_id)

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return VendorReview.objects.none()
        vendor_id = self.kwargs.get('vendor_id')
        return VendorReview.objects.filter(vendor_id=vendor_id).select_related('user')

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['vendor'] = self.get_vendor()
        return ctx

    def perform_create(self, serializer):
        serializer.save()


class AdminVendorListView(generics.ListAPIView):
    permission_classes = [IsAdminRole]
    serializer_class = VendorPublicSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = Vendor.objects.select_related('owner').order_by('-joined_at')
        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(verification_status=status)
        return qs


class AdminVendorVerifyView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        v = get_object_or_404(Vendor, pk=pk)
        v.is_verified = True
        v.verification_status = 'verified'
        v.save(update_fields=['is_verified', 'verification_status'])
        
        Notification.objects.create(
            user=v.owner,
            type='vendor_verified',
            message='Your business account has been verified! You can now start listing products.',
        )
        
        AuditLog.objects.create(
            actor=request.user,
            action='vendor_verify',
            resource='vendor',
            resource_id=str(v.id),
        )
        return Response(VendorPublicSerializer(v).data)


class AdminVendorRejectView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        v = get_object_or_404(Vendor, pk=pk)
        
        v.is_verified = False
        v.verification_status = 'rejected'
        v.save(update_fields=['is_verified', 'verification_status'])
        
        reason = request.data.get('reason', 'Provided documents were insufficient or invalid.')
        
        Notification.objects.create(
            user=v.owner,
            type='vendor_rejected',
            message=f'Your verification request was rejected. Reason: {reason}',
        )
        
        AuditLog.objects.create(
            actor=request.user,
            action='vendor_reject',
            resource='vendor',
            resource_id=str(pk),
            detail={'reason': reason},
        )
        return Response({'detail': 'Vendor verification rejected.'}, status=status.HTTP_200_OK)
