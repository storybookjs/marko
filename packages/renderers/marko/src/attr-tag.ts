import type {
  Args,
  StrictArgTypes,
  StrictInputType,
} from "storybook/internal/types";

type Attrs = Record<PropertyKey, unknown>;
type AttrTag = Attrs & { [rest]: Attrs[] };
const empty: never[] = [];
const rest = Symbol("Attribute Tag");

export function attrTag(attrs: Attrs): AttrTag {
  attrs[Symbol.iterator] = attrTagIterator;
  attrs[rest] = empty;
  return attrs as AttrTag;
}

function* attrTagIterator(this: AttrTag) {
  yield this;
  yield* this[rest];
}

/**
 * Flattens `"@"` attr tag argTypes into `@parent > child` keys, along with a
 * single attr tag's args (others, eg an array of repeated tags, stay as given).
 */
export function flattenAttrTags(
  argTypes: StrictArgTypes,
  args: Args | undefined,
  prefix = "",
) {
  const newArgTypes: StrictArgTypes = {};
  const newArgs: Args | undefined = args ? {} : undefined;

  for (const key in argTypes) {
    if (key.startsWith("@")) continue;
    const argType = argTypes[key];
    const name = argType.name || key;
    const table = prefix
      ? {
          ...argType.table,
          category: prefix.substring(0, prefix.length - 3),
          subcategory: argType.table?.subcategory || argType.table?.category,
        }
      : argType.table;

    if (argType["@"]) {
      newArgTypes[prefix + key] = {
        ...argType,
        name: "@" + name,
        control: { disable: true },
        table,
      };

      const arg = args?.[key];
      const flatten = isPlainObject(arg);
      const [otherArgTypes, otherArgs] = flattenAttrTags(
        argType["@"] as StrictInputType,
        flatten ? arg : undefined,
        prefix + "@" + key + " > ",
      );

      Object.assign(newArgTypes, otherArgTypes);
      if (flatten) {
        // Storybook merges these over the story's args, so the object itself
        // can only be unset.
        newArgs![prefix + key] = undefined;
        Object.assign(newArgs!, otherArgs);
      } else if (args && key in args) {
        newArgs![prefix + key] = arg;
      }
    } else {
      newArgTypes[prefix + key] = { ...argType, name, table };
      if (args && key in args) {
        newArgs![prefix + key] = args[key];
      }
    }
  }

  // Attributes the docs don't list (eg inherited native ones) still apply.
  for (const key in args) {
    if (!(key in argTypes)) newArgs![prefix + key] = args[key];
  }

  return [newArgTypes, newArgs] as const;
}

export function isPlainObject(value: unknown): value is Args {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}
