import { TSESTree as es } from "@typescript-eslint/utils";
import { getTypeServices, isMemberExpression } from "@icetee/eslint-etc";
import { createRule } from "../utils.js";

type OptionItem = { types?: string[] };
type Options = readonly OptionItem[];

const defaultOptions: Options = [];

const rule = createRule({
  defaultOptions,
  meta: {
    docs: {
      description: "Forbids calling `forEach`.",
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "Calling `forEach` is forbidden.",
    },
    schema: [
      {
        properties: {
          types: {
            items: {
              type: "string",
            },
            type: "array",
          },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
  name: "no-foreach",
  create: (context, unused: typeof defaultOptions) => {
    const [config = {}] = context.options;
    const types = config?.types ?? ["Array", "Map", "NodeList", "Set"];
    const typesRegExp = new RegExp(`^${types.join("|")}$`);
    const { couldBeType } = getTypeServices(context);
    return {
      "CallExpression[callee.property.name='forEach']": (
        callExpression: es.CallExpression
      ) => {
        const { callee } = callExpression;
        if (!isMemberExpression(callee)) {
          return;
        }
        if (!couldBeType(callee.object, typesRegExp)) {
          return;
        }
        context.report({
          messageId: "forbidden",
          node: callee.property,
        });
      },
    };
  },
});

export default rule;
