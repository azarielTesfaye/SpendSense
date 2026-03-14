from rest_framework import serializers

from .models import Item, PriceSubmission


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('id', 'name', 'category', 'unit')


class PriceSubmissionSerializer(serializers.ModelSerializer):
    item_id = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all(), source='item')
    outlier_warning = serializers.SerializerMethodField()

    class Meta:
        model = PriceSubmission
        fields = (
            'id', 'item_id', 'price_value', 'market_location', 'city',
            'date_observed', 'status', 'created_at', 'outlier_warning',
        )
        read_only_fields = ('id', 'status', 'created_at')

    def get_outlier_warning(self, obj):
        return getattr(obj, '_outlier_warning', None)

    def validate_price_value(self, value):
        if value <= 0:
            raise serializers.ValidationError('Price must be positive.')
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
