export function managerEntries(entry: any[] = []) {
  return [...entry, require.resolve('../register')];
}

export function config(entry: any[] = []) {
  const toolbarConfig = [require.resolve('./enhanceGlobalArgs')];
  return [...entry, ...toolbarConfig];
}
