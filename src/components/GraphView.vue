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

import { Property, Resource } from '@/model/resource.model';
import { Link } from '@/model/link.model'
import { linksFromResources, resourcesFromDataset } from '@/resources-utils'

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

</script>

<script lang="ts">

export default {
  name: 'GraphView'
}

</script>
