<template>
  <GraphLayout class="w-full h-full"
               :layout-cfg="layoutCfg"
               :nodes="resources" :links="links" :active-links="activeLinks" :auto-zoom="false"
    @link-enter="onLinkHover" @link-out="onUnhover">
    <template v-slot:node="{ node }">
      <ResourceCard :resource="node" :active-links="activeLinks" :env="env" @hover-title="onHoverResource"
        @unhover-title="onUnhover" @hover-property="onHoverProperty" @unhover-property="onUnhover" />
    </template>
  </GraphLayout>
  <div id="menu">
    <template v-if="showlayoutControls">
      <div class="control">
        <label>Rank Direction:</label>
        <select v-model="layoutCfg.rankdir">
          <option value="TB">Top to Bottom</option>
          <option value="BT">Bottom to Top</option>
          <option value="LR">Left to Right</option>
          <option value="RL">Right to Left</option>
        </select>
      </div>
      <div class="control">
        <label>Node Separation:</label>
        <input type="range" v-model="layoutCfg.nodesep" min="10" max="100">
      </div>
      <div class="control">
        <label>Rank Separation:</label>
        <input type="range" v-model="layoutCfg.ranksep" min="10" max="100">
      </div>
    </template>
    <cog-icon class="cog w-5 h-5" @click="toggleLayoutControls"></cog-icon>
  </div>
</template>

<script setup lang="ts">

import { computed, ref } from 'vue'
import { GraphLayout } from '@zazuko/vue-graph-layout'
import ResourceCard from './ResourceCard.vue'
import DatasetExt from 'rdf-ext/lib/Dataset'

import { Property, Resource } from '@/model/resource.model';
import { Link } from '@/model/link.model'
import { linksFromResources, resourcesFromDataset } from '@/resources-utils'
import { CogIcon } from '@heroicons/vue/solid'

interface Props {
  dataset: DatasetExt,
  env: any
}
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const props = defineProps<Props>()

const resources = computed(() => resourcesFromDataset(props.dataset, props.env))
const links = computed(() => linksFromResources(resources.value))
const activeLinks = ref([])

function toggleLayoutControls(){
    showlayoutControls.value = !showlayoutControls.value
}
const showlayoutControls = ref(false)
const layoutCfg = ref({
  rankdir: 'RL',
  align: undefined,
  nodesep: 20,
  ranksep: 50,
  marginx: 10,
  marginy: 10,
})

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

<style>
#menu {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: white;
  border: 1px solid black;
  padding: 10px;
  pointer-events: auto;
}

.control {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.cog {
    margin-left: auto;
    margin-right: 0;
    color: #8a9ba1;
}

</style>
