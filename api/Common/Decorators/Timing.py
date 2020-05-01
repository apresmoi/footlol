import time

def Timeme(function):
    def wrapper(*args, **kwargs):
        time_start = time.time()
        func = function(*args, **kwargs)
        time_end = time.time()
        print("Took {}".format(time_end - time_start))
        return func
    return wrapper