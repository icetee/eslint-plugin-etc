import { TSESTree as es } from "@typescript-eslint/utils";
import { getParent, getParserServices } from "@icetee/eslint-etc";
import ts from "typescript";
import { findTaggedNames } from "../tag.js";
import { getTags, isDeclaration } from "../tslint-tag.js";
import { createRule } from "../utils.js";

// https://api-extractor.com/pages/tsdoc/tag_internal/

const internalNamesByProgram = new WeakMap<ts.Program, Set<string>>();

type OptionItem = { ignored?: Record<string, string> };
type Options = readonly OptionItem[];

const defaultOptions: Options = [];

const rule = createRule({
  defaultOptions,
  meta: {
    docs: {
      description: "Forbids the use of internal APIs.",
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: `"{{name}}" is internal.`,
    },
    schema: [
      {
        properties: {
          ignored: { type: "object" },
        },
        type: "object",
      },
    ],
    type: "problem",
  },
  name: "no-internal",
  create: (context, unused: typeof defaultOptions) => {
    const [{ ignored = {} } = {}] = context.options;
    const ignoredNameRegExps: RegExp[] = [];
    const ignoredPathRegExps: RegExp[] = [];
    Object.entries(ignored).forEach(([key, value]) => {
      switch (value) {
        case "name":
          ignoredNameRegExps.push(new RegExp(key));
          break;
        case "path":
          ignoredPathRegExps.push(new RegExp(key));
          break;
        default:
          break;
      }
    });
    const { esTreeNodeToTSNodeMap, program } = getParserServices(context);
    const typeChecker = program.getTypeChecker();
    const getPath = (identifier: ts.Identifier) => {
      const type = typeChecker.getTypeAtLocation(identifier);
      return typeChecker.getFullyQualifiedName(type.symbol);
    };
    let internalNames = internalNamesByProgram.get(program);
    if (!internalNames) {
      internalNames = findTaggedNames("internal", program);
      internalNamesByProgram.set(program, internalNames);
    }
    return {
      Identifier: (node: es.Identifier) => {
        switch (getParent(node)?.type) {
          case "ExportSpecifier":
          case "ImportDefaultSpecifier":
          case "ImportNamespaceSpecifier":
          case "ImportSpecifier":
            return;
          default:
            break;
        }
        const identifier = esTreeNodeToTSNodeMap.get(node) as ts.Identifier;
        if (!internalNames?.has(identifier.text)) {
          return;
        }
        if (isDeclaration(identifier)) {
          return;
        }
        if (
          ignoredNameRegExps.some((regExp) => regExp.test(identifier.text)) ||
          ignoredPathRegExps.some((regExp) => regExp.test(getPath(identifier)))
        ) {
          return;
        }
        const tags = getTags("internal", identifier, typeChecker);
        if (tags.length > 0) {
          for (const tag of tags) {
            context.report({
              data: {
                comment: tag.trim().replace(/[\n\r\s\t]+/g, " "),
                name: identifier.text,
              },
              messageId: "forbidden",
              node,
            });
          }
        }
      },
    };
  },
});

export default rule;
