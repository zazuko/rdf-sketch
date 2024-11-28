<template>
<DataTable  v-model:filters="filters" filterDisplay="row" :value="spo" scrollable scrollHeight="flex"  tableStyle="min-width: 50rem;">
    <Column field="subject" header="Subject" style="width: 20%">  
        <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search Subject" />
        </template>
        <template #body="{ data }">
            <span @click="nodeSelected(data.subjectTerm)" class="node-link">
                {{ data.subject }}
            </span>
        </template>
    </Column>
    <Column field="predicate" header="Predicate" style="width: 20%">
        <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search Predicate" />
        </template>
        <template #body="{ data }">
            <span @click="nodeSelected(data.subjectTerm)" class="node-link">
                {{ data.predicate }}
            </span>
        </template>
    </Column>
    <Column field="object" header="Object"  style="width: 20%">
        <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search Object" />
        </template>
        <template #body="{ data }">
            <span v-if="data.predicateTerm.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' || data.objectTerm.termType === 'Literal'">
                {{ data.object }}
            </span>
            <span v-else @click="nodeSelected(data.objectTerm)" class="node-link">
                {{ data.object }}
            </span>
        </template>
    </Column>
    <Column v-if="hasContext" field="context" header="Context" style="width: 20%">
        <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search Context aka Named Graph" />
        </template>
    </Column>
</DataTable>

</template>

<script setup lang="ts">

import type { Dataset, Term } from '@rdfjs/types';
import { computed, ref } from 'vue'
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
            predicateTerm: quad.predicate,
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

<style scoped>

span {
    font-size: 12px;
}

.node-link {
    cursor: pointer;
    text-decoration: underline;

}

</style>
