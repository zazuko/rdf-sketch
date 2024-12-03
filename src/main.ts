import './assets/main.css'

import { createApp } from 'vue';

import PrimeVue from 'primevue/config';

import Aura from '@primevue/themes/aura';
import App from './App.vue';

import { useUrlSearchParams } from '@vueuse/core';
import { rdfFormats, RdfSerializationType } from './constant/rdf-format';
import { localStorageKeyFormat, localStorageKeyText } from './constant/local-storage-keys';

const params = useUrlSearchParams('hash-params')

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    },
    options: {
        darkModeSelector: '.my-app-dark',
        cssLayer: false
    }
});

writeRdfFromUrlToLocalStorage();

app.mount('#app')


/**
 * This is used for "Share" functionality.
 * It reads the RDF and format from the URL and writes it to the local storage.
 */
function writeRdfFromUrlToLocalStorage(): void {
    if (params.rdf) {
        const rdfText = (Array.isArray(params.rdf) ? params.rdf[0] : params.rdf) ?? '';
        const rdfFormat = ((Array.isArray(params.format) ? params.format[0] : params.format) ?? RdfSerializationType.Turtle).replace(' ', '+');
        if (rdfText.length > 0 && rdfFormats.find(f => f.type === rdfFormat)) {
            localStorage.setItem(localStorageKeyText, rdfText);
            localStorage.setItem(localStorageKeyFormat, rdfFormat);
        }
    }
}
