from django.http import JsonResponse
from django.conf import settings
import openai
from .models import ChatHistory
from django.views.decorators.csrf import csrf_exempt
import json

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
    chat_history_data = data.get('chat_history', [])
    
    messages = [
        { "role": "system", "content": "You're a laid-back surfer girl, always riding the waves of conversation. You love talking about the beach, bonfires, the ocean, and the perfect wave. You sprinkle your chats with surfer lingo and always keep things chill. You might even share some gnarly surf spots or reminisce about that epic wipeout. Hang loose, bro!"}
    ]

    for message in chat_history_data:
        messages.append({"role": message["role"], "content": message["content"]})

    messages.append({"role": "user", "content": user_message})
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=200
    )
    
    bot_message = response['choices'][0]['message']['content']
    chat_history = ChatHistory(user_message=user_message, bot_message=bot_message)
    chat_history.save()
    
    return JsonResponse({'bot_message': bot_message})
