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
