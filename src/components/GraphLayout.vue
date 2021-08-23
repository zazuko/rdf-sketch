<template>
  <div class="bg-gray-50 relative overflow-hidden">
    <div ref="layout" class="relative">
      <div v-for="node in nodes" :key="node.id" class="node absolute">
        <slot name="node" :node="node">
          Missing slot
        </slot>
      </div>
      <svg class="links">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="10" refY="5"
            markerUnits="userSpaceOnUse"
            markerWidth="10" markerHeight="10"
            orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" class="link-arrow" />
          </marker>
          <marker
            id="arrow-active"
            viewBox="0 0 10 10"
            refX="10" refY="5"
            markerUnits="userSpaceOnUse"
            markerWidth="10" markerHeight="10"
            orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" class="link-arrow" />
          </marker>
          <marker
            id="dot"
            viewBox="0 0 100 100"
            refX="50" refY="50"
            markerUnits="userSpaceOnUse"
            markerWidth="6" markerHeight="6"
            orient="auto">
            <circle cx="50" cy="50" r="50" class="link-start" />
          </marker>
          <marker
            id="dot-active"
            viewBox="0 0 100 100"
            refX="50" refY="50"
            markerUnits="userSpaceOnUse"
            markerWidth="6" markerHeight="6"
            orient="auto">
            <circle cx="50" cy="50" r="50" class="link-start" />
          </marker>
        </defs>
        <path v-for="(link, index) in links" :key="index" class="link" :class="{ active: activeLinks.includes(link) }">
          <title>{{ link.label }}</title>
        </path>
      </svg>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import * as d3 from 'd3'
import dagre from 'dagre'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GraphLayout',
  props: {
    // List of objects with an `id` property
    nodes: { required: true, type: Array },
    // List of obejcts with `label`, `source` and `target` properties
    links: { required: true, type: Array },
    // List of currently highlighted links
    activeLinks: { required: true, type: Array },
    // Adjust zoom level when nodes change
    autoZoom: { default: true },
  },

  mounted () {
    this.$nextTick(() => {
      this.renderGraph()
    })
  },

  watch: {
    nodes () {
      if (this.nodes.length === 0) {
        return
      }

      this.$nextTick(() => {
        this.renderGraph()
      })
    }
  },

  methods: {
    renderGraph () {
      const container = this.$el
      const containerSelection = d3.select(container)
      const root = d3.select(this.$refs.layout)

      // Copy to avoid mutating the props
      const nodes = this.nodes.map(node => ({ ...node }))
      const links = this.links.map(link => ({ ...link }))

      const layout = computeLayout(root, nodes, links)
      const simulation = d3.forceSimulation().nodes(nodes)

      simulation
        .force('links', d3.forceLink(links).id(({ id }) => id).strength(0))
        .force('posX', d3.forceX().strength(1).x(node => layout.nodes[node.id].x))
        .force('posY', d3.forceY().strength(1).y(node => layout.nodes[node.id].y))
        .stop()

      root.style('width', `${layout.width}px`)
      root.style('height', `${layout.height}px`)

      // Setup pan-zoom
      const initScaleX = container.clientWidth / layout.width
      const initScaleY = container.clientHeight / layout.height
      const initScale = Math.min(initScaleX, initScaleY, 1)
      const initX = Math.max((container.clientWidth - (layout.width * initScale)) / 2, 0)
      const initY = Math.max((container.clientHeight - (layout.height * initScale)) / 2, 0)
      const zoom = d3.zoom().scaleExtent([0.1, 1.2]).on('zoom', onZoom)
      containerSelection.call(zoom)
      setupZoomArrowKeys(containerSelection, zoom)
      if (this.autoZoom) {
        containerSelection.call(zoom.transform, d3.zoomIdentity.translate(initX, initY).scale(initScale))
      }

      // Draw lines for links
      const linkFromGraphLink = (graphLink) =>
        this.links.find(({ source, target }) => source === graphLink.source.id && target === graphLink.target.id)
      const link = root
        .select('.links')
        .selectAll('.link')
        .data(links)
        .on('mouseover', (event, graphLink) => {
          const link = linkFromGraphLink(graphLink)
          this.$emit('link-enter', link)
        })
        .on('mouseout', (event, graphLink) => {
          const link = linkFromGraphLink(graphLink)
          this.$emit('link-out', link)
        })

      // draw circles for the nodes
      const node = root.selectAll('.node')
        .data(nodes)
        .call(drag(simulation))

      // Run simulation for a defined number of steps
      // See https://github.com/d3/d3-force/blob/master/README.md#simulation_tick
      for (let i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
        simulation.tick()
      }
      renderSimulation()

      // Remove all forces after simulation is finished to allow dragging nodes around without affecting the other nodes
      simulation
        .force('posX', null)
        .force('posY', null)

      function renderSimulation () {
        // Update node positions
        node
          .join()
          .attr('style', (d) => `left: ${d.x}px; top: ${d.y}px`)

        // Update link positions
        const computeLinkPath = d3
          .linkHorizontal()
          .source((d) => sourcePoint(d, container))
          .target((d) => targetClosestAnchor(d, container))
          .x(({ x }) => x)
          .y(({ y }) => y)

        link.attr('d', computeLinkPath)
      }

      function drag (simulation) {
        function dragstarted (event, d) {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        }

        function dragged (event, d) {
          d.fx = event.x
          d.fy = event.y
          renderSimulation()
        }

        function dragended (event, d) {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
          renderSimulation()
        }

        return d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      }

      function onZoom ({ transform }) {
        root.style('transform', `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`)
        root.style('transform-origin', '0 0')
      }
    },
  },
})

