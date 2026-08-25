import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import nodeSecurity from 'eslint-plugin-node-security';
import secureCoding from 'eslint-plugin-secure-coding';

export default defineConfig([
    {
        ignores: ['coverage', 'grafana'],
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
    // Security rules, CWE- and CVSS-tagged. Measured against this repository
    // before being proposed: 0 findings across 4.5 KLOC.
    {
        plugins: {
            'node-security': nodeSecurity,
            'secure-coding': secureCoding,
        },
        rules: {
            ...nodeSecurity.configs.recommended.rules,
            ...secureCoding.configs.recommended.rules,
        },
    },
    {
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-this-alias': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-namespace': 'off',
        },
    },
]);
