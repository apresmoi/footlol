from rest_framework import serializers
from rest_framework.validators import UniqueValidator

class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        check_unique = kwargs.pop('check_unique', None)
        depth = kwargs.pop('depth', None)

        try:
            depth_original = getattr(self.Meta, 'depth_original')
        except:
            depth_original = None
        if depth_original != None:
            setattr(self.Meta, 'depth', depth_original)
        else:
            setattr(self.Meta, 'depth_original', getattr(self.Meta, 'depth'))

        depthModified = False
        if type(depth) == int:
            if depth > 10:
                depth = 10
            setattr(self.Meta, 'depth', depth)
            depthModified = True

        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if depthModified:
            _fields = [str(field) for field in self.fields]
            for field in _fields:
                if issubclass(type(self.fields[field]), DynamicFieldsModelSerializer):
                    if depth == 0:
                        _model = self.fields[field].Meta.model
                        self.fields.pop(field)
                        self.fields[field + "_id"] = serializers.PrimaryKeyRelatedField(queryset=_model)
                    else:
                        _type = type(self.fields[field])
                        self.fields[field] = _type(depth=depth - 1)

                # maybe this should be a custom feature specified in the serializer's definition
                # elif issubclass(type(self.fields[field]), serializers.SerializerMethodField):
                    # if depth == 0:
                        # self.fields.pop(field)

        if fields is not None and len(fields) > 0:
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)

        if check_unique == False:
            for field in self.fields:
                validators = []
                for validator in self.fields[field].validators:
                    if type(validator) != UniqueValidator:
                        validators.append(validator)
                self.fields[field].validators = validators


class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = None
        if self.parent.parent != None:
            serializer = self.parent.parent.__class__(value, context=self.context)
        else:
            serializer = self.parent.__class__(value, context=self.context)
        return serializer.data