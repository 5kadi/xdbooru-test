from rest_framework.serializers import ModelSerializer, CharField
from django.contrib.auth.models import User 
from .models import Images, Tags, Comments
from django.contrib.auth.hashers import make_password

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'password'
        ]
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }
 
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        user = User.objects.create(**validated_data)
        user.is_active = True
        user.save()
        return user
    
class TagsSerializer(ModelSerializer):
    class Meta:
        model = Tags
        fields = '__all__'


class InfoTagsSerializer(TagsSerializer):
    class Meta:
        model = Tags
        fields = [
            'tag',
            'type',
            'amount'
        ]


class CommentsSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comments
        fields = '__all__'
        extra_kwargs = {
            'image': {
                'read_only': True
            },
            'id': {
                'read_only': True
            }
        }

class ImagesSerializer(ModelSerializer):
    tags = TagsSerializer(read_only=True, many=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Images 
        fields = '__all__'

class ImagesTagsSerializer(ModelSerializer):
    tags = TagsSerializer(read_only=True, many=True)
    
    class Meta:
        model = Images
        fields = [
            'tags'
        ]  #TODO: 7-8 unique tags of 5-6 different images
 
class InfoImagesSerializer(ImagesSerializer):
    #tags = InfoTagsSerializer(read_only=True, many=True)

    class Meta:
        model = Images
        fields = [
            'id',
            'image'
        ]

