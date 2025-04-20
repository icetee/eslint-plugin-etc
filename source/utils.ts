import { ESLintUtils } from '@typescript-eslint/utils'

export const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/icetee/eslint-plugin-etc/tree/main/docs/rules/${name}.md`
)
