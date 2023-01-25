<template>
    <div class="px-2 py-2 border whitespace-nowrap flex items-center gap-2"
        :class="{ 'border-t-2 border-t-primary-500': tab.id === selectedTabId }">

        <form v-if="isTabNameEditable" @submit.prevent="updateTabName(newTabLabel)">
            <input type="text" v-model="newTabLabel" @blur="updateTabName(newTabLabel)" v-focus />
        </form>

        <button v-else-if="tab.id === selectedTabId" @click="renameTab()" class="cursor-text" title="Rename tab">
            {{ tab.label }}
        </button>

        <button v-else @click="$emit('selected', tab.id)">
            {{ tab.label }}
        </button>

        <button @click="$emit('delete', tab.id)" title="Delete tab">
            <XCircleIcon class="w-4 h-4 text-gray-500 hover:text-gray-700" />
        </button>
    </div>

</template>

<script setup lang="ts">

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { Tab } from '@/model/tab.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { XCircleIcon } from '@heroicons/vue/outline'

import { ref } from 'vue'

interface Props {
    tab: Tab,
    selectedTabId: string
}

const emit = defineEmits<{
    (e: 'selected', tabId: string): void
    (e: 'delete', tabId: string): void
    (e: 'update', tab: Tab, label: string): void
}>()
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const props = defineProps<Props>()

const isTabNameEditable = ref<boolean>(false)
const newTabLabel = ref<string>(props.tab.label)

function updateTabName(name: string) {
    isTabNameEditable.value = false;
    emit('update', props.tab, name)
}

function renameTab() {
    isTabNameEditable.value = true;
}


</script>

<script lang="ts">

export default {
    name: 'TabComponent',
}

</script>
