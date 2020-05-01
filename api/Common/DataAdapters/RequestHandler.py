import math

class RequestHandler(object):
    q = ''
    fields = []
    depth = 0

    def __init__(self, *args, **kwargs):
        _setattr = setattr
        if kwargs:
            for prop in tuple(kwargs):
                try:
                    _setattr(self, prop, int(kwargs[prop]))
                except:
                    _setattr(self, prop, kwargs[prop])
        super().__init__()