from rest_framework.exceptions import ErrorDetail, ValidationError


def GetSerializerFieldNames(serializer_fields):
    return [field[0] for field in serializer_fields if field[1].write_only == False]


def fields_validator(field_names, serializer_fields):
    _serializer_fields_names = GetSerializerFieldNames(serializer_fields)
    
    _errors = {}

    for field_name in field_names:
        if '__' in field_name:
            _errors[field_name] = recursive_validate_field(field_name, serializer_fields, [])
        else:
            if field_name not in _serializer_fields_names:
                _errors[field_name] = [ErrorDetail("El campo " + field_name + " no se encuentra asociado a este recurso.", 'invalid_field')]

    if len(_errors.keys()) > 0:
        raise ValidationError(_errors)


def recursive_validate_field(field_name, serializer_fields, trace = []):
    _serializer_fields_names = GetSerializerFieldNames(serializer_fields)

    _errors = {}

    if '__' in field_name:
        first_field_name = field_name.split('__')[0]
        next_field_name = field_name[len(first_field_name)+2:]
    else:
        first_field_name = field_name
        next_field_name = None

    if first_field_name not in _serializer_fields_names:
        _error_detail = "El campo " + field_name + " no se encuentra asociado a este recurso."
        if len(trace) > 0:
            _error_detail += " Traceback: " + ' > '.join(trace)

        _errors[field_name] = [ErrorDetail("El campo " + field_name + " no se encuentra asociado a este recurso.", 'invalid_field')]

    elif next_field_name != None:
        for serializer_field in serializer_fields:
            try:
                serializer_fields = serializer_field[1].get_fields().items()
                trace.append(serializer_field[0])
            except:
                pass
        _errors[field_name] = recursive_validate_field(next_field_name, serializer_fields, trace)

    return _errors