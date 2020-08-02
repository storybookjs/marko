interface LinkOptions {
  addDecorator?: boolean;
}

export function managerEntries(entry: any[] = []) {
  return [...entry, require.resolve('../register')];
}

export function config(entry: any[] = [], { addDecorator = true }: LinkOptions = {}) {
  const linkConfig = [];
  if (addDecorator) {
    linkConfig.push(require.resolve('./addDecorator'));
  }
  return [...entry, ...linkConfig];
}
