import type { TSESLint } from '@typescript-eslint/utils'
import eslintparser from '@typescript-eslint/parser'

const config: TSESLint.FlatConfig.ConfigArray = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: eslintparser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
    },
    rules: {
      "sort-keys": "off"
    },
  },
];

export default config;
