from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
import os

# Create your models here.



class TagsTypes(models.TextChoices):
    TRAIT = 'TR', 'TRAIT'
    AUTHOR = 'AU', 'AUTHOR'
    SOURCE = 'SO', 'SOURCE'
    CHARACTER = 'CH', 'CHARACTER'
    SPECIAL = 'SP', 'SPECIAL',
    NONE = 'NE', 'NONE'  
    

class Tags(models.Model):
    tag = models.CharField(max_length=100)
    type = models.CharField(max_length=3, choices=TagsTypes)
    description = models.TextField()
    amount = models.IntegerField(default=0)

    def change_amount(self, increment=True, value=1):
        if increment:
            self.amount += value
        else:
            self.amount -= value
        self.save()



class Images(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='images/')
    description = models.TextField()
    tags = models.ManyToManyField(to=Tags) #TODO: custom? | NOTE: many images to many tags
    date = models.DateTimeField(auto_now_add=True)
        

class Comments(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='comments') #user.comments
    image = models.ForeignKey(to=Images, on_delete=models.CASCADE, related_name='comments') #image.comments | NOTE: one image to many comments
    comment = models.TextField()
    score = models.IntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)


#!!!ATTENTION!!!
#For some reason ManyToMany field QueryDict is always empty, no matter where I try to do operations with it:
#   1. Receiver QuerySet is empty by itself and I cant really do anything about it
#   2. Images save() args are empty, so I can't add objects to ManyToMany field manually
#The only solution is to implement tag amount feature in views, but it's not really beautiful    
#!!!ATTENTION!!!

"""
@receiver(models.signals.post_save, sender=Images)
def Images_on_save(sender, instance: Images, *args, **kwargs):
    print(args, kwargs, sep='\n')
"""

@receiver(models.signals.post_delete, sender=Images)
def Images_on_delete(sender, instance: Images, **kwargs):

    #decrementing tags count on post_delete does not work, 'cause QueryDict is empty LMAO (read ATTENTION)

    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)
    return




