import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
    {
        ignores: ['coverage'],
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: globals.node },
    },
    {
        files: ['test/**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: { ...globals.node, ...globals.vitest } },
    },
    tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-this-alias': 'off',
        },
    },
]);
