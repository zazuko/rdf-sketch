<template>
  <TermTooltip :label="tooltip">
    {{ displayValue }}<small v-if="language" class="has-text-grey">@{{ language }}</small>
  </TermTooltip>
</template>

<script lang="ts">
import { Term } from 'rdf-js'
import { defineComponent } from 'vue'

import TermTooltip from './TermTooltip.vue'

export default defineComponent({
  name: 'Term',
  props: ['term', 'env'],

  components: { TermTooltip },

  data() {
    const displayValue = termValue(this.env, this.term)
    const expandedValue = expandValue(this.env, this.term)

    return {
      displayValue,
      language: this.term && this.term.language,
      tooltip: expandedValue !== displayValue ? expandedValue : ''
    }
  }
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
