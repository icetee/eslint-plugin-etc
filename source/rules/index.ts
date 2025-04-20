import noAssignMutatedArray from './no-assign-mutated-array.js'
import noCommentedOutCode from './no-commented-out-code.js'
import noConstEnum from './no-const-enum.js'
import noDeprecated from './no-deprecated.js'
import noeEnum from './no-enum.js'
import noForeach from './no-foreach.js'
import noImplicitAnyCatch from './no-implicit-any-catch.js'
import noInternal from './no-internal.js'
import noMisusedGenerics from './no-misused-generics.js'
import noT from './no-t.js'
import preferInterface from './prefer-interface.js'
import preferLessThan from './prefer-less-than.js'
import throwError from './throw-error.js'
import underscoreInternal from './underscore-internal.js'

const allRules = {
  'no-assign-mutated-array': noAssignMutatedArray,
  'no-commented-out-code': noCommentedOutCode,
  'no-const-enum': noConstEnum,
  'no-deprecated': noDeprecated,
  'no-enum': noeEnum,
  'no-foreach': noForeach,
  'no-implicit-any-catch': noImplicitAnyCatch,
  'no-internal': noInternal,
  'no-misused-generics': noMisusedGenerics,
  'no-t': noT,
  'prefer-interface': preferInterface,
  'prefer-less-than': preferLessThan,
  'throw-error': throwError,
  'underscore-internal': underscoreInternal,
};

export default allRules;
