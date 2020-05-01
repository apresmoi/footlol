# from django.urls import path
from django.conf.urls import url, include
from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from Chat import routing as ChatRouting

application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter(
            ChatRouting.websocket_urlpatterns
        ),
    ),
})