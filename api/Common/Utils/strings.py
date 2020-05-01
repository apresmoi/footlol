import json
import random
import string
import gc
import sys

def RandomString(length=10):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

def GetSize(obj):
    obj = json.dumps(obj)
    return sys.getsizeof(obj)