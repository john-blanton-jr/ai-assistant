
Basic chatbot with a surfer vibe. 

create .env file in django-backend/backend_project/
    OPENAI_API_KEY='Your openai api key'

INSTALLED:
Bootstrap
React router
** see requirements.txt for other installed items **

Use docker compose:
- docker-compose build
- docker-compose up

change bot persona/vibes in views.py

Does not remember chat history. Each request is a new chat. (plan to change this soon)
