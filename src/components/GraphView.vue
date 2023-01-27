<template>
  <GraphLayout class="w-full h-full" :nodes="resources" :links="links" :active-links="activeLinks" :auto-zoom="false"
    @link-enter="onLinkHover" @link-out="onUnhover">
    <template v-slot:node="{ node }">
      <ResourceCard :resource="node" :active-links="activeLinks" :env="env" @hover-title="onHoverResource"
        @unhover-title="onUnhover" @hover-property="onHoverProperty" @unhover-property="onUnhover" />
    </template>
  </GraphLayout>
</template>

<script setup lang="ts">

import { computed, ref } from 'vue'
import { GraphLayout } from '@zazuko/vue-graph-layout'
import ResourceCard from './ResourceCard.vue'
import DatasetExt from 'rdf-ext/lib/Dataset'

import { Term } from 'rdf-js'
import { Property, Resource } from '@/model/resource.model';
import { Link } from '@/model/link.model'
import TermSet from '@rdfjs/term-set'

interface Props {
  dataset: DatasetExt,
  env: any
}
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const props = defineProps<Props>()

const resources = computed(() => resourcesFromDataset(props.dataset, props.env))
const links = computed(() => linksFromResources(resources.value))
const activeLinks = ref([])

function onLinkHover(link: Link): void {
  activeLinks.value.push(link)
}

function onUnhover(): void {
  activeLinks.value = []
}

function onHoverResource(resource: Resource): void {
  activeLinks.value = links.value.filter((link) => link.source === resource.id)
}

function onHoverProperty(resource: Resource, property: Property): void {
  activeLinks.value = links.value.filter(link => (
    link.source === resource.id && link.sourceProperty === property.id))
}

/**
 * 
 * 
 */

function resourcesFromDataset(dataset: DatasetExt, env: any): Resource[] {
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

function linksFromResources(resources: Resource[]): Link[] {
  const resourceIds = new TermSet(resources.map(({ term }) => term))
  return resources
    .flatMap(resource => resource.properties.map((property) => ({ ...property, resource })))
    .reduce((links, property) => {
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
    }, [])
}
</script>

<script lang="ts">

export default {
  name: 'GraphView'
}

</script>
