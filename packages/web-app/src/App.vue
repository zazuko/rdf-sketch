<script setup lang="ts">
import { computed, ref, watch } from "vue";

import RdfEditor from "@/components/RdfEditor.vue";
import type { RdfData } from "@/components/RdfEditor.vue";
import { rdfEnvironment } from "@/rdf/environment";
import { RdfSerializationType, rdfFormats } from "@/constant/rdf-format";
import type { RdfFormat } from "@/constant/rdf-format";
import GraphView from "@/components/GraphView.vue";
import type { Dataset, Term } from "@rdfjs/types";

import { prefixMap } from "@/rdf/prefix-map";
import SPOSearch from "@/components/SPOSearch.vue";
import ShareButton from "@/components/share-button/ShareButton.vue";
import { useVueFlow } from "@vue-flow/core";

const { fitView, nodeLookup } = useVueFlow();

const selectedFormat = ref<RdfFormat>(
  rdfFormats.find((f) => f.type === RdfSerializationType.Turtle)!,
);
const rdfFormatOptions = ref<RdfFormat[]>(rdfFormats);
const rdfText = ref<string>("");
let rdfSimpleHash = 0;

const currentSerialization = computed(() => selectedFormat.value.type);
const dataset = ref<Dataset>(rdfEnvironment.dataset() as unknown as Dataset);
const hideEditorSplitterPanel = ref(false);
const showSearchPanel = ref(false);
const showAboutDialog = ref(false);
const aboutDialogRef = ref<HTMLDialogElement | null>(null);
const searchPanelHeight = ref(350); // px, draggable
const editorSplitPercent = ref(40); // % width of editor panel
const splitContainerRef = ref<HTMLElement | null>(null);

watch(showAboutDialog, (visible) => {
  const dialog = aboutDialogRef.value;
  if (!dialog) return;
  if (visible && !dialog.open) {
    dialog.showModal();
  } else if (!visible && dialog.open) {
    dialog.close();
  }
});

