import rdf from '@zazuko/env';

import formats from '@rdfjs/formats';


rdf.formats.import(formats);

export const rdfEnvironment = rdf;
