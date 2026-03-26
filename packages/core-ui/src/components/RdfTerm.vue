<template>

  <div>
  <span v-if="props.term.termType === 'NamedNode'" :class="['term', { 'named-node': props.showArrow }]" @mousedown="avoidNodeDrag" :style="{ cursor: props.showArrow ? 'pointer' : 'default' }">
    <span class="node-text">{{ displayValue }}</span><span class="arrow" style="color: #000" v-if="props.showArrow">&rarr;</span></span>
  <span v-if="props.term.termType === 'BlankNode'" class="term blank-node" @mousedown="avoidNodeDrag" style="cursor: pointer;">
    <span class="node-text">[{{ displayValue }}]</span>
    <span class="arrow" style="color: #000">&rarr;</span>
  </span>
  <span v-if="props.term.termType === 'Literal'" class="term literal-container" @mousedown="avoidNodeDrag">
    <span class="literal">{{ displayValue }}</span>
    <small v-if="language" style="color: grey">@{{ language }}</small>
    <small class="data-type" v-else-if="dataType" style="color: grey">^^ {{ dataType }}</small>
  </span>
  </div>

</template>

<script setup lang="ts">

import { computed, type PropType } from 'vue';
import type { Term } from '@rdfjs/types';
import { shrinkTerm } from '@/rdf/shrink-term';

const props = defineProps({
  term: {
    type: Object as PropType<Term>,
    required: true
  },
  showArrow: {
    type: Boolean,
    default: true
  }
})

const displayValue = computed(() => {
  return shrinkTerm(props.term)
})

const language  = computed<string|null>(() => {
  if (props.term.termType !== "Literal") {
    return null
  }
  return props.term.language ?? null;
})

const dataType = computed(() => {
  if (props.term.termType !== "Literal") {
    return null
  }
  return shrinkTerm(props.term.datatype) ?? null;
})

function avoidNodeDrag(event: MouseEvent) {
 event.stopPropagation();
}

</script>
<style scoped>
.term {
  cursor: default;
  user-select: text;
  display: flex;
  flex-direction: row;
  align-items: center;  
}

.literal {
  max-width: 500px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space:nowrap;
  display: inline-block;
}

.arrow {
  opacity: 0;
  margin-left: 4px;
  transition: opacity 0.15s ease;
  text-decoration: none;
  display: inline-block;
}

.named-node:hover .arrow {
  opacity: 1;
}
.named-node:hover .node-text {
  text-decoration: underline;
  color: var(--p-primary-color, #007acc);
}

.blank-node:hover .arrow {
  opacity: 1;
}
.blank-node:hover .node-text {
  text-decoration: underline;
  color: var(--p-primary-color, #007acc);
}

.data-type {
  opacity: 0;
  transition: opacity 0.15s ease;
  margin-left: 4px;
}

.literal-container:hover .data-type {
  opacity: 1;
}
</style>
