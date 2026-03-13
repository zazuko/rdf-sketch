
import type { Term } from '@rdfjs/types';
import { shrink } from '@zazuko/prefixes'

import { prefixMap } from '@/rdf/prefix-map';


/**
 * Shrink a term to a prefixed string
 * 
 * It uses the prefixes from the App wide used prefixMap
 * 
 * @param term 
 * @returns a prefixed string or the original value
 */
export function shrinkTerm(term: Term): string {
  if (term.termType === 'NamedNode') {
    const s = shrink(term.value, prefixMap.prefixes);
    return s ? s : term.value
  }
  return term.value
}

