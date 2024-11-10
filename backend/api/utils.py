from .models import Tags, Images
from .serializers import InfoTagsSerializer
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist



def validate_tags(tags: list) -> list | bool:
    if not tags:
        return False 
    
    validated_tag_list = []
    #ManyToMany already implements Set, but this explicit declaration makes code below faster
    tags = set(tags) 

    for tag in tags:
        try: 
            validated_tag = Tags.objects.get(tag=tag)
        except ObjectDoesNotExist:
            continue
        else:
            validated_tag_list.append(validated_tag)
    
    if len(tags) == 0:
        return False

    return validated_tag_list

def is_unique(tag_name: str) -> True | False:
    try:
        Tags.objects.get(tag=tag_name)
    except ObjectDoesNotExist:
        return True 
    else:
        return False

def get_unique_tags_by_images(images) -> list:
    img_objs = Images.objects.filter(pk__in=images).order_by('-pk')[0:100]
    tags = []
    for img in img_objs:
        tags += [*img.tags.all()]
    serializer = InfoTagsSerializer(set(tags), many=True)
    return serializer.data

def check_ownership(user, obj) -> True | False:
    if user == obj.user:
        return True
    return False

def paginate_data(request, data, paginator, serializer):
    images_paginated = paginator.paginate_queryset(data, request)
    serializer = serializer(images_paginated, many=True) #info serializer
    return serializer.data

def method_permission_classes(permission_classes):
    def function_decorator(function):
        def decorated_function(self, *args, **kwargs):
            self.permission_classes = permission_classes
            self.check_permissions(self.request)
            return function(self, *args, **kwargs)
        return decorated_function
    return function_decorator

 
