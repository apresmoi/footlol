from django.db.utils import OperationalError

def RetryOnLostConnection(function):
    def wrapper(*args, **kwargs):
        retries = 5
        done = False
        result = None
        while not done:
            try:
                result = function(*args, **kwargs)
                done = True
            except OperationalError as ex:
                if '2013' in str(ex):
                    if retries > 0:
                        retries -= 1
                        print("Retrying for connection loss ({})".format(retries))
                    else:
                        raise ex
                else:
                    raise ex
            except Exception as ex:
                raise ex
        return result
    return wrapper