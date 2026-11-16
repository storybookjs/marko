import fs from "node:fs/promises";
import path from "node:path";

import { render } from "@storybook/marko/dist/entry-preview.mjs";
import {
  parameters,
  typeFromArgs,
} from "@storybook/marko/dist/entry-preview-docs.mjs";
import {
  type DocgenInfo,
  type DocgenProp,
  isDocgenEnabled,
  withDocgenInfo,
} from "@storybook/marko/docgen";

const docgenReg = /__docgenInfo = (.*);$/m;

async function extract(file: string) {
  const fileName = path.join(import.meta.dirname, file);
  const result = await withDocgenInfo("export default {};\n", fileName);
  expect(result).toBeTruthy();
  const info: DocgenInfo | undefined =
    JSON.parse(docgenReg.exec(result!.code)?.[1] ?? "null") ?? undefined;
  return {
    info,
    props: info?.props as Record<string, DocgenProp>,
    dependencies: result!.dependencies.map((dependency) =>
      path.relative(import.meta.dirname, dependency),
    ),
  };
}

describe("docgen", () => {
  test("stops expanding recursive attribute tags", async () => {
    const { props } = await extract("tree.marko");
    const nested = props.item["@"]!;
    expect(nested.label.description).toBe("The item's label.");
    expect(nested.item.tsType).toEqual({ name: "AttrTag", raw: "AttrTag" });
    expect(nested.item["@"]).toEqual({});
  });

  test("expands attribute tags within a union", async () => {
    const { props } = await extract("mixed.marko");
    expect(props.title.tsType.name).toBe("union");
    expect(props.title["@"]!.level.description).toBe("The heading level.");
  });

  test("treats a union of handlers as a handler", async () => {
    const { props } = await extract("mixed.marko");
    expect(props.valueChange.tsType).toMatchObject({
      name: "signature",
      type: "function",
    });
  });

  test("detects attribute tags without ES2015 lib types", async () => {
    const { props } = await extract("es5/attr-tag.marko");
    expect(props.item["@"]!.name.description).toBe("The item name.");
  });

  test("lists in-project bases but not external ones", async () => {
    const { props, dependencies } = await extract("extends.marko");
    expect(Object.keys(props).sort()).toEqual([
      "base",
      "heading",
      "hidden",
      "shared",
      "title",
    ]);
    expect(props.base.description).toBe("Declared on an in-project base.");
    expect(props.shared.description).toBe("Declared in a separate file.");
    expect(dependencies).toEqual(["shared.ts"]);
    expect(Object.keys(props.heading["@"]!)).toEqual(["text"]);
  });

  test("keeps only in-project docs for a re-declared native prop", async () => {
    const { props } = await extract("extends.marko");
    expect(props.title.description).toBe(
      "Overrides the native title without inheriting its docs.",
    );
  });

  test("leaves out what an Omit of an in-project type removes", async () => {
    const { props } = await extract("omit-local.marko");
    expect(props.base).toBeUndefined();
    expect(props.shared.description).toBe("Declared in a separate file.");
  });

  test("resolves in-project types, showing external names as written", async () => {
    const { props } = await extract("types.marko");
    expect(props.content.tsType).toEqual({
      name: "signature",
      type: "function",
      raw: "Marko.Body",
    });
    expect(props.size.tsType).toEqual({
      name: "union",
      raw: '"small" | "large"',
      elements: [
        { name: "literal", value: '"small"', raw: '"small"' },
        { name: "literal", value: '"large"', raw: '"large"' },
      ],
    });
    expect(props.flag.tsType).toEqual({ name: "boolean", raw: "boolean" });
    expect(props.label.tsType).toEqual({
      name: "string",
      raw: "string | null",
    });
    expect(props.index.tsType.raw).toBe("string | number");
    expect(props.tag.tsType.raw).toBe("keyof Marko.NativeTags");
    expect(props.slot.tsType.raw).toBe("Marko.Body | Marko.HTML.Span");
    expect(props.nothing.tsType.name).not.toBe("signature");
    expect(props.mode.tsType.elements!.map((e) => e.name)).toEqual([
      "true",
      "literal",
    ]);
    expect(props.items.tsType.raw).toBe("{ label: string; }[]");
    expect(props.state.tsType.raw).toBe(
      '"loading" | "expand" | "reset" | "none"',
    );
  });

  test("documents an Input naming another type from that type", async () => {
    const { info } = await extract("named-input.marko");
    expect(info!.description).toBe("Documented where it is declared.");
    expect(Object.keys(info!.props)).toEqual(["label"]);
  });

  test("documents a split component's Input from its browser file", async () => {
    const { info } = await extract("../split-component/index.marko");
    expect(info!.description).toBe(
      "A split component that greets someone and renders body content.",
    );
    expect(info!.props.name.description).toBe("Who to greet.");
  });

  test("uses the project a solution tsconfig references", async () => {
    const { props } = await extract("solution/index.marko");
    expect(props.label.tsType.raw).toBe("string | null");
  });

  test("finds the referenced project for a component added later", async () => {
    await extract("solution/index.marko");
    const added = path.join(import.meta.dirname, "solution/added.marko");
    await fs.copyFile(
      path.join(import.meta.dirname, "solution/index.marko"),
      added,
    );
    try {
      const { props } = await extract("solution/added.marko");
      expect(props.label.tsType.raw).toBe("string | null");
    } finally {
      await fs.rm(added);
    }
  });

  test("keeps the parameter name of @param tags", async () => {
    const { props } = await extract("solution/index.marko");
    expect(props.label.description).toContain("@param unused not a real param");
  });

  test("watches files that only declare a prop's type", async () => {
    const { props, dependencies } = await extract("type-only.marko");
    expect(props.size.tsType.raw).toBe('"small" | "large"');
    expect(dependencies).toContain("size.ts");
  });

  test("skips props a mapped type renames", async () => {
    const { props } = await extract("mapped.marko");
    expect(Object.keys(props)).toEqual(["mine"]);
  });

  test("shows a re-declared native attribute as declared", async () => {
    const { props } = await extract("redeclare.marko");
    expect(props.onClick.tsType.raw).toBe("(event: MouseEvent) => void");
    expect(props.class.tsType.raw).toBe("string");
    expect(props.class.description).toBe("Extra classes.");
  });

  test("follows types borrowed by indexed access", async () => {
    const { props, dependencies } = await extract("indexed.marko");
    expect(Object.keys(props.seeMore["@"]!)).toEqual(["extra"]);
    expect(dependencies).toContain("indexed-types.ts");
    // Written order, though `early` made the checker create `alpha` first.
    expect(props.mode.tsType.raw).toBe('"zeta" | "beta" | "alpha"');
  });

  test("shows identical union members once", async () => {
    const { props } = await extract("duplicates.marko");
    expect(props.selected.tsType.raw.match(/from/g)).toHaveLength(1);
    // Declared differently by each member, so no one annotation describes it.
    expect(props.content.tsType.raw).toMatch(/string/);
  });

  test("watches in-project bases that add no listed prop", async () => {
    const { dependencies } = await extract("base-file.marko");
    expect(dependencies).toEqual(["base-types.ts"]);
  });

  test("watches the bases of an Input with nothing to document", async () => {
    const { info, dependencies } = await extract("bare-base.marko");
    expect(info).toBeUndefined();
    expect(dependencies).toEqual(["base-types.ts"]);
  });

  test("keeps the description of an Input with no listed props", async () => {
    const { info } = await extract("description-only.marko");
    expect(info!.description).toBe("A styled button.");
    expect(info!.props).toEqual({});
  });

  test("converts docs with no props, at the top or in an attr tag", async () => {
    for (const file of ["description-only.marko", "tree.marko"]) {
      const { info: __docgenInfo } = await extract(file);
      expect(() =>
        parameters.docs.extractArgTypes({ __docgenInfo } as any),
      ).not.toThrow();
    }
  });

  test("is turned off by the framework's docgen option", async () => {
    const enabled = (framework: unknown) =>
      isDocgenEnabled({
        presets: {
          apply: async (name: string) =>
            name === "framework" ? framework : { docs: true },
        },
      } as any);
    expect(await enabled("@storybook/marko-vite")).toBe(true);
    expect(await enabled({ name: "", options: {} })).toBe(true);
    expect(await enabled({ name: "", options: { docgen: false } })).toBe(false);
  });

  test("makes options of a lone literal", () => {
    const argTypes: Record<string, any> = parameters.docs.extractArgTypes({
      __docgenInfo: {
        props: {
          status: {
            description: "",
            required: false,
            tsType: {
              name: "literal",
              value: '"uploading"',
              raw: '"uploading"',
            },
          },
        },
      },
    } as any)!;
    expect(argTypes.status.type).toMatchObject({
      name: "enum",
      value: ["uploading"],
    });
  });

  test("infers a control from the story's args when the type has none", () => {
    const argTypes = typeFromArgs({
      argTypes: {
        number: { name: "number", type: { name: "other", required: false } },
        content: { name: "content", type: { name: "function" } },
        onClick: { name: "onClick", type: { name: "function" } },
      },
      initialArgs: { number: 5, content: "Hi", onClick: () => {} },
    } as any);
    expect(argTypes.number.type).toEqual({ name: "number", required: false });
    expect(argTypes.content.type).toEqual({ name: "string" });
    expect(argTypes.onClick.type).toEqual({ name: "function" });
  });

  test("makes options of literals with any escapes", async () => {
    const { info } = await extract("types.marko");
    const argTypes: Record<string, any> = parameters.docs.extractArgTypes({
      __docgenInfo: info,
    } as any)!;
    expect(argTypes.escaped.type.value).toEqual(["a\0b", "\v"]);
  });

  test("leaves an attribute tag prop's own control to its args", async () => {
    const { info } = await extract("mixed.marko");
    const argTypes: Record<string, any> = parameters.docs.extractArgTypes({
      __docgenInfo: info,
    } as any)!;
    expect(argTypes.title.control).toBeUndefined();
    expect(argTypes["@title > level"]).toBeDefined();
  });

  test("sets an attribute tag's attribute on a copy of the story's arg", () => {
    const header = { level: 2 };
    const { input } = render({ header, "@header > level": 3 }, {
      id: "story",
      component: { mount() {} },
      argTypes: {},
    } as any) as unknown as { input: { header: Record<string, unknown> } };
    expect(input.header).toMatchObject({ level: 3 });
    expect(header).toEqual({ level: 2 });
  });
});
