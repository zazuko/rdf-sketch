<template>
  <TermTooltip :label="tooltip">
    {{ displayValue }}<small v-if="language" class="has-text-grey">@{{ language }}</small>
  </TermTooltip>
</template>

<script>
import { defineComponent } from 'vue'

import TermTooltip from './TermTooltip.vue'

export default defineComponent({
  name: 'Term',
  props: ['term', 'env'],

  components: { TermTooltip },

  data () {
    const displayValue = termValue(this.env, this.term)
    const expandedValue = expandValue(this.env, this.term)

    return {
      displayValue,
      language: this.term && this.term.language,
      tooltip: expandedValue !== displayValue ? expandedValue : ''
    }
  }
})

function termValue (env, term) {
  if (!term) {
    return term
  }

  if (term.termType === 'NamedNode') {
    return env.shrink(term.value)
  }

  return term.value
}

function expandValue (env, term) {
  if (term.termType === 'Literal') {
    const datatype = term.datatype ? `^^${env.shrink(term.datatype.value)}` : ''
    const language = term.language ? `@${term.language}` : ''

    return `${term.value}${datatype}${language}`
  }

  return term.value
}
</script>
