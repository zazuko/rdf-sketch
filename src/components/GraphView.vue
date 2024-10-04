<template>
    
    <VueFlow :nodes="nodes" :edges="edges" :min-zoom="0.05" :max-zoom="10" @node-drag="onNodeDrag" >
      <template #node-custom="customNodeProps">
      <ResourceNode v-bind="customNodeProps" />
    </template>
  <!-- <MiniMap pannable zoomable />--> 
    <Controls />
   
  </VueFlow>

</template>

<script setup lang="ts">

import { computed, ref, watch, nextTick } from 'vue'

import type { Resource } from '@/model/resource.model';
import type {  Link } from '@/model/link.model';
import type { Dataset } from '@rdfjs/types';
import { linksFromResources, resourcesFromDataset } from '../resources-utils';

// vue-flow
import { VueFlow, useVueFlow, type Node, type Edge, type NodeDragEvent} from '@vue-flow/core'
// import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'

import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/controls/dist/style.css'

// the layout function
import { useLayout } from '../layout/use-layout'; 

// custom nodes 
import ResourceNode  from './graph/resource-node/ResourceNode.vue'


type CustomNodeTypes = 'custom' | 'special'
type CustomNode = Node<Resource, {}, CustomNodeTypes>


interface GraphViewProps {
  dataset: Dataset,
  env: any
}

const props = defineProps<GraphViewProps>()


const { elkLayout } = useLayout()
const { fitView, nodeLookup } = useVueFlow()

const resources = computed(() => resourcesFromDataset(props.dataset))
const links = computed(() => linksFromResources(resources.value))

const nodes = ref<CustomNode[]>([])
const edges = ref<Edge<Link>[]>([])

watch(resources, async (newResources) => {
  const nodesWithoutLayout = newResources.map(resource => ({
    id: resource.id,
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      resource,
      env: props.env,
    },
  }));

  const newEdges = links.value.map(link => ({
    id: `${link.source}-${link.sourceProperty}-${link.target}`,
    source: link.source,
    target: link.target,
    sourceHandle: `${link.source}-${link.sourceProperty}-right`,
    animated: true,
    data: link,
  }));

  const layoutedStuff = await elkLayout(nodesWithoutLayout, newEdges);
  nodes.value = (layoutedStuff as any).nodes as unknown as CustomNode[];
  edges.value = (layoutedStuff as any).edges as unknown as Edge[];

  await nextTick();
  fitView();
});

function onNodeDrag(nodeDragEvent: NodeDragEvent) {
  const focusNode = nodeDragEvent.node;
  
  const linksFromFocusNodeToTarget = edges.value.filter(e => e.source === focusNode.id);



  // linksFromFocusNodeToTarget.forEach(e => console.log('link', focusNode.id, '->', e.id));
  
  // find all target nodes
  const targetNodes = linksFromFocusNodeToTarget.flatMap(e => nodeLookup.value.get(e.target)) as CustomNode[];


  targetNodes.forEach(targetNode=> {
    // is targetNode left of focusNode?
  //  console.log(targetNode.id, targetNode.position.x, focusNode.position.x);
    if(targetNode?.position.x < focusNode.position.x) {
 //     console.log(targetNode.id, targetNode.position.x, 'change to left' );

      // the target node is left check if we have to update the handle of the edge 
      const edgesToCheck = edges.value.filter(e => e.source === focusNode.id && e.target === targetNode.id);
      
      edgesToCheck.forEach(e => {
        const currentSourceHandle = e.sourceHandle;
        if(currentSourceHandle?.endsWith('-right')) {
          e.sourceHandle = `${focusNode.id}-${e.data?.sourceProperty}-left`;
        }
      })
    } else {
    //  console.log(targetNode.id, targetNode.position.x, 'change to right' );

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

  const linkedFromEdges = edges.value.filter(e => e.target === focusNode.id);
  const sourceNodes = linkedFromEdges.flatMap(e => {
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
  edges.value = [...edges.value];



  
 // nodes.value = updatedNodes
}



</script>

<script lang="ts">

export default {
  name: 'GraphView'
}

</script>

<style>

/* these are necessary styles for vue flow */
@import '@vue-flow/core/dist/style.css';

/* this contains the default theme, these are optional styles */
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

