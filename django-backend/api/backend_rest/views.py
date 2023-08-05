from django.http import JsonResponse
from datetime import datetime
from django.conf import settings
import openai
from .models import ChatHistory
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse


def index(request):
    current_time = datetime.now().strftime("%-I:%S %p")
    current_date = datetime.now().strftime("%A %m %-Y")

    data = {
        'time': current_time,
        'date': current_date,
    }

    return JsonResponse(data)


openai.api_key = settings.OPENAI_API_KEY


@csrf_exempt
def chat(request):
    if not request.body:
        return JsonResponse({'error': 'Empty request body'}, status=400)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    user_message = data.get('message')
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": user_message},
        ]
    )
    
    bot_message = response['choices'][0]['message']['content']
    
    # Store the conversation in ChatHistory
    chat_history = ChatHistory(user_message=user_message, bot_message=bot_message)
    chat_history.save()
    
    return JsonResponse({'message': bot_message})

