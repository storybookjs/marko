import { ensureDocsBeforeControls } from './ensureDocsBeforeControls';

export function managerEntries(entry: any[] = [], options: any) {
  ensureDocsBeforeControls(options.configDir);
  return [...entry, require.resolve('../register')];
}
