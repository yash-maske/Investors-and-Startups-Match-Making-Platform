from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import PitchEvent
from .mongo import mongo_db

@receiver(post_save, sender=PitchEvent)
def sync_pitch_event_to_mongo(sender, instance, **kwargs):
    pitch_collection = mongo_db['pitch_events']

    doc = {
        "id": instance.id,
        "title": instance.title,
        "startup_mail": instance.startup_mail,
        "investor_mail": instance.investor_mail,
        "description": instance.description,
        "date": instance.date.isoformat(),
        "video_url": instance.video_url,
    }

    pitch_collection.update_one({"id": instance.id}, {"$set": doc}, upsert=True)