import ts from "typescript";

const kinds = new Set<ts.SyntaxKind>([
  ts.SyntaxKind.ClassDeclaration,
  ts.SyntaxKind.Constructor,
  ts.SyntaxKind.EnumDeclaration,
  ts.SyntaxKind.EnumMember,
  ts.SyntaxKind.FunctionDeclaration,
  ts.SyntaxKind.GetAccessor,
  ts.SyntaxKind.InterfaceDeclaration,
  ts.SyntaxKind.MethodDeclaration,
  ts.SyntaxKind.MethodSignature,
  ts.SyntaxKind.PropertyDeclaration,
  ts.SyntaxKind.PropertySignature,
  ts.SyntaxKind.SetAccessor,
  ts.SyntaxKind.TypeAliasDeclaration,
  ts.SyntaxKind.VariableDeclaration,
]);

export function findTaggedNames(
  tagName: string,
  program: ts.Program
): Set<string> {
  const taggedNames = new Set<string>();
  program.getSourceFiles().forEach((sourceFile) => {
    if (sourceFile.text.indexOf(`@${tagName}`) === -1) {
      return;
    }

    const nodes = getNodes(sourceFile);

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

function getNodes(node: ts.Node): ts.Node[] {
  const matchingNodes: ts.Node[] = [];

  collectMatchingNodes(node)

  return matchingNodes
}

function collectMatchingNodes(node: ts.Node): void {
  const matchingNodes: ts.Node[] = [];

  if (kinds.has(node.kind)) {
    matchingNodes.push(node);
  }

  ts.forEachChild(node, collectMatchingNodes);
}
