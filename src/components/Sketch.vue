<template>
  <div class="h-full flex flex-col">
    <div class="bg-white shadow-sm flex justify-between items-stretch">
      <ul class="flex items-stretch overflow-x-auto">
        <li
          v-for="tab in tabs"
          :key="tab.id"
          class="px-2 py-2 border whitespace-nowrap flex items-center gap-2"
          :class="{ 'border-t-2 border-t-primary-500': tab.id === selectedTabId }"
        >
          <form v-if="tab.isEditing" @submit.prevent="saveTabName(tab)">
            <input type="text" v-model="tab.label" @blur="saveTabName(tab)" v-focus />
          </form>
          <button v-else-if="tab.id === selectedTabId" @click="renameTab(tab)" class="cursor-text" title="Rename tab">
            {{ tab.label }}
          </button>
          <button v-else @click="selectTab(tab.id)">
            {{ tab.label }}
          </button>

          <button @click="deleteTab(tab.id)" title="Delete tab">
            <XCircleIcon class="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </button>
        </li>
        <li class="px-2 py-2 flex items-center">
          <button @click="addTab"><PlusSmIcon class="w-5 h-5" /></button>
        </li>
      </ul>
      <div class="px-4 py-2 shadow-md flex items-center gap-4">
        <div class="flex items-center gap-2">
          <h1 class="font-title font-bold text-xl">
            Sketch
          </h1>
          <span>/</span>
          <a href="https://zazuko.com" target="_blank" rel="noopener noreferer">
            <svg class="h-6" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.41421" viewBox="0 0 768 260" xmlns="http://www.w3.org/2000/svg">
              <path d="m2137 3767c1-1-44-1-42-1h240c6-2 12-7 12-14s-5-13-12-14h-195c-35 0-63-29-63-64 0-31 23-57 53-62 2-1-14-1-13-1h223c7-1 12-7 12-14 0-8-7-14-15-14-80 0-161 2-242 2-16 0-27-17-31-30-21-62-34-144-80-190-121-121-165-296-94-456 66-149 211-240 374-241 336-3 529 388 328 654 16 21 25 47 25 74 0 65-53 119-118 119-66 0-119-54-119-119 0-66 53-119 119-119 19 0 37 5 53 13 175-233 5-574-287-571-143 1-270 80-329 211-62 140-23 293 84 399 56 56 66 131 90 204v1h227c35 0 64 28 64 63 0 31-23 58-53 63-2 0-32 0-34 0h29c-2 0-4 0-6 0h-199c-7 2-12 8-12 14 0 7 5 13 12 14h194c35 0 64 29 64 64 0 31-23 57-54 62-1 1 27 1 25 1h-29c-2 0-4 0-6 0h-188c-6 1-11 7-11 14 0 8 6 14 14 14 21 0 73-1 94 0 206 15 363-55 512-199 135-131 211-315 211-502 0-69-10-136-29-200h-1c-25-86-67-167-123-238h-2c-85-108-201-190-335-233v-3l-1 2c-34-11-69-19-105-24-3 11-8 22-15 33-37 54-110 69-165 33-23-16-40-39-48-65-333 56-587 346-587 695 0 89 17 178 50 261 14-7 30-10 46-10 66 0 119 53 119 119 0 65-53 118-119 118-65 0-118-53-118-118 0-30 10-58 30-80-38-92-58-190-58-290 0-374 273-685 631-744 0-2 1-5 1-7h2c3-15 9-30 18-44 36-54 110-69 165-33 29 20 47 50 51 82 43 6 85 17 126 30v1c77 26 149 64 213 112v-1c70 53 129 115 176 186h1c80 120 126 263 126 418 0 237-111 459-301 603-205 141-324 151-565 147-35 0-64-28-64-63 0-31 23-58 54-62zm183-1327v-1c1-1 1-2 1-3l1-1v-1-1-1l1-1v-1-1l1-2v-1-1-1-1-1l1-1v-1c0-1 0-2 0-3v-1-1-1-1-1-1-1-1-1-1-1-1l-1-1v-1-1-2-1l-1-2v-1-1l-1-1v-1-1-1h-1v-1c-5-14-14-27-28-36-32-22-77-13-99 20-3 5-6 11-8 17v2h-1v3h-1v5h-1v23l1 1v4l1 1v3l1 1v2l1 1v2l1 1c5 13 14 24 26 32 33 22 77 13 99-19 3-5 5-9 7-13zm234 910c-7-7-15-13-23-18-10-5-21-7-32-7-39 0-71 32-71 71s31 71 71 71c39 0 71-32 71-71 0-17-6-33-16-46zm-905 233c40 0 71-32 71-71 0-40-31-72-71-72-39 0-71 32-71 72 0 39 32 71 71 71z" transform="matrix(.14637844056 0 0 .14637844056 -192.39293319 -322.90052908)"/>
              <g fill="#ff441c">
                <path d="m3509 3401.22c-4 5-6 10-6 17 0 3 1 6 2 10l6 9c2 2 5 4 8 5s7 2 11 2h417c7 0 13-2 18-7 5-6 8-12 8-20s-3-13-8-19c-5-5-11-7-18-7h-343c-4 0-7-2-8-5s-1-7 1-9l371-443c4-5 6-11 6-18 0-3-1-6-2-9s-4-7-6-9-5-4-8-6c-4-1-7-2-11-2h-417c-8 0-13 3-18 8-6 5-8 11-8 18 0 8 2 14 8 20 5 5 10 8 18 8h342c3 0 6 1 8 4 1 3 1 7-2 9z" transform="matrix(.12790089092 0 0 .12790089092 -128.22109287 -266.58431113)"/>
                <path d="m4479 3418.22c0 7 2 13 7 18 6 6 12 8 20 8 7 0 13-2 18-8 6-5 8-11 8-18v-251c0-77-27-142-81-196s-119-81-196-81-142 27-196 81c-54 55-81 119-81 196s27 142 81 196 119 81 196 81c32 0 63-5 93-16 29-10 56-26 81-45l36-29c2-2 6-3 9-1 3 1 5 4 5 7zm-224-474c30 0 60 5 88 17 26 12 50 28 70 49 21 20 37 44 48 70 12 28 18 57 18 87s-6 59-18 87c-11 26-27 50-48 70-20 21-44 37-71 49s-57 18-87 18-60-6-88-18c-27-12-50-28-71-48-20-21-36-45-47-71-12-28-18-57-18-87s6-59 18-87c11-26 27-50 47-70 21-21 44-37 71-49 28-12 57-17 88-17z" transform="matrix(.12790089092 0 0 .12790089092 -128.22109287 -266.58431113)"/>
                <path d="m4597 3401.22c-4 5-5 10-5 17 0 3 0 6 2 10 1 3 3 6 5 9 3 2 5 4 8 5s7 2 11 2h417c7 0 13-2 18-7 6-6 8-12 8-20s-2-13-8-19c-5-5-10-7-18-7h-343c-4 0-6-2-8-5-1-3-1-7 1-9l371-443c5-5 6-11 6-18 0-3-1-6-2-9s-3-7-6-9c-2-2-5-4-8-6-3-1-7-2-11-2h-417c-7 0-13 3-18 8-6 5-8 11-8 18 0 8 2 14 8 20 5 5 11 8 18 8h342c3 0 6 1 8 4 1 3 1 7-1 9z" transform="matrix(.12790089092 0 0 .12790089092 -128.22109287 -266.58431113)"/>
                <path d="m5609 3444.22c8 0 14-2 20-7 5-6 7-12 7-19v-502c0-7-2-13-7-18-6-5-11-8-19-8s-14 2-19 8c-6 5-8 11-8 18v272c0 27-5 54-16 79-10 24-25 46-43 64-19 19-41 33-65 44-25 11-51 16-79 16-27 0-54-5-79-16-24-11-46-25-64-43-19-19-33-41-43-65-11-25-16-52-16-79v-272c0-7-3-13-8-18-6-5-11-8-19-8s-13 2-19 8c-5 5-8 11-8 18v272c0 34 7 67 20 99 14 30 32 58 56 82 24 23 51 41 82 55 31 13 64 20 98 20 28 0 56-3 83-12 26-8 49-21 70-38l35-27c3-2 6-3 9-1 3 1 5 4 5 7l1 44c0 8 3 14 8 20 5 5 11 7 18 7z" transform="matrix(.12790089092 0 0 .12790089092 -128.22109287 -266.58431113)"/>
                <path d="m6162 3439.22c4 4 10 5 16 5 4 0 8 0 11-2 3-1 5-3 8-5 3-3 5-6 6-10 2-3 2-6 2-9 0-8-3-14-8-20l-253-285c-2-2-3-5-2-7 0-3 1-5 3-6l252-163c7-5 8-12 8-21 0-3 0-6-1-9-2-3-4-7-7-9-2-2-5-4-8-6-3-1-7-2-11-2-5 0-9 1-14 4l-363 236c-2 2-5 2-8 0-3-1-5-4-5-7v-470c0-7-2-13-7-19-6-5-12-8-19-8-8 0-14 3-19 8-6 6-8 12-8 19v764c0 8 2 14 8 19 5 6 11 8 19 8 7 0 13-2 18-8 6-5 8-11 8-19v-210c0-3 2-6 4-7l93-61c4-3 8-2 11 1z" transform="matrix(.12790089092 0 0 .12790089092 -128.22109287 -266.58431113)"/>
                <path d="m6802.94 3171.21c0-39.08-6.34-76.05-21.12-111.96-14.79-35.91-36.97-67.59-64.43-95.06-57.04-57.03-125.69-85.55-207.02-85.55-80.27 0-148.92 28.52-207.01 85.55-57.04 58.09-85.55 125.69-85.55 207.02 0 81.32 28.51 149.98 85.55 207.01 58.09 57.04 126.74 85.55 207.01 85.55 81.33 0 149.98-28.51 207.02-85.55 58.09-57.03 86.6-125.69 85.55-207.01zm-292.57-235.53c32.74 0 63.37 5.28 92.95 17.95 27.46 12.68 52.81 29.58 74.99 51.76 21.12 21.12 38.02 46.47 49.64 73.93 12.67 29.57 19.01 60.2 19.01 91.89 0 31.68-6.34 62.31-19.01 91.89-11.62 27.46-28.52 52.81-49.64 73.93-22.18 22.18-47.53 39.08-74.99 51.75-29.58 12.68-60.21 19.02-92.95 19.02-31.68 0-63.37-6.34-92.94-19.02-27.46-12.67-52.81-29.57-73.94-50.69-22.18-22.18-39.08-47.53-50.69-74.99-12.68-29.58-17.96-60.21-17.96-91.89 0-31.69 5.28-62.32 17.96-91.89 11.61-27.46 28.51-52.81 50.69-73.93 21.13-22.18 46.48-39.08 73.94-51.76 29.57-12.67 61.26-17.95 92.94-17.95z" transform="matrix(.12790089092 0 0 .12790089092 -129.98018937 -266.58431113)"/>
              </g>
            </svg>
          </a>
        </div>
        <a href="https://github.com/zazuko/rdf-sketch" target="_blank" rel="noopener noreferer" title="Github repository">
          <svg class="w-4 h-4 opacity-70 hover:opacity-100" aria-hidden="true" viewBox="0 0 16 16" version="1.1" data-view-component="true">
            <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
        </a>
      </div>
    </div>
    <Splitpanes class="default-theme flex-grow">
      <Pane size="40">
        <header class="px-4 py-2 bg-gray-200 flex items-center justify-between">
          <h2 class="font-bold text-lg">RDF editor</h2>
          <div class="select">
            <select v-model="selectedTab.format">
              <option v-for="format in formats" :key="format" :value="format">
                {{ format }}
              </option>
            </select>
          </div>
        </header>
        <rdf-editor
          class="w-full h-full overflow-hidden"
          :value.prop="selectedTab.content"
          :format="selectedTab.format"
          ref="shaclEditor"
          prefixes="schema"
          auto-parse
          parseDelay="1000"
          @parsing-failed="onParsingFailed"
          @quads-changed="onQuadsChanged"
        />
        <div v-if="parseError" class="px-4 py-2 bg-red-500 text-white">
          {{ parseError }}
        </div>
      </Pane>
      <Pane>
        <Splitpanes horizontal>
          <Pane>
            <div class="flex-grow flex flex-col">
              <header class="px-4 py-2 bg-gray-200 flex items-center justify-between">
                <h2 class="font-bold text-lg">Representation</h2>
                <!-- Hack to fix header height :shrug: -->
                <input class="input invisible" readonly />
              </header>

              <GraphView class="flex-grow" :dataset="dataset" :env="env" />
            </div>
          </Pane>
        </Splitpanes>
      </Pane>
    </Splitpanes>

    <p v-show="justSaved" class="absolute bottom-2 right-2 text-green-500 text-xs">
      Saved
    </p>
  </div>
