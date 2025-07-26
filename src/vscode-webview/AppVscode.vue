<script setup lang="ts">

import { rdfEnvironment } from '../rdf/environment';
import { prefixMap } from '../rdf/prefix-map';
import GraphView from '../components/GraphView.vue';

import { onMounted, ref, onBeforeMount} from 'vue';
import type { UpdateMessage } from './model/update-message';
import { updateEventType } from './constant/update-event-type';
import toStream from 'string-to-stream';
import type { Dataset, Term } from '@rdfjs/types';

import Button from 'primevue/button';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import SPOSearch from './../components/SPOSearch.vue';

import { useVueFlow } from '@vue-flow/core';
import type { RdfPrefix } from '@/components/RdfEditor.vue';

const { fitView, nodeLookup} = useVueFlow()

let observer: MutationObserver | null = null;

const dataset  = ref<Dataset>(rdfEnvironment.dataset() as unknown as Dataset);
const hideSearchPanel = ref(true);

// listen to sketch.updateContent event
window.addEventListener(updateEventType, async (event: Event) => {
    const customEvent = event as CustomEvent<UpdateMessage>;
    if (!customEvent || !customEvent.detail) {
        console.error('Invalid event', event);
        return;
    }
    const message: UpdateMessage = customEvent.detail;
    const rdfStream = toStream(message.rdfString);
    const quadStream = rdfEnvironment.formats.parsers.import(message.contentType, rdfStream);
    
    const prefixList: RdfPrefix[] = [];
    quadStream?.on('prefix', (prefix, ns) => {
      prefixList.push({prefix, uri: ns.value});
    });

    quadStream?.on('end', () => {
      prefixMap.update(prefixList);
    });
    if(quadStream === null) {
        console.error('Failed to parse RDF content', message);
        return;
    }
    try {
        const newDataset =  await rdfEnvironment.dataset().import(quadStream);
        dataset.value = newDataset as unknown as Dataset;
    } catch (error) {
        console.error('Failed to import RDF content', error);
        return;
    }
    
});


function toggleSearch () {
  hideSearchPanel.value = !hideSearchPanel.value;
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

onMounted(() => {
  // Function to update the class on the <html> element
    const updateHtmlClass = () => {
      const bodyClassList = document.body.classList;
      const htmlElement = document.documentElement;

      if (bodyClassList.contains('vscode-dark')) {
        htmlElement.classList.add('vscode-dark');
      } else {
        htmlElement.classList.remove('vscode-dark');
      }
    };

    // Initial update
    updateHtmlClass();

    // Create a MutationObserver to watch for class changes on the <body> element
    observer = new MutationObserver(updateHtmlClass);

    // Observe changes to the class attribute of the <body> element
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  
})

onBeforeMount(() => {
    if(observer) {
        console.log('Disconnecting observer');
      observer.disconnect();
    }
})
</script>

<template>
  <Button style="position: absolute; top: 15px; left:15px; z-index: 9000;" class="mr-2" severity="secondary" @click="toggleSearch" rounded text>
    <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden="true" class="DocSearch-Search-Icon"><path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>
  </Button>

  <Splitter :unstyled="true" style="height: 100vh; width: 100vw; flex-direction: column; display: flex; flex-wrap: nowrap;" layout="vertical" >
    <SplitterPanel class="flex items-center justify-center" style="display: flex; align-items: center; justify-content: center; flex-grow: 1;">
                  <GraphView :dataset="dataset"/>

      <!-- 
        <div 
          class="graph-panel"
          :class="{'full-height': hideSearchPanel}" 
        >
            <GraphView :dataset="dataset"/>
        </div>  
        -->
     </SplitterPanel>

    <SplitterPanel  v-if="!hideSearchPanel" style="display: flex; align-items: center; justify-content: center; flex-grow: 1;">
        <div class="search">
            <SPOSearch :dataset="dataset" :is-vscode="true" @selected="onNdeSelected"/>
        </div>
    </SplitterPanel>

  </Splitter>

</template>


<style>
.search {
  background-color: white;
  max-height: 40vh; 
  height: 40vh;
  width: 100%;
  border-top: solid 1px var(--p-datatable-header-cell-border-color);
}

.vscode-dark .search {
  background-color: rgb(24, 24, 27);
}

graph-panel {
  height: 100% ;
  width: 100vw !important;
}
.full-height {
  height: 100vh !important;
  width: 100vw !important;
}
</style>