function onDialogClick(event: MouseEvent) {
  const dialog = aboutDialogRef.value;
  if (!dialog || event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  const isDialogContent =
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width;
  if (!isDialogContent) {
    dialog.close();
  }
}

function onHorizontalSplitDragStart(e: MouseEvent) {
  e.preventDefault();
  const container = splitContainerRef.value;
  if (!container) return;
  const containerRect = container.getBoundingClientRect();

  function onMouseMove(ev: MouseEvent) {
    const newPercent =
      ((ev.clientX - containerRect.left) / containerRect.width) * 100;
    editorSplitPercent.value = Math.max(15, Math.min(85, newPercent));
  }

  function onMouseUp() {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}

function onResizeDragStart(e: MouseEvent) {
  e.preventDefault();
  const startY = e.clientY;
  const startHeight = searchPanelHeight.value;

  function onMouseMove(ev: MouseEvent) {
    const delta = startY - ev.clientY;
    searchPanelHeight.value = Math.max(
      80,
      Math.min(window.innerHeight - 150, startHeight + delta),
    );
  }

  function onMouseUp() {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}

function onQuadsChanged(rdfData: RdfData) {
  const hash = simpleHash(rdfData.rdfText);
  if (hash === rdfSimpleHash) {
    return;
  }
  rdfSimpleHash = hash;

  const newDataset = rdfEnvironment.dataset(
    rdfData.quads,
  ) as unknown as Dataset;
  prefixMap.update(rdfData.prefix);
  rdfText.value = rdfData.rdfText;
  dataset.value = newDataset;
}

function makeEditorSmall() {
  hideEditorSplitterPanel.value = true;
}

function makeEditorBig() {
  hideEditorSplitterPanel.value = false;
}

function toggleSearch() {
  showSearchPanel.value = !showSearchPanel.value;
  if (showSearchPanel.value) {
    hideEditorSplitterPanel.value = true;
  }
}

function changeEditorFormat(rdfSerializationType: RdfSerializationType) {
  const newFormat =
    rdfFormats.find((f) => f.type === rdfSerializationType) ?? rdfFormats[0];
  if (!newFormat) {
    return;
  }
  selectedFormat.value = newFormat;
}

function onFormatSelectChange(event: Event) {
  const value = (event.target as HTMLSelectElement)
    .value as RdfSerializationType;
  changeEditorFormat(value);
}

function onNdeSelected(term: Term) {
  if (!(term.termType === "NamedNode" || term.termType === "BlankNode")) {
    return;
  }
  const node = nodeLookup.value.get(term.value);
  if (!node) {
    return;
  }
  fitView({
    nodes: [node.id],
    duration: 1000,
    padding: 0.3,
  });
}

function zoomFitView() {
  setTimeout(() => {
    fitView({
      duration: 1000,
      padding: 0.3,
    });
  }, 100);
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}
</script>

<template>
  <header class="app-toolbar">
    <div class="toolbar-section">
      <button
        v-if="!hideEditorSplitterPanel"
        type="button"
        class="sketch-btn sketch-btn-text sketch-btn-icon"
        @click="makeEditorSmall"
        aria-label="Hide Editor"
        title="Hide Editor"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </button>
      <button
        v-if="hideEditorSplitterPanel"
        type="button"
        class="sketch-btn sketch-btn-text sketch-btn-icon"
        @click="makeEditorBig"
        aria-label="Show Editor"
        title="Show Editor"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </button>

      <select
        class="sketch-select"
        :value="selectedFormat.type"
        @change="onFormatSelectChange"
        aria-label="Select RDF Serialization"
      >
        <option
          v-for="option in rdfFormatOptions"
          :key="option.type"
          :value="option.type"
        >
          {{ option.name }}
        </option>
      </select>
    </div>

    <div class="toolbar-center">
      <span>Sketch</span>
    </div>

    <div class="toolbar-section">
      <button
        type="button"
        class="sketch-btn sketch-btn-text sketch-btn-icon"
        @click="toggleSearch"
        aria-label="Toggle SPO Search"
        title="SPO Search"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      <button
        type="button"
        class="sketch-btn sketch-btn-text sketch-btn-icon"
        @click="zoomFitView"
        aria-label="Fit Graph View"
        title="Fit View"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </button>

      <ShareButton :format="currentSerialization" :rdf-text="rdfText" />

      <button
        type="button"
        class="sketch-btn sketch-btn-text sketch-btn-icon"
        @click="showAboutDialog = true"
        aria-label="About RDF Sketch"
        title="About"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path
            d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"
          />
        </svg>
      </button>

      <a
        class="sketch-btn sketch-btn-text sketch-btn-icon"
        href="https://github.com/zazuko/rdf-sketch"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub Repository"
        title="GitHub"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
          />
        </svg>
      </a>
    </div>
  </header>

  <div
    style="
      display: flex;
      flex-direction: column;
      height: calc(100vh - 55px);
      margin-top: 0;
    "
  >
    <!-- Graph + Editor: takes all remaining space, shrinks when search opens -->
    <div style="flex: 1 1 0; min-height: 0">
      <div ref="splitContainerRef" class="splitter-container">
        <div
          v-show="!hideEditorSplitterPanel"
          class="splitter-panel"
          :style="{ flex: `0 0 ${editorSplitPercent}%` }"
        >
          <RdfEditor
            :format="currentSerialization"
            @change="onQuadsChanged"
            @format-change="changeEditorFormat"
          />
        </div>

        <div
          v-show="!hideEditorSplitterPanel"
          class="splitter-gutter splitter-gutter-horizontal"
          @mousedown="onHorizontalSplitDragStart"
        />

        <div class="splitter-panel" style="flex: 1 1 0; position: relative">
          <GraphView
            :dataset="dataset"
            style="position: absolute; top: 0; left: 0; right: 0; bottom: 0"
          />
        </div>
      </div>
    </div>

    <!-- Drag handle + SPO Search panel -->
    <template v-if="showSearchPanel">
      <div
        @mousedown="onResizeDragStart"
        class="splitter-gutter splitter-gutter-vertical"
      />

      <div
        :style="{ flex: '0 0 ' + searchPanelHeight + 'px' }"
        style="
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background-color: var(--sketch-bg);
        "
      >
        <div
          style="
            padding: 12px 16px;
            border-bottom: 1px solid var(--sketch-border);
            font-size: 16px;
            font-weight: 600;
            background: var(--sketch-bg);
          "
        >
          SPO Search
        </div>
        <div style="flex-grow: 1; min-height: 0; overflow: auto">
          <SPOSearch
            :dataset="dataset"
            :is-vscode="false"
            @selected="onNdeSelected"
          />
        </div>
      </div>
    </template>
  </div>

  <dialog
    ref="aboutDialogRef"
    v-bind="{ closedby: 'any' } as any"
    class="about-dialog"
    aria-labelledby="about-dialog-title"
    @close="showAboutDialog = false"
    @click="onDialogClick"
  >
    <div class="dialog-header">
      <h2 id="about-dialog-title">Zazuko RDF Sketch</h2>
      <form method="dialog">
        <button
          type="submit"
          class="sketch-btn sketch-btn-text sketch-btn-icon sketch-btn-rounded"
          aria-label="Close"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </form>
    </div>
    <div class="dialog-body">
      <img
        src="/img/icons/zazuko_icon.svg"
        alt="Zazuko Logo"
        width="100"
        height="100"
        style="width: 100px; height: auto"
      />
      <div style="opacity: 0.85; line-height: 1.5">
        Sketch is a simple yet powerful tool for visualizing RDF graphs. It
        allows you to:
        <ul style="padding-left: 20px">
          <li>
            Traverse and Explore: Seamlessly navigate through your RDF graphs.
          </li>
          <li>Search with Ease: Quickly locate nodes and connections.</li>
          <li>
            Interact Intuitively: Click edges and Objects (SPO) to navigate.
          </li>
        </ul>
        You can find more tools and resources at
        <a href="https://zazuko.com" target="_blank" rel="noopener noreferrer"
          >Zazuko.com</a
        >.
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.app-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.85rem;
  background-color: var(--sketch-surface);
  border-bottom: 1px solid var(--sketch-border-accent);
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toolbar-center {
  font-family: var(--ff-secondary, sans-serif);
  font-weight: 500;
  font-size: 1.125rem;
  letter-spacing: 0.02em;
  color: var(--sketch-primary);
}

.splitter-container {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  border: 1px solid var(--sketch-border);
  overflow: hidden;
}

.splitter-panel {
  height: 100%;
  min-width: 0;
  display: flex;
}

.splitter-gutter {
  background-color: var(--sketch-border);
  transition: background-color 0.2s ease;
}

.splitter-gutter:hover {
  background-color: var(--sketch-primary);
}

.splitter-gutter-horizontal {
  flex: 0 0 4px;
  cursor: col-resize;
}

.splitter-gutter-vertical {
  flex: 0 0 5px;
  cursor: row-resize;
}

.about-dialog {
  width: min(60rem, 90vw);
  border: 1px solid var(--clr-p-500, #a89271);
  border-radius: 1rem;
  padding: 2rem;
  background-color: var(--sketch-bg);
  color: var(--sketch-text);
  box-shadow: 0 26px 64px -26px rgba(40, 32, 20, 0.55);
}

.about-dialog::backdrop {
  background-color: rgba(27, 23, 18, 0.55);
  backdrop-filter: blur(2px);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.dialog-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.dialog-body {
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: flex-start;
}
</style>
