<template>
  <div v-if="spo" class="spo-container" ref="scrollContainerRef" @scroll="onScroll">
    <table class="spo-table">
      <thead>
        <tr>
          <th :style="{ width: hasContext ? '25%' : '33.33%' }">Subject</th>
          <th :style="{ width: hasContext ? '25%' : '33.33%' }">Predicate</th>
          <th :style="{ width: hasContext ? '25%' : '33.33%' }">Object</th>
          <th v-if="hasContext" style="width: 25%">Context</th>
        </tr>
        <tr class="filter-row">
          <th>
            <input
              v-model="subjectFilter"
              type="text"
              class="sketch-input sketch-input-sm"
              placeholder="Search Subject"
            />
          </th>
          <th>
            <input
              v-model="predicateFilter"
              type="text"
              class="sketch-input sketch-input-sm"
              placeholder="Search Predicate"
            />
          </th>
          <th>
            <input
              v-model="objectFilter"
              type="text"
              class="sketch-input sketch-input-sm"
              placeholder="Search Object"
            />
          </th>
          <th v-if="hasContext">
            <input
              v-model="contextFilter"
              type="text"
              class="sketch-input sketch-input-sm"
              placeholder="Search Context aka Named Graph"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="topPadding > 0" :style="{ height: topPadding + 'px' }" aria-hidden="true">
          <td :colspan="hasContext ? 4 : 3" style="padding: 0; border: none;"></td>
        </tr>
        <tr
          v-for="(row, idx) in visibleRows"
          :key="startIndex + idx"
          :style="{ height: rowHeight + 'px' }"
          class="data-row"
        >
          <td>
            <div class="cell">
              <span
                :title="row.subjectTerm.value"
                @click="nodeSelected(row.subjectTerm)"
                class="node-link"
              >
                {{ row.subject }}
              </span>
            </div>
          </td>
          <td>
            <div class="cell">
              <span
                :title="row.predicateTerm.value"
                @click="nodeSelected(row.subjectTerm)"
                class="node-link"
              >
                {{ row.predicate }}
              </span>
            </div>
          </td>
          <td>
            <div class="cell">
              <span
                v-if="row.predicateTerm.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' || row.objectTerm.termType === 'Literal'"
                :title="row.objectTerm.value"
                class="row"
              >
                {{ row.object }}
              </span>
              <span
                v-else
                :title="row.objectTerm.value"
                @click="nodeSelected(row.objectTerm)"
                class="node-link"
              >
                {{ row.object }}
              </span>
            </div>
          </td>
          <td v-if="hasContext">
            <div class="cell">
              <span :title="row.context">
                {{ row.context }}
              </span>
            </div>
          </td>
        </tr>
        <tr v-if="bottomPadding > 0" :style="{ height: bottomPadding + 'px' }" aria-hidden="true">
          <td :colspan="hasContext ? 4 : 3" style="padding: 0; border: none;"></td>
        </tr>
        <tr v-if="filteredSpo.length === 0">
          <td :colspan="hasContext ? 4 : 3" class="empty-message">
            No matching triples found.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Dataset, Term } from '@rdfjs/types';
import { computed, ref, watch, onMounted, onUnmounted, type PropType } from 'vue';
import { shrinkTerm } from '@/rdf/shrink-term';

interface SPO {
  subject: string;
  subjectTerm: Term;
  predicate: string;
  predicateTerm: Term;
  object: string;
  objectTerm: Term;
  context: string;
}

