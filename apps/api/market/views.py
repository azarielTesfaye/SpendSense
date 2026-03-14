from django.db.models import Avg, Count
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Item, PriceSubmission
from .serializers import ItemSerializer, PriceSubmissionSerializer


class ItemsView(generics.ListAPIView):
    """GET /api/market/items/ — list tracked items (seeded via seed_items)."""

    permission_classes = [AllowAny]
    serializer_class = ItemSerializer
    queryset = Item.objects.all().order_by('name')


class SubmitPriceView(generics.CreateAPIView):
    """POST /api/market/prices/submit/ — browsable API + Swagger show request body."""

    permission_classes = [IsAuthenticated]
    serializer_class = PriceSubmissionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = serializer.validated_data.get('item')
        city = serializer.validated_data.get('city')
        price_value = serializer.validated_data.get('price_value')
        recent = PriceSubmission.objects.filter(
            item=item, city=city, status='approved',
        ).aggregate(avg=Avg('price_value'))
        avg = recent.get('avg')
        submission = serializer.save()
        if avg is not None:
            pct = abs(float(price_value - avg) / float(avg)) * 100
            if pct > 50:
                submission._outlier_warning = (
                    f'Price differs by {pct:.0f}% from recent average ({avg:.2f}).'
                )
        return Response(
            PriceSubmissionSerializer(submission, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class PriceAveragesView(APIView):
    """GET /api/market/prices/averages/ — aggregated prices from approved submissions."""

    permission_classes = [AllowAny]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'item_id',
                openapi.IN_QUERY,
                description='Filter by item primary key',
                type=openapi.TYPE_INTEGER,
            ),
            openapi.Parameter(
                'city',
                openapi.IN_QUERY,
                description='Filter by city (case-insensitive)',
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                'from_date',
                openapi.IN_QUERY,
                description='Include submissions on or after this date (YYYY-MM-DD)',
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                'to_date',
                openapi.IN_QUERY,
                description='Include submissions on or before this date (YYYY-MM-DD)',
                type=openapi.TYPE_STRING,
            ),
        ],
        responses={200: 'List of average price rows'},
    )
    def get(self, request):
        item_id = request.query_params.get('item_id')
        city = request.query_params.get('city')
        from_date = request.query_params.get('from_date')
        to_date = request.query_params.get('to_date')

        qs = PriceSubmission.objects.filter(status='approved')
        if item_id:
            qs = qs.filter(item_id=item_id)
        if city:
            qs = qs.filter(city__iexact=city)
        if from_date:
            qs = qs.filter(date_observed__gte=from_date)
        if to_date:
            qs = qs.filter(date_observed__lte=to_date)

        rows = (
            qs.values('item', 'item__name', 'city')
            .annotate(avg_price=Avg('price_value'), count=Count('id'))
            .order_by('item__name', 'city')
        )
        data = [
            {
                'item_id': r['item'],
                'item_name': r['item__name'],
                'average_price': str(round(r['avg_price'], 2)),
                'city': r['city'],
                'source': 'crowdsourced',
                'count': r['count'],
            }
            for r in rows
        ]
        return Response(data)
