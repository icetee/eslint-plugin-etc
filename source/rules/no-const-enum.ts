import { TSESTree as es } from "@typescript-eslint/utils";
import { getLoc, getParserServices } from "@icetee/eslint-etc";
import * as tsutils from "tsutils";
import ts from "typescript";
import { createRule } from "../utils.js";

type OptionItem = { allowLocal?: boolean };
type Options = readonly OptionItem[];

const defaultOptions: Options = [];

const rule = createRule({
  defaultOptions,
  meta: {
    docs: {
      description: "Forbids the use of `const enum`.",
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "`const enum` is forbidden.",
    },
    schema: [
      {
        properties: {
          allowLocal: { type: "boolean" },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
  name: "no-const-enum",
  create: (context, unused: typeof defaultOptions) => ({
    TSEnumDeclaration: (node: es.Node) => {
      const [{ allowLocal = false } = {}] = context.options;
      const { esTreeNodeToTSNodeMap } = getParserServices(context);
      const enumDeclaration = esTreeNodeToTSNodeMap.get(
        node
      ) as ts.EnumDeclaration;
      const rawModifiers = enumDeclaration.modifiers ?? ts.factory.createNodeArray();
      const modifiers = ts.factory.createNodeArray(
        rawModifiers.filter((m): m is ts.Modifier => ts.isModifier(m))
      );

      if (
        allowLocal &&
        !tsutils.hasModifier(
          modifiers,
          ts.SyntaxKind.ExportKeyword
        )
      ) {
        return;
      }
      if (
        !tsutils.hasModifier(
          modifiers,
          ts.SyntaxKind.ConstKeyword
        )
      ) {
        return;
      }
      context.report({
        messageId: "forbidden",
        loc: getLoc(enumDeclaration.name),
      });
    },
  }),
});

export default rule;
