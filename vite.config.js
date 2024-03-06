import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';
import { defineConfig, normalizePath } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import typescript2 from 'rollup-plugin-typescript2';
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [
            vue(),
        ],
        dts: {
            insertTypesEntry: true,
        },
        cssInjectedByJsPlugin: { },
        typescript2: {
            check: false,
            include: [ "src/components/**/*.vue" ],
            sconfigOverride: {
                compilerOptions: {
                    outDir: "dist",
                    sourceMap: true,
                    declaration: true,
                    declarationMap: true,
                },
            },
            exclude: ["vite.config.ts"],
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        build: {
            cssCodeSplit: true,
            lib: {
                // Could also be a dictionary or array of multiple entry points
                entry: resolve(__dirname, 'src/plugin.ts'),
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
