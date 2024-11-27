from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from .models import Images, Tags, Comments
from .serializers import *
from rest_framework import generics, viewsets, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError, PermissionDenied
from .pagination import StandardPaginator, ImagesPaginator
from .utils import *


#!!!ATTENTION!!!
#SETTINGS DEFUALT_AUTHENTICATION_CLASSES should be changed to None

class CreateUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny] 

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(is_active=True)
        else:
            raise ValidationError(serializer.errors)

class UserProfile(viewsets.ViewSet):

    permission_classes = [AllowAny]

    @staticmethod
    def serialize_profile_data(user):
        all_imgs = user.images.all()
        response_data = {}
        response_data['images'] = InfoImagesSerializer(all_imgs.order_by('-pk')[0:5], many=True).data
        response_data['total'] = len(all_imgs)
        response_data['comments'] = CommentsSerializer(user.comments.all().order_by('-pk')[0:5], many=True).data
        response_data['user'] = UserSerializer(user).data

        return response_data
    
    @method_permission_classes([IsAuthenticated])
    def current_user(self, request):
        user = request.user 
        data = self.serialize_profile_data(user)
        return Response(data)
    
    @method_permission_classes([AllowAny])
    def lookup_user(self, request, username):
        user = get_object_or_404(User, username=username)
        data = self.serialize_profile_data(user)
        return Response(data)

class CreateImages(generics.CreateAPIView):
    queryset = Images.objects.all()
    serializer_class = ImagesSerializer
    permission_classes = [IsAuthenticated] #change to IsAuth

    def perform_create(self, serializer: ImagesSerializer) -> Response | None:
        if serializer.is_valid():
            tags = self.request.POST.get('tags', False).split('+')
            tags = validate_tags(tags)
            if not tags:
                raise ValidationError(['Valid tags for an image have not been provided!'])
            serializer.save(user=self.request.user, tags=tags)
            for tag in tags:
                tag.count_amount()
        else:
            return ValidationError(serializer.errors)

class GetImages(viewsets.ViewSet):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_by_pk(self, request, pk, *args, **kwargs):
        image = get_object_or_404(Images, pk=pk)
        serializer = ImagesSerializer(image)
        return Response(serializer.data)
    
    def get_by_search(self, request, *args, **kwargs):
        images = Images.objects.all().order_by('-pk')

        tags = request.GET.get('tags')
        user = request.GET.get('user')  

        if tags:
            tags = [tag.pk for tag in validate_tags(tags.split())]
            for tag in tags:
                images = images.filter(tags=tag) #TODO: filter with one request
        if user:
            user = get_object_or_404(User, username=user)
            images = images.filter(user=user)

        data = paginate_data(request, images, ImagesPaginator, InfoImagesSerializer) #info serializer
        return ImagesPaginator.get_paginated_response(data)

#WIP
class DeleteImages(generics.DestroyAPIView):
    queryset = Images.objects.all()
    serializer_class = ImagesSerializer
    permission_classes = [IsAuthenticated]   

    def delete(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        image = get_object_or_404(Images, pk=pk)

        for tag in image.tags.all():
            tag.count_amount()

        return super().delete(request, *args, **kwargs)      

class CreateTags(generics.CreateAPIView):
    queryset = Tags.objects.all()
    serializer_class = TagsSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer: TagsSerializer):
        if serializer.is_valid():
            tag_name = serializer.validated_data['tag']
            if is_unique(tag_name):
                serializer.save()
            else:
                raise ValidationError(['Tag with such name already exists!'])
        else:
            raise ValidationError(['Given data is not valid!'])

class GetTags(viewsets.ViewSet):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_autocomplete(self, request, *args, **kwargs):
        search = request.GET.get('search')
        tags = Tags.objects.all()
        if search:
            tags = tags.filter(tag__startswith=search)[0:5]
        serializer = InfoTagsSerializer(tags, many=True)
        return Response(serializer.data)

    def get_by_tag(self, request, tag, **kwargs):
        try:
            tag = Tags.objects.get(tag=tag)
        except ObjectDoesNotExist:
            return Response({
                'tag': tag,
                'amount': 'N/A',
                'type': 'NE',
                'description': 'Such tag does not exist, but you can change it!'
            })
        else:
            serializer = TagsSerializer(tag)
            return Response(serializer.data)

class EditImageInfo(views.APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk, *args, **kwargs):
        image = get_object_or_404(Images, pk=pk)
        if not check_ownership(request.user, image):
            raise PermissionDenied()
        description = request.data.get('description')
        if len(description) < 1:
            raise ValidationError(['Image should have a description!'])

        tags = request.data.get('tags')
        if len(tags) < 1:
            raise ValidationError(['Image should have at least 1 tag!'])
        validated_tags = validate_tags(tags)
        if not validated_tags:
            raise ValidationError(['No valid tags were provided!'])
        
        serializer = ImagesSerializer(
            image,
            data={
                'tags': validated_tags,
                'description': description
            },
            partial=True
        )
        if serializer.is_valid():
            prev_image_tags = [*image.tags.all()]
            serializer.save(tags=validated_tags, description=description)
            for tag in set(validated_tags + prev_image_tags):
                tag.count_amount()
            return Response(serializer.data)
        raise ValidationError(serializer.errors)

class CreateComments(generics.CreateAPIView):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.is_valid():
            image_pk = self.request.data.get('image') #TODO: with request.POST
            image = get_object_or_404(Images, pk=image_pk)
            serializer.save(user=self.request.user, image=image)
            print('created')
        else:
            return Response({
                'message': 'error',
                'error': serializer.errors
            })      
        
class GetComments(generics.ListAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, *args, **kwargs):
        image_pk = kwargs.get('image_pk')
        username = kwargs.get('username') 
        search_kwargs = {}
        
        if username:
            search_kwargs['user'] = get_object_or_404(User, username=username)
        elif image_pk:
            search_kwargs['image'] = get_object_or_404(Images, pk=image_pk)

        comments = Comments.objects.filter(**search_kwargs).order_by('-pk')
        data = paginate_data(request, comments, StandardPaginator, CommentsSerializer)
        return StandardPaginator.get_paginated_response(data)









#!!!ATTENTION!!!
#TODO: implement likes (too hard)

"""
@api_view(['GET'])
@permission_classes([AllowAny])
def GetUser(request):
    pk = request.GET.get('pk')
    if pk:
        try:
            user = User.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({
                'message': 'error',
                'error': 'This user doesnt exist'
            })
    else:
        user = request.user 
    serializer = UserSerializer(user)
    return Response(serializer.data)
"""

