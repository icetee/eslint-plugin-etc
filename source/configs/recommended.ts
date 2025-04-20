import { Linter } from "eslint"

export const rules: Partial<Linter.RulesRecord> = {
  '@icetee/etc/no-assign-mutated-array': 'error',
  '@icetee/etc/no-deprecated': 'error',
  '@icetee/etc/no-implicit-any-catch': 'error',
  '@icetee/etc/no-internal': 'error',
}

export default {
  extends: ["./configs/base"],
  rules,
}
