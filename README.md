# @icetee/eslint-plugin-etc

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/icetee/eslint-plugin-etc/blob/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/@icetee/eslint-plugin-etc.svg)](https://www.npmjs.com/package/@icetee/eslint-plugin-etc)
[![Downloads](http://img.shields.io/npm/dm/@icetee/eslint-plugin-etc.svg)](https://npmjs.org/package/@icetee/eslint-plugin-etc)

This package contains a bunch of general-purpose, TypeScript-related ESLint rules. Essentially, it's a re-implementation of the rules that are in the [`tslint-etc`](https://github.com/icetee/tslint-etc) package.

Some of the rules are rather opinionated and are not included in the `recommended` configuration. Developers can decide for themselves whether they want to enable opinionated rules.

# Install

Install the ESLint TypeScript parser using npm:

```
npm install @typescript-eslint/parser --save-dev
```

Install the package using npm:

```
npm install @icetee/eslint-plugin-etc --save-dev
```

Configure the `parser` and the `parserOptions` for ESLint. Here, I use a `eslint.config.mjs` file for the configuration:

```js
import { defineConfig } from 'eslint/config'
import etcPlugin from '@icetee/eslint-plugin-etc'

export default defineConfig([
    files: ['**/*.{js,mjs,ts}'],
    languageOptions: {
        parser: parserTs,
        ecmaVersion: 2022,
        sourceType: 'module',
        parserOptions: {
            project: ['./tsconfig.json'],
            tsconfigRootDir: path.resolve(),
            sourceType: 'module',
        },
    },
    plugins: [
        '@icetee/etc': etcPlugin,
    ],
])
```

Or, using the `recommended` configuration:

```js
import { defineConfig } from 'eslint/config'

export default defineConfig([
    etc.configs.flatRecommended,
    files: ['**/*.{js,mjs,ts}'],
    languageOptions: {
        parser: parserTs,
        ecmaVersion: 2022,
        sourceType: 'module',
        parserOptions: {
            project: ['./tsconfig.json'],
            tsconfigRootDir: path.resolve(),
            sourceType: 'module',
        },
    },
])
```

# Rules

The package includes the following rules.

Rules marked with ✅ are recommended and rules marked with 🔧 have fixers.

| Rule | Description | | |
| --- | --- | --- | --- |
| [`no-assign-mutated-array`](https://github.com/icetee/eslint-plugin-etc/blob/main/docs/rules/no-assign-mutated-array.md) | Forbids the assignment of returned, mutated arrays. | ✅ | |
| [`no-commented-out-code`](https://github.com/icetee/eslint-plugin-etc/blob/main/docs/rules/no-commented-out-code.md) | Forbids commented-out code. | | |
| [`no-const-enum`](https://github.com/icetee/eslint-plugin-etc/blob/main/docs/rules/no-const-enum.md) | Forbids the use of `const enum`. Constant enums are [not compatible with isolated modules](https://ncjamieson.com/dont-export-const-enums/). | | |
| [`no-deprecated`](https://github.com/icetee/eslint-plugin-etc/blob/main/docs/rules/no-deprecated.md) | Forbids the use of deprecated APIs. | ✅ | |
| [`no-enum`](https://github.com/icetee/eslint-plugin-etc/blob/main/docs/rules/no-enum.md) | Forbids the use of `enum`. | | |
| [`no-implicit-any-catch`](https://github.com/icetee/eslint-plugin-etc/blob/main/docs/rules/no-implicit-any-catch.md) | Like the [`no-implicit-any-catch` rule](https://github.com/typescript-eslint/typescript-eslint/blob/e01204931e460f5e6731abc443c88d666ca0b07a/packages/eslint-plugin/docs/rules/no-implicit-any-catch.md) in `@typescript-eslint/eslint-plugin`, but for `Promise` rejections instead of `catch` clauses. | ✅ | 🔧 |
| [`no-internal`](https://github.com/icetee/eslint-plugin-etc/blob/main/docs/rules/no-internal.md) | Forbids the use of internal APIs. | ✅ | |
| [`no-misused-generics`](https://github.com/icetee/eslint-plugin-etc/blob/main/docs/rules/no-misused-generics.md) | Forbids type parameters without inference sites and type parameters that don't add type safety to declarations. This is an ESLint port of [Wotan's `no-misused-generics` rule](https://github.com/fimbullinter/wotan/blob/11368a193ba90a9e79b9f6ab530be1b434b122de/packages/mimir/docs/no-misused-generics.md). See also ["The Golden Rule of Generics"](https://effectivetypescript.com/2020/08/12/generics-golden-rule/). | | |
| [`no-t`](https://github.com/icetee/eslint-plugin-etc/blob/main/docs/rules/no-t.md) | Forbids single-character type parameters. | | |
| [`prefer-interface`](https://github.com/icetee/eslint-plugin-etc/blob/main/docs/rules/prefer-interface.md) | Forbids type aliases where interfaces can be used. | | 🔧 |
| [`prefer-less-than`](https://github.com/icetee/eslint-plugin-etc/blob/main/docs/rules/prefer-less-than.md) | Forbids greater-than comparisons. (Yes, this is the rule for [Ben Lesh comparisons](https://twitter.com/BenLesh/status/1397593619096166400).) | | 🔧 |
| [`throw-error`](https://github.com/icetee/eslint-plugin-etc/blob/main/docs/rules/throw-error.md) | Forbids throwing - or rejecting with - non-`Error` values. | | |
| [`underscore-internal`](https://github.com/icetee/eslint-plugin-etc/blob/main/docs/rules/underscore-internal.md) | Forbids internal APIs that are not prefixed with underscores. | | |
