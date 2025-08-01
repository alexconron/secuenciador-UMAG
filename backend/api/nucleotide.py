import strawberry

@strawberry.type(
    description="A nucleotide, just that."
)
class Nucleotide:
    id: strawberry.ID = strawberry.field(description="The ID of the nucleotide.")
    name: str = strawberry.field(description="The name of the nucleotide (C,A,G,T).")