<script setup lang="ts">

import { rdfEnvironment } from '@/rdf/environment';
import { prefixMap } from '@/rdf/prefix-map';
import GraphView from '@/components/GraphView.vue';

import { ref, watch, onMounted, onUnmounted } from 'vue';

import toStream from 'string-to-stream';
import type { Dataset, Term } from '@rdfjs/types';

import Button from 'primevue/button';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import SPOSearch from '@/components/SPOSearch.vue';

import { useVueFlow } from '@vue-flow/core';
import type { RdfPrefix } from '@/components/RdfEditor.vue';

const { fitView, nodeLookup} = useVueFlow()

const props = defineProps<{
    rdfString?: string;
    contentType?: string;
}>();

const dataset  = ref<Dataset>(rdfEnvironment.dataset() as unknown as Dataset);
const hideSearchPanel = ref(true);

async function parseAndUpdate(newRdfString: string, contentType: string) {
    try {
        const rdfStream = toStream(newRdfString);
        const quadStream = rdfEnvironment.formats.parsers.import(contentType, rdfStream);
        
        if(quadStream === null) {
            console.error('Failed to parse RDF content', { rdfString: newRdfString, contentType: contentType });
            return;
        }

        const prefixList: RdfPrefix[] = [];
        quadStream.on('prefix', (prefix, ns) => {
          prefixList.push({prefix, uri: ns.value});
        });

        quadStream.on('end', () => {
          prefixMap.update(prefixList);
        });
        
        quadStream.on('error', (err) => {
          console.error(`Stream Error: ${err.message}`);
        });

        const newDataset = await rdfEnvironment.dataset().import(quadStream);
        dataset.value = newDataset as unknown as Dataset;
    } catch (error: any) {
        console.error('Failed to import RDF content', error);
        return;
    }
}

watch(() => props.rdfString, async (newRdfString) => {
    if (!newRdfString || !props.contentType) return;
    await parseAndUpdate(newRdfString, props.contentType);
}, { immediate: true });

const handleUpdateContent = async (event: Event) => {
    const customEvent = event as CustomEvent;
    if (customEvent.detail && customEvent.detail.rdfString && customEvent.detail.contentType) {
        await parseAndUpdate(customEvent.detail.rdfString, customEvent.detail.contentType);
    }
};

let themeObserver: MutationObserver | null = null;

const syncTheme = () => {
    const isDark = document.body.classList.contains('vscode-dark');
    if (isDark) {
        document.documentElement.classList.add('vscode-dark');
    } else {
        document.documentElement.classList.remove('vscode-dark');
    }
};

onMounted(() => {
    window.addEventListener('sketch.updateContent', handleUpdateContent);

    // Sync PrimeVue dark mode configuration with the VS Code body class
    syncTheme();
    themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
});

onUnmounted(() => {
    window.removeEventListener('sketch.updateContent', handleUpdateContent);
    if (themeObserver) {
        themeObserver.disconnect();
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
		duration: 1000,
		padding: 0.3
	})
}

</script>
<template>
  <Button style="position: absolute; top: 15px; left:15px; z-index: 9000;" class="mr-2" severity="secondary" @click="toggleSearch" rounded text>
    <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden="true" class="DocSearch-Search-Icon"><path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>
  </Button>

  <Splitter :unstyled="true" style="height: 100vh; width: 100vw; flex-direction: column; display: flex; flex-wrap: nowrap;" layout="vertical" >
    <SplitterPanel style="flex-grow: 1; height: 100%; width: 100%; position: relative;">
        <GraphView :dataset="dataset" style="height: 100%; width: 100%; position: absolute; top: 0; left: 0;" />

      <!-- 
        <div 
          class="graph-panel"
          :class="{'full-height': hideSearchPanel}" 
        >
            <GraphView :dataset="dataset"/>
        </div>  
        -->
     </SplitterPanel>

    <SplitterPanel  v-if="!hideSearchPanel" style="display: flex; flex-direction: column; flex-grow: 1; width: 100%; overflow: hidden;">
        <div class="search" style="width: 100%; height: 100%;">
            <SPOSearch :dataset="dataset" :is-vscode="true" @selected="onNdeSelected" style="width: 100%;" />
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