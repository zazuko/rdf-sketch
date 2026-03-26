<template>

<DataTable
v-if="spo"
 v-model:filters="filters" 
 filterDisplay="row" 
 :value="spo" 
 :itemSize="itemSizeWithPadding" 
 scrollable 
 scrollHeight="flex" 
 :virtualScrollerOptions="{ itemSize: itemSizeWithPadding }" 
 class="spo-table"
 style="height: 100%; display: flex; flex-direction: column;"
 tableStyle="table-layout: fixed">
    <Column field="subject" header="Subject"  :style="{ width: hasContext ? '25%' : '33.33%' }">  
        <template #filter="{ filterModel, filterCallback }">
            <InputText size="small" v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search Subject" />
        </template>
        <template #body="{ data }">
            <div class="cell">

            <span v-tooltip.top="data.subjectTerm.value" @click="nodeSelected(data.subjectTerm)" class="node-link">
                {{ data.subject }}
            </span>
            </div>
        </template>
    </Column>
    <Column field="predicate" header="Predicate"  :style="{ width: hasContext ? '25%' : '33.33%'  }">
        <template #filter="{ filterModel, filterCallback }">
            <InputText size="small" v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search Predicate" />
        </template>
        <template #body="{ data }">
            <div class="cell">

            <span v-tooltip.top="data.predicateTerm.value" @click="nodeSelected(data.subjectTerm)" class="node-link">
                {{ data.predicate }}
            </span>
            </div>
        </template>
    </Column>
    <Column field="object" header="Object" :style="{ width: hasContext ? '25%' : '33.33%'  }">
        <template #filter="{ filterModel, filterCallback }">
            <InputText size="small" v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search Object" />
        </template>
        <template #body="{ data }">
            <div class="cell">
            <span v-tooltip.top="data.objectTerm.value" class="row" v-if="data.predicateTerm.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' || data.objectTerm.termType === 'Literal'">
                {{ data.object }}
            </span>
            <span v-else v-tooltip.top="data.objectTerm.value" @click="nodeSelected(data.objectTerm)" class="node-link">
                {{ data.object }}
            </span>
        </div>
        </template>
    </Column>
    <Column v-if="hasContext" field="context" header="Context" style="width: 25%">
        <template #filter="{ filterModel, filterCallback }">
            <InputText size="small" v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search Context aka Named Graph" />
        </template>
        <template #body="{ data }">
            <div class="cell">
           
            <span v-tooltip.top="data.context">
                {{ data.context }}
            </span>
        </div>
        </template>
    </Column>
</DataTable>

</template>

<script setup lang="ts">

import type { Dataset, Term } from '@rdfjs/types';
import { computed, ref, type PropType } from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { shrinkTerm } from '@/rdf/shrink-term';
import { FilterMatchMode } from '@primevue/core/api';
import InputText from 'primevue/inputtext';
import vTooltip from 'primevue/tooltip';

interface SPO {
    subject: string,
    subjectTerm: Term,
    predicate: string,
    predicateTerm: Term,
    object: string,
    objectTerm: Term,
    context: string,
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

const itemSize = ref(61);

const itemSizeWithPadding = computed(() => {
    return itemSize.value + 24; // adding padding
});

</script>

<style scoped>

span {
    font-size: 12px;
}

.node-link {
    cursor: pointer;
    text-decoration: none;
    color: inherit;
}
.node-link:hover {
    color: var(--p-primary-color, #007acc);
    text-decoration: underline;
}


.spo-table {
    width: 100vw;
    max-width: 100vw;
}

.cell {
    max-height: 61px;
    min-height: 61px;
    
    /* display: flex; conflicts with -webkit-box for line-clamp */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    
    /* word-break ensures long URIs don't overflow horizontally */
    word-break: break-all; 
    
    /* vertical alignment simulation for -webkit-box if needed, 
       but line-clamp usually implies top alignment. 
       If previously centered, we might need a wrapper, 
       but for multi-line text, top alignment works best 
       to see the start of the content. */
}

</style>
