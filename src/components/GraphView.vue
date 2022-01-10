<template>
  <GraphLayout
    class="w-full h-full"
    :nodes="resources"
    :links="links"
    :active-links="activeLinks"
    :auto-zoom="false"
    @link-enter="onLinkHover"
    @link-out="onUnhover"
  >
    <template v-slot:node="{ node }">
      <ResourceCard
        :resource="node"
        :active-links="activeLinks"
        :env="env"
        @hover-title="onHoverResource"
        @unhover-title="onUnhover"
        @hover-property="onHoverProperty"
        @unhover-property="onUnhover"
      />
    </template>
  </GraphLayout>
</template>

<script>
import { computed, defineComponent, ref, toRefs } from 'vue'
import GraphLayout from '@zazuko/spex/src/components/GraphLayout.vue'

import rdf from '../rdf'
import ResourceCard from './ResourceCard.vue'

export default defineComponent({
  name: 'GraphView',
  props: {
    dataset: { required: true },
    env: { required: true },
  },
  components: { GraphLayout, ResourceCard },

  setup (props) {
    const { dataset, env } = toRefs(props)

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
    onLinkHover (link) {
      this.activeLinks.push(link)
    },

    onUnhover () {
      this.activeLinks = []
    },

    onHoverResource (resource) {
      this.activeLinks = this.links.filter((link) => link.source === resource.id)
    },

    onHoverProperty (resource, property) {
      this.activeLinks = this.links.filter((link) => (
        link.source === resource.id &&
        link.sourceProperty === property.id
      ))
    },
  }
})

function resourcesFromDataset (dataset, env) {
  const subjects = rdf.termSet([...dataset].map(({ subject }) => subject))

  return [...subjects].map(subject => {
    const quads = dataset.match(subject)
    const properties = [...quads].reduce((acc, { predicate, object }) => {
      if (!acc.has(predicate.value)) {
        const property = {
          id: predicate.value,
          term: predicate,
          name: env.shrink(predicate.value),
          values: rdf.termSet(),
        }
        acc.set(predicate.value, property)
      }

      acc.get(predicate.value).values.add(object)

      return acc
    }, new Map())

    return {
      id: subject.value,
      term: subject,
      name: env.shrink(subject.value),
      properties: [...properties.values()],
    }
  })
}

function linksFromResources (resources) {
  const resourceIds = rdf.termSet(resources.map(({ term }) => term))

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
