import '../assets/main.css'

import { createApp } from 'vue';

import PrimeVue from 'primevue/config';

import Aura from '@primevue/themes/aura';
import App from './AppVscode.vue';



const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.vscode-dark',
            cssLayer: false
        }
    },

});


app.mount('#app')