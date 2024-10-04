<template>
    
 <h1>SPO</h1>

<DataTable  v-model:filters="filters" filterDisplay="row" :value="spo"   tableStyle="min-width: 50rem">
    <Column field="subject" header="Subject">  
        <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search Subject" />
        </template>
        <template #body="{ data }">
            <span @click="nodeSelected(data.subjectTerm)">
                {{ data.subject }}
            </span>
        </template>
    </Column>
    <Column field="predicate" header="Predicate">
        <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search Predicate" />
        </template>
        <template #body="{ data }">
            <span @click="nodeSelected(data.subjectTerm)">
                {{ data.predicate }}
            </span>
        </template>
    </Column>
    <Column field="object" header="Object">
        <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search Object" />
        </template>
        <template #body="{ data }">
            <span @click="nodeSelected(data.objectTerm)">
                {{ data.object }}
            </span>
        </template>
    </Column>
    <Column v-if="hasContext" field="context" header="Context">
        <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search Context aka Named Graph" />
        </template>
    </Column>
</DataTable>

</template>

<script setup lang="ts">

import type { Dataset, Term } from '@rdfjs/types';
import { computed, ref, watch, nextTick, inject } from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { shrinkTerm } from '@/rdf/shrink-term';
import { FilterMatchMode } from '@primevue/core/api';
import InputText from 'primevue/inputtext';



interface SPO {
    subject: string,
    subjectTerm: Term,
    predicate: string,
    predicateTerm: Term,
    object: string,
    objectTerm: Term,
    context: string,
}

interface GraphViewProps {
  dataset: Dataset,
}

const props = defineProps<GraphViewProps>();


const emit = defineEmits<{
  (event: 'selected', arg1: Term): void;
}>();


const spo = computed<SPO[]>(() => {
    const spo: SPO[] = [];
    props.dataset.forEach(quad => {
        spo.push({
            subject:  shrinkTerm( quad.subject),
            subjectTerm: quad.subject,
            predicate: shrinkTerm( quad.predicate),
            predicateTerm: quad.subject,
            object: shrinkTerm(quad.object),
            objectTerm: quad.object,
            context: quad.graph.value
        });
    });
    return spo;
});

const hasContext = computed(() => {
    return spo.value.some(quad => quad.context !== '');
});

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    subject: { value: null, matchMode: FilterMatchMode.CONTAINS },
    predicate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    object: { value: null, matchMode: FilterMatchMode.CONTAINS },
    context: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

function nodeSelected(term: Term) {
    emit('selected', term);
}


</script>

<style>

/* these are necessary styles for vue flow */
@import '@vue-flow/core/dist/style.css';

/* this contains the default theme, these are optional styles */
@import '@vue-flow/core/dist/theme-default.css';
#menu {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: white;
  border: 1px solid black;
  padding: 10px;
  pointer-events: auto;
}

.control {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.cog {
  margin-left: auto;
  margin-right: 0;
  color: #8a9ba1;
}

</style>
