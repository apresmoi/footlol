from rest_framework import serializers
from .fields import CommaSeparatedField
import math

class ListHandler(object):
    q = ''
    page = 0
    pageSize = 0
    fields = []
    sort = []
    totalRows = 0
    filteredRows = 0

    def __init__(self, *args, **kwargs):
        _setattr = setattr
        if kwargs:
            for prop in tuple(kwargs):
                try:
                    _setattr(self, prop, int(kwargs[prop]))
                except:
                    _setattr(self, prop, kwargs[prop])
        super().__init__()
    
    def TotalPageCount(self):
        if self.pageSize > 0:
            return int(math.ceil(self.totalRows / self.pageSize))
        else:
            return 0

    def PageCount(self):
        if self.pageSize > 0:
            return int(math.ceil(self.filteredRows / self.pageSize))
        else:
            return 0

    def Order(self, query):
        if self.sort:
            return query.order_by(*self.sort)
        else:
            return query.order_by('id')

    def Filter(self, query):
        self.totalRows = query.count()
        #do filters
        self.filteredRows = query.count()
        return query

    def Limit(self, query):
        offset = self.page * self.pageSize
        limit = offset + self.pageSize
        query = query[offset:limit]
        print(offset,limit)
        return query

    def GetMeta(self):
        return {
            'page': self.page,
            'pageSize': self.pageSize,
            'totalRows': self.totalRows,
            'filteredRows': self.filteredRows,
            'pageCount': self.PageCount(),
            'totalPageCount': self.TotalPageCount(),
        }

class ListSerializer(serializers.Serializer):
    q = serializers.CharField(required=False)
    page = serializers.IntegerField(required=False, default=0)
    pageSize = serializers.IntegerField(required=False)
    fields = CommaSeparatedField(required=False)
    sort = CommaSeparatedField(required=False)

    def GetHandler(self):
        self.is_valid()
        return ListHandler(**self.data)

