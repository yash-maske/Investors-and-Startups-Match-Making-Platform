from rest_framework import serializers
from .models import PitchEvent

class PitchEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = PitchEvent
        fields = '__all__'