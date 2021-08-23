<template>
  <Splitpanes class="default-theme">
    <Pane size="40">
      <header class="px-4 py-2 bg-gray-200 flex items-center justify-between">
        <h2 class="font-bold text-lg">RDF editor</h2>
        <div class="select">
          <select v-model="format">
            <option v-for="format in formats" :key="format" :value="format">
              {{ format }}
            </option>
          </select>
        </div>
      </header>
      <rdf-editor
        class="w-full h-full overflow-hidden"
        :format="format"
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
</template>

<script>
import rdf from '@rdfjs/dataset'
import { shrink } from '@zazuko/rdf-vocabularies/shrink'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import '@rdfjs-elements/rdf-editor'
import { parsers } from '@rdf-esm/formats-common'
import { defineComponent } from 'vue'

import GraphView from './GraphView.vue'

const formats = [...parsers.keys()]

export default defineComponent({
  name: 'Sketch',
  components: { GraphView, Splitpanes, Pane },

  data () {
    return {
      format: 'text/turtle',
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

  methods: {
    onParsingFailed (e) {
      console.log(e)
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
</script>
