<template>
  <div class="h-full flex flex-col">
    <!-- page header -->
    <div class="bg-white shadow-sm flex justify-between items-stretch">

      <TabsComponent :tabs="tabs" :selected-tab-id="selectedTabId" @selected="tabsController.selectTab($event)"
        @delete="tabsController.deleteTab($event)" @add="tabsController.addTab()"
        @update="(tab, label) => tabsController.updateTabName(tab, label)">
      </TabsComponent>

      <div class="px-4 py-2 shadow-md flex items-center gap-4">
        <div class="flex items-center gap-2">
          <h1 class="font-title font-bold text-xl">
            Sketch
          </h1>
          <span>/</span>
          <ZazukoLogo />
        </div>
        <ShareUrlButton ref="shareButton" @share="share" />
        <GitHubLogo />
      </div>
    </div>
    <!-- end page header -->
    <Splitpanes class="default-theme flex-grow">
      <Pane size="40">
        <!-- editor -->
        <PaneHeader label="RDF editor">
          <div class="select">
            <select v-model="selectedTab.format">
              <option v-for="format in formats" :key="format" :value="format">
                {{ format }}
              </option>
            </select>
          </div>
        </PaneHeader>

        <rdf-editor class="w-full h-full overflow-hidden" :value.prop="selectedTab.content" :format="selectedTab.format"
          ref="shaclEditor" prefixes="schema" auto-parse parseDelay="1000" @parsing-failed="onParsingFailed"
          @quads-changed="onQuadsChanged" @prefixes-parsed="onPrefixesParsed" />
        <div v-if="parseError" class="px-4 py-2 bg-red-500 text-white">
          {{ parseError }}
        </div>
      </Pane>
      <Pane>
        <div class="flex-grow flex flex-col">
          <PaneHeader label="Representation" />
          <GraphView class="flex-grow" :dataset="dataset" :env="env" />
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>

<script setup lang="ts">

import prefixes from '@zazuko/rdf-vocabularies/prefixes'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import '@rdfjs-elements/rdf-editor'
import { parsers } from '@rdf-esm/formats-common'
import { computed, nextTick, onMounted, onUnmounted, Ref, ref } from 'vue'
import rdf from 'rdf-ext'

import GraphView from './GraphView.vue'
import PaneHeader from './PaneHeader.vue'
import ZazukoLogo from './ZazukoLogo.vue'
import ShareUrlButton from './ShareUrlButton.vue'
import GitHubLogo from './GitHubLogo.vue'
import TabsComponent from './Tabs.vue'
import QuadExt from 'rdf-ext/lib/Quad'
import { TabsController } from '@/class/tab-controller.class'
import DatasetExt from 'rdf-ext/lib/Dataset'
import { useUrlSearchParams } from '@vueuse/core'

const params = useUrlSearchParams('hash-params')

const tabsController = TabsController
const tabs = TabsController.tabs;
const selectedTabId = TabsController.selectedTabId
const selectedTab = TabsController.selectedTab

const formats = [...parsers.keys()]
const editorPrefixes: Ref<{ [key: string]: string }> = ref({});
const dataset: Ref<DatasetExt> = ref<DatasetExt>(rdf.dataset());
const parseError: Ref<string> = ref(null)
const shaclEditor = ref(null)
const shareButton = ref()

const env = computed(() => ({
  shrink(term) {
    // fix ts
    const factory = (rdf as any).clone()
    for (const [prefix, uri] of Object.entries(prefixes)) {
      factory.prefixes.set(prefix, factory.namedNode(uri))
    }
    for (const [prefix, uri] of Object.entries(editorPrefixes.value)) {
      factory.prefixes.set(prefix, factory.namedNode(uri))
    }
    return factory.prefixes.shrink(term) || term.value
  },
}))

onMounted(async () => {
  if (params.rdf && !Array.isArray(params.rdf)) {
    selectedTab.value.content = params.rdf
    selectedTab.value.format = 'text/n3'
  }

  tabsController.listenToStorageEvents()
  await nextTick();
  const codeMirror = computed(() => shaclEditor.value.codeMirror)
  codeMirror.value.editor.on('change', (_c, _e) => {
    selectedTab.value.content = codeMirror.value.value
    tabsController.saveTabs()
  })
})

onUnmounted(() => {
  tabsController.stopListenToStorageEvents()
})

function onParsingFailed(e: CustomEvent): void {
  parseError.value = e.detail.error
}

function onQuadsChanged(e: CustomEvent): void {
  parseError.value = null
  loadResources(e.detail.value)
}

function onPrefixesParsed(e: CustomEvent) {
  const prefixes = e.detail.prefixes
  editorPrefixes.value = prefixes
}

function loadResources(quads: QuadExt[]) {
  dataset.value = rdf.dataset(quads)
}

function share() {
  const datasetN3 = dataset.value.toString()
  const url = new URL(`${document.location.protocol}//${document.location.host}/#rdf=${encodeURIComponent(datasetN3)}`)
  shareButton.value.copyURL(url)
}

</script>

<script lang="ts">
export default {
  name: 'ZazukoSketch',
}
</script>
