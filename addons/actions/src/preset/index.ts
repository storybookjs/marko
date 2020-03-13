export function managerEntries(entry: any[] = [], options: any) {
  return [...entry, require.resolve('../../register')];
}

export function config(entry: any[] = []) {
  return [...entry, require.resolve('./addArgs')];
}
