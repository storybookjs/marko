/**
 * Reads a Marko component's docs from its exported `Input` type, through the
 * TypeScript checker, into react-docgen shaped `__docgenInfo`.
 */
import path from "node:path";

import type { Options } from "storybook/internal/types";
import type TS from "typescript";

type LanguageTools = typeof import("@marko/language-tools");

export interface DocgenTsType {
  name: string;
  /** The type as displayed. */
  raw: string;
  value?: string;
  type?: "function";
  elements?: DocgenTsType[];
}

export interface DocgenProp {
  description: string;
  required: boolean;
  tsType: DocgenTsType;
  defaultValue?: { value: string };
  /** Nested members when the prop is a `Marko.AttrTag`. */
  "@"?: Record<string, DocgenProp>;
}

export interface DocgenInfo {
  displayName: string;
  description: string;
  props: Record<string, DocgenProp>;
}

export interface DocgenResult {
  code: string;
  /** In-project files the docs were read from, to watch for changes. */
  dependencies: string[];
}

type GetDocgenInfo = (
  fileName: string,
) => { info: DocgenInfo; dependencies: Set<string> } | undefined;

interface Tools {
  ts: typeof TS;
  Processors: LanguageTools["Processors"];
  Project: LanguageTools["Project"];
  /** Shared by every tsconfig's service, so each doesn't re-parse the libs. */
  registry: TS.DocumentRegistry;
}

interface ProjectConfig {
  configFile: string;
  parsed: TS.ParsedCommandLine;
  fileNames: Set<string>;
}

const fsPathReg = /^(?:[./\\]|[A-Z]:)/i;
const importTagReg = /^<([^>]+)>$/;
const nodeModulesReg = /[\\/]node_modules[\\/]/;
// Replaces `export default` with the same length so source maps stay valid.
const exportDefault = "export default";
const namedDefault = "const __dg =".padEnd(exportDefault.length);
const warned = new Set<string>();
const docgens = new Map<string, GetDocgenInfo>();
const configs = new Map<string, ProjectConfig>();
/** Files no project included, even after re-reading the configs. */
const missed = new Set<string>();
let toolsPromise: Promise<Tools | undefined> | undefined;

export async function isDocsEnabled(options: Options) {
  return (
    Object.keys(await options.presets.apply("docs", {}, options)).length > 0
  );
}

export async function isDocgenEnabled(options: Options) {
  const framework = await options.presets.apply("framework", {}, options);
  return (
    (typeof framework === "string" || framework.options?.docgen !== false) &&
    (await isDocsEnabled(options))
  );
}

/** Never throws: docs are best effort, so a failure warns once per file. */
export async function withDocgenInfo(
  code: string,
  fileName: string,
): Promise<DocgenResult | undefined> {
  fileName = path.resolve(fileName);
  if (nodeModulesReg.test(fileName)) return;
  try {
    const tools = await (toolsPromise ??= loadTools());
    const result = tools && getMarkoDocgen(tools, fileName)(fileName);
    if (!result) return;
    // TypeScript's paths always use `/`, which webpack rejects on Windows.
    const dependencies = [...result.dependencies].map((file) =>
      path.resolve(file),
    );
    if (!Object.keys(result.info.props).length && !result.info.description) {
      return { code, dependencies };
    }
    const { ts } = tools;
    const sourceFile = ts.createSourceFile(
      fileName,
      code,
      ts.ScriptTarget.Latest,
    );
    const start = sourceFile.statements
      .find(
        (statement) =>
          ts.isExportAssignment(statement) && !statement.isExportEquals,
      )
      ?.getStart(sourceFile);
    if (start === undefined || !code.startsWith(exportDefault, start)) {
      return { code, dependencies };
    }
    return {
      code: `${code.slice(0, start)}${namedDefault}${code.slice(
        start + exportDefault.length,
      )}\nexport default __dg;\n__dg.__docgenInfo = ${JSON.stringify(result.info)};\n`,
      dependencies,
    };
  } catch (err) {
    if (!warned.has(fileName)) {
      warned.add(fileName);
      console.warn(
        `[storybook:marko-docgen] failed to extract docs from ${fileName}`,
        err,
      );
    }
  }
}

