<script setup lang="ts">

import { rdfEnvironment } from '../rdf/environment';
import GraphView from '../components/GraphView.vue';
import type { Dataset } from '@rdfjs/types';

import { onMounted, ref } from 'vue';




const ds = rdfEnvironment.dataset();
ds.add(rdfEnvironment.quad(
    rdfEnvironment.namedNode('https://example.org/subject'),
    rdfEnvironment.namedNode('https://example.org/predicate'),
    rdfEnvironment.literal('object')
)); 
ds.add(rdfEnvironment.quad(
    rdfEnvironment.namedNode('https://example.org/subject'),
    rdfEnvironment.namedNode('https://example.org/dd'),
    rdfEnvironment.namedNode('https://example.org/e')
)); 

const dataset  = ref<Dataset>(rdfEnvironment.dataset() as any);

onMounted(() => {
    dataset.value = ds as any;
}); 

</script>

<template>
  <div style="height:100vh; width:100vw">
  
      <GraphView :dataset="dataset" :env="null" />
  
</div>




</template>

