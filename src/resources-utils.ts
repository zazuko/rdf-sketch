import TermSet from "@rdfjs/term-set"
import type { Link } from "./model/link.model"
import type { Resource } from "./model/resource.model"
import { rdfEnvironment } from './rdf/environment';
import { shrinkTerm } from "./rdf/shrink-term";
import type { Dataset } from "@rdfjs/types";


export function resourcesFromDataset(dataset: Dataset): Resource[] {
    const extractedSubjects = [...dataset].map(quad => quad.subject)
    const extractedObject = [...dataset].filter(
        quad => !quad.predicate.equals(rdfEnvironment.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'))).map(quad => quad.object).filter(o => o.termType === "BlankNode" || o.termType === "NamedNode")

    const nodeSet = new TermSet([...extractedSubjects, ...extractedObject])

    const resources = [...nodeSet].map(node => {
        const quads = dataset.match(node)
        const properties = [...quads].reduce((acc, { predicate, object }) => {
            if (!acc.has(predicate.value)) {
                const property = {
                    id: predicate.value,
                    term: predicate,
                    name: shrinkTerm(predicate),
                    values: new TermSet(),
                }
                acc.set(predicate.value, property)
            }
            acc.get(predicate.value).values.add(object)
            return acc
        }, new Map())

        // order properties by name but rdf:type first
        const orderedProperties = [...properties.values()].sort((a, b) => {
            if (a.name === 'rdf:type') return -1;
            if (b.name === 'rdf:type') return 1;
            return a.name.localeCompare(b.name);
        })

        return {
            id: node.value === '' ? '_:nobody' : node.value,
            term: node,
            name: shrinkTerm(node),
            properties: orderedProperties
        } as Resource
    });
    return resources
}


export function linksFromResources(resources: Resource[]): Link[] {
    const resourceIds = new TermSet(resources.map(resource => {
        return resource.term
    }))

    const links = resources
        .flatMap(resource => resource.properties.map(property => {
            return ({ ...property, resource })
        }))
        .reduce((links: Link[], property) => {
            property.values.forEach((value) => {
                const source = property.resource.term
                const target = value
                if (resourceIds.has(target)) {
                    links.push({
                        source: source.value,
                        target: target.value,
                        sourceProperty: property.id,
                        label: property.name,
                    })
                }
            })
            return links
        },
            []);
    return links
}