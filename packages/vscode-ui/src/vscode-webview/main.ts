import '@/assets/main.css'

import { createApp } from 'vue';

import PrimeVue from 'primevue/config';

import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import App from './AppVscode.vue';

const VscodeBlue = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#f0f8ff',
            100: '#e0f0fe',
            200: '#bae2fd',
            300: '#7dcbfb',
            400: '#38b0f8',
            500: '#007acc',
            600: '#006bb3',
            700: '#00558c',
            800: '#004471',
            900: '#00355a',
            950: '#002542'
        }
    }
});

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: VscodeBlue,
        options: {
            darkModeSelector: '.vscode-dark',
            cssLayer: false
        }
    },

});


app.mount('#app')