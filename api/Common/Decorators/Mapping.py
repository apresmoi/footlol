def DictToArray(function):
    def wrapper(*args, **kwargs):
        try:
            return function(*args, **kwargs).values()
        except Exception as ex:
            raise ex
    return wrapper