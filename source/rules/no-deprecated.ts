import { TSESTree as es } from "@typescript-eslint/utils";
import { getParent, getParserServices } from "@icetee/eslint-etc";
import ts from "typescript";
import { findTaggedNames } from "../tag.js";
import { getTags, isDeclaration } from "../tslint-tag.js";
import { createRule } from "../utils.js";

const deprecatedNamesByProgram = new WeakMap<ts.Program, Set<string>>();

type OptionItem = { ignored?: Record<string, string> };
type Options = readonly OptionItem[];

const defaultOptions: Options = [];

const rule = createRule({
  defaultOptions,
  meta: {
    docs: {
      description: "Forbids the use of deprecated APIs.",
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: `"{{name}}" is deprecated: {{comment}}`,
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
  name: "no-deprecated",
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
    let deprecatedNames = deprecatedNamesByProgram.get(program);
    if (!deprecatedNames) {
      deprecatedNames = findTaggedNames("deprecated", program);
      deprecatedNamesByProgram.set(program, deprecatedNames);
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
        if (!deprecatedNames?.has(identifier.text)) {
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
        const tags = getTags("deprecated", identifier, typeChecker);
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
