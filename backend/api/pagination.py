from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .utils import get_unique_tags_by_images

class StandardPagination(PageNumberPagination):
    page_size = 42
StandardPaginator = StandardPagination()

class ImagesPagination(PageNumberPagination):
    page_size = 42

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'images': data,
            'tags': get_unique_tags_by_images([d['id'] for d in data])
        })
ImagesPaginator = ImagesPagination()