import { configApp } from '@adonisjs/eslint-config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default [
  ...configApp(),
  {
    rules: {
      '@unicorn/filename-case': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@unicorn/no-await-expression-member': 'off',
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
]
