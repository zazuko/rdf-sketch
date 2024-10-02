<template>
  <!--
  <TermTooltip :label="tooltip">
    {{ displayValue }}<small v-if="language" class="has-text-grey">@{{ language }}</small>
  </TermTooltip>
  -->
  {{ displayValue }}<small v-if="language" class="has-text-grey">@{{ language }}</small>

</template>

<script setup lang="ts">

import { computed } from 'vue';
import type { Term } from '@rdfjs/types';
import { shrink } from '@zazuko/prefixes'
//import prefixes from "@zazuko/prefixes";

interface TermProps {
  term: any,
  env: any
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const props = defineProps<TermProps>()



const displayValue = computed(() => {
  const shrinked = shrink(props.term.value);
  console.log('shrinked', shrinked);
  return termValue(props.env, props.term)
})

const language = computed(() => {
  if (props.term.termType !== "Literal") {
    return null
  }
  return props.term.language ?? null;
})
const tooltip = computed(() => {
  const expandedValue = expandValue(props.env, props.term)
  return expandedValue !== displayValue.value ? expandedValue : ''
})

function termValue(env: any, term: Term): string {
  if (term.termType === 'NamedNode') {
    return term.value // env.shrink(term)
  }
  return term.value
}

function expandValue(env: any, term: Term): string {
  if (term.termType === 'Literal') {
    const datatype = term.datatype ? `^^${ term.datatype.value/*env.shrink(term.datatype)*/}` : ''
    const language = term.language ? `@${term.language}` : ''

    return `${term.value}${datatype}${language}`
  }
  return term.value
}

</script>

<script lang="ts">

export default {
  name: 'ZazukoTerm',
}

</script>
