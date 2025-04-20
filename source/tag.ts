import { tsquery } from "@phenomnomnominal/tsquery";
import ts from "typescript";

export function findTaggedNames(
  tagName: string,
  program: ts.Program
): Set<string> {
  const taggedNames = new Set<string>();
  program.getSourceFiles().forEach((sourceFile) => {
    if (sourceFile.text.indexOf(`@${tagName}`) === -1) {
      return;
    }
    const nodes = tsquery(
      sourceFile,
      `ClassDeclaration, Constructor, EnumDeclaration, EnumMember, FunctionDeclaration, GetAccessor, InterfaceDeclaration, MethodDeclaration, MethodSignature, PropertyDeclaration, PropertySignature, SetAccessor, TypeAliasDeclaration, VariableDeclaration`
    );
    nodes.forEach((node) => {
      const tags = ts.getJSDocTags(node);
      if (!tags.some((tag) => tag.tagName.text === tagName)) {
        return;
      }
      if (ts.isConstructorDeclaration(node)) {
        const { parent } = node;
        const { name } = parent;
        if (name?.text) {
          taggedNames.add(name.text);
        }
      } else {
        const { name } = node as ts.Node & { name?: ts.Identifier };
        if (name?.text) {
          taggedNames.add(name.text);
        }
      }
    });
  });
  return taggedNames;
}
