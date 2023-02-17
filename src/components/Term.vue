<template>
  <TermTooltip :label="tooltip">
    {{ displayValue }}<small v-if="language" class="has-text-grey">@{{ language }}</small>
  </TermTooltip>
</template>

<script setup lang="ts">

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import TermTooltip from './TermTooltip.vue'
import { Term } from 'rdf-js'
import { computed } from 'vue'

interface Props {
  term: Term,
  env: any
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const props = defineProps<Props>()

const displayValue = computed(() => termValue(props.env, props.term))

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
    return env.shrink(term)
  }
  return term.value
}

function expandValue(env: any, term: Term): string {
  if (term.termType === 'Literal') {
    const datatype = term.datatype ? `^^${env.shrink(term.datatype)}` : ''
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
