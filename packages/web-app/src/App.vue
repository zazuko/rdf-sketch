<script setup lang="ts">
import { computed, ref } from 'vue';

import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';

import RdfEditor from '@/components/RdfEditor.vue';
import type {  RdfData } from '@/components/RdfEditor.vue';
import { rdfEnvironment } from '@/rdf/environment';
import { RdfSerializationType, rdfFormats} from '@/constant/rdf-format';
import type { RdfFormat } from '@/constant/rdf-format';
import GraphView from '@/components/GraphView.vue';
import type { Dataset, Term } from '@rdfjs/types';

import { prefixMap } from '@/rdf/prefix-map'; 
import SPOSearch from '@/components/SPOSearch.vue';
import ShareButton from '@/components/share-button/ShareButton.vue';
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
const searchPanelHeight = ref(350); // px, draggable

function onResizeDragStart(e: MouseEvent) {
  e.preventDefault();
  const startY = e.clientY;
  const startHeight = searchPanelHeight.value;

  function onMouseMove(ev: MouseEvent) {
    // Dragging up increases the search panel
    const delta = startY - ev.clientY;
    searchPanelHeight.value = Math.max(80, Math.min(window.innerHeight - 150, startHeight + delta));
  }

  function onMouseUp() {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}

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

  <div style="display: flex; flex-direction: column; height: calc(100vh - 91.5px); margin-top: 8px;">

    <!-- Graph + Editor: takes all remaining space, shrinks when search opens -->
    <div style="flex: 1 1 0; min-height: 0;">
      <Splitter style="height: 100%; width: 100%;">
        <SplitterPanel :style="{ display: hideEditorSplitterPanel ? 'none' : 'flex' }" class="flex items-center justify-center">
          <RdfEditor :format="currentSerialization" @change="onQuadsChanged" @format-change="changeEditorFormat"/>
        </SplitterPanel>

        <SplitterPanel style="flex-grow: 1; position: relative;">
          <GraphView :dataset="dataset" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;" />
        </SplitterPanel>
      </Splitter>
    </div>

    <!-- Drag handle + SPO Search panel -->
    <template v-if="showSearchPanel">
      <!-- Resize handle -->
      <div
        @mousedown="onResizeDragStart"
        style="flex: 0 0 5px; cursor: row-resize; background: var(--p-datatable-header-cell-border-color); transition: background 0.15s;"
        @mouseenter="(e) => (e.target as HTMLElement).style.background = 'var(--p-primary-color)'"
        @mouseleave="(e) => (e.target as HTMLElement).style.background = 'var(--p-datatable-header-cell-border-color)'"
      />

      <!-- SPO Search panel: pixel height, draggable -->
      <div :style="{ flex: '0 0 ' + searchPanelHeight + 'px' }" style="min-height: 0; display: flex; flex-direction: column; overflow: hidden; background-color: var(--p-content-background);">
        <div style="padding: 12px 16px; border-bottom: 1px solid var(--p-datatable-header-cell-border-color); font-size: 16px; font-weight: 600; background: var(--p-content-background);">
          SPO Search
        </div>
        <div style="flex-grow: 1; min-height: 0; overflow: auto;">
          <SPOSearch :dataset="dataset" :is-vscode="false" @selected="onNdeSelected"/>
        </div>
      </div>
    </template>

  </div>





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




