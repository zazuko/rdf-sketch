<template>
    <header class="px-4 py-2 bg-gray-200 flex items-center justify-between">
        <h2 class="font-bold text-lg">{{ label }}</h2>
        <slot></slot>
    </header>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
interface Props {
    label: string,
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const props = defineProps<Props>()

</script>

<script lang="ts">

export default {
    name: 'PaneHeader',
}

</script>
