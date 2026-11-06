import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

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
                }
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
                main: fileURLToPath(new URL('./vscode/index.html', import.meta.url))
            },
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`
            }
        },
        outDir: '../vscode-ext/media', // specify the target folder for the build
        emptyOutDir: true,
    },
})
