def LogFunctionName(function):
    def wrapper(*args, **kwargs):
        try:
            func = function(*args, **kwargs)
        except Exception as ex:
            print(function.__name__, ex)
            raise ex
        return func
    return wrapper