<template>
    <div class="card flex justify-center">
        <Button icon="pi pi-share-alt" @click="toggle" severity="secondary" text ></Button>
        <Popover ref="popoverElement">
            <div class="content">
                <div class="group">
                    <div style="display: flex; flex-direction: row; gap:1">
                        <div class="limit">{{ shareUrl }}</div>
                        <div v-if="!shareUrl.startsWith('https://s.zazuko.com/')" >...</div>
                    </div>
                   

                    <Button  icon="pi pi-clipboard" @click="copyURL(shareUrl)" variant="text" rounded aria-label="Copy to Clipboard"  />

                </div>
               
            <Button :disabled="shareUrl.startsWith('https://s.zazuko.com/')" type="button" severity="secondary" @click="useLinkShortener(shareUrl)" label="Shorten" />
        </div>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from "vue";
import Button from 'primevue/button';
import Popover from 'primevue/popover';
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


const popoverElement = ref<InstanceType<typeof Popover> | null>(null);

const appUrl =  new URL(window.location.href.split('#')[0]!);


const shareUrl = ref<string>('');

async function toggle(event: MouseEvent): Promise<void> {
    if(popoverElement.value) {
        shareUrl.value = `${appUrl}#rdf=${encodeURIComponent(props.rdfText)}&format=${props.format}`;
        if(shareUrl.value.length > 2000) {
            useLinkShortener(shareUrl.value);
        }
        popoverElement.value.toggle(event);
    }
}

async function useLinkShortener(url: string): Promise<void> {
  const body = new URLSearchParams({ url })
  const response = await fetch('https://s.zazuko.com/api/v1/shorten/', {
    method: 'POST',
    body
  })
  const res = await response
  if (res.status<200 || res.status >= 300) {
    console.error('shortener error', res.status)
  } else {
    shareUrl.value = await response.text()
  }
}

function copyURL(url: string): void {
  navigator.clipboard.writeText(url).then(() => {
    if(popoverElement.value) {
        popoverElement.value.hide();
    }
  }).catch((err) => {
    console.error('copy failed', err);
    if(popoverElement.value) {
        popoverElement.value.hide();
    }
  });
}
</script>

<style scoped>
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
