export function managerEntries(entry: any[] = []) {
  return [...entry, require.resolve('./register')];
}

export function config(entry: any[] = [], { addDecorator = true } = {}) {
  return [
    ...entry,
    require.resolve('./a11yRunner'),
    require.resolve('./a11yHighlight'),
    addDecorator && require.resolve('./addDecorator'),
  ].filter(Boolean);
}