async function loadTools(): Promise<Tools | undefined> {
  try {
    const [{ default: ts }, { Processors, Project }] = await Promise.all([
      import("typescript"),
      import("@marko/language-tools"),
    ]);
    const registry = ts.createDocumentRegistry(
      ts.sys.useCaseSensitiveFileNames,
    );
    return { ts, Processors, Project, registry };
  } catch {
    return undefined;
  }
}

/** One docgen per tsconfig, found from the component like an editor would. */
function getMarkoDocgen(tools: Tools, fileName: string) {
  const { ts } = tools;
  const fileDir = path.dirname(fileName);
  const nearest =
    ts.findConfigFile(fileDir, ts.sys.fileExists, "tsconfig.json") ||
    ts.findConfigFile(fileDir, ts.sys.fileExists, "jsconfig.json");
  let project: ProjectConfig | undefined;
  if (nearest) {
    project = findProject(tools, nearest, fileName);
    // The file may be newer than the parsed configs; re-read them once for it.
    if (!project && !missed.has(fileName)) {
      missed.add(fileName);
      configs.clear();
      project = findProject(tools, nearest, fileName);
    }
    project ??= configs.get(nearest);
  }
  const key = project?.configFile || "";
  let docgen = docgens.get(key);
  if (!docgen) {
    docgen = createMarkoDocgen(tools, project);
    docgens.set(key, docgen);
  }
  return docgen;
}

/**
 * `configFile`'s project, or as tsserver does for a solution config (eg
 * create-vite's), the one it references that includes `fileName`.
 */
function findProject(
  tools: Tools,
  configFile: string,
  fileName: string,
  seen = new Set<string>(),
): ProjectConfig | undefined {
  const { ts, Processors } = tools;
  if (seen.has(configFile)) return;
  seen.add(configFile);
  let project = configs.get(configFile);
  if (!project) {
    const parsed = ts.getParsedCommandLineOfConfigFile(
      configFile,
      undefined,
      { ...ts.sys, onUnRecoverableConfigFileDiagnostic() {} },
      undefined,
      undefined,
      Processors.extensions.map((extension) => ({
        extension,
        isMixedContent: false,
        scriptKind: ts.ScriptKind.Deferred,
      })),
    );
    if (!parsed) return;
    project = {
      configFile,
      parsed,
      fileNames: new Set(parsed.fileNames.map((name) => path.resolve(name))),
    };
    configs.set(configFile, project);
  }
  if (project.fileNames.has(fileName)) return project;
  for (const reference of project.parsed.projectReferences || []) {
    const found = findProject(
      tools,
      ts.resolveProjectReferencePath(reference),
      fileName,
      seen,
    );
    if (found) return found;
  }
}

