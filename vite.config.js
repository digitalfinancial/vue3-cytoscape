import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';
import { defineConfig, normalizePath } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [
            vue(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        build: {
            lib: {
                // Could also be a dictionary or array of multiple entry points
                entry: resolve(__dirname, 'src/index.ts'),
                name: 'vue3-cytoscape',
                formats: ["es", "umd"],
                // the proper extensions will be added
                fileName: 'vue3-cytoscape',
            },
            rollupOptions: {
                // make sure to externalize deps that shouldn't be bundled
                // into your library
                external: ['vue'],
                output: {
                    exports: "named",
                    // Provide global variables to use in the UMD build
                    // for externalized deps
                    globals: {
                        vue: 'Vue',
                    },
                },
            },
        },
    };
});
