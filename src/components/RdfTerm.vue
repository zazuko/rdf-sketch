<template>

  <div>
  <span v-if="props.term.termType === 'NamedNode'" class="term" @mousedown="avoidNodeDrag" style="cursor: pointer;">{{ displayValue }}</span>
  <span v-if="props.term.termType === 'BlankNode'" class="term" @mousedown="avoidNodeDrag" style="cursor: pointer;">[{{ displayValue }}]</span>
  <span v-if="props.term.termType === 'Literal'" class="term literal" @mousedown="avoidNodeDrag">{{ displayValue }}<small v-if="language" style="color: grey">@{{ language }}</small></span>
  </div>

</template>

<script setup lang="ts">

import { computed } from 'vue';
import type { Term } from '@rdfjs/types';
import { shrinkTerm } from '@/rdf/shrink-term';

interface RdfTermProps {
  term: Term
}

const props = defineProps<RdfTermProps>()

const displayValue = computed(() => {
  return shrinkTerm(props.term)
})

const language  = computed<string|null>(() => {
  if (props.term.termType !== "Literal") {
    return null
  }
  return props.term.language ?? null;
})

function avoidNodeDrag(event: MouseEvent) {
 event.stopPropagation();
}

</script>
<style scoped>
.term {
  cursor: default;
  user-select: text;
}

.literal {
  max-width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
  white-space:nowrap;
  }
</style>
