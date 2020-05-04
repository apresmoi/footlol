# chat/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer


import json
import asyncio
import uuid
from Chat import signals

REQUEST_POSITION_CHANGE = 'request_position_change'
REQUEST_SEND_MESSAGE = 'request_send_message'

LOGIN_SUCCESS = 'login_success'
PLAYER_JOIN = 'player_join'
PLAYER_LEAVE = 'player_leave'
POSITION_CHANGE = 'position_change'
SEND_MESSAGE = 'send_message'

class ChatConsumer(AsyncWebsocketConsumer):
    players = {}

    async def AddPlayer(self, position):
        self.players[self.channel_name] = {
            'name': self.channel_name,
            'position': position
        }
        await self.SendToSelf(LOGIN_SUCCESS, {
            'name': self.channel_name,
            'position': position,
            'players': self.players
        })
        await self.SendToAll(PLAYER_JOIN, {
            'name': self.channel_name,
            'position': position,
        })

    async def UpdatePlayer(self, position):
        self.players[self.channel_name]['position'] = position
        await self.SendToAll(POSITION_CHANGE, {
            'name': self.channel_name,
            'position': position
        })

    async def DeletePlayer(self):
        if self.channel_name in self.players:
            del self.players[self.channel_name]
        await self.SendToAll(PLAYER_LEAVE, {
            'name': self.channel_name,
        })

    async def SendToAll(self, type, payload):
        await self.channel_layer.group_send(self.room_group_name, {
            'type': type,
            'id': self.channel_name,
            'data': payload
        })
    
    async def SendToSelf(self, type, payload):
        await self.channel_layer.send(self.channel_name, {
            'type': type,
            'id': self.channel_name,
            'data': payload
        })

    async def SendJson(self, payload):
        print(payload)
        await self.send(text_data=json.dumps(payload))

    async def connect(self):
        self.room_group_name = 'instance'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        await self.AddPlayer({'x': 0, 'y': 0})

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        await self.DeletePlayer()

    async def receive(self, text_data):
        payload = json.loads(text_data)
        _type = payload.get('type', None)
        if _type:
            if _type == REQUEST_POSITION_CHANGE:
                position = payload.get('position', None)
                if position:
                    await self.UpdatePlayer(position)
            elif _type == REQUEST_SEND_MESSAGE:
                message = payload.get('message', None)
                if message:
                    await self.SendToAll(SEND_MESSAGE, {
                        'name': self.channel_name,
                        'message': message
                    })

    async def login_success(self, event):
        type = event.get('type', None)
        data = event.get('data', None)
        await self.SendJson({'type': type, 'data': data})

    async def player_join(self, event):
        type = event.get('type', None)
        data = event.get('data', None)
        await self.SendJson({'type': type, 'data': data})
        
    async def player_leave(self, event):
        type = event.get('type', None)
        data = event.get('data', None)
        await self.SendJson({'type': type, 'data': data})
    
    async def position_change(self, event):
        type = event.get('type', None)
        data = event.get('data', None)
        await self.SendJson({'type': type, 'data': data})
    
    async def send_message(self, event):
        type = event.get('type', None)
        data = event.get('data', None)
        await self.SendJson({'type': type, 'data': data})