function createMarkoDocgen(
  { ts, Processors, Project, registry }: Tools,
  project: ProjectConfig | undefined,
): GetDocgenInfo {
  const configFile = project?.configFile;
  const dir = configFile
    ? path.dirname(configFile)
    : ts.sys.getCurrentDirectory();
  // Resolve Marko's own types from the project, not wherever Storybook runs.
  const host = { ...ts.sys, getCurrentDirectory: () => dir };
  const processors = Processors.create({ ts, host, configFile });
  const getProcessor = (fileName: string) => {
    const ext = Processors.getProcessorExtension(fileName);
    return ext ? processors[ext] : undefined;
  };

  // Start from every file the config includes, as an editor would, so that
  // components share one program rather than each rebuilding it.
  const parsedConfig = project?.parsed;
  const compilerOptions: TS.CompilerOptions = {
    ...parsedConfig?.options,
    noEmit: true,
    allowJs: true,
    skipLibCheck: true,
    allowNonTsExtensions: true,
  };
  const resolutionCache = ts.createModuleResolutionCache(
    dir,
    host.useCaseSensitiveFileNames
      ? (fileName) => fileName
      : (fileName) => fileName.toLowerCase(),
    compilerOptions,
  );

  // The processors' roots are Marko's own type libraries.
  const typeLibNames = new Set<string>();
  for (const ext in processors) {
    for (const rootName of processors[
      ext as keyof typeof processors
    ].getRootNames?.() || []) {
      typeLibNames.add(rootName);
    }
  }
  const rootNames = new Set([
    ...typeLibNames,
    ...(parsedConfig?.fileNames || []),
  ]);

  const service = ts.createLanguageService(
    {
      getCompilationSettings: () => compilerOptions,
      getScriptFileNames: () => [...rootNames],
      getScriptVersion: (fileName) =>
        `${host.getModifiedTime?.(fileName)?.getTime() ?? 0}`,
      getScriptSnapshot(fileName) {
        const code = host.readFile(fileName);
        if (code === undefined) return undefined;
        const processor = getProcessor(fileName);
        let extractedCode = code;
        if (processor) {
          try {
            extractedCode = processor.extract(fileName, code).toString();
          } catch {
            extractedCode = "";
          }
        }
        return ts.ScriptSnapshot.fromString(extractedCode);
      },
      getScriptKind: (fileName) =>
        getProcessor(fileName)?.getScriptKind(fileName) ??
        ts.ScriptKind.Unknown,
      // Unresolved specifiers degrade to `any` rather than failing.
      resolveModuleNameLiterals: (
        literals,
        containingFile,
        redirectedReference,
      ) =>
        literals.map(({ text }) => {
          let moduleName = text;
          const tagName = importTagReg.exec(moduleName)?.[1];
          if (tagName) {
            const tagDef = Project.getTagLookup(
              path.dirname(containingFile),
            ).getTag(tagName);
            moduleName =
              (tagDef && (tagDef.template || tagDef.renderer)) || text;
          }
          const processor = getProcessor(moduleName);
          if (processor && fsPathReg.test(moduleName)) {
            const resolvedFileName = path.resolve(
              containingFile,
              "..",
              moduleName,
            );
            return {
              resolvedModule: host.fileExists(resolvedFileName)
                ? {
                    resolvedFileName,
                    extension: processor.getScriptExtension(resolvedFileName),
                    isExternalLibraryImport: false,
                  }
                : undefined,
            };
          }
          return ts.bundlerModuleNameResolver(
            moduleName,
            containingFile,
            compilerOptions,
            host,
            resolutionCache,
            redirectedReference,
          );
        }),
      readDirectory: host.readDirectory,
      readFile: host.readFile,
      fileExists: host.fileExists,
      directoryExists: host.directoryExists,
      getDirectories: host.getDirectories,
      realpath: host.realpath,
      getCurrentDirectory: () => dir,
      getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
      useCaseSensitiveFileNames: () => host.useCaseSensitiveFileNames,
    },
    registry,
  );

  return (fileName) => {
    rootNames.add(fileName);
    const program = service.getProgram();
    const sourceFile = program?.getSourceFile(fileName);
    if (!program || !sourceFile) return;
    const checker = program.getTypeChecker();
    const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
    const inputSymbol =
      moduleSymbol &&
      checker
        .getExportsOfModule(moduleSymbol)
        .find((exportSymbol) => exportSymbol.name === "Input");
    if (!inputSymbol) return;

    const type = checker.getDeclaredTypeOfSymbol(inputSymbol);
    const extractor = new InputExtractor(
      ts,
      program,
      new Set(
        [...typeLibNames].flatMap((name) => program.getSourceFile(name) || []),
      ),
    );
    // `Input` may just name another in-project type, eg a split component's
    // `Component["input"]`, whose declaration then holds the docs.
    const declared = [
      ...new Set([inputSymbol, type.aliasSymbol, type.getSymbol()]),
    ].filter(
      (symbol): symbol is TS.Symbol =>
        !!symbol?.declarations?.some((decl) => !extractor.isExternal(decl)),
    );
    const props = extractor.props(type);
    for (const symbol of declared) {
      for (const decl of symbol.declarations!) extractor.watch(decl);
    }
    extractor.dependencies.delete(sourceFile.fileName);
    const basename = path.basename(fileName, ".marko");
    return {
      info: {
        displayName:
          basename === "index"
            ? path.basename(path.dirname(fileName))
            : basename,
        description:
          declared
            .map((symbol) =>
              ts.displayPartsToString(symbol.getDocumentationComment(checker)),
            )
            .find(Boolean) || "",
        props,
      },
      dependencies: extractor.dependencies,
    };
  };
}

class InputExtractor {
  readonly dependencies = new Set<string>();
  private readonly checker: TS.TypeChecker;
  /** Attr tag types being expanded, so recursive ones stop. */
  private readonly expanding = new Set<TS.Type>();
  private readonly printer: TS.Printer;

  constructor(
    private readonly ts: typeof TS,
    private readonly program: TS.Program,
    private readonly markoTypeFiles: Set<TS.SourceFile>,
  ) {
    this.checker = program.getTypeChecker();
    this.printer = ts.createPrinter({ removeComments: true });
  }

