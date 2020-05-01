from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError, ParseError, ErrorDetail, APIException
from django.db.models.deletion import ProtectedError

def MainResponse(status, meta=None, data=None, errors=None, error=None):
    reply_obj = dict()
    if meta != None:
        reply_obj['meta'] = meta
        reply_obj['meta']["allowed"] = True
    else:
        reply_obj['meta'] = {"allowed": True}
    if data != None:
        reply_obj['data'] = data
    if errors != None:
        reply_obj['errors'] = errors
    if error != None:
        reply_obj['error'] = error
    return Response(reply_obj, status)

def GeoJsonFeatureResponse(features):
    reply = {
        "type": "FeatureCollection",
        "features": features
    }
    return Response(reply, status.HTTP_200_OK)

def ListResponse(data = None, meta = None):
    return MainResponse(status.HTTP_200_OK, meta, data)

def OKResponse(data = None, meta = None):
    return MainResponse(status.HTTP_200_OK, meta, data)

def CreatedResponse(data = None, meta = None):
    return MainResponse(status.HTTP_201_CREATED, None, data)

def ValidationErrorResponse(errors = None, meta = None):
    return MainResponse(status.HTTP_400_BAD_REQUEST, meta, None, errors)

def NotFoundResponse(errors = None, meta = None):
    error = GeneralError("FAILED", "NOT_FOUND", "The requested object doesn't exists.")
    return MainResponse(status.HTTP_404_NOT_FOUND, meta, None, error)

def NotModifiedResponse(data = None, meta = None):
    return MainResponse(status.HTTP_304_NOT_MODIFIED, meta, None, errors)

    
def InvalidJsonResult(errors = None, meta = None):
    return MainResponse(status.HTTP_400_BAD_REQUEST, meta, None, errors)

def ProtectedErrorJsonResult(ex):
    _protected_objects = ex.protected_objects
    error = GeneralError("FAILED", "PROTECTED", "The object cannot be deleted since it's beign referenced by another entity.")
    return MainResponse(status.HTTP_400_BAD_REQUEST, None, None, error)

def GeneralError(status, code, message):
    return {
        "status": status,
        "code": code,
        "message": message,
    }

def ParseErrorDict(error, d):
    for key in error.keys():
        d[key] = []
        for _error in error[key]:
            d[key].append({
                'message':_error,
                'code': _error.code
            })
    return d

def ParseValidationErrors(ex):
    reply = {}
    for error in ex.detail:
        if type(error) == dict:
            reply = ParseErrorDict(error, reply)
        else:
            _error = ex.detail[error]
            
            if error in reply:
                reply[error].append({
                    'message': _error[0],
                    'code': _error[0].code
                })
            else:
                reply[error] = [{
                    'message': _error[0],
                    'code': _error[0].code
                }]
    return reply

def ExceptionJsonResult(ex):
    if type(ex) == ProtectedError:
        return ProtectedErrorJsonResult(ex)
    elif type(ex) == ValidationError:
        errors = ParseValidationErrors(ex)
        return MainResponse(status.HTTP_400_BAD_REQUEST, None, None, errors)
    elif type(ex) == APIException:
        return MainResponse(status.HTTP_400_BAD_REQUEST, None, None, None, {
            'message': ex.detail,
            'code': ex.default_code
        })
    else:
        return MainResponse(status.HTTP_400_BAD_REQUEST, None, None, None)