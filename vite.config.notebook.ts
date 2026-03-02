import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import inject from '@rollup/plugin-inject';
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
        lib: {
            entry: fileURLToPath(new URL('./src/notebook-renderer/renderer.ts', import.meta.url)),
            name: 'rdfSketchRenderer',
            formats: ['es'],
            fileName: () => 'renderer.js'
        },
        rollupOptions: {
            plugins: [
                rollupNodePolyFill() as any,
                inject({
                    process: 'process', // Inject process global
                    Buffer: ['buffer', 'Buffer'], // Inject Buffer global
                })
            ],
            external: ['vscode']
        },
        outDir: 'src-vscode/dist',
        emptyOutDir: false,
    },
})
