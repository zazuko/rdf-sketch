import { createApp } from 'vue'
import GraphView from './components/GraphView.vue'
import './styles/graph-view.css'

import N3Parser from '@rdfjs/parser-n3'
import { shrink } from '@zazuko/rdf-vocabularies/shrink'
import stringToStream from 'string-to-stream'
import getStream from 'get-stream'
import rdf from 'rdf-ext'
import QuadExt from 'rdf-ext/lib/Quad'

export { default as GraphView } from './components/GraphView.vue'

export function render (selector, props) {
  const app = createApp(GraphView, props)

  app.mount(selector)
}

const defaultEnv = { shrink (url) { return shrink(url) || url } }

export function renderText (selector, { content, env = defaultEnv }) {
  const parser = new N3Parser()
  const stream = parser.import(stringToStream(content))
  const promise = getStream.array(stream)

  promise.then(quads => {
    const dataset = rdf.dataset(quads as QuadExt[])
    const app = createApp(GraphView, { dataset, env: env || defaultEnv })

    app.mount(selector)
  }).catch(error => {
    console.error(error)
  })
}