  props(type: TS.Type): Record<string, DocgenProp> {
    const { ts, checker } = this;
    const props: Record<string, DocgenProp> = {};
    for (const prop of checker.getPropertiesOfType(type)) {
      // Only in-project declarations are documented, so inherited native
      // attributes aren't listed and a re-declared one keeps only its own docs.
      const declarations = new Set(
        prop.declarations?.filter((decl) => !this.isExternal(decl)),
      );
      if (!declarations.size) continue;
      // A prop re-declared over an external one (eg in an intersection) shows
      // as declared here rather than as TypeScript's merge of the two.
      const own =
        declarations.size < prop.declarations!.length
          ? [...declarations][0]
          : undefined;

      const descriptions = new Set<string>();
      let defaultValue: { value: string } | undefined;
      for (const decl of declarations) {
        for (const text of this.jsDocComments(decl)) descriptions.add(text);
        for (const tag of ts.getJSDocTags(decl)) {
          const name = tag.tagName.text;
          const text = [
            ts.isJSDocParameterTag(tag) && tag.name.getText(),
            ts.getTextOfJSDocComment(tag.comment),
          ]
            .filter(Boolean)
            .join(" ");
          if (name === "default" || name === "defaultValue") {
            if (text) defaultValue = { value: text };
          } else {
            // docs-tools parses remaining tags (eg @deprecated) back out.
            descriptions.add(`@${name}${text ? ` ${text}` : ""}`);
          }
        }
      }

      const location = own || prop.valueDeclaration || prop.declarations![0];
      const declaredType = ts.isPropertySignature(location)
        ? location.type
        : undefined;
      const propType =
        own && declaredType
          ? checker.getTypeFromTypeNode(declaredType)
          : checker.getTypeOfSymbolAtLocation(prop, location);
      const attrTagType = this.attrTagType(propType);
      let nested: Record<string, DocgenProp> | undefined;
      if (attrTagType && !this.expanding.has(attrTagType)) {
        this.expanding.add(attrTagType);
        nested = this.props(attrTagType);
        this.expanding.delete(attrTagType);
      }
      props[prop.name] = {
        description: [...descriptions].join("\n"),
        required: !(prop.flags & ts.SymbolFlags.Optional),
        tsType:
          attrTagType && !(propType.isUnion() && this.isMixedUnion(propType))
            ? { name: "AttrTag", raw: "AttrTag" }
            : own && ts.isMethodSignature(own)
              ? {
                  name: "signature",
                  type: "function",
                  raw: checker.signatureToString(
                    checker.getSignatureFromDeclaration(own)!,
                    undefined,
                    ts.TypeFormatFlags.WriteArrowStyleSignature,
                  ),
                }
              : this.tsTypeOf(propType, declaredType, declarations.size === 1),
        ...(defaultValue && { defaultValue }),
        ...(attrTagType && { "@": nested || {} }),
      };
    }
    // A union itself only exposes props common to every member; merge
    // member-only props in as optional.
    if (type.isUnion()) {
      for (const member of type.types) {
        const memberProps = this.props(member);
        for (const name in memberProps) {
          if (!(name in props)) {
            props[name] = { ...memberProps[name], required: false };
          }
        }
      }
    }
    return props;
  }

  isExternal(node: TS.Node): boolean {
    const { ts, program } = this;
    const sourceFile = node.getSourceFile();
    if (
      program.isSourceFileDefaultLibrary(sourceFile) ||
      program.isSourceFileFromExternalLibrary(sourceFile) ||
      this.markoTypeFiles.has(sourceFile)
    ) {
      return true;
    }
    // A member added to an external interface from the project (eg to
    // `Marko.HTMLAttributes` in a `declare global`) belongs to that interface.
    const { parent } = node;
    return (
      !!parent &&
      ts.isInterfaceDeclaration(parent) &&
      !!this.checker
        .getSymbolAtLocation(parent.name)
        ?.declarations?.some((decl) => decl !== parent && this.isExternal(decl))
    );
  }

  private textOf(node: TS.Node) {
    return this.printer
      .printNode(this.ts.EmitHint.Unspecified, node, node.getSourceFile())
      .replace(/\s+/g, " ");
  }