const props = defineProps({
  dataset: {
    type: Object as PropType<Dataset>,
    required: true
  },
  isVscode: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits<{
  (event: 'selected', arg1: Term): void;
}>();

const spo = computed<SPO[]>(() => {
  const result: SPO[] = [];
  props.dataset.forEach(quad => {
    result.push({
      subject: shrinkTerm(quad.subject),
      subjectTerm: quad.subject,
      predicate: shrinkTerm(quad.predicate),
      predicateTerm: quad.predicate,
      object: shrinkTerm(quad.object),
      objectTerm: quad.object,
      context: quad.graph.value
    });
  });
  return result;
});

const hasContext = computed(() => {
  return spo.value.some(quad => quad.context !== '');
});

const subjectFilter = ref('');
const predicateFilter = ref('');
const objectFilter = ref('');
const contextFilter = ref('');

const filteredSpo = computed(() => {
  const sFilter = subjectFilter.value.trim().toLowerCase();
  const pFilter = predicateFilter.value.trim().toLowerCase();
  const oFilter = objectFilter.value.trim().toLowerCase();
  const cFilter = contextFilter.value.trim().toLowerCase();

  if (!sFilter && !pFilter && !oFilter && !cFilter) {
    return spo.value;
  }

  return spo.value.filter(item => {
    if (sFilter && !item.subject.toLowerCase().includes(sFilter)) return false;
    if (pFilter && !item.predicate.toLowerCase().includes(pFilter)) return false;
    if (oFilter && !item.object.toLowerCase().includes(oFilter)) return false;
    if (cFilter && !item.context.toLowerCase().includes(cFilter)) return false;
    return true;
  });
});

const rowHeight = 77;
const scrollContainerRef = ref<HTMLElement | null>(null);
const scrollTop = ref(0);
const containerHeight = ref(400);

function onScroll(e: Event) {
  scrollTop.value = (e.target as HTMLElement).scrollTop;
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (scrollContainerRef.value) {
    containerHeight.value = scrollContainerRef.value.clientHeight || 400;
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerHeight.value = entry.contentRect.height || 400;
      }
    });
    resizeObserver.observe(scrollContainerRef.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});

watch(filteredSpo, () => {
  if (scrollContainerRef.value) {
    scrollContainerRef.value.scrollTop = 0;
    scrollTop.value = 0;
  }
});

const bufferRows = 6;
const startIndex = computed(() => {
  return Math.max(0, Math.floor(scrollTop.value / rowHeight) - bufferRows);
});

const visibleCount = computed(() => {
  return Math.ceil(containerHeight.value / rowHeight) + bufferRows * 2;
});

const endIndex = computed(() => {
  return Math.min(filteredSpo.value.length, startIndex.value + visibleCount.value);
});

const visibleRows = computed(() => {
  return filteredSpo.value.slice(startIndex.value, endIndex.value);
});

const topPadding = computed(() => {
  return startIndex.value * rowHeight;
});

const bottomPadding = computed(() => {
  return Math.max(0, (filteredSpo.value.length - endIndex.value) * rowHeight);
});

function nodeSelected(term: Term) {
  emit('selected', term);
}
</script>

<style scoped>
.spo-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--sketch-bg, #ffffff);
  color: var(--sketch-text, #1e293b);
}

.spo-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.spo-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--sketch-surface, #f8fafc);
}

.spo-table th {
  text-align: left;
  padding: 0.6rem 0.75rem;
  font-family: var(--ff-secondary, sans-serif);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--sketch-text);
  border-bottom: 1px solid var(--sketch-border-accent, rgba(168, 146, 113, 0.55));
  background-color: var(--sketch-surface, #FFFEF5);
}

.spo-table .filter-row th {
  padding: 0.4rem 0.75rem;
  font-family: var(--ff-primary, sans-serif);
}

.spo-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--sketch-border, #e2e8f0);
  vertical-align: top;
}

.data-row:hover {
  background-color: var(--sketch-surface-hover, #f1f5f9);
}

span {
  font-size: 12px;
}

.node-link {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.node-link:hover {
  color: var(--sketch-primary, #007acc);
  text-decoration: underline;
}

.cell {
  max-height: 61px;
  min-height: 61px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}

.empty-message {
  text-align: center;
  padding: 1.5rem;
  color: var(--sketch-text-muted, #64748b);
  font-size: 0.875rem;
}
</style>
