import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
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
            ],
        },
    },
    build: {
        rollupOptions: {
            plugins: [rollupNodePolyFill],
            input: {
                main: fileURLToPath(new URL('./index.html', import.meta.url))
            }
        },
    },
})
