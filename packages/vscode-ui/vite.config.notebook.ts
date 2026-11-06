import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
    define: {
        global: 'window',
    },
    plugins: [
        vue(),
        cssInjectedByJsPlugin()
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
        lib: {
            entry: fileURLToPath(new URL('./src/notebook-renderer/renderer.ts', import.meta.url)),
            name: 'rdfSketchRenderer',
            formats: ['es'],
            fileName: () => 'renderer.js'
        },
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
            external: ['vscode']
        },
        outDir: '../vscode-ext/dist',
        emptyOutDir: false,
    },
})
