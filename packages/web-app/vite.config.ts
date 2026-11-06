import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        global: 'window',
    },
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    // treat any tag that starts with rdf- as custom elements
                    isCustomElement: tag => tag.startsWith('rdf-')
                }
            }
        }),
        VitePWA({
            registerType: 'autoUpdate',
            filename: 'service-worker.js',
            workbox: {
                maximumFileSizeToCacheInBytes: 5 * 1024 ** 2, // 5 MB or set to something else
                globPatterns: ['**/*.{js,css,html,woff,woff2,svg,webmanifest,ico,png}'],

            }
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('../core-ui/src', import.meta.url)),
            'node:stream': 'readable-stream',
            stream: 'readable-stream',
            util: 'util',
        }
    },
    optimizeDeps: {
        rolldownOptions: {
            plugins: [
                rollupNodePolyFill() as any,
            ],
            transform: {
                inject: {
                    process: 'process',
                    Buffer: ['buffer', 'Buffer'],
                },
            },
        },
    },
    build: {
        rolldownOptions: {
            plugins: [
                rollupNodePolyFill() as any,
            ],
            transform: {
                inject: {
                    process: 'process', // Inject process global
                    Buffer: ['buffer', 'Buffer'], // Inject Buffer global
                },
            },
            input: {
                main: fileURLToPath(new URL('./index.html', import.meta.url))
            }
        },
    },
})