  private jsDocComments(decl: TS.Node) {
    const { ts } = this;
    const texts: string[] = [];
    for (const jsDoc of ts.getJSDocCommentsAndTags(decl)) {
      if (!ts.isJSDoc(jsDoc)) continue;
      const text = ts.getTextOfJSDocComment(jsDoc.comment);
      if (text) texts.push(text);
    }
    return texts;
  }

  /**
   * The `T & {...}` of a `Marko.AttrTag<T>`, found by the marker type literal
   * in Marko's own types so that it works whatever the configured lib.
   */
  private attrTagType(type: TS.Type): TS.Type | undefined {
    if (type.isUnion()) {
      return type.types.map((member) => this.attrTagType(member)).find(Boolean);
    }
    if (
      type.isIntersection() &&
      type.types.some((t) => this.isAttrTagMarker(t))
    )
      return type;
  }

  private isAttrTagMarker(type: TS.Type) {
    const { ts } = this;
    const decl = type.getSymbol()?.declarations?.[0];
    if (!decl || !ts.isTypeLiteralNode(decl) || !this.isExternal(decl))
      return false;
    let node = decl.parent;
    while (ts.isIntersectionTypeNode(node) || ts.isParenthesizedTypeNode(node))
      node = node.parent;
    return ts.isTypeAliasDeclaration(node) && node.name.text === "AttrTag";
  }

  private isMixedUnion(type: TS.UnionType) {
    return type.types.some(
      (member) =>
        !(member.flags & this.ts.TypeFlags.Undefined) &&
        !this.attrTagType(member),
    );
  }

  /**
   * The annotation an in-project indexed access names, eg `seeMore`'s for
   * `OtherInput["seeMore"]`.
   */
  private indexedTypeNode(node: TS.TypeNode) {
    const { ts, checker } = this;
    if (
      !ts.isIndexedAccessTypeNode(node) ||
      !ts.isLiteralTypeNode(node.indexType) ||
      !ts.isStringLiteral(node.indexType.literal)
    ) {
      return;
    }
    const decl = checker
      .getPropertyOfType(
        checker.getTypeFromTypeNode(node.objectType),
        node.indexType.literal.text,
      )
      ?.declarations?.find((d) => !this.isExternal(d));
    if (!decl || !ts.isPropertySignature(decl)) return;
    return decl.type;
  }

  /**
   * Adds the files of the in-project types `node` is built from, including
   * ones that add no listed prop yet (eg `Base extends Marko.HTML.Span`).
   */
  watch(node: TS.Node, seen = new Set<TS.Node>()) {
    const { ts } = this;
    if (seen.has(node) || this.isExternal(node)) return;
    seen.add(node);
    this.dependencies.add(node.getSourceFile().fileName);
    const visit = (child: TS.Node): void => {
      if (
        ts.isTypeReferenceNode(child) ||
        ts.isExpressionWithTypeArguments(child)
      ) {
        const decl = this.resolveDeclaration(
          ts.isTypeReferenceNode(child) ? child.typeName : child.expression,
        );
        if (
          decl &&
          (ts.isInterfaceDeclaration(decl) || ts.isTypeAliasDeclaration(decl))
        ) {
          this.watch(decl, seen);
        } else if (decl && !this.isExternal(decl)) {
          // Eg an enum in a `.ts` file, which only a type import reaches.
          this.dependencies.add(decl.getSourceFile().fileName);
        }
      }
      ts.forEachChild(child, visit);
    };
    ts.forEachChild(node, visit);
  }

  private resolveDeclaration(name: TS.Node) {
    const { ts, checker } = this;
    let symbol = checker.getSymbolAtLocation(name);
    if (symbol && symbol.flags & ts.SymbolFlags.Alias) {
      symbol = checker.getAliasedSymbol(symbol);
    }
    return symbol?.declarations?.[0];
  }

  /**
   * An annotation naming only external types (eg `Marko.Body`) displays as
   * written, since readers know those names; others as the checker prints.
   */
  private tsTypeOf(
    type: TS.Type,
    written: TS.TypeNode | undefined,
    // Eg a prop declared by several members of a union `Input` has more to
    // its type than any one annotation.
    fullyWritten: boolean,
  ): DocgenTsType {
    const { ts } = this;
    const tsType = this.convert(
      type,
      written
        ? this.writtenMembers(written).map((member) =>
            ts.isLiteralTypeNode(member) && ts.isStringLiteral(member.literal)
              ? JSON.stringify(member.literal.text)
              : this.textOf(member),
          )
        : [],
    );
    return written && fullyWritten && this.namesOnlyExternalTypes(written)
      ? { ...tsType, raw: this.textOf(written) }
      : tsType;
  }

