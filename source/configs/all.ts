import { Linter } from "eslint"

export const rules: Partial<Linter.RulesRecord> = {
  '@icetee/etc/no-assign-mutated-array': 'error',
  '@icetee/etc/no-commented-out-code': 'error',
  '@icetee/etc/no-const-enum': 'error',
  '@icetee/etc/no-deprecated': 'error',
  '@icetee/etc/no-enum': 'error',
  '@icetee/etc/no-foreach': 'error',
  '@icetee/etc/no-implicit-any-catch': 'error',
  '@icetee/etc/no-internal': 'error',
  '@icetee/etc/no-misused-generics': 'error',
  '@icetee/etc/no-t': 'error',
  '@icetee/etc/prefer-interface': 'error',
  '@icetee/etc/prefer-less-than': 'error',
  '@icetee/etc/throw-error': 'error',
  '@icetee/etc/underscore-internal': 'error',
}

export default {
  extends: ["./configs/base"],
  rules,
}
