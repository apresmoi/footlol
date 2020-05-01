from rest_framework import fields
from django.utils.translation import ugettext_lazy as _
import copy
import inspect
import collections
from collections import OrderedDict

import re

from django.db.models import Q

from .validators import fields_validator


class FilterField(fields.Field):
    filter = None

    def __init__(self, *args, **kwargs):
        self.modelSerializer = None
        if 'serializer' in kwargs:
            self.modelSerializer = kwargs['serializer']
            kwargs.pop('serializer')
        
        super(FilterField, self).__init__(*args, **kwargs)

    def to_internal_value(self, data):
        """
        List of dicts of native values <- List of dicts of primitive datatypes.
        """
        _filter_field = data['field']
        _filter_value = data['value']

        _field = None
        _operator = None
        _value = None

        _field = _filter_field.split('[')[0]
        if '[' in _filter_field:
            _operator = re.search('\[.*\]', _filter_field).group()
            _operator = _operator.replace('[', '').replace(']', '')

        if ',' in _filter_value and 'in' in _operator:
            _value = _filter_value.split(',')
        else:
            _value = _filter_value

        self.field = _field
        self.operator = 'in' if _operator == 'not_in' else _operator
        self.exclude = True if _operator == 'not_in' else False
        self.value = _value

        _filter_str = self.field
        if self.operator != None:
            _filter_str += "__" + self.operator
        
        if self.operator == 'isnull':
            if self.value in [0, '0', 'False', 'false']:
                self.value = False
            else:
                self.value = True

        self.filter = Q(**{_filter_str: self.value})
        if self.exclude:
            self.filter = Q(~self.filter)

        return self.validate()

    def to_representation(self, data):
        _filter_str = data['field']
        if 'operator' in data and data['operator'] != None:
            _filter_str += "__" + data['operator']

        if data['exclude']:
            return ~Q(**{_filter_str: data['value']})
        return Q(**{_filter_str: data['value']})

    def validate(self):
        if self.modelSerializer != None:
            _serializer_fields = self.modelSerializer().get_fields().items()
            fields_validator([self.field], _serializer_fields)

        return {'field': self.field, 'operator': self.operator, 'value': self.value, 'exclude': self.exclude}

class CommaSeparatedField(fields.Field):
    child = fields._UnvalidatedField()
    initial = []
    default_error_messages = {
        'not_a_list': _('Expected a list of items but got type "{input_type}".'),
        'empty': _('This list may not be empty.'),
        'min_length': _('Ensure this field has at least {min_length} elements.'),
        'max_length': _('Ensure this field has no more than {max_length} elements.')
    }

    def __init__(self, *args, **kwargs):
        self.child = kwargs.pop('child', copy.deepcopy(self.child))
        self.allow_empty = kwargs.pop('allow_empty', True)
        self.max_length = kwargs.pop('max_length', None)
        self.min_length = kwargs.pop('min_length', None)

        assert not inspect.isclass(self.child), '`child` has not been instantiated.'
        assert self.child.source is None, (
            "The `source` argument is not meaningful when applied to a `child=` field. "
            "Remove `source=` from the field declaration."
        )

        super(CommaSeparatedField, self).__init__(*args, **kwargs)
        self.child.bind(field_name='', parent=self)
        if self.max_length is not None:
            message = self.error_messages['max_length'].format(max_length=self.max_length)
            self.validators.append(MaxLengthValidator(self.max_length, message=message))
        if self.min_length is not None:
            message = self.error_messages['min_length'].format(min_length=self.min_length)
            self.validators.append(MinLengthValidator(self.min_length, message=message))

    def get_value(self, dictionary):
        if self.field_name not in dictionary:
            if getattr(self.root, 'partial', False):
                return fields.empty
        return dictionary.get(self.field_name, fields.empty)

    def to_internal_value(self, data):
        """
        List of dicts of native values <- List of dicts of primitive datatypes.
        """
        if data != '':
            data = data.split(',')
        else:
            data = None
        
        if isinstance(data, type('')) or isinstance(data, collections.Mapping) or not hasattr(data, '__iter__'):
            self.fail('not_a_list', input_type=type(data).__name__)
        if not self.allow_empty and len(data) == 0:
            self.fail('empty')
        return self.run_child_validation(data)

    def to_representation(self, data):
        """
        List of object instances -> List of dicts of primitive datatypes.
        """
        return [self.child.to_representation(item) if item is not None else None for item in data]

    def run_child_validation(self, data):
        result = []
        errors = OrderedDict()

        for idx, item in enumerate(data):
            try:
                result.append(self.child.run_validation(item))
            except ValidationError as e:
                errors[idx] = e.detail

        if not errors:
            return result
        raise ValidationError(errors)