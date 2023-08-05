from django.db import models

class ChatHistory(models.Model):
    user_message = models.TextField()
    bot_message = models.TextField()
    models.DateTimeField(auto_now_add=True)
