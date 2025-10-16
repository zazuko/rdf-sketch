export enum RdfSerializationType {
    JsonLD = 'application/ld+json',
    Trig = 'application/trig',
    NQuads = 'application/n-quads',
    NTriples = 'application/n-triples',
    //  N3 = 'text/n3',
    Turtle = 'text/turtle',
    RdfXML = 'application/rdf+xml',
}

export const rdfFormats: RdfFormat[] = [
    {
        contentType: RdfSerializationType.Turtle,
        name: 'Turtle',
        type: RdfSerializationType.Turtle,
    },
    {
        contentType: RdfSerializationType.JsonLD,
        name: 'JSON-LD',
        type: RdfSerializationType.JsonLD,
    },
    {
        contentType: RdfSerializationType.Trig,
        name: 'TriG',
        type: RdfSerializationType.Trig,
    },
    {
        contentType: RdfSerializationType.NQuads,
        name: 'N-Quads',
        type: RdfSerializationType.NQuads,
    },
    {
        contentType: RdfSerializationType.NTriples,
        name: 'N-Triples',
        type: RdfSerializationType.NTriples,
    },
    /*  {
          contentType: RdfSerializationType.N3,
          name: 'N3',
          type: RdfSerializationType.N3,
      },*/
    {
        contentType: RdfSerializationType.RdfXML,
        name: 'RDF/XML',
        type: RdfSerializationType.RdfXML,
    }
];


export interface RdfFormat {
    contentType: string;
    name: string;
    type: RdfSerializationType;
}

