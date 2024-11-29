<script setup lang="ts">
import { computed, ref } from 'vue';

import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';

import RdfEditor from './components/RdfEditor.vue';
import type {  RdfData } from './components/RdfEditor.vue';
import { rdfEnvironment } from './rdf/environment';
import { RdfSerializationType, rdfFormats} from './constant/rdf-format';
import type { RdfFormat } from './constant/rdf-format';
import GraphView from './components/GraphView.vue';
import type { Dataset, Term } from '@rdfjs/types';

import { prefixMap } from './rdf/prefix-map'; 
import SPOSearch from './components/SPOSearch.vue';
import { useVueFlow } from '@vue-flow/core';

const { fitView, nodeLookup} = useVueFlow()

const selectedFormat = ref<RdfFormat>(rdfFormats.find(f => f.type === RdfSerializationType.Turtle) ?? rdfFormats[0]);
const rdfFormatOptions = ref<RdfFormat[]>(rdfFormats);
const currentSerialization = computed(() => selectedFormat.value.type);
const dataset  = ref<Dataset>(rdfEnvironment.dataset() as unknown as Dataset);
const hideEditorSplitterPanel = ref(false);
const hideSearchPanel = ref(true);
const showAboutDialog = ref(false);

function onQuadsChanged(rdfData: RdfData) {
  const newDataset = rdfEnvironment.dataset(rdfData.quads) as unknown as  Dataset;
  prefixMap.update(rdfData.prefix);
  dataset.value = newDataset;
}
function makeEditorSmall() {
  hideEditorSplitterPanel.value = true
}
function makeEditorBig() {
  hideEditorSplitterPanel.value = false;
}

function toggleSearch () {
  hideSearchPanel.value = !hideSearchPanel.value;
}

function onFormatChange(rdfSerializationType: RdfSerializationType) {
  const newFormat = rdfFormats.find(f => f.type === rdfSerializationType) ?? rdfFormats[0];
  selectedFormat.value = newFormat;
}


const env = rdfEnvironment;

function onNdeSelected(term: Term) {
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
  <Toolbar>
    <template #start>

      <Button v-if="!hideEditorSplitterPanel" icon="pi pi-file-edit" class="mr-2" severity="secondary" @click="makeEditorSmall" text ></Button>
      <Button v-if="hideEditorSplitterPanel" icon="pi pi-file-edit" class="mr-2" severity="secondary" @click="makeEditorBig" text ></Button>
      <Select v-model="selectedFormat" :options="rdfFormatOptions" optionLabel="name" placeholder="Select RDF Serialization" checkmark :highlightOnSelect="false"></Select>
    </template>

    <template #center>
      <span>Sketch</span>
    </template>

    <template #end>

      <Button icon="pi pi-search" class="mr-2" severity="secondary" @click="toggleSearch" text></Button>
      <Button icon="pi pi-lightbulb" class="mr-2" severity="secondary" @click="showAboutDialog = !showAboutDialog" text></Button>
      <Button as="a" icon="pi pi-github" class="mr-2" severity="secondary" href="https://github.com/zazuko/rdf-sketch"
        target="_blank"></Button>
    </template>
  </Toolbar>

  <Splitter style="height: calc(100vh - (67.5px + ( 2 * 8px) + 8px) ); margin-top: 8px" class="mb-8">
    <SplitterPanel :style="{ display: hideEditorSplitterPanel ? 'none' : 'flex' }" class="flex items-center justify-center">
      <RdfEditor :format="currentSerialization" @change="onQuadsChanged" @format-change="onFormatChange"/>
    </SplitterPanel>
    <SplitterPanel class="flex items-center justify-center">
      <GraphView :dataset="dataset" :env="env" />
    </SplitterPanel>
    <SplitterPanel v-if="!hideSearchPanel">
      <SPOSearch :dataset="dataset" @selected="onNdeSelected"/>
    </SplitterPanel>
  </Splitter>



  <Dialog v-model:visible="showAboutDialog" modal header="Zazuko Sketch" :style="{ width: '60rem' }">
    <div style="display: flex; flex-direction: row; gap: 24px">  
      <img src="/img/icons/zazuko_icon.svg" alt="Zazuko Logo" style="width: 100px;">

    <div style="opacity: 0.8;" >
Sketch is a simple yet powerful tool for visualizing RDF graphs. It allows you to:

<ul style="padding-left: 20px">
  <li>
    Traverse and Explore: Seamlessly navigate through your RDF graphs.
  </li>
  <li>
    Search with Ease:Quickly locate nodes and connections.
  </li>
  <li>
    Interact Intuitively: Click edges and Objects (SPO) to navigate.
  </li>
</ul>
  You can find more tools and resources at <a href="https://zazuko.com" target="_blank">Zazuko.com</a>.
</div>
    </div>
</Dialog>



</template>

