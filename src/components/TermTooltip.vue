<templatex>
  <b-tooltip :label="label" type="is-dark" :delay="300" square :triggers="label ? ['hover'] : []">
    <slot />
  </b-tooltip>
</templatex>
<template>
  <span :title="label">
    <slot />
  </span>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TermTooltip',
  props: ['label'],
})
</script>
