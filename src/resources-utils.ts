import TermSet from "@rdfjs/term-set"
import DatasetExt from "rdf-ext/lib/Dataset"
import { Term } from "rdf-js"
import { Link } from "./model/link.model"
import { Resource } from "./model/resource.model"

export function resourcesFromDataset(dataset: DatasetExt, env: any): Resource[] {
    const extractedSubjects = [...dataset].map(quad => quad.subject)
    const subjectSet = new TermSet<Term>([...extractedSubjects])


    return [...subjectSet].map(node => {
        const quads = dataset.match(node)
        const properties = [...quads].reduce((acc, { predicate, object }) => {
            if (!acc.has(predicate.value)) {
                const property = {
                    id: predicate.value,
                    term: predicate,
                    name: env.shrink(predicate),
                    values: new TermSet<Term>(),
                }
                acc.set(predicate.value, property)
            }
            acc.get(predicate.value).values.add(object)
            return acc
        }, new Map())

        return {
            id: node.value,
            term: node,
            name: env.shrink(node),
            properties: [...properties.values()],
        } as Resource
    })
}

export function linksFromResources(resources: Resource[]): Link[] {
    const resourceIds = new TermSet(resources.map(resource => {
        return resource.term
    }))

    return resources
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
                    } as Link)
                }
            })
            return links
        }, [])
}