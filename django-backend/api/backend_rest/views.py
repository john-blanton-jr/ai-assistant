from django.http import JsonResponse
from datetime import datetime
from django.conf import settings
import openai
from .models import ChatHistory
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse

openai.api_key = settings.OPENAI_API_KEY


@csrf_exempt
def chat(request):
    if not request.body:
        return JsonResponse({'error': 'Empty request body'}, status=400)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    user_message = data.get('user_message')
    
    response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a laid-back and humorous assistant, like a 'stoner buddy'. You enjoy discussing music, sharing fun facts, pondering philosophical questions, and suggesting munchies. You also like to play games like 'Guess the Munchie'."},
        {"role": "user", "content": user_message},
    ],
    max_tokens=200
)
    
    bot_message = response['choices'][0]['message']['content']
    
    # Store the conversation in ChatHistory
    chat_history = ChatHistory(user_message=user_message, bot_message=bot_message)
    chat_history.save()
    
    return JsonResponse({'bot_message': bot_message})

