<script setup>
/* eslint-disable */
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ShareIcon } from '@heroicons/vue/solid'
import { useClipboard } from '@vueuse/core'
import { defineEmits, onMounted, ref } from 'vue'

const emit = defineEmits(['share'])

const source = ref()
const {
  text,
  copy,
  copied,
  isSupported
} = useClipboard({ source })

onMounted(() => {
  source.value = new URL(window.location.href)
})

async function copyURL (url) {
  const body = new URLSearchParams({ url })
  const response = await fetch('https://s.zazuko.com/api/v1/shorten/', {
    method: 'POST',
    body
  })
  const res = await response
  if (res.status<200 || res.status >= 300) {
    console.error('shortener error', res.status)
    source.value = url
  } else {
    source.value = await response.text()
  }
  await copy(source.value)
}

defineExpose({
  copyURL,
})

function share() {
  emit('share')
}

</script>

<template>

  <Popover class="relative">
    <PopoverButton class="button" title="Share" @click='share'>
      <share-icon class="w-5 h-5"/>
    </PopoverButton>
    <PopoverPanel v-if="copied" class="absolute right-0 z-10 border bg-white p-2">
      <span class="text-sm text-green-500">
        Copied to clipboard
      </span>
    </PopoverPanel>
  </Popover>
</template>
