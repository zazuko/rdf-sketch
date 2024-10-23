import TermSet from "@rdfjs/term-set"
import type { Link } from "./model/link.model"
import type { Resource } from "./model/resource.model"
import { rdfEnvironment } from './rdf/environment';
import { shrinkTerm } from "./rdf/shrink-term";


export function resourcesFromDataset(dataset: any): Resource[] {
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

        return {
            id: node.value,
            term: node,
            name: shrinkTerm(node),
            properties: [...properties.values()]
        } as Resource
    });
    console.log(resources)
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
    console.log(links)
    return links
}