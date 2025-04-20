import type { ClassicConfig } from '@typescript-eslint/utils/ts-eslint'

export default {
  parser: "@typescript-eslint/parser",
  parserOptions: { sourceType: "module" },
  plugins: ["@icetee/etc"],
} satisfies ClassicConfig.Config
