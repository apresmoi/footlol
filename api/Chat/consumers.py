# chat/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import asyncio
import uuid
from Chat import signals

user_ids = []

def NewUserID():
    new_id = uuid.uuid1()
    while new_id in user_ids:
        new_id = uuid.uuid1()
    user_ids.append(new_id)
    return new_id

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        id = str(NewUserID())

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': "join",
                'id': id
            }
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        id = text_data_json['id']
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'id': id
            }
        )

    async def chat_message(self, event):
        message = event['message']
        id = event['id']
        await self.send(text_data=json.dumps({
            'message': message,
            'id': id,
        }))
