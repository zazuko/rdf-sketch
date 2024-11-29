import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import inject from '@rollup/plugin-inject';

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
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            stream: 'readable-stream',
            util: 'util',
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    process: true,
                    buffer: true,
                }) as any,
                NodeModulesPolyfillPlugin()
            ],
        },
    },
    build: {
        rollupOptions: {
            plugins: [
                rollupNodePolyFill() as any,
                inject({
                    process: 'process', // Inject process global
                    Buffer: ['buffer', 'Buffer'], // Inject Buffer global
                }),
            ],
            input: {
                main: fileURLToPath(new URL('./index.html', import.meta.url))
            }
        },
    },
})
