import asyncio
import random
import strawberry

from typing import AsyncGenerator


NUCLEOTIDES = ["A", "C", "G", "T"]

@strawberry.type
class Subscription:
    @strawberry.subscription
    async def get_nucleotide(self, amount: int = 100) -> AsyncGenerator[str, None]:
        for i in range(amount):
            yield random.choice(NUCLEOTIDES)
            await asyncio.sleep(0.2)


