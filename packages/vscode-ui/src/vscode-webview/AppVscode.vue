<script setup lang="ts">
import { rdfEnvironment } from '@/rdf/environment';
import { prefixMap } from '@/rdf/prefix-map';
import GraphView from '@/components/GraphView.vue';

import { ref, watch, onMounted, onUnmounted } from 'vue';

import toStream from 'string-to-stream';
import type { Dataset, Term } from '@rdfjs/types';

import SPOSearch from '@/components/SPOSearch.vue';

import { useVueFlow } from '@vue-flow/core';
import type { RdfPrefix } from '@/components/RdfEditor.vue';

const { fitView, nodeLookup } = useVueFlow();

const props = defineProps<{
  rdfString?: string;
  contentType?: string;
}>();

const dataset = ref<Dataset>(rdfEnvironment.dataset() as unknown as Dataset);
const hideSearchPanel = ref(true);
const splitPercent = ref(50);
const splitContainerRef = ref<HTMLElement | null>(null);

function onVerticalSplitDragStart(e: MouseEvent) {
  e.preventDefault();
  const container = splitContainerRef.value;
  if (!container) return;
  const containerRect = container.getBoundingClientRect();
  const ownerWin = container.ownerDocument.defaultView || window;

  function onMouseMove(ev: MouseEvent) {
    const newPercent = ((ev.clientY - containerRect.top) / containerRect.height) * 100;
    splitPercent.value = Math.max(15, Math.min(85, newPercent));
  }

  function onMouseUp() {
    ownerWin.removeEventListener('mousemove', onMouseMove);
    ownerWin.removeEventListener('mouseup', onMouseUp);
  }

  ownerWin.addEventListener('mousemove', onMouseMove);
  ownerWin.addEventListener('mouseup', onMouseUp);
}

async function parseAndUpdate(newRdfString: string, contentType: string) {
  try {
    const rdfStream = toStream(newRdfString);
    const quadStream = rdfEnvironment.formats.parsers.import(contentType, rdfStream);

    if (quadStream === null) {
      console.error('Failed to parse RDF content', { rdfString: newRdfString, contentType: contentType });
      return;
    }

    const prefixList: RdfPrefix[] = [];
    quadStream.on('prefix', (prefix, ns) => {
      prefixList.push({ prefix, uri: ns.value });
    });

    quadStream.on('end', () => {
      prefixMap.update(prefixList);
    });

    quadStream.on('error', (err) => {
      console.error(`Stream Error: ${err.message}`);
    });

    const newDataset = await rdfEnvironment.dataset().import(quadStream);
    dataset.value = newDataset as unknown as Dataset;
  } catch (error: unknown) {
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

function toggleSearch() {
  hideSearchPanel.value = !hideSearchPanel.value;
}

function onNdeSelected(term: Term) {
  if (!(term.termType === 'NamedNode' || term.termType === 'BlankNode')) {
    return;
  }
  const node = nodeLookup.value.get(term.value);
  if (!node) {
    return;
  }
  fitView({
    nodes: [node.id],
    duration: 1000,
    padding: 0.3
  });
}
</script>

<template>
  <button
    type="button"
    style="position: absolute; top: 15px; left: 15px; z-index: 9000;"
    class="sketch-btn sketch-btn-text sketch-btn-icon sketch-btn-rounded"
    @click="toggleSearch"
    aria-label="Toggle SPO Search"
    title="Toggle SPO Search"
  >
    <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden="true" class="DocSearch-Search-Icon">
      <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>

  <div
    ref="splitContainerRef"
    style="height: 100vh; width: 100vw; flex-direction: column; display: flex; flex-wrap: nowrap;"
  >
    <div
      :style="{ flex: hideSearchPanel ? '1 1 100%' : `0 0 ${splitPercent}%` }"
      style="width: 100%; position: relative; min-height: 0;"
    >
      <GraphView :dataset="dataset" style="height: 100%; width: 100%; position: absolute; top: 0; left: 0;" />
    </div>

    <template v-if="!hideSearchPanel">
      <div
        class="vscode-splitter-gutter"
        @mousedown="onVerticalSplitDragStart"
      />
      <div
        style="display: flex; flex-direction: column; flex: 1 1 0; width: 100%; min-height: 0; overflow: hidden;"
      >
        <div class="search" style="width: 100%; height: 100%;">
          <SPOSearch :dataset="dataset" :is-vscode="true" @selected="onNdeSelected" style="width: 100%; height: 100%;" />
        </div>
      </div>
    </template>
  </div>
</template>

<style>
.search {
  background-color: var(--sketch-bg, #ffffff);
  width: 100%;
  height: 100%;
  border-top: solid 1px var(--sketch-border-accent, rgba(168, 146, 113, 0.55));
}

.vscode-dark .search {
  background-color: var(--sketch-bg, #1b1712);
}

.vscode-splitter-gutter {
  flex: 0 0 5px;
  cursor: row-resize;
  background-color: var(--sketch-border, #E5E5E5);
  transition: background-color 0.15s ease;
}

.vscode-splitter-gutter:hover {
  background-color: var(--sketch-primary, #A89271);
}

graph-panel {
  height: 100%;
  width: 100vw !important;
}

.full-height {
  height: 100vh !important;
  width: 100vw !important;
}
</style>
