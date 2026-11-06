<script setup lang="ts">

import type { Resource } from '@/model/resource.model';
import type { NodeProps } from '@vue-flow/core'  
import { Handle, Position, useVueFlow } from '@vue-flow/core'

import RdfTerm from '../../RdfTerm.vue'
import type { Term } from '@rdfjs/types';

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

        <div class="avatar-group">
          <div
            v-for="(avatar, index) in props.data.resource.avatars"
            :key="index"
            class="avatar-circle"
            :style="{ backgroundColor: avatar.color }"
          >
            {{ avatar.label }}
          </div>
        </div>
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
              <RdfTerm :term="value" :env="props.data.env" :show-arrow="property.name !== 'rdf:type'" />
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
  position: relative;
  border-radius: 0.75rem;
  background-color: var(--clr-n-0, #ffffff);
  border: 1px solid var(--clr-p-500, #A89271);
  box-shadow: 0 12px 28px -12px rgba(103, 89, 69, 0.35);
  min-width: 500px;
  width: max-content;
  max-width: max-content;
  overflow: hidden;
  transition: box-shadow 0.25s ease;
}

.resource-card:hover {
  box-shadow: 0 20px 40px -20px rgba(103, 89, 69, 0.55);
}

.resource-card-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
    padding: 0.875rem 1.25rem;
    background: radial-gradient(120% 140% at 15% 0%, #2d2419 0%, #1b1712 72%);
    border-bottom: 2px solid var(--clr-p-500, #A89271);
}

.resource-title {
  display: flex;
  flex-direction: column;
  color: #fff7e6;
  font-family: var(--ff-secondary, sans-serif);
  font-weight: 500;
  letter-spacing: 0.01em;
}

.avatar-group {
  display: inline-flex;
  align-items: center;
}

.avatar-circle {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-family: var(--ff-secondary, sans-serif);
  font-weight: 600;
  color: #1b1712;
  border: 1.5px solid #1b1712;
  box-shadow: 0 0 0 1px rgba(168, 146, 113, 0.5);
  user-select: none;
  flex-shrink: 0;
}

.avatar-circle + .avatar-circle {
  margin-left: -0.75rem;
}


.table-container {
  display: table;
  width: 100%;
  border-collapse: collapse;
}

.table-row {
  display: table-row;
  position: relative !important;
  border-bottom: 1px solid var(--clr-n-20, #E5E5E5);
  right: 0;
  top: 0;
}

.table-row:hover {
  background-color: var(--clr-p-50, #FFFEF5);
}

.table-row:last-child {
  border-bottom: none;
}
.predicate, .object {
  display: table-cell;
  padding: 12px 10px;
  text-align: left;
  color: #1b1712;
  vertical-align: top;
}

.predicate {
  padding-left: 18px;
  font-weight: 500;
  color: var(--clr-p-600, #675945);
}
.object {
  padding-right: 18px;
  text-align: left;
}

</style>