</template>

<script>
import rdf from '@rdfjs/dataset'
import { shrink } from '@zazuko/rdf-vocabularies/shrink'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import '@rdfjs-elements/rdf-editor'
import { parsers } from '@rdf-esm/formats-common'
import { computed, defineComponent, ref } from 'vue'
import { PlusSmIcon } from '@heroicons/vue/solid'
import { XCircleIcon } from '@heroicons/vue/outline'
import { nanoid } from 'nanoid'
import debounce from 'lodash.debounce'

import GraphView from './GraphView.vue'
import { useLocalStorage } from '../useLocalStorage'

const formats = [...parsers.keys()]

export default defineComponent({
  name: 'Sketch',
  components: { PlusSmIcon, GraphView, Splitpanes, Pane, XCircleIcon },

  setup () {
    return {
      ...useTabs(),
    }
  },

  data () {
    return {
      formats,
      dataset: rdf.dataset(),
      parseError: null,
      activeLinks: [],
      env: {
        shrink (uri) {
          return shrink(uri) || uri
        },
      },
    }
  },

  mounted () {
    this.$nextTick(() => {
      const codeMirror = this.$refs.shaclEditor.codeMirror

      codeMirror.editor.on('change', (c, e) => {
        this.selectedTab.content = codeMirror.value
        this.saveTabs()
      })
    })
  },

  methods: {
    onParsingFailed (e) {
      this.parseError = e?.detail?.error
    },

    onQuadsChanged (e) {
      this.parseError = null
      this.loadResources()
    },

    async loadResources () {
      const editor = this.$refs.shaclEditor

      this.resources = []

      const quads = await editor.quads
      this.dataset = rdf.dataset(quads)
    },
  }
})

function useTabs () {
  // TODO: Validate stored state?
  const { value: tabs, save: syncTabs } = useLocalStorage('tabs', [])
  const { value: selectedTabId, save: syncSelectedTab } = useLocalStorage('selectedTabId')

  const justSaved = ref(false)
  const saveTabs = debounce(() => {
    syncTabs()
    syncSelectedTab()
    justSaved.value = true
    setTimeout(() => { justSaved.value = false }, 1000)
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

  const renameTab = (tab) => {
    tab.isEditing = true
  }

  const saveTabName = (tab) => {
    tab.isEditing = false
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
    renameTab,
    saveTabName,
  }
}
</script>