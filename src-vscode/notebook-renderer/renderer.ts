import { createApp } from 'vue';
import type { ActivationFunction } from 'vscode-notebook-renderer';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import AppVscode from '../../src/vscode-webview/AppVscode.vue';
import { updateEventType } from '../../src/vscode-webview/constant/update-event-type';

// Make sure to import the CSS styles properly so they are bundled
import '../../src/assets/main.css';


export const activate: ActivationFunction = (context) => {
    return {
        renderOutputItem(data, element) {
            // Clear existing content
            element.innerHTML = '';

            // Create an iframe to sandbox the Vue app
            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '650px';
            iframe.style.border = 'none';
            // Append iframe first so it has a contentWindow
            element.appendChild(iframe);

            const iframeDoc = iframe.contentWindow?.document;
            if (!iframeDoc) return;

            // 1) Copy stylesheets from parent document to iframe document 
            // so PrimeVue and our components get styled correctly!
            const copyStyle = (el: Element) => {
                // Avoid duplicating the exact same style node if it was already copied
                if (!iframeDoc.head.querySelector(`style[data-vite-dev-id="${el.getAttribute('data-vite-dev-id')}"]`)) {
                    iframeDoc.head.appendChild(el.cloneNode(true));
                }
            };

            // Copy existing styles
            document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(copyStyle);

            // PrimeVue 4 dynamically injects CSS at runtime (when Button, etc. are mounted).
            // It uses the parent document.head, so we must observe and copy them as they appear!
            const headObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeName === 'STYLE' || node.nodeName === 'LINK') {
                            iframeDoc.head.appendChild(node.cloneNode(true));
                        }
                    });
                });
            });
            headObserver.observe(document.head, { childList: true });

            // 2) Keep the iframe's HTML class in sync with the parent's theme
            const syncTheme = () => {
                const parentIsDark = document.body.classList.contains('vscode-dark');
                if (parentIsDark) {
                    iframeDoc.documentElement.classList.add('vscode-dark');
                    iframeDoc.body.classList.add('vscode-dark');
                } else {
                    iframeDoc.documentElement.classList.remove('vscode-dark');
                    iframeDoc.body.classList.remove('vscode-dark');
                }
            };
            syncTheme();

            // Set up a mutation observer on the parent body to watch for theme changes
            const observer = new MutationObserver(syncTheme);
            observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

            // 3) Create a container inside the iframe for Vue to mount to
            const container = iframeDoc.createElement('div');
            container.style.height = '100%';
            container.style.width = '100%';
            // Vue Flow works best when the body has a defined height
            iframeDoc.body.style.height = '100vh';
            iframeDoc.body.style.margin = '0';
            iframeDoc.body.appendChild(container);

            // 4) Mount Vue using props
            const app = createApp(AppVscode, {
                rdfString: data.text(),
                contentType: data.mime
            });

            app.use(PrimeVue, {
                theme: {
                    preset: Aura,
                    options: {
                        darkModeSelector: '.vscode-dark',
                        cssLayer: false
                    }
                },
                pt: {
                    global: {
                        css: `
                            body { margin: 0; padding: 0; }
                        `
                    }
                }
            });

            app.mount(container);
        }
    };
};