  private namesOnlyExternalTypes(node: TS.TypeNode) {
    const { ts } = this;
    let named = false;
    let external = true;
    const visit = (child: TS.Node): void => {
      if (ts.isTypeReferenceNode(child)) {
        const decl = this.resolveDeclaration(child.typeName);
        named = true;
        external &&= !!decl && this.isExternal(decl);
      } else if (ts.isTypeLiteralNode(child)) {
        // An inline type is ours, and as written would include its JSDoc.
        external = false;
      }
      ts.forEachChild(child, visit);
    };
    visit(node);
    return named && external;
  }

  /**
   * The checker orders a union's members by when each type was created in
   * the program, which would shuffle eg enum options; this keeps written order.
   */
  private writtenMembers(
    node: TS.TypeNode,
    seen = new Set<TS.Node>(),
  ): TS.TypeNode[] {
    const { ts } = this;
    if (seen.has(node)) return [];
    seen.add(node);
    if (ts.isUnionTypeNode(node)) {
      return node.types.flatMap((member) => this.writtenMembers(member, seen));
    }
    if (ts.isParenthesizedTypeNode(node)) {
      return this.writtenMembers(node.type, seen);
    }
    if (ts.isTypeReferenceNode(node)) {
      const decl = this.resolveDeclaration(node.typeName);
      if (decl && ts.isTypeAliasDeclaration(decl) && !this.isExternal(decl)) {
        return this.writtenMembers(decl.type, seen);
      }
    }
    const indexed = this.indexedTypeNode(node);
    if (indexed) return this.writtenMembers(indexed, seen);
    return [node];
  }

  private convert(type: TS.Type, order: readonly string[] = []): DocgenTsType {
    const { ts, checker } = this;
    // A generic `Input`'s parameters are documented by their constraints.
    if (type.isTypeParameter()) {
      type = checker.getBaseConstraintOfType(type) || checker.getUnknownType();
    }
    if (type.isUnion()) {
      let elements: DocgenTsType[] = [];
      const boolLiterals: string[] = [];
      let nullable = false;
      for (const member of type.types) {
        if (member.flags & ts.TypeFlags.Undefined) continue;
        if (member.flags & ts.TypeFlags.Null) {
          nullable = true;
        } else if (member.flags & ts.TypeFlags.BooleanLiteral) {
          boolLiterals.push(checker.typeToString(member));
        } else {
          elements.push(this.convert(member));
        }
      }
      // The checker expands `boolean` to `true | false`; fold it back. A lone
      // `true` or `false` isn't a "literal": as an option it'd be a string.
      if (boolLiterals.length === 2) {
        elements.push({ name: "boolean", raw: "boolean" });
      } else {
        for (const value of boolLiterals) {
          elements.push({ name: value, raw: value });
        }
      }
      const rank = (element: DocgenTsType) =>
        order.indexOf(element.raw) + 1 || Infinity;
      // Identical members from separate declarations show once.
      elements = elements
        .filter(
          (element, i) =>
            elements.findIndex((other) => other.raw === element.raw) === i,
        )
        .sort((a, b) => rank(a) - rank(b));
      // `null` shows in the type but, like `undefined`, not in the control.
      const raw = elements
        .map((element) => element.raw)
        .concat(nullable ? ["null"] : [])
        .join(" | ");
      if (elements.length === 1) return { ...elements[0], raw };
      // Eg a handler typed differently by each member of a union `Input`.
      if (
        elements.length &&
        elements.every((element) => element.type === "function")
      ) {
        return { name: "signature", type: "function", raw };
      }
      return { name: "union", raw, elements };
    }
    const raw = checker.typeToString(type);
    // An enum member (eg `Color.Red`) isn't a literal option either.
    if (
      (type.isStringLiteral() || type.isNumberLiteral()) &&
      !(type.flags & ts.TypeFlags.EnumLiteral)
    ) {
      return { name: "literal", value: JSON.stringify(type.value), raw };
    }
    if (type.getCallSignatures().length) {
      return { name: "signature", type: "function", raw };
    }
    return { name: raw, raw };
  }
}