/**
 * Property link source point
 */
function sourcePoint (d, container) {
  const radius = 3
  const sourceElt = container.querySelector(`[data-id="${d.source.id}${d.sourceProperty}"]`)
  const offsetX = d.target.x > d.source.x ? (sourceElt.clientWidth + radius) : -radius
  const magic = 60 // TODO: Don't know where this difference is coming from...
  return {
    x: d.source.x + offsetX,
    y: d.source.y + sourceElt.offsetTop + magic,
  }
}

/**
 * Find closest point to link to target node
 */
function targetClosestAnchor (d, container) {
  const targetElt = container.querySelector(`[data-id="${d.target.id}"]`)
  const source = sourcePoint(d, container)
  return nearestPointOnPerimeter(source, d.target, targetElt.clientWidth, targetElt.clientHeight)
}

function clamp (x, lower, upper) {
  return Math.max(lower, Math.min(upper, x))
}

function nearestPointOnPerimeter (point, rectTopLeft, rectWidth, rectHeight) {
  const rectBottomRight = {
    x: rectTopLeft.x + rectWidth,
    y: rectTopLeft.y + rectHeight,
  }

  const x = clamp(point.x, rectTopLeft.x, rectBottomRight.x)
  const y = clamp(point.y, rectTopLeft.y, rectBottomRight.y)

  const dl = Math.abs(x - rectTopLeft.x)
  const dr = Math.abs(x - rectBottomRight.x)
  const dt = Math.abs(y - rectTopLeft.y)
  const db = Math.abs(y - rectBottomRight.y)
  const m = Math.min(dl, dr, dt, db)

  if (m === dt) {
    return { x, y: rectTopLeft.y }
  } else if (m === db) {
    return { x, y: rectBottomRight.y }
  } else if (m === dl) {
    return { x: rectTopLeft.x, y }
  } else {
    return { x: rectBottomRight.x, y }
  }
}

// Compute graph layout using Dagre
function computeLayout (root, nodes, links) {
  const g = new dagre.graphlib.Graph()

  g.setGraph({
    rankdir: 'RL',
    // align: 'DL',
    nodesep: 20,
    ranksep: 50,
    marginx: 10,
    marginy: 10,
  })

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(() => ({}))

  nodes.forEach(node => {
    const elt = root.select(`[data-id="${node.id}"]`)
    const width = elt.style('width').replace('px', '')
    const height = elt.style('height').replace('px', '')

    g.setNode(node.id, { width, height })
  })

  links.forEach(({ source, target }) => {
    g.setEdge(source, target)
  })

  dagre.layout(g)

  return {
    width: g._label.width,
    height: g._label.height,
    nodes: g.nodes().reduce((acc, id) => {
      const node = g.node(id)

      return {
        ...acc,
        [id]: {
          id,
          x: node.x - (node.width / 2),
          y: node.y - (node.height / 2),
        }
      }
    }, {}),
  }
}

function setupZoomArrowKeys (container, zoom) {
  d3.select('body').on('keydown', (event) => {
    if (event.target.localName !== 'body') return

    const step = 50
    const translation = {
      ArrowUp: [0, step],
      ArrowRight: [-step, 0],
      ArrowDown: [0, -step],
      ArrowLeft: [step, 0],
    }[event.key]

    if (translation) {
      container.call(zoom.translateBy, ...translation)
    }
  })
}
</script>

<style scoped>
.links {
  flex-grow: 1;
  flex-basis: 100%;
  /* Hack because I can't figure out how to make the SVG take the full parent width/height */
  overflow: visible;
  pointer-events: none;
}

.link {
  fill: transparent;
  stroke-width: 1;
  stroke: #333;
  marker-end: url(#arrow);
  marker-start: url(#dot);
  pointer-events: all;
}

.link-arrow {
  fill: #456;
}

.link-start {
  fill: #456;
}

/* SVG 1 doesn't provide a way to style markers based on their referencing
 * element. To circumvent this limitation, I use one marker for the normal
 * state, and one marker for the active state. */
#arrow-active > .link-arrow { fill: var(--color-primary-300); }
#dot-active > .link-start { fill: var(--color-primary-300); }

.link.active {
  z-index: 10;
  stroke: var(--color-primary-300);
  stroke-width: 2;
  marker-end: url(#arrow-active);
  marker-start: url(#dot-active);
}
</style>
