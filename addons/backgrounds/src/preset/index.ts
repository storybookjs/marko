export function config(entry: any[] = []) {
  return [...entry, require.resolve('./addDecorator'), require.resolve('./addParameter')];
}

export function managerEntries(entry: any[] = [], options: any) {
  return [...entry, require.resolve('../register')];
}
