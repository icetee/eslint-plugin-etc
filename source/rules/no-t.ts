import { TSESTree as es } from "@typescript-eslint/utils";
import { createRule } from "../utils.js";

type OptionItem = { prefix?: string };
type Options = readonly OptionItem[];

const defaultOptions: Options = [];

const rule = createRule({
  defaultOptions,
  meta: {
    docs: {
      description: "Forbids single-character type parameters.",
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: `Single-character type parameters are forbidden. Choose a more descriptive name for "{{name}}"`,
      prefix: `Type parameter "{{name}}" does not have prefix "{{prefix}}"`,
    },
    schema: [
      {
        properties: {
          prefix: { type: "string" },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
  name: "no-t",
  create: (context, unused: typeof defaultOptions) => {
    const [{ prefix = "" } = {}] = context.options;
    return {
      "TSTypeParameter > Identifier[name=/^.$/]": (node: es.Identifier) =>
        context.report({
          data: { name: node.name },
          messageId: "forbidden",
          node,
        }),
      "TSTypeParameter > Identifier[name=/^.{2,}$/]": (node: es.Identifier) => {
        const { name } = node;
        if (prefix && name.indexOf(prefix) !== 0) {
          context.report({
            data: { name, prefix },
            messageId: "prefix",
            node,
          });
        }
      },
    };
  },
});

export default rule;
