<template>
    <!-- tab head -->
    <div class="flex items-stretch overflow-x-auto">
        <TabComponent v-for="tab in tabs" :key="tab.id" :tab="tab" :selectedTabId="selectedTabId"
            @selected="$emit('selected', tab.id)" @delete="$emit('delete', tab.id)"
            @update="(tab, label) => $emit('update', tab, label)">
        </TabComponent>
        <div class="px-2 py-2 flex items-center">
            <button @click="$emit('add')">
                <PlusSmIcon class="w-5 h-5" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import TabComponent from './Tab.vue'
import { Tab } from '@/model/tab.model';
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { PlusSmIcon } from '@heroicons/vue/solid'

interface Props {
    tabs: Tab[],
    selectedTabId: string
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const props = defineProps<Props>()

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const emit = defineEmits<{
    (e: 'selected', tabId: string): void
    (e: 'delete', tabId: string): void
    (e: 'update', tab: Tab, label: string): void
    (e: 'add'): void
}>()

</script>

<script lang="ts">

export default {
    name: 'TabsComponent',
}

</script>
