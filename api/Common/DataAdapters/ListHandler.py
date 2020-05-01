import math

class ListHandler(object):
    q = ''
    page = 0
    pageSize = 30
    fields = []
    sort = []
    totalRows = 0
    filteredRows = 0
    filters = []
    extra_args = []
    depth = 0

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

    def Sort(self, query):
        if self.sort != []:
            return query.order_by(*self.sort)
        else:
            return query.order_by('id')

    def Filter(self, query):
        self.totalRows = query.count()
        
        if self.filters != []:
            for filter in self.filters:
                query = query.filter(filter)

        self.filteredRows = query.count()
        return query

    def Limit(self, query):
        offset = self.page * self.pageSize
        limit = offset + self.pageSize
        query = query[offset:limit]
        return query

    def Select(self, query):
        if self.fields != []:
            query = query.values(*self.fields)
        return query

    def full_filter(self, query):
        query = self.Filter(query)
        query = self.Order(query)
        #query = self.Select(query)
        query = self.Limit(query)
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