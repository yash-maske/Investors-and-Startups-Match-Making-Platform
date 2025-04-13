from django import forms
from .models import PitchEvent

class PitchEventForm(forms.ModelForm):
    class Meta:
        model = PitchEvent
        fields = ['title',"startup_mail","investor_mail",'description', 'date']
        widgets = {
            'date': forms.DateTimeInput(attrs={'type': 'datetime-local'})
        }