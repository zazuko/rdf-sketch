<template>
    <div style="height: 100%; width:100%">
    <VueFlow 
    :nodes="nodes" 
    :edges="edges" 
    :min-zoom="0.00005" 
    :max-zoom="10"
    :fit-view-on-init="true"
    @node-drag="onNodeDrag"
    @edge-click="zoomToNode" 
    >
   
      <template #node-custom="customNodeProps">
      <ResourceNode v-bind="customNodeProps" />
    </template>
    <template #edge-custom="customEdgeProps">
      <FloatingEdge v-bind="customEdgeProps" />
    </template>
  </VueFlow>
</div>
</template>

<script setup lang="ts">

import { computed, ref, watch, type PropType } from 'vue'

import type { Resource } from '@/model/resource.model';
import { rdfEnvironment } from '../rdf/environment';

import { VueFlow, useVueFlow, type Node, type Edge, type NodeDragEvent, MarkerType, type EdgeMouseEvent} from '@vue-flow/core';

import { linksFromResources, resourcesFromDataset } from '../resources-utils';
import { useLayout } from '../layout/use-layout'; 

import ResourceNode  from './graph/resource-node/ResourceNode.vue'
import FloatingEdge from './graph/floating-edge/FloatingEdge.vue';


export type CustomNodeTypes = 'custom' | 'special'
export type CustomNode = Node<Resource, {}, CustomNodeTypes>
type CustomEdgeTypes = 'custom' | 'special'
export type CustomEdge = Edge<any, any, CustomEdgeTypes>

const props = defineProps({
  dataset: {
    type: Object as PropType<ReturnType<typeof rdfEnvironment.dataset>>,
    required: true
  }
})

const { elkLayout } = useLayout()
const { fitView, nodeLookup } = useVueFlow()

const resources = computed(() => {
  const res = resourcesFromDataset(props.dataset);
  return res;
});

const links = computed(() => {
  const lks = linksFromResources(resources.value);
  return lks;
});

const nodes = ref<CustomNode[]>([])
const edges = ref<CustomEdge[]>([])

watch(links, async (newLinks) => {
  const nodesWithoutLayout = resources.value.map(resource => ({
    id: resource.id,
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      resource
    },
  }));

  const newEdges = newLinks.map(link => ({
    id: `${link.source}-${link.sourceProperty}-${link.target}`,
    source: link.source,
    target: link.target,
    sourceHandle: `${link.source}-${link.sourceProperty}-right`,
    animated: false,
    data: link,
    type: 'custom',
    markerEnd:  MarkerType.ArrowClosed
  }));

  const nodesWithLayout = await elkLayout(nodesWithoutLayout, newEdges);
  nodes.value = (nodesWithLayout as any).nodes as unknown as CustomNode[];
  edges.value = (nodesWithLayout as any).edges as unknown as CustomEdge[];

},{ immediate: true });

function onNodeDrag(nodeDragEvent: NodeDragEvent) {
  const focusNode = nodeDragEvent.node;
  
  // outgoing arrows: here we check the if we have to use the right or left handle for the focus and target node
  const linksFromFocusNodeToTarget = edges.value.filter(e => e.source === focusNode.id);
  const targetNodes = linksFromFocusNodeToTarget.flatMap(e => nodeLookup.value.get(e.target)) as CustomNode[];
  targetNodes.forEach(targetNode=> {
    if(targetNode?.position.x < focusNode.position.x) {
      // the target node is left check if we have to update the handle of the edge 
      const edgesToCheck = edges.value.filter(e => e.source === focusNode.id && e.target === targetNode.id);
      
      edgesToCheck.forEach(e => {
        const currentSourceHandle = e.sourceHandle;
        if(currentSourceHandle?.endsWith('-right')) {
          e.sourceHandle = `${focusNode.id}-${e.data?.sourceProperty}-left`;
        }
      })
    } else {
     // the target node is left check if we have to update the handle of the edge 
     const edgesToCheck = edges.value.filter(e => e.source === focusNode.id && e.target === targetNode.id);
      edgesToCheck.forEach(e => {
        const currentSourceHandle = e.sourceHandle;
        if(currentSourceHandle?.endsWith('-left')) {
          e.sourceHandle = `${focusNode.id}-${e.data?.sourceProperty}-right`;
        }
      })
    }
  })
  // end outgoing arrows


  // incoming arrows:  here we check the if we have to use the right or left handle for the focus and source node
  const linksFromEdgesToFocusNode = edges.value.filter(e => e.target === focusNode.id);
  const sourceNodes = linksFromEdgesToFocusNode.flatMap(e => {
    const n = nodeLookup.value.get( e.source);
    return n ? [n] : [];
  });
    // iterate over all target nodes and check if focusNode is left or right of the target node
    sourceNodes.forEach(sourceNode => {
    // is targetNode left of focusNode?
    if(sourceNode.position.x < focusNode.position.x) {
      // the target node is left check if we have to update the handle of the edge 
      const edgesToCheck = edges.value.filter(e => e.target === focusNode.id && e.source === sourceNode.id);
      
      edgesToCheck.forEach(e => {
        const currentSourceHandle = e.sourceHandle;
        if(currentSourceHandle && currentSourceHandle.endsWith('-left')) {
          e.sourceHandle = `${sourceNode!.id}-${e.data!.sourceProperty}-right`;
        }
      })
    } else {
     // the target node is right check if we have to update the handle of the edge 

     const edgesToCheck = edges.value.filter(e => e.target === focusNode.id && e.source === sourceNode.id);
      edgesToCheck.forEach(e => {
        const currentSourceHandle = e.sourceHandle;
        if(currentSourceHandle && currentSourceHandle?.endsWith('-right')) {

          e.sourceHandle = `${sourceNode.id}-${e.data!.sourceProperty}-left`;
        }
      })
    }
  })
  // incoming arrows

  // update the edges with the new handles
  edges.value = [...edges.value];
}

 function zoomToNode(e: EdgeMouseEvent) {
	fitView({
		nodes: [e.edge.sourceNode.id],
		duration: 1000, // use this if you want a smooth transition to the node
		padding: 0.3 // use this for some padding around the node
	})
} 

</script>

<style>

@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

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

