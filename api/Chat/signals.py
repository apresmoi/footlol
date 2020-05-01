from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.dispatch import receiver
from django.utils import timezone
from django.db.models.signals import post_save, pre_save


# from Ventas.models import Ventas

# @receiver(post_save, sender=Ventas)
# def my_handler1(sender, instance, **kwargs): 
#     if kwargs['created'] == True:
#         channel_layer = get_channel_layer()
#         async_to_sync(channel_layer.group_send)("chat_notification", {"type": "chat_message", "message": "EMPRESA GUARDADA " + str(timezone.now()) + " id: " + str(instance.id)})
#     else:
#         channel_layer = get_channel_layer()
#         async_to_sync(channel_layer.group_send)("chat_notification", {"type": "chat_message", "message": "EMPRESA ACTUALIZADA " + str(timezone.now()) + " id: " + str(instance.id)})