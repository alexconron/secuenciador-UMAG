import strawberry
from .nucleotide import Nucleotide

@strawberry.type
class Query:

    @strawberry.field(description="Get all nucleotides.")
    def get_all_nucleotide() -> list[Nucleotide]:
        return [
            Nucleotide(id="1", name="A"),
            Nucleotide(id="2", name="C"),
            Nucleotide(id="3", name="G"),
            Nucleotide(id="4", name="T"),
        ]
