<template>
  <div class="h-full flex flex-col">
    <!-- page header -->
    <div class="bg-white shadow-sm flex justify-between items-stretch">

      <TabsComponent :tabs="tabs" :selected-tab-id="selectedTabId" @selected="selectTab" @delete="deleteTab"
        @add="addTab" @update="updateTabName">
      </TabsComponent>

      <div class="px-4 py-2 shadow-md flex items-center gap-4">
        <div class="flex items-center gap-2">
          <h1 class="font-title font-bold text-xl">
            Sketch
          </h1>
          <span>/</span>
          <ZazukoLogo />
        </div>
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


        <!-- end editor -->
      </Pane>
      <Pane>
        <div class="flex-grow flex flex-col">
          <PaneHeader label="Representation" />
          <GraphView class="flex-grow" :dataset="dataset" :env="env" />
        </div>
      </Pane>
    </Splitpanes>

    <p v-show="justSaved" class="absolute bottom-2 right-2 text-green-500 text-xs">
      Saved
    </p>
  </div>
</template>

<script lang="ts">
import prefixes from '@zazuko/rdf-vocabularies/prefixes'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import '@rdfjs-elements/rdf-editor'
import { parsers } from '@rdf-esm/formats-common'
import { computed, defineComponent, Ref, ref } from 'vue'
import { nanoid } from 'nanoid'
import debounce from 'lodash.debounce'
import rdf from 'rdf-ext'

import GraphView from './GraphView.vue'
import PaneHeader from './PaneHeader.vue'
import ZazukoLogo from './ZazukoLogo.vue'
import GitHubLogo from './GitHubLogo.vue'
import TabsComponent from './Tabs.vue'
import { useLocalStorage } from '../useLocalStorage'
import QuadExt from 'rdf-ext/lib/Quad'
import { Tab } from '@/model/tab.model'

class TabController {
  tabs: Ref<Tab[]> = null;
  justSaved = ref(false)

  constructor() {
    const loadedTabs = useLocalStorage('tabs', [])
    this.tabs = loadedTabs.value;
  }

  selectedTabId(): string {
    return ''
  }
  selectedTab(): string {
    return ''
  }

  addTab() {

    const tabId = nanoid()
    this.tabs.value.push({ id: tabId, label: 'Untitled', format: 'text/turtle', content: '' })
    //selectedTabId.value = tabId
    this.saveTabs()
  }
  deleteTab(id: string): void { }
  saveTabs() {

  }
  selectTab(id: string): void { }
  saveTabName(name: string): void { }
}
const formats = [...parsers.keys()]

export default defineComponent({
  name: 'ZazukoSketch',
  components: { GraphView, Splitpanes, Pane, ZazukoLogo, GitHubLogo, PaneHeader, TabsComponent },

  setup() {
    const tabCtrl = new TabController();
    console.log('class', tabCtrl.tabs);
    const editorPrefixes = ref({})
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

    return {
      ...useTabs(),
      editorPrefixes,
      env,
    }

  },

  data() {

    return {
      formats,
      dataset: rdf.dataset(),
      parseError: null,
      activeLinks: [],
    }

  },

  mounted() {

    this.$nextTick(() => {

      const codeMirror = this.$refs.shaclEditor.codeMirror

      codeMirror.editor.on('change', (_c, _e) => {

        this.selectedTab.content = codeMirror.value
        this.saveTabs()

      })

    })

  },

  methods: {
    onParsingFailed(e: CustomEvent) {
      this.parseError = e.detail.error
    },

    onQuadsChanged(e: CustomEvent) {
      this.parseError = null
      this.loadResources(e.detail.value)
    },

    onPrefixesParsed(e: CustomEvent) {
      const prefixes = e.detail.prefixes
      this.editorPrefixes = prefixes
    },

    loadResources(quads: QuadExt[]) {
      this.resources = []
      this.dataset = rdf.dataset(quads)
    },
  }
})


function useTabs() {

  // TODO: Validate stored state?
  const loadedTabs = useLocalStorage('tabs', [])
  const tabs = loadedTabs.value;
  const syncTabs = loadedTabs.save;

  const { value: selectedTabId, save: syncSelectedTab } = useLocalStorage('selectedTabId')


  const justSaved = ref(false)
  const saveTabs = debounce(() => {

    syncTabs()
    syncSelectedTab()
    justSaved.value = true
    setTimeout(() => {

      justSaved.value = false

    }, 1000)

  }, 1000)

  const addTab = () => {

    const tabId = nanoid()
    tabs.value.push({ id: tabId, label: 'Untitled', format: 'text/turtle', content: '' })
    selectedTabId.value = tabId
    saveTabs()

  }

  const deleteTab = (idToDelete) => {

    if (!window.confirm('Are you sure?')) return

    tabs.value = tabs.value.filter(({ id }) => id !== idToDelete)

    if (tabs.value.length === 0) {

      addTab()

    }

    if (selectedTabId.value === idToDelete) {

      selectedTabId.value = tabs.value[0].id

    }

    saveTabs()

  }

  const selectTab = (id) => {

    selectedTabId.value = id
    saveTabs()

  }

  const saveTabName = (tab) => {
    console.log('save tab:', tab);
    tab.isEditing = false
    saveTabs()

  }

  const updateTabName = (tab: Tab, label: string) => {
    tab.isEditing = false
    tab.label = label
    saveTabs()

  }

  const selectedTab = computed(() => tabs.value.find(({ id }) => id === selectedTabId.value))

  if (tabs.value.length === 0) {

    addTab()

  }

  if (!selectedTabId.value) {

    selectedTabId.value = tabs.value[0].id

  }

  return {
    tabs,
    selectedTabId,
    selectedTab,
    addTab,
    deleteTab,
    saveTabs,
    justSaved,
    selectTab,
    saveTabName,
    updateTabName
  }


}
</script>
