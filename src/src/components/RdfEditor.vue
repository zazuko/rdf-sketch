<script setup lang="ts">
import { computed, onMounted, ref, watch, type VNodeRef } from 'vue';

import '@rdfjs-elements/rdf-editor';

import {rdfFormats, RdfSerializationType} from '../constant/rdf-format';

import type { Quad} from '@rdfjs/types';
import { localStorageKeyFormat, localStorageKeyPrefixList, localStorageKeyText } from '@/constant/local-storage-keys';


export interface RdfData {
    quads: Quad[];
    rdfText: string;
    serializationFormat: RdfSerializationType;
  }

export interface RdfPrefix {
  prefix: string;
  uri: string;
}

interface RdfEditorProps {
  format: RdfSerializationType;
}


const props = defineProps<RdfEditorProps>()


const emit = defineEmits<{
  (event: 'change', data: RdfData): void;
  (event: 'format-change', format: RdfSerializationType): void;
}>();

const prefixList = ref<RdfPrefix[]>([]);
const editorElement = ref<VNodeRef |null>(null);
const currentSerialization = ref<RdfSerializationType>(RdfSerializationType.Turtle);

watch(() => props.format, (newFormat) => {
  if (newFormat !== currentSerialization.value) {
    console.log('Format changed', newFormat);

    currentSerialization.value = newFormat;
  }
});

const rdfText = ref<string>('foo');

function onParsingFailed(e: CustomEvent) {
  console.error('Parsing failed', e.detail);
  
}

function onQuadsChanged(e: CustomEvent) {
 
  const text = (editorElement.value as unknown as any)?.codeMirror?.value;
  const quads = e.detail.value as Quad[];
  const rdfData: RdfData = {
      quads: quads,
      rdfText: text,
      serializationFormat: props.format,
  };
    localStorage.setItem(localStorageKeyText, rdfData.rdfText);
    localStorage.setItem(localStorageKeyFormat, rdfData.serializationFormat);
    // store prefix list
    localStorage.setItem(localStorageKeyPrefixList, JSON.stringify(prefixList.value));
    emit('change', rdfData);
  }
 

function onPrefixesParsed(e: CustomEvent) {
  for (const [prefix, val] of Object.entries(e.detail.prefixes)) {
    const uri = val as string ;
    prefixList.value.push({ prefix, uri });
  }   
}

const customPrefixes = computed(() => {
  const prefixMap: Record<string, string> = {};
  prefixList.value.forEach((p) => {
    if (typeof p.uri === 'string') {
    prefixMap[p.prefix] = p.uri;
  } else {
    prefixMap[p.prefix] = (p.uri as unknown as any).value;
  }
  });
  prefixes.split(',').forEach((p) => {
    delete prefixMap[p];
  });
 
  return prefixMap;
});

const prefixes = "rdf,rdfs,sh";

onMounted(() => {
  // read previous state from local storage
  const storedText = localStorage.getItem(localStorageKeyText);
  const storedFormat = localStorage.getItem(localStorageKeyFormat);
  const storedPrefixList = JSON.parse( localStorage.getItem(localStorageKeyPrefixList) ?? '[]');
  if (storedText && storedFormat && rdfFormats.find(f => f.type === storedFormat) && Array.isArray(storedPrefixList)) {
    rdfText.value = storedText;
    currentSerialization.value = (rdfFormats.find(f => f.type === storedFormat) ?? rdfFormats[0]).type;
    prefixList.value = storedPrefixList;
    emit('format-change', currentSerialization.value);
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
