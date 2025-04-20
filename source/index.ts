import * as parserBase from '@typescript-eslint/parser'
import type { FlatConfig, Linter } from '@typescript-eslint/utils/ts-eslint'
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { TSESLint } from '@typescript-eslint/utils'
import all from './configs/all.js'
import rules from './rules/index.js'
import recommended from './configs/recommended.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { name, version } = JSON.parse(readFileSync(resolve(__dirname, "../package.json"), "utf8"));

const meta: { name: string, version: string } = {
  name,
  version,
}

export const parser: TSESLint.FlatConfig.Parser = {
  meta: parserBase.meta,
  parseForESLint: parserBase.parseForESLint,
}

const classicPlugin = {
  configs: {
    recommended: recommended,
    all,
  },
  rules,
  meta,
} satisfies Linter.Plugin

export const plugin: TSESLint.FlatConfig.Plugin = classicPlugin as Omit<
    typeof classicPlugin,
    "configs"
>;

const flatBaseConfig = (
  plugin: FlatConfig.Plugin,
  parser: FlatConfig.Parser
) => {
  const baseConfig: FlatConfig.Config = {
    name: '@icetee/etc/base',
    languageOptions: {
      parser,
      sourceType: 'module',
    },
    plugins: {
      '@icetee/etc': plugin,
    },
  }

  return baseConfig
}

export { classicPlugin }

export type ConfigArray = TSESLint.FlatConfig.ConfigArray;

const flatConfig = {
  plugin,
  configs: {
    flatRecommended: [
      flatBaseConfig(plugin, parser),
      {
        name: "@icetee/etc/recommended",
        rules: recommended.rules,
      },
    ],
    flatAll: [
      flatBaseConfig(plugin, parser),
      {
        name: "@icetee/etc/all",
        rules: all.rules,
      },
    ]
  } as {
    flatRecommended: ConfigArray;
    flatAll: ConfigArray;
  }
}

export default flatConfig
