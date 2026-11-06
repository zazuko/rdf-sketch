<script setup lang="ts">
import { onMounted, ref, watch, type PropType, type VNodeRef } from 'vue';

import '@rdfjs-elements/rdf-editor';

import {rdfFormats, RdfSerializationType} from '../constant/rdf-format';

import type { Quad} from '@rdfjs/types';
import { localStorageKeyFormat, localStorageKeyPrefixList, localStorageKeyText } from '@/constant/local-storage-keys';
import { MAX_TRIPLES_TO_BE_STORED } from '@/constant/min-max';


export interface RdfData {
    quads: Quad[];
    rdfText: string;
    serializationFormat: RdfSerializationType;
    prefix: RdfPrefix[];
  }

export interface RdfPrefix {
  prefix: string;
  uri: string;
}

const props = defineProps({
  format: {
    type: String as PropType<RdfSerializationType>,
    required: true
  }
})


const emit = defineEmits<{
  (event: 'change', data: RdfData): void;
  (event: 'format-change', format: RdfSerializationType): void;
}>();

const prefixList = ref<RdfPrefix[]>([]);
const editorElement = ref<VNodeRef |null>(null);
const currentSerialization = ref<RdfSerializationType>(RdfSerializationType.Turtle);

const prefixes = "rdf,rdfs,sh";
const builtinPrefixes = new Set(prefixes.split(','));
// Mutate in-place so <rdf-editor> does not see a new object reference after every parse
// and trigger an unwanted re-serialize -> re-parse cycle.
const customPrefixes: Record<string, string> = {};

function syncCustomPrefixes() {
  for (const key of Object.keys(customPrefixes)) {
    delete customPrefixes[key];
  }
  for (const p of prefixList.value) {
    const uri = typeof p.uri === 'string' ? p.uri : (p.uri as unknown as any)?.value;
    if (uri && !builtinPrefixes.has(p.prefix)) {
      customPrefixes[p.prefix] = uri;
    }
  }
}

watch(() => props.format, (newFormat) => {
  if (newFormat !== currentSerialization.value) {
    currentSerialization.value = newFormat;
  }
});

const rdfText = ref<string>('');

function onParsingFailed(e: CustomEvent) {
  console.error('Parsing failed', e.detail);
  
}

function onQuadsChanged(e: CustomEvent) {
  const quads = e.detail.value as Quad[];
  // Defer by a microtask so @prefixes-parsed (dispatched synchronously right after
  // @quads-changed by <rdf-editor>) updates prefixList before we emit 'change'.
  queueMicrotask(() => {
    const editor = editorElement.value as unknown as any;
    const text = editor?.value || editor?.codeMirror?.value || rdfText.value;
    const rdfData: RdfData = {
      quads: quads,
      rdfText: text,
      serializationFormat: props.format,
      prefix: prefixList.value
    };

    if (quads.length < MAX_TRIPLES_TO_BE_STORED) {
      localStorage.setItem(localStorageKeyText, rdfData.rdfText);
      localStorage.setItem(localStorageKeyFormat, rdfData.serializationFormat);
      localStorage.setItem(localStorageKeyPrefixList, JSON.stringify(prefixList.value));
    }
    emit('change', rdfData);
  });
}
 

function onPrefixesParsed(e: CustomEvent) {
  for (const [prefix, val] of Object.entries(e.detail.prefixes)) {
    const uri = typeof val === 'string' ? val : (val as unknown as any)?.value;
    if (!uri) continue;
    const existing = prefixList.value.find(p => p.prefix === prefix);
    if (existing) {
      existing.uri = uri;
    } else {
      prefixList.value.push({ prefix, uri });
    }
  }
  syncCustomPrefixes();
}

onMounted(() => {
  // read previous state from local storage
  const storedText = localStorage.getItem(localStorageKeyText);
  const storedFormat = localStorage.getItem(localStorageKeyFormat);
  const storedPrefixList = JSON.parse( localStorage.getItem(localStorageKeyPrefixList) ?? '[]');
  if (storedText && storedFormat && rdfFormats.find(f => f.type === storedFormat) && Array.isArray(storedPrefixList)) {
    rdfText.value = storedText;
    const normalizedPrefixes: RdfPrefix[] = [];
    for (const p of storedPrefixList) {
      const uri = typeof p?.uri === 'string' ? p.uri : p?.uri?.value;
      if (p?.prefix && uri && !normalizedPrefixes.some(existing => existing.prefix === p.prefix)) {
        normalizedPrefixes.push({ prefix: p.prefix, uri });
      }
    }
    prefixList.value = normalizedPrefixes;
    syncCustomPrefixes();

    const format = rdfFormats.find(f => f.type === storedFormat);
    if(format) {
      currentSerialization.value = format.type;
      emit('format-change', currentSerialization.value);
    }
  } else {
    localStorage.removeItem(localStorageKeyText);
    localStorage.removeItem(localStorageKeyFormat);
    localStorage.removeItem(localStorageKeyPrefixList);
  }

});




</script>

<template>
  <div class="editor-container">

  <rdf-editor :value.prop="rdfText" :format="currentSerialization" ref="editorElement" :prefixes="prefixes" :customPrefixes="customPrefixes" auto-parse
    parseDelay="1000" @parsing-failed="onParsingFailed" @quads-changed="onQuadsChanged"
    @prefixes-parsed="onPrefixesParsed" />
  </div>

</template>

<style scoped>
.editor-container {
  height: 100%;
  width: 100%;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  overflow: hidden;
}
rdf-editor {
  height: 100%;
  width: 100%;
 
}
</style>
