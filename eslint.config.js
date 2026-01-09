//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    files: ['*.js'],
    rules: {
      // Disable TypeScript-specific rules for JavaScript files
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    ignores: ['*.config.js', '.output/**', '.vinxi/**', '.nitro/**'],
  },
]
