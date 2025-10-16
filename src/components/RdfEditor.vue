<script setup lang="ts">
import { computed, onMounted, ref, watch, type PropType, type VNodeRef } from 'vue';

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


const defaultPrefixes = "rdf,rdfs,sh";
const rdfText = ref<string>('');
const prefixList = ref<RdfPrefix[]>([]);
const currentSerialization = ref<RdfSerializationType>(RdfSerializationType.Turtle);

const editorElement = ref<VNodeRef |null>(null);

/**
 * List of standard prefixes supported by the editor and custom prefixes. Custom prefixes are those extracted from the RDF document, 
 * in addition to the standard prefixes supported by the editor.
 */
const customPrefixes = computed(() => {
  const prefixMap: Record<string, string> = {};
  prefixList.value.forEach((p) => {
    if (typeof p.uri === 'string') {
    prefixMap[p.prefix] = p.uri;
  } else {
    prefixMap[p.prefix] = (p.uri as unknown as any).value;
  }
  });
  defaultPrefixes.split(',').forEach((p) => {
    delete prefixMap[p];
  });
 
  return prefixMap;
});




watch(() => props.format, (newFormat) => {
  if (newFormat !== currentSerialization.value) {
    currentSerialization.value = newFormat;
  }
});


function logParseErrorToConsole(e: CustomEvent) {
  console.error('Parsing failed', e.detail);
  
}

function emitRdfDataToVisualise(e: CustomEvent) {
 
  const text = (editorElement.value as unknown as any)?.codeMirror?.value;
  const quads = e.detail.value as Quad[];

  if(quads.length === 0) {
    resetPrefixList();
  }

  const rdfData: RdfData = {
      quads: quads,
      rdfText: text,
      serializationFormat: props.format,
      prefix: prefixList.value
  };

  if (quads.length < MAX_TRIPLES_TO_BE_STORED) {
    // store in local storage if not too big
    localStorage.setItem(localStorageKeyText, rdfData.rdfText);
    localStorage.setItem(localStorageKeyFormat, rdfData.serializationFormat);
    localStorage.setItem(localStorageKeyPrefixList, JSON.stringify(prefixList.value));
  }
    emit('change', rdfData);
  }
 

function addPrefix(e: CustomEvent) {
  for (const [prefix, val] of Object.entries(e.detail.prefixes)) {
    const uri = val as string ;
    prefixList.value.push({ prefix, uri });
  }   
}

/**
 * Reset the prefix list and remove it from local storage
 */
function resetPrefixList() {
    localStorage.removeItem(localStorageKeyPrefixList);
    prefixList.value = [];
}

onMounted(() => {
  // read previous state from local storage
  const storedText = localStorage.getItem(localStorageKeyText);
  const storedFormat = localStorage.getItem(localStorageKeyFormat);
  const storedPrefixList = JSON.parse( localStorage.getItem(localStorageKeyPrefixList) ?? '[]');
  if (storedText && storedFormat && rdfFormats.find(f => f.type === storedFormat) && Array.isArray(storedPrefixList)) {
    rdfText.value = storedText;
    prefixList.value = storedPrefixList;

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
    <rdf-editor 
      ref="editorElement" 
      auto-parse
      parseDelay="1000" 
      :value.prop="rdfText" 
      :format="currentSerialization" 
      :prefixes="defaultPrefixes" 
      :customPrefixes="customPrefixes" 
      @parsing-failed="logParseErrorToConsole"
      @quads-changed="emitRdfDataToVisualise"
      @prefixes-parsed="addPrefix"
    />
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
