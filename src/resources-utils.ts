import TermSet from "@rdfjs/term-set"
import DatasetExt from "rdf-ext/lib/Dataset"
import { Term } from "rdf-js"
import { Link } from "./model/link.model"
import { Resource } from "./model/resource.model"

export function resourcesFromDataset(dataset: DatasetExt, env: any): Resource[] {
    const subjectsSet = new TermSet<Term>([...dataset].map(({ subject }) => subject))
    return [...subjectsSet].map(subject => {
        const quads = dataset.match(subject)
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
            id: subject.value,
            term: subject,
            name: env.shrink(subject),
            properties: [...properties.values()],
        }
    })
}

export function linksFromResources(resources: Resource[]): Link[] {
    const resourceIds = new TermSet(resources.map(({ term }) => {
        console.log('t', term);
        console.log('r', resources);
        return term
    }))

    return resources
        .flatMap(resource => resource.properties.map((property) => {
            console.log('p1', property);
            return ({ ...property, resource })
        }))
        .reduce((links, property) => {
            console.log('---- link --- prop --')
            console.log(links)
            console.log(property)

            property.values.forEach((value) => {
                const source = property.resource.term
                const target = value
                console.log('ressource is ', resourceIds);
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
        }, [])
}