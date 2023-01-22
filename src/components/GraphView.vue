<template>
  <GraphLayout class="w-full h-full" :nodes="resources" :links="links" :active-links="activeLinks" :auto-zoom="false"
    @link-enter="onLinkHover" @link-out="onUnhover">
    <template v-slot:node="{ node }">
      <ResourceCard :resource="node" :active-links="activeLinks" :env="env" @hover-title="onHoverResource"
        @unhover-title="onUnhover" @hover-property="onHoverProperty" @unhover-property="onUnhover" />
    </template>
  </GraphLayout>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from 'vue'
import { GraphLayout } from '@zazuko/vue-graph-layout'
import ResourceCard from './ResourceCard.vue'
import DatasetExt from 'rdf-ext/lib/Dataset'
import TermSet from '@rdfjs/term-set';

import { Term } from 'rdf-js'

export default defineComponent({
  name: 'GraphView',
  props: {
    dataset: {
      type: DatasetExt,
      required: true
    },
    env: {
      required: true
    },
  },
  components: { GraphLayout, ResourceCard },

  setup(props) {
    const refs = toRefs(props)
    const dataset = refs.dataset
    const env = refs.env

    const resources = computed(() => resourcesFromDataset(dataset.value, env.value))
    const links = computed(() => linksFromResources(resources.value))
    const activeLinks = ref([])


    return {
      resources,
      links,
      activeLinks,
    }

  },

  methods: {
    onLinkHover(link): void {

      this.activeLinks.push(link)

    },

    onUnhover(): void {
      this.activeLinks = []
    },

    onHoverResource(resource): void {
      this.activeLinks = this.links.filter((link) => link.source === resource.id)
    },

    onHoverProperty(resource, property): void {
      this.activeLinks = this.links.filter((link) => (
        link.source === resource.id &&
        link.sourceProperty === property.id
      ))
    },
  }
})

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

interface Resource {
  id: string,
  name: string,
  term: Term,
  properties: Property[]
}

interface Property {
  id: string,
  name: string,
  values: TermSet,
}

interface Link {
  source: string,
  target: string,
  sourceProperty: string,
  label: string,
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
