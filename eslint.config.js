// eslint.config.js

import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // Ignore build output
  { ignores: ['dist'] },

  {
    files: ['**/*.{js,jsx}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    settings: {
      react: {
        version: 'detect', // Auto-detect React version
      },
    },

    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,

      // Disallow unused vars but allow constants starting with CAPITALS
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

      // Ensure fast-refresh works properly
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
]
