export function managerEntries(entry: any[] = []) {
  return [...entry, require.resolve('../register')];
}
