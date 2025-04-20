import { TSESTree as es } from "@typescript-eslint/utils";
import { getParent, getTypeServices, isCallExpression } from "@icetee/eslint-etc";
import { createRule } from "../utils.js";

const rule = createRule({
  defaultOptions: [],
  meta: {
    docs: {
      description: "Forbids throwing - or rejecting with - non-`Error` values.",
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "{{usage}} non-`Error` values is forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "throw-error",
  create: (context) => {
    const sourceCode = context.getSourceCode();
    const { couldBeType, isAny, isUnknown } = getTypeServices(context);

    const checkRejection = (node: es.CallExpression) => {
      const {
        arguments: [arg],
      } = node;

      if (arg === undefined) {
        return
      }

      if (!isAny(arg) && !isUnknown(arg) && !couldBeType(arg, "Error")) {
        context.report({
          data: { usage: "Rejecting with" },
          messageId: "forbidden",
          node: arg,
        });
      }
    };

    return {
      "CallExpression > MemberExpression[property.name='reject']": (
        node: es.MemberExpression
      ) => {
        if (!couldBeType(node.object, /^Promise/)) {
          return;
        }
        checkRejection(getParent(node) as es.CallExpression);
      },
      "NewExpression[callee.name='Promise'] > ArrowFunctionExpression, NewExpression[callee.name='Promise'] > FunctionExpression":
        (node: es.ArrowFunctionExpression | es.FunctionExpression) => {
          const [, param] = node.params;
          if (!param) {
            return;
          }
          const text = sourceCode.getText(param);
          const variable = context
            .getDeclaredVariables(node)
            .find((variable) => variable.name === text);
          if (!variable) {
            return;
          }
          variable.references.forEach(({ identifier }) => {
            const parent = getParent(identifier) as es.Node;
            if (isCallExpression(parent) && identifier === parent.callee) {
              checkRejection(parent);
            }
          });
        },
      ThrowStatement: (node: es.ThrowStatement) => {
        if (
          node.argument &&
          !isAny(node.argument) &&
          !isUnknown(node.argument) &&
          !couldBeType(node.argument, /^(Error|DOMException)$/)
        ) {
          context.report({
            data: { usage: "Throwing" },
            messageId: "forbidden",
            node: node.argument,
          });
        }
      },
    };
  },
});

export default rule;
