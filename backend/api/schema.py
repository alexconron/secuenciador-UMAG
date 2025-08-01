import strawberry
from .query import Query
from .subscription import Subscription

schema = strawberry.Schema(query=Query, subscription=Subscription)

