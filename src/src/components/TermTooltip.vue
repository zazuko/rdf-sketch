<template>
  <div class="group inline-block relative">
    <div v-if="label"
      class="invisible group-hover:visible absolute z-10 bottom-full left-1/2 -translate-x-1/2 -translate-y-1 delay-300">
      <div class="bg-gray-800 text-white font-normal text-sm rounded py-1 px-3">
        {{ label }}
        <svg class="absolute h-3 w-full left-0 top-full fill-current text-gray-800" viewBox="0 0 255 255">
          <polygon points="0,0 127.5,127.5 255,0" />
        </svg>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">

interface Props {
  label: string
}
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const props = defineProps<Props>()

</script>

<script lang="ts">

export default {
  name: 'TermTooltip'
}
</script>
