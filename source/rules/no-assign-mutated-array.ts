import { TSESTree as es, AST_NODE_TYPES } from "@typescript-eslint/utils";
import {
  getParent,
  getTypeServices,
  isArrayExpression,
  isCallExpression,
  isExpressionStatement,
  isIdentifier,
  isMemberExpression,
  isNewExpression,
} from "@icetee/eslint-etc";
import { createRule } from "../utils.js";

const mutatorRegExp = /^(fill|reverse|sort)$/;
const creatorRegExp = /^(concat|entries|filter|keys|map|slice|splice|values)$/;

export type OptionString = 'array' | 'array-simple' | 'generic';

export type Options = [
  recommended?: boolean
];

type MessageIds = 'forbidden';

const rule = createRule<Options, MessageIds>({
  create: (context: any) => {
    const { couldBeType } = getTypeServices(context);
    return {
      [`CallExpression > MemberExpression[property.name=${mutatorRegExp.toString()}]`]:
        (memberExpression: es.MemberExpression) => {
          const callExpression = getParent(
            memberExpression
          ) as es.CallExpression;
          const parent = getParent(callExpression);
          if (parent && !isExpressionStatement(parent)) {
            if (
              couldBeType(memberExpression.object, "Array") &&
              mutatesReferencedArray(callExpression)
            ) {
              context.report({
                messageId: "forbidden",
                node: memberExpression.property,
              });
            }
          }
        },
    };

  function isNewArray(node: es.Expression): boolean {
    if (
      isArrayExpression(node) ||
      isNewExpression(node) ||
      (isCallExpression(node) &&
        isIdentifier(node.callee) &&
        node.callee.name === 'Array') ||
      (isMemberExpression(node) &&
        isIdentifier(node.object) &&
        node.object.name === 'Array')
    ) {
      return true;
    }

    return false;
  }

    function mutatesReferencedArray(
      callExpression: es.CallExpression
    ): boolean {
      if (isMemberExpression(callExpression.callee)) {
        const memberExpression = callExpression.callee;
        const { object, property } = memberExpression;
        if (isIdentifier(property) && creatorRegExp.test(property.name)) {
          return false;
        }

        if (
          object.type === AST_NODE_TYPES.Identifier ||
          object.type === AST_NODE_TYPES.CallExpression ||
          object.type === AST_NODE_TYPES.NewExpression ||
          object.type === AST_NODE_TYPES.ArrayExpression
        ) {
          if (isNewArray(object)) {
            return false;
          }
        }

        if (isCallExpression(object)) {
          return mutatesReferencedArray(object);
        }
      }
      return true;
    }
  },
  meta: {
    docs: {
      description: "Forbids the assignment of returned, mutated arrays.",
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      'forbidden': "Assignment of mutated arrays is forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-assign-mutated-array",
  defaultOptions: [],
});

export default rule
