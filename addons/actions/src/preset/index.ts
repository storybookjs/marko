interface ActionsOptions {
  addDecorator?: boolean;
}

export function managerEntries(entry: any[] = [], options: any) {
  return [...entry, require.resolve('../register')];
}

export function config(entry: any[] = [], { addDecorator = true }: ActionsOptions = {}) {
  const actionConfig = [];
  if (addDecorator) {
    actionConfig.push(require.resolve('./addDecorator'));
  }
  return [...entry, ...actionConfig, require.resolve('./addArgs')];
}
