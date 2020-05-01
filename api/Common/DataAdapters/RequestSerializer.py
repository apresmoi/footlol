import copy
from rest_framework import serializers
from .fields import CommaSeparatedField, FilterField
from .ListHandler import ListHandler
from .RequestHandler import RequestHandler

from rest_framework.exceptions import ValidationError

from .validators import fields_validator, GetSerializerFieldNames

class RequestListSerializer(serializers.Serializer):
    q = serializers.CharField(required=False)
    page = serializers.IntegerField(required=False, default=0)
    pageSize = serializers.IntegerField(required=False, default=30)
    fields = CommaSeparatedField(required=False)
    sort = CommaSeparatedField(required=False, default=[])
    filters = serializers.ListField(child=FilterField(),required=False)
    extra_args = serializers.JSONField()
    depth = serializers.IntegerField(required=False, default=0)

    _reserved_words = ['format']

    def GetHandler(self):
        self.is_valid()
        self.custom_is_valid()
        return ListHandler(**self.data)

    def __init__(self, request, serializer):
        self.modelSerializer = serializer
        self.filters = serializers.ListField(child=FilterField(serializer=serializer),required=False)

        _query_dict = copy.deepcopy(request.GET)
        _restrictedWords = [str(field) for field in self.fields]
        _data_keys = [key for key, value in _query_dict.items() if key not in RequestListSerializer._reserved_words]
        
        _filters = []
        _extra_args = {}
        _data = {}

        all_model_fields = self.modelSerializer().get_fields()
        write_only_fields = [field for field in all_model_fields if all_model_fields[field].write_only]

        for key in _data_keys:
            if key not in _restrictedWords:
                if key in write_only_fields:
                    _extra_args[key] = _query_dict[key]
                else:
                    _filters.append({'field':key, 'value':_query_dict[key]})
            else:
                _data[key] = _query_dict[key]

        _data['filters'] = _filters
        _data['extra_args'] = _extra_args

        try:
            depth_original = getattr(serializer.Meta, 'depth_original')
        except:
            depth_original = getattr(serializer.Meta, 'depth')

        if not 'depth' in _data and depth_original != None:
            _data['depth'] = depth_original

        args = {}
        kwargs = {'data': _data}

        super(RequestListSerializer, self).__init__(*args, **kwargs)


    def custom_is_valid(self):
        _serializer_fields = self.modelSerializer().get_fields().items()
        
        if 'fields' in self.data:
            fields_validator(self.data['fields'], _serializer_fields)


class RequestSerializer(serializers.Serializer):
    q = serializers.CharField(required=False)
    fields = CommaSeparatedField(required=False)
    depth = serializers.IntegerField(required=False, default=0)

    _reserved_words = ['format']

    def GetHandler(self):
        self.is_valid()
        self.custom_is_valid()
        return RequestHandler(**self.data)

    def __init__(self, request, serializer):
        self.modelSerializer = serializer

        _query_dict = copy.deepcopy(request.GET)
        _restrictedWords = [str(field) for field in self.fields]
        _data_keys = [key for key, value in _query_dict.items() if key not in RequestSerializer._reserved_words]
        
        _data = {}

        for key in _data_keys:
            if key in _restrictedWords:
                _data[key] = _query_dict[key]

        args = {}
        kwargs = {'data': _data}

        super(RequestSerializer, self).__init__(*args, **kwargs)


    def custom_is_valid(self):
        _serializer_fields = self.modelSerializer().get_fields().items()
        
        if 'fields' in self.data:
            fields_validator(self.data['fields'], _serializer_fields)