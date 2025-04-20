import { TSESTree as es } from "@typescript-eslint/utils";
import { getLoc, getParserServices } from "@icetee/eslint-etc";
import ts from "typescript";
import { createRule } from "../utils.js";

const rule = createRule({
  defaultOptions: [],
  meta: {
    docs: {
      description: "Forbids the use of `enum`.",
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "`enum` is forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-enum",
  create: (context) => ({
    TSEnumDeclaration: (node: es.Node) => {
      const { esTreeNodeToTSNodeMap } = getParserServices(context);
      const enumDeclaration = esTreeNodeToTSNodeMap.get(
        node
      ) as ts.EnumDeclaration;
      context.report({
        messageId: "forbidden",
        loc: getLoc(enumDeclaration.name),
      });
    },
  }),
});

export default rule;
