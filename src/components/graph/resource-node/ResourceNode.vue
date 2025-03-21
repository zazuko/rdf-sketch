<script setup lang="ts">

import type { Resource } from '@/model/resource.model';
import type { NodeProps } from '@vue-flow/core'  
import { Handle, Position, useVueFlow } from '@vue-flow/core'

import RdfTerm from '../../RdfTerm.vue'
import type { Term } from '@rdfjs/types';
import { Avatar,AvatarGroup } from 'primevue';

const { fitView, nodeLookup} = useVueFlow()

// props were passed from the slot using `v-bind="customNodeProps"`
const props = defineProps<NodeProps<{resource: Resource, env: any}>>()


function zoomToNode(term: Term) {
  if (!(term.termType === 'NamedNode' || term.termType === 'BlankNode')) {
    return
  }
  const node = nodeLookup.value.get(term.value);
  if (!node) {
    return
  }
	fitView({
		nodes: [node.id],
		duration: 1000, // use this if you want a smooth transition to the node
		padding: 0.3 // use this for some padding around the node
	})
}
</script>

<template>
  <div >
    <div class="resource-card">

      <header class="resource-card-header">

        <AvatarGroup>
            <Avatar v-for="(avatar, index) in props.data.resource.avatars" :key="index" :label="avatar.label" :style="{ backgroundColor: avatar.color, color: 'black', borderColor: 'rgba(0,0,0,0)', opacity: 0.8 }" size="large" shape="circle"/>
        </AvatarGroup>
        <div class="resource-title">
          <div>
          {{ props.data.resource.name }}
          </div>
      
        </div>
       
      
      </header>
      <div class="table-container">
         <div v-for="(property, index) in props.data.resource.properties" :key="index" :data-id="property.id" class="table-row">
         <div>
          <div v-for="value in property.values" :key="value.value" style="position: relative;">
            <Handle v-if="value.termType === 'NamedNode' || value.termType === 'BlankNode'" type="source" :position="Position.Left" :id="`${props.data.resource.id}-${property.id}-left`" style="opacity: 0" :connectable="false"></Handle>
          </div>
        </div>
        <div class="predicate">
          {{ property.name }}
        </div>

        <div class="object">
          <div v-for="value in property.values" :key="value.value" @click="zoomToNode(value)">
            <RdfTerm :term="value" :env="props.data.env" />
          </div>
        </div>

        <div v-for="value in property.values" :key="value.value" style="position: relative;">
          <Handle v-if="value.termType === 'NamedNode' || value.termType === 'BlankNode'" type="source" :position="Position.Right" :id="`${props.data.resource.id}-${property.id}-right`" style="opacity: 0;" :connectable="false"/>
        </div>
          
      </div>
  </div>
</div>
  </div>
</template>





<style scoped>
.resource-card {
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(107, 107, 107, 0.8);
  min-width: 500px;

  
}

.resource-card-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
    padding: 1rem;
    background-color: gray;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.resource-title {
  display: flex;
  flex-direction: column;
}

table {
  width: 100%;
  border-collapse: collapse;
  color: grey;
}

tr {
  position: relative;
}
tr:not(:last-child) {
  border-bottom: 1px solid lightgray !important;
}

.table-container {
  display: table;
  width: 100%;
}

.table-row {
  display: table-row;
  position: relative !important;
  border-bottom: 1px solid gray;
  right: 0;
  top: 0;
}

.predicate, .object {
  display: table-cell;
  padding: 8px;
  
  text-align: left;
  color: black;
  padding-top: 16px;
  padding-bottom: 16px;
}

.predicate {
  /* background-color: lightsalmon; */
  padding-left: 16px;
  text-align: left;
  color: black;
  padding-top: 16px;
  padding-bottom: 16px;

}
.object {
  /* background-color: lightsalmon; */
  padding-right: 16px;
  text-align: left;
}

</style>
