from django.shortcuts import render
from rest_framework import viewsets
from .models import Todo
from .serializers import TodoSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime
import requests
from django.conf import settings
from django.db.models import Q

# Create your views here.

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

@api_view(['GET'])
def todo_analytics(request):
    start = request.GET.get('start')
    end = request.GET.get('end')
    status = request.GET.get('status', 'all')
    keyword = request.GET.get('keyword', '').strip()
    if not start or not end:
        return Response({'error': 'start and end date required'}, status=400)
    todos = Todo.objects.filter(date__range=[start, end])
    if status == 'completed':
        todos = todos.filter(completed=True)
    elif status == 'not_completed':
        todos = todos.filter(completed=False)
    if keyword:
        todos = todos.filter(Q(title__icontains=keyword) | Q(description__icontains=keyword))
    todos_data = TodoSerializer(todos, many=True).data

    # Prepare prompt for Mistral AI
    prompt = f"Analyze the following todos from {start} to {end} with filters (status: {status}, keyword: '{keyword}') and provide insights:\n{todos_data}"

    mistral_api_url = "https://api.mistral.ai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.MISTRAL_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "mistral-tiny",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    try:
        ai_response = requests.post(mistral_api_url, headers=headers, json=payload, timeout=30)
        ai_result = ai_response.json()
        ai_message = ai_result.get("choices", [{}])[0].get("message", {}).get("content", "")
    except Exception as e:
        return Response({"error": f"AI request failed: {str(e)}"}, status=500)

    return Response({
        "todos": todos_data,
        "ai_analytics": ai_message
    })
