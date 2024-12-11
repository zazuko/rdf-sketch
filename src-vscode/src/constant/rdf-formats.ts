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
        vscodeLanguageId: 'turtle',
        vscodeFileExtension: 'ttl',
    },
    {
        contentType: RdfSerializationType.JsonLD,
        name: 'JSON-LD',
        type: RdfSerializationType.JsonLD,
        vscodeLanguageId: 'jsonld',
        vscodeFileExtension: 'jsonld',
    },
    {
        contentType: RdfSerializationType.Trig,
        name: 'TriG',
        type: RdfSerializationType.Trig,
        vscodeLanguageId: 'trig',
        vscodeFileExtension: 'trig'
    },
    {
        contentType: RdfSerializationType.NQuads,
        name: 'N-Quads',
        type: RdfSerializationType.NQuads,
        vscodeLanguageId: 'n-quads',
        vscodeFileExtension: 'nq'
    },
    {
        contentType: RdfSerializationType.NTriples,
        name: 'N-Triples',
        type: RdfSerializationType.NTriples,
        vscodeLanguageId: 'ntriples',
        vscodeFileExtension: 'nt'
    },
    /*  {
          contentType: RdfSerializationType.N3,
          name: 'N3',
          type: RdfSerializationType.N3,
      },*/
    /*
        {
            contentType: RdfSerializationType.RdfXML,
            name: 'RDF/XML',
            type: RdfSerializationType.RdfXML,
    
        }
            */
];


export interface RdfFormat {
    contentType: string;
    name: string;
    type: RdfSerializationType;
    vscodeLanguageId: string;
    vscodeFileExtension: string;
}

