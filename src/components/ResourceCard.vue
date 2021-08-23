<template>
  <div class="resource-card" :class="{ active: isActive }">
    <header
      class="resource-card-header"
      @mouseenter="$emit('hover-title', resource)"
      @mouseleave="$emit('unhover-title', resource)"
    >
      <h3 class="resource-title">
        <TermTooltip :label="resource.id">
          {{ resource.name }}
        </TermTooltip>
      </h3>
      <span class="resource-actions">
        <slot name="actions" />
      </span>
    </header>
    <table class="resource-properties">
      <tr
        v-for="(property, index) in resource.properties"
        :key="index"
        :data-id="property.id"
        :class="{ active: isPropertyActive(property) }"
        @mouseenter="$emit('hover-property', resource, property)"
        @mouseleave="$emit('unhover-property', resource, property)"
      >
        <th class="property-row">
          <TermTooltip :label="property.id">
            {{ property.name }}
          </TermTooltip>
        </th>
        <td class="property-row">
          <div v-for="value in property.values" :key="value.id">
            <Term :term="value" :env="env" />
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

import Term from './Term.vue'
import TermTooltip from './TermTooltip.vue'

export default defineComponent({
  name: 'ResourceCard',
  props: [
    'resource',
    'activeLinks',
    'env',
  ],

  components: { Term, TermTooltip },

  data () {
    return {}
  },

  computed: {
    isActive () {
      return this.activeLinks.some((link) => link.target === this.resource.id)
    }
  },

  methods: {
    isPropertyActive (property) {
      return this.activeLinks.some((link) => (
        link.source === this.resource.id &&
        link.sourceProperty === property.id
      ))
    }
  }
})
</script>

<style scoped>
.resource-card {
  @apply border rounded shadow-md bg-white text-gray-900 opacity-90 text-sm;
}

.resource-card-header {
  @apply bg-gray-100 flex items-center gap-4 justify-between px-3 py-2;
}

.resource-title {
  @apply font-bold;
}

.resource-actions {
  @apply flex flex-nowrap;
}

.resource-properties {
  @apply w-full;
}

.property-row {
  @apply border-b px-3 py-2 text-left;
}

.active {
  @apply border-2 border-primary-300;
}
</style>
