type A11yOptions = {
  addDecorator?: boolean;
};

export function managerEntries(entry: any[] = []) {
  return [...entry, require.resolve('../register')];
}

export function config(entry: any[] = [], { addDecorator = true }: A11yOptions = {}) {
  const a11yConfig = [];
  if (addDecorator) {
    a11yConfig.push(require.resolve('./addDecorator'));
  }
  return [...entry, ...a11yConfig];
}
