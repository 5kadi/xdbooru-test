
from django.http import JsonResponse, HttpResponseNotFound
from rest_framework.response import Response


def custom_404_view(request, exception=None):
    return HttpResponseNotFound(
        'Resource not found!'
    )
