<template>
  <div class="share-wrapper" ref="wrapperRef">
    <button
      type="button"
      class="sketch-btn sketch-btn-text sketch-btn-icon"
      @click="toggle"
      aria-label="Share RDF"
      :aria-expanded="isOpen"
      title="Share"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    </button>

    <div v-if="isOpen" class="share-popover" role="dialog" aria-label="Share URL">
      <div class="content">
        <div class="group">
          <div style="display: flex; flex-direction: row; gap: 4px; align-items: center;">
            <div class="limit">{{ shareUrl }}</div>
            <div v-if="!shareUrl.startsWith('https://s.zazuko.com/')">...</div>
          </div>

          <button
            type="button"
            class="sketch-btn sketch-btn-text sketch-btn-icon sketch-btn-rounded"
            @click="copyURL(shareUrl)"
            aria-label="Copy to Clipboard"
            title="Copy to Clipboard"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>

        <button
          :disabled="shareUrl.startsWith('https://s.zazuko.com/')"
          type="button"
          class="sketch-btn"
          @click="useLinkShortener(shareUrl)"
        >
          Shorten
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, type PropType } from "vue";
import type { RdfSerializationType } from "@/constant/rdf-format";

const props = defineProps({
  format: {
    type: String as PropType<RdfSerializationType>,
    required: true
  },
  rdfText: {
    type: String,
    required: true
  }
});

const isOpen = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);
const appUrl = new URL(window.location.href.split('#')[0]!);
const shareUrl = ref<string>('');

async function toggle(): Promise<void> {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    shareUrl.value = `${appUrl}#rdf=${encodeURIComponent(props.rdfText)}&format=${props.format}`;
    if (shareUrl.value.length > 2000) {
      useLinkShortener(shareUrl.value);
    }
  }
}

function handleClickOutside(event: MouseEvent) {
  if (isOpen.value && wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

async function useLinkShortener(url: string): Promise<void> {
  const body = new URLSearchParams({ url });
  const response = await fetch('https://s.zazuko.com/api/v1/shorten/', {
    method: 'POST',
    body
  });
  const res = await response;
  if (res.status < 200 || res.status >= 300) {
    console.error('shortener error', res.status);
  } else {
    shareUrl.value = await response.text();
  }
}

function copyURL(url: string): void {
  navigator.clipboard.writeText(url).then(() => {
    isOpen.value = false;
  }).catch((err) => {
    console.error('copy failed', err);
    isOpen.value = false;
  });
}
</script>

<style scoped>
.share-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.share-popover {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 9500;
  background-color: var(--sketch-bg, #ffffff);
  color: var(--sketch-text, #000000);
  border: 1px solid var(--clr-p-500, #A89271);
  border-radius: 0.75rem;
  box-shadow: 0 20px 40px -24px rgba(103, 89, 69, 0.5);
}

.limit {
  display: inline-block;
  white-space: nowrap;
  width: 253px;
  overflow: hidden;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.group {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
}
</style>
