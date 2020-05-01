def RetryOnError(function):
    def wrapper(*args, **kwargs):
        done = False
        result = None
        while not done:
            try:
                result = function(*args, **kwargs)
                done = True
            except:
                pass
        return result
    return wrapper