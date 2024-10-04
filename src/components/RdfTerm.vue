<template>

  <div>
  <span class="term"  @mousedown="avoidNodeDrag">{{ displayValue }}<small v-if="language" style="color: grey">@{{ language }}</small></span>
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


const tooltip = computed<string>(() => {
  const term = props.term;

  if (term.termType === 'Literal') {
    const datatype = term.datatype ? `^^${ shrinkTerm(term.datatype)}` : ''
    const language = term.language ? `@${term.language}` : ''

    return `${term.value}${datatype}${language}`
  }
  return term.value
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
</style>
