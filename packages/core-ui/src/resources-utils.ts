import TermSet from "@rdfjs/term-set"
import type { Link } from "./model/link.model"
import type { Resource } from "./model/resource.model"
import { rdfEnvironment } from './rdf/environment';
import { shrinkTerm } from "./rdf/shrink-term";
import type { Dataset } from "@rdfjs/types";


export function resourcesFromDataset(dataset: Dataset): Resource[] {
    const nodeSet = new TermSet();
    for (const quad of dataset) {
        nodeSet.add(quad.subject);
        if (!quad.predicate.equals(rdfEnvironment.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'))) {
            if (quad.object.termType === "BlankNode" || quad.object.termType === "NamedNode") {
                nodeSet.add(quad.object);
            }
        }
    }

    const resources = [...nodeSet].map(node => {
        const quads = dataset.match(node);
        const rdfClasses = [...quads].filter(quad => quad.predicate.equals(rdfEnvironment.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'))).map(quad => quad.object.value);
        const avatarsWithDuplicates = rdfClasses.map(rdfClass => {
            return {
                label: mapTypeToLabel(rdfClass),
                color: mapTypeToColor(rdfClass),
                iri: rdfClass
            }
        });
        const avatars = avatarsWithDuplicates.filter((avatar, index) => avatarsWithDuplicates.findIndex(a => a.iri === avatar.iri) === index);
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
            properties: orderedProperties,
            avatars
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

export const colorPalette = ["#b30000", "#7c1158", "#4421af", "#1a53ff", "#0d88e6", "#00b7c7", "#5ad45a", "#8be04e", "#ebdc78"];

export function mapTypeToColor(typeIri: string): string {
    const typeHash = Array.from(typeIri).reduce((hash, char) => {
        return char.charCodeAt(0) + ((hash << 5) - hash);
    }, 0);

    const colorIndex = Math.abs(typeHash) % colorPalette.length;
    return colorPalette[colorIndex] ?? "#b30000";
}
function mapTypeToLabel(typeIri: string): string {
    const iriParts = typeIri.split(/[#\/]/).filter(Boolean);
    const lastPart = iriParts[iriParts.length - 1] ?? '';

    const cc = lastPart.replace(/[a-z]/g, '');
    if (cc.length > 1) {

        return cc.slice(0, 2);
    }
    const label = lastPart.replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(/[^a-zA-Z0-9]/)
        .filter(Boolean)
        .map(part => (part[0] ?? '').toUpperCase() + (part[1] ? part[1].toLowerCase() : ''))
        .join('')
        .slice(0, 2);

    return label;
}