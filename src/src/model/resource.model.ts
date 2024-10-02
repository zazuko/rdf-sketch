import TermSet from "@rdfjs/term-set";
import type { Term } from "@rdfjs/types";

export interface Resource {
    id: string,
    name: string,
    term: Term,
    properties: Property[]
}

export interface Property {
    id: string,
    name: string,
    values: TermSet,
}
