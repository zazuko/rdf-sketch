<script setup lang="ts">
import { computed, ref } from 'vue';

import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';
import Drawer from 'primevue/drawer';

import RdfEditor from './components/RdfEditor.vue';
import type {  RdfData } from './components/RdfEditor.vue';
import { rdfEnvironment } from './rdf/environment';
import { RdfSerializationType, rdfFormats} from './constant/rdf-format';
import type { RdfFormat } from './constant/rdf-format';
import GraphView from './components/GraphView.vue';
import type { Dataset, Term } from '@rdfjs/types';

import { prefixMap } from './rdf/prefix-map'; 
import SPOSearch from './components/SPOSearch.vue';
import ShareButton from './components/share-button/ShareButton.vue';
import { useVueFlow } from '@vue-flow/core';

const { fitView, nodeLookup} = useVueFlow()

const selectedFormat = ref<RdfFormat>(rdfFormats.find(f => f.type === RdfSerializationType.Turtle)!);
const rdfFormatOptions = ref<RdfFormat[]>(rdfFormats);
const rdfText = ref<string>('');
let rdfSimpleHash = 0;

const currentSerialization = computed(() => selectedFormat.value.type);
const dataset  = ref<Dataset>(rdfEnvironment.dataset() as unknown as Dataset);
const hideEditorSplitterPanel = ref(false);
const showSearchPanel = ref(false);
const showAboutDialog = ref(false);

function onQuadsChanged(rdfData: RdfData) {
  const hash = simpleHash(rdfData.rdfText);
  if(hash === rdfSimpleHash) {
    // dont update the ui if nothing has changed
    return;
  }
  rdfSimpleHash = hash;

  const newDataset = rdfEnvironment.dataset(rdfData.quads) as unknown as  Dataset;
  prefixMap.update(rdfData.prefix);
  rdfText.value = rdfData.rdfText;
  dataset.value = newDataset;
}

function makeEditorSmall() {
  hideEditorSplitterPanel.value = true
}

function makeEditorBig() {
  hideEditorSplitterPanel.value = false;
}

function toggleSearch () {
  showSearchPanel.value = !showSearchPanel.value;
  if (showSearchPanel.value) {
    hideEditorSplitterPanel.value = true;
  } 
}

function changeEditorFormat(rdfSerializationType: RdfSerializationType) {
  const newFormat = rdfFormats.find(f => f.type === rdfSerializationType) ?? rdfFormats[0];
  if(!newFormat) {
    return;
  }
  selectedFormat.value = newFormat;
}


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

function zoomFitView () {
  setTimeout(() => {
		fitView({
      duration: 1000, // use this if you want a smooth transition to the node
      padding: 0.3 // use this for some padding around the node
})}, 100)
}

function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32-bit integer
    }
    return hash >>> 0; // Convert to unsigned integer
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
      <Button icon="pi pi-arrow-up-right-and-arrow-down-left-from-center" class="mr-2" severity="secondary" @click="zoomFitView" text></Button>
      <ShareButton :format="currentSerialization" :rdf-text="rdfText"></ShareButton>
      <Button icon="pi pi-lightbulb" class="mr-2" severity="secondary" @click="showAboutDialog = !showAboutDialog" text></Button>
      <Button as="a" icon="pi pi-github" class="mr-2" severity="secondary" href="https://github.com/zazuko/rdf-sketch"
        target="_blank" text></Button>
    </template>

  </Toolbar>

  <Splitter :style="{ height: showSearchPanel ? 'calc(60vh - (67.5px + ( 2 * 8px) + 8px) )' : 'calc(100vh - (67.5px + ( 2 * 8px) + 8px) )' }" style="margin-top: 8px;" class="mb-8">

    <SplitterPanel :style="{ display: hideEditorSplitterPanel ? 'none' : 'flex' }" class="flex items-center justify-center">
      <RdfEditor :format="currentSerialization" @change="onQuadsChanged" @format-change="changeEditorFormat"/>
    </SplitterPanel>

    <SplitterPanel class="flex items-center justify-center">
      <GraphView :dataset="dataset" />
    </SplitterPanel>

  </Splitter>


  <Drawer v-model:visible="showSearchPanel" header="SPO Search" :modal="false" position="bottom" :dismissable="false" style="height: 40vh" :pt="{
        root: {
            style: 'padding: 0;'
        },
        content: {
            style: 'padding: 0;'
        },
        title: {
          style: 'font-size: 16px; font-weight: 600;'
        },
        header: {
            style: 'padding-left: 16px; padding-top:0; padding-bottom:0; padding-right: 0px; '
            
        }}">
    <SPOSearch :dataset="dataset" :is-vscode="false" @selected="onNdeSelected"/>
  </Drawer>

  <Dialog v-model:visible="showAboutDialog" header="Zazuko RDF Sketch" :style="{ width: '60rem' }">
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




