# pitchapp/views.py
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from django.utils.timezone import now
from .models import PitchEvent
import os, datetime

# Setup
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # For dev only

SCOPES = ['https://www.googleapis.com/auth/calendar.events']
REDIRECT_URI = 'http://localhost:8000/google/callback/'

flow = Flow.from_client_secrets_file(
    'credentials.json',
    scopes=SCOPES,
    redirect_uri=REDIRECT_URI
)

def google_auth(request):
    auth_url, _ = flow.authorization_url(prompt='consent')
    return redirect(auth_url)


from django.shortcuts import render, redirect
from .forms import PitchEventForm
from .models import PitchEvent
#
@csrf_exempt
def create_pitch_event(request):
    if request.method == 'POST':
        form = PitchEventForm(request.POST)
        if form.is_valid():
            pitch_event = form.save()
            request.session['pitch_event_id'] = pitch_event.id
            return redirect('google_auth')
    else:
        form = PitchEventForm()
    return render(request, 'create_pitch_event.html', {'form': form})

#
# import json
# from django.views.decorators.csrf import csrf_exempt
# from django.http import JsonResponse, HttpResponseBadRequest
#
# @csrf_exempt
# def create_pitch_event(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body.decode('utf-8'))
#         except json.JSONDecodeError:
#             return HttpResponseBadRequest("Invalid JSON")
#
#         form = PitchEventForm(data)
#         if form.is_valid():
#             pitch_event = form.save()
#             request.session['pitch_event_id'] = pitch_event.id
#             return redirect('google_auth')
#         else:
#             return JsonResponse({'status': 'error', 'errors': form.errors}, status=400)
#     else:
#         form = PitchEventForm()
#     return render(request, 'create_pitch_event.html', {'form': form})

    # return JsonResponse({'detail': 'Only POST method is allowed'}, status=405)

from django.shortcuts import redirect

from django.shortcuts import render, redirect
from .forms import PitchEventForm
from .models import PitchEvent


import datetime
from django.utils.timezone import now
from django.shortcuts import render
from googleapiclient.discovery import build
from .models import PitchEvent

from django.http import JsonResponse  # 👈 Import this
#
# #
# # def google_callback(request):
# #     flow.fetch_token(authorization_response=request.build_absolute_uri())
# #     credentials = flow.credentials
# #     service = build('calendar', 'v3', credentials=credentials)
# #
# #     # Create Google Calendar event
# #     start_time = (now() + datetime.timedelta(minutes=30)).isoformat()
# #     end_time = (now() + datetime.timedelta(minutes=90)).isoformat()
# #
# #     event_data = {
# #         'summary': 'Startup Pitch Event',
# #         'start': {'dateTime': start_time, 'timeZone': 'Asia/Kolkata'},
# #         'end': {'dateTime': end_time, 'timeZone': 'Asia/Kolkata'},
# #         'conferenceData': {
# #             'createRequest': {
# #                 'requestId': 'pitch-' + str(datetime.datetime.now().timestamp()).replace('.', ''),
# #                 'conferenceSolutionKey': {'type': 'hangoutsMeet'}
# #             }
# #         }
# #     }
# #
# #     calendar_event = service.events().insert(
# #         calendarId='primary',
# #         body=event_data,
# #         conferenceDataVersion=1
# #     ).execute()
# #
# #     meet_link = calendar_event.get('hangoutLink')
# #
# #     pitch_event = None
# #     response_data = {
# #         'meet_link': meet_link,
# #         'status': 'success'
# #     }
# #
# #     event_id = request.session.get('pitch_event_id')
# #     if event_id:
# #         try:
# #             pitch_event = PitchEvent.objects.get(id=event_id)
# #             pitch_event.video_url = meet_link
# #             pitch_event.save()
# #
# #             # Add event details to JSON response
# #             response_data['pitch_event'] = {
# #                 'id': pitch_event.id,
# #                 'title': pitch_event.title,
# #                 'description': pitch_event.description,
# #                 'date': pitch_event.date.isoformat(),
# #                 'video_url': pitch_event.video_url,
# #             }
# #
# #         except PitchEvent.DoesNotExist:
# #             response_data['status'] = 'error'
# #             response_data['message'] = 'Pitch event not found'
# #
# #     return JsonResponse(response_data)
# s



# def google_callback(request):
#     flow.fetch_token(authorization_response=request.build_absolute_uri())
#     credentials = flow.credentials
#     service = build('calendar', 'v3', credentials=credentials)
#
#     # Create Google Calendar event
#     start_time = (now() + datetime.timedelta(minutes=30)).isoformat()
#     end_time = (now() + datetime.timedelta(minutes=90)).isoformat()
#
#     event_data = {
#         'summary': 'Startup Pitch Event',
#         'start': {'dateTime': start_time, 'timeZone': 'Asia/Kolkata'},
#         'end': {'dateTime': end_time, 'timeZone': 'Asia/Kolkata'},
#         'conferenceData': {
#             'createRequest': {
#                 'requestId': 'pitch-' + str(datetime.datetime.now().timestamp()).replace('.', ''),
#                 'conferenceSolutionKey': {'type': 'hangoutsMeet'}
#             }
#         }
#     }
#
#     calendar_event = service.events().insert(
#         calendarId='primary',
#         body=event_data,
#         conferenceDataVersion=1
#     ).execute()
#
#     meet_link = calendar_event.get('hangoutLink')
#
#     # 🎯 Retrieve event from session
#     event_id = request.session.get('pitch_event_id')
#     if event_id:
#         try:
#             pitch_event = PitchEvent.objects.get(id=event_id)
#             pitch_event.video_url = meet_link
#             pitch_event.save()
#         except PitchEvent.DoesNotExist:
#             pass
#
#     print("Generated Meet link:", meet_link)
#
#     return render(request, 'meet_created.html', {'link': meet_link})

def google_callback(request):
    flow.fetch_token(authorization_response=request.build_absolute_uri())
    credentials = flow.credentials
    service = build('calendar', 'v3', credentials=credentials)

    # Create Google Calendar event
    start_time = (now() + datetime.timedelta(minutes=30)).isoformat()
    end_time = (now() + datetime.timedelta(minutes=90)).isoformat()

    event_data = {
        'summary': 'Startup Pitch Event',
        'start': {'dateTime': start_time, 'timeZone': 'Asia/Kolkata'},
        'end': {'dateTime': end_time, 'timeZone': 'Asia/Kolkata'},
        'conferenceData': {
            'createRequest': {
                'requestId': 'pitch-' + str(datetime.datetime.now().timestamp()).replace('.', ''),
                'conferenceSolutionKey': {'type': 'hangoutsMeet'}
            }
        }
    }

    calendar_event = service.events().insert(
        calendarId='primary',
        body=event_data,
        conferenceDataVersion=1
    ).execute()

    meet_link = calendar_event.get('hangoutLink')

    pitch_event = None
    event_id = request.session.get('pitch_event_id')
    if event_id:
        try:
            pitch_event = PitchEvent.objects.get(id=event_id)
            pitch_event.video_url = meet_link
            pitch_event.save()
        except PitchEvent.DoesNotExist:
            pitch_event = None

    print("Generated Meet link:", meet_link)

    return render(request, 'meet_created.html', {
        'link': meet_link,
        'pitch_event': pitch_event  # 👈 passing the event too
    })